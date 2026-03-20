// ──────────────────────────────────────────────
// POST /api/webhooks/resend
// Handle Resend webhook events (delivered, opened, clicked, bounced)
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

  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][emailIdx] || '').trim().toLowerCase() === email.toLowerCase()) {
      return { row: rows[i], rowIndex: i + 1, headers }; // rowIndex is 1-based (sheet row)
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
      const rows = await readSheet(env, 'Contacts', 'A1:Z');
      if (rows.length >= 2) {
        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const found = findContactByEmail(rows, headers, recipientEmail);
        if (found) {
          const idIdx = headers.indexOf('id');
          contactId = found.row[idIdx] || recipientEmail;
          contactRow = found;
        }
      }
    } catch {
      // Continue even if sheet read fails
    }

    switch (eventType) {
      case 'email.delivered': {
        await appendSheet(env, 'CommLog', [
          [contactId, 'email', `Delivered: ${eventData.subject || ''}`.substring(0, 80), now, 'delivered'],
        ]);
        break;
      }

      case 'email.opened': {
        // Log to CommLog
        await appendSheet(env, 'CommLog', [
          [contactId, 'email', `Opened: ${eventData.subject || ''}`.substring(0, 80), now, 'opened'],
        ]);

        // Update contact's email_opened field
        if (contactRow) {
          const emailOpenedIdx = contactRow.headers.indexOf('email_opened');
          if (emailOpenedIdx !== -1) {
            const colLetter = String.fromCharCode(65 + emailOpenedIdx);
            await updateSheetCell(env, 'Contacts', `${colLetter}${contactRow.rowIndex}`, 'true');
          }
        }
        break;
      }

      case 'email.clicked': {
        const clickedUrl = eventData.click?.url || eventData.url || '';
        await appendSheet(env, 'CommLog', [
          [contactId, 'email', `Clicked: ${clickedUrl}`.substring(0, 80), now, 'clicked'],
        ]);
        break;
      }

      case 'email.bounced': {
        await appendSheet(env, 'CommLog', [
          [contactId, 'email', `Bounced: ${eventData.bounce?.type || 'unknown'}`, now, 'bounced'],
        ]);

        // Flag contact as bounced
        if (contactRow) {
          const notesIdx = contactRow.headers.indexOf('notes');
          if (notesIdx !== -1) {
            const colLetter = String.fromCharCode(65 + notesIdx);
            const existingNotes = contactRow.row[notesIdx] || '';
            const updated = existingNotes
              ? `${existingNotes}; BOUNCED ${now}`
              : `BOUNCED ${now}`;
            await updateSheetCell(env, 'Contacts', `${colLetter}${contactRow.rowIndex}`, updated);
          }
        }
        break;
      }

      default:
        // Unknown event type — log but don't error
        await appendSheet(env, 'CommLog', [
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
