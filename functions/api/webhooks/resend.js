// ──────────────────────────────────────────────
// POST /api/webhooks/resend
// Handle Resend webhook events (delivered, opened, clicked, bounced)
// ──────────────────────────────────────────────

import {
  sheetsGet,
  sheetsAppend,
  sheetsUpdate,
  CORS_HEADERS,
  SHEET_TAB,
  SHEET_LAST_COL,
  normalizeHeaders,
} from "../_shared/sheets.js";

// ── Webhook signature verification ───────────

async function verifyResendSignature(request, env) {
  const signingSecret = env.RESEND_WEBHOOK_SECRET;
  if (!signingSecret) return true; // Skip verification if no secret configured

  const signature = request.headers.get('svix-signature');
  const timestamp = request.headers.get('svix-timestamp');
  const msgId = request.headers.get('svix-id');

  if (!signature || !timestamp || !msgId) return false;

  // Verify timestamp is within 5 minutes
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(timestamp, 10);
  if (Math.abs(now - ts) > 300) return false;

  // Compute expected signature
  const body = await request.clone().text();
  const toSign = `${msgId}.${timestamp}.${body}`;
  const encoder = new TextEncoder();

  // Decode base64 secret (Resend/Svix format: "whsec_<base64>")
  const secretBytes = Uint8Array.from(
    atob(signingSecret.replace('whsec_', '')),
    (c) => c.charCodeAt(0)
  );

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(toSign));
  const computed = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));

  // Svix sends multiple signatures separated by spaces, each prefixed with version
  const signatures = signature.split(' ');
  return signatures.some((sig) => {
    const [, sigValue] = sig.split(',');
    return sigValue === computed;
  });
}

// ── Find contact by email in sheet ───────────

function findContactByEmail(rows, headers, email) {
  const emailIdx = headers.indexOf('email');
  if (emailIdx === -1) return null;

  for (let i = 0; i < rows.length; i++) {
    if ((rows[i][emailIdx] || '').trim().toLowerCase() === email.toLowerCase()) {
      return { row: rows[i], rowIndex: i + 2, headers }; // +2: 1-indexed + skip header
    }
  }
  return null;
}

// ── Main handler ─────────────────────────────

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Verify webhook signature
    const isValid = await verifyResendSignature(request, env);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = await request.json();
    const eventType = payload.type;
    const eventData = payload.data || {};
    const now = new Date().toISOString();

    // Extract recipient email
    const recipientEmail = Array.isArray(eventData.to)
      ? eventData.to[0]
      : eventData.to || eventData.email || '';

    // Read contacts to find the matching contact
    let contactId = 'unknown';
    let contactRow = null;
    try {
      const data = await sheetsGet(env, SHEET_TAB + '!A1:' + SHEET_LAST_COL);
      const rows = data.values || [];
      if (rows.length >= 2) {
        const headers = normalizeHeaders(rows[0]);
        const dataRows = rows.slice(1);
        const found = findContactByEmail(dataRows, headers, recipientEmail);
        if (found) {
          contactId = recipientEmail;
          contactRow = found;
        }
      }
    } catch {
      // Continue even if sheet read fails
    }

    switch (eventType) {
      case 'email.delivered': {
        await sheetsAppend(env, 'CommLog!A:E', [
          [contactId, 'email', `Delivered: ${eventData.subject || ''}`.substring(0, 80), now, 'delivered'],
        ]);
        break;
      }

      case 'email.opened': {
        // Log to CommLog
        await sheetsAppend(env, 'CommLog!A:E', [
          [contactId, 'email', `Opened: ${eventData.subject || ''}`.substring(0, 80), now, 'opened'],
        ]);

        // Update contact's notes with open event
        if (contactRow) {
          const notesIdx = contactRow.headers.indexOf('notes');
          if (notesIdx !== -1) {
            const colLetter = String.fromCharCode(65 + notesIdx);
            const existingNotes = contactRow.row[notesIdx] || '';
            const updated = existingNotes
              ? `${existingNotes}; email-opened ${now}`
              : `email-opened ${now}`;
            await sheetsUpdate(env, `${SHEET_TAB}!${colLetter}${contactRow.rowIndex}`, [[updated]]);
          }
        }
        break;
      }

      case 'email.clicked': {
        const clickedUrl = eventData.click?.url || eventData.url || '';
        await sheetsAppend(env, 'CommLog!A:E', [
          [contactId, 'email', `Clicked: ${clickedUrl}`.substring(0, 80), now, 'clicked'],
        ]);
        break;
      }

      case 'email.bounced': {
        await sheetsAppend(env, 'CommLog!A:E', [
          [contactId, 'email', `Bounced: ${eventData.bounce?.type || 'unknown'}`, now, 'bounced'],
        ]);

        // Flag contact as bounced in notes
        if (contactRow) {
          const notesIdx = contactRow.headers.indexOf('notes');
          if (notesIdx !== -1) {
            const colLetter = String.fromCharCode(65 + notesIdx);
            const existingNotes = contactRow.row[notesIdx] || '';
            const updated = existingNotes
              ? `${existingNotes}; BOUNCED ${now}`
              : `BOUNCED ${now}`;
            await sheetsUpdate(env, `${SHEET_TAB}!${colLetter}${contactRow.rowIndex}`, [[updated]]);
          }
        }
        break;
      }

      default:
        // Unknown event type — log but don't error
        await sheetsAppend(env, 'CommLog!A:E', [
          [contactId, 'email', `Webhook: ${eventType}`, now, 'info'],
        ]);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // Always return 200 to webhooks to prevent retries on processing errors
    console.error('Resend webhook error:', err.message);
    return new Response(JSON.stringify({ received: true, error: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
