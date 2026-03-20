// ──────────────────────────────────────────────
// POST /api/webhooks/twilio
// Handle incoming SMS replies from Twilio
// ──────────────────────────────────────────────

// ── Inline Sheets helpers ────────────────────

async function getAccessToken(env) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();
  if (!data.access_token) throw new Error('Failed to obtain Google access token');
  return data.access_token;
}

async function readSheet(env, tab, range) {
  const token = await getAccessToken(env);
  const sheetId = env.GOOGLE_SHEET_ID;
  const fullRange = `${tab}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(fullRange)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.values || [];
}

async function appendSheet(env, tab, rows) {
  const token = await getAccessToken(env);
  const sheetId = env.GOOGLE_SHEET_ID;
  const range = `${tab}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: rows }),
  });
}

async function updateSheetCell(env, tab, cellRange, value) {
  const token = await getAccessToken(env);
  const sheetId = env.GOOGLE_SHEET_ID;
  const fullRange = `${tab}!${cellRange}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(fullRange)}?valueInputOption=USER_ENTERED`;
  await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [[value]] }),
  });
}

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
  // Strip everything except digits
  const digits = (phone || '').replace(/\D/g, '');
  // Handle US numbers: add leading 1 if 10 digits
  if (digits.length === 10) return '1' + digits;
  return digits;
}

// ── Find contact by phone number ─────────────

function findContactByPhone(rows, headers, phone) {
  const phoneIdx = headers.indexOf('phone');
  if (phoneIdx === -1) return null;

  const normalizedSearch = normalizePhone(phone);

  for (let i = 1; i < rows.length; i++) {
    const contactPhone = normalizePhone(rows[i][phoneIdx]);
    if (contactPhone && contactPhone === normalizedSearch) {
      return { row: rows[i], rowIndex: i + 1, headers };
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
    let contactId = from; // Default to phone number if contact not found
    let contactRow = null;

    try {
      const rows = await readSheet(env, 'Contacts', 'A1:Z');
      if (rows.length >= 2) {
        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const found = findContactByPhone(rows, headers, from);
        if (found) {
          const idIdx = headers.indexOf('id');
          contactId = found.row[idIdx] || from;
          contactRow = found;
        }
      }
    } catch {
      // Continue even if sheet read fails
    }

    // Log the reply to CommLog
    try {
      await appendSheet(env, 'CommLog', [
        [contactId, 'sms-reply', body.substring(0, 200), now, `sid:${messageSid}`],
      ]);
    } catch {
      // Non-fatal: logging failure shouldn't break the webhook
    }

    // Update contact's last_contact_date
    if (contactRow) {
      try {
        const lastContactIdx = contactRow.headers.indexOf('last_contact_date');
        if (lastContactIdx !== -1) {
          const colLetter = String.fromCharCode(65 + lastContactIdx);
          await updateSheetCell(env, 'Contacts', `${colLetter}${contactRow.rowIndex}`, now);
        }
      } catch {
        // Non-fatal
      }
    }

    // Return TwiML response — empty by default, or auto-reply if configured
    const autoReply = env.TWILIO_AUTO_REPLY || '';
    return twimlResponse(autoReply || null);
  } catch (err) {
    console.error('Twilio webhook error:', err.message);
    // Return valid TwiML even on error to avoid Twilio retries
    return twimlResponse();
  }
}
