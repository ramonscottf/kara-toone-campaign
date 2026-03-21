// ──────────────────────────────────────────────
// POST /api/webhooks/twilio
// Handle incoming SMS replies from Twilio
// ──────────────────────────────────────────────

import {
  sheetsGet,
  sheetsAppend,
  sheetsUpdate,
  SHEET_TAB,
  SHEET_LAST_COL,
  normalizeHeaders,
} from "../_shared/sheets.js";

// ── Twilio signature verification ────────────

async function verifyTwilioSignature(request, env) {
  const authToken = env.TWILIO_AUTH_TOKEN;
  if (!authToken) return true; // Skip if not configured

  const signature = request.headers.get('X-Twilio-Signature');
  if (!signature) return false;

  const url = request.url;
  const body = await request.clone().text();
  const params = new URLSearchParams(body);

  // Sort params alphabetically and concatenate
  const sortedKeys = [...params.keys()].sort();
  let dataString = url;
  for (const key of sortedKeys) {
    dataString += key + params.get(key);
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(authToken),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(dataString));
  const computed = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));

  return computed === signature;
}

// ── Normalize phone number ───────────────────

function normalizePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 10) return '1' + digits;
  return digits;
}

// ── Find contact by phone number ─────────────

function findContactByPhone(rows, headers, phone) {
  const phoneIdx = headers.indexOf('phone');
  if (phoneIdx === -1) return null;

  const normalizedSearch = normalizePhone(phone);

  for (let i = 0; i < rows.length; i++) {
    const contactPhone = normalizePhone(rows[i][phoneIdx]);
    if (contactPhone && contactPhone === normalizedSearch) {
      return { row: rows[i], rowIndex: i + 2, headers }; // +2: 1-indexed + skip header
    }
  }
  return null;
}

// ── TwiML response helper ────────────────────

function twimlResponse(message) {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Main handler ─────────────────────────────

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Verify Twilio signature
    const isValid = await verifyTwilioSignature(request, env);
    if (!isValid) {
      return new Response('Forbidden', { status: 403 });
    }

    // Twilio sends form-encoded POST data
    const formData = await request.formData();
    const from = formData.get('From') || '';
    const body = formData.get('Body') || '';
    const messageSid = formData.get('MessageSid') || '';

    if (!from) {
      return twimlResponse();
    }

    const now = new Date().toISOString();

    // Find contact by phone number in sheet
    let contactId = from;
    let contactRow = null;

    try {
      const data = await sheetsGet(env, SHEET_TAB + '!A1:' + SHEET_LAST_COL);
      const rows = data.values || [];
      if (rows.length >= 2) {
        const headers = normalizeHeaders(rows[0]);
        const dataRows = rows.slice(1);
        const found = findContactByPhone(dataRows, headers, from);
        if (found) {
          contactId = from;
          contactRow = found;
        }
      }
    } catch {
      // Continue even if sheet read fails
    }

    // Log the reply to CommLog
    try {
      await sheetsAppend(env, 'CommLog!A:E', [
        [contactId, 'sms-reply', body.substring(0, 200), now, `sid:${messageSid}`],
      ]);
    } catch {
      // Non-fatal
    }

    // Update contact's contacted field
    if (contactRow) {
      try {
        const contactedIdx = contactRow.headers.indexOf('contacted');
        if (contactedIdx !== -1) {
          const colLetter = String.fromCharCode(65 + contactedIdx);
          await sheetsUpdate(env, `${SHEET_TAB}!${colLetter}${contactRow.rowIndex}`, [['Yes']]);
        }
      } catch {
        // Non-fatal
      }
    }

    // Return TwiML response
    const autoReply = env.TWILIO_AUTO_REPLY || '';
    return twimlResponse(autoReply || null);
  } catch (err) {
    console.error('Twilio webhook error:', err.message);
    return twimlResponse();
  }
}
