// ──────────────────────────────────────────────
// POST /api/messages/sms
// Send SMS blasts via Twilio API
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

// ── CORS helpers ─────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ── Audience filter ──────────────────────────

function matchesAudience(contact, headers, audience) {
  const idx = (name) => headers.indexOf(name);
  const val = (name) => (contact[idx(name)] || '').trim().toLowerCase();

  // SMS requires opt_text = true AND a phone number
  if (val('opt_text') !== 'true') return false;

  const phoneIdx = idx('phone');
  const phone = (contact[phoneIdx] || '').trim();
  if (!phone) return false;

  switch (audience) {
    case 'all-optin':
      return true;
    case 'volunteers':
      return val('type') === 'volunteer';
    case 'donors':
      return val('type') === 'donor';
    case 'delegates':
      return val('type') === 'delegate';
    case 'yardsign':
      return val('type') === 'yardsign';
    default:
      return false;
  }
}

// ── Merge fields ─────────────────────────────

function replaceMergeFields(template, contact, headers) {
  const get = (name) => contact[headers.indexOf(name)] || '';
  return template
    .replace(/\{first_name\}/gi, get('first_name'))
    .replace(/\{last_name\}/gi, get('last_name'))
    .replace(/\{precinct\}/gi, get('precinct'))
    .replace(/\{city\}/gi, get('city'));
}

// ── Send SMS via Twilio ──────────────────────

async function sendTwilioSMS({ accountSid, authToken, from, to, body }) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${accountSid}:${authToken}`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ From: from, To: to, Body: body }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Twilio error ${res.status}`);
  return data;
}

// ── Batching helper ──────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main handler ─────────────────────────────

export async function onRequestPost(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const { audience, message } = await request.json();

    if (!audience || !message) {
      return corsResponse({ error: 'Missing required fields: audience, message' }, 400);
    }

    // Read contacts from Sheets
    const rows = await readSheet(env, 'Contacts', 'A1:Z');
    if (rows.length < 2) {
      return corsResponse({ error: 'No contacts found in sheet' }, 404);
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const contacts = rows.slice(1);
    const phoneIdx = headers.indexOf('phone');
    const idIdx = headers.indexOf('id');

    if (phoneIdx === -1) {
      return corsResponse({ error: 'Contacts sheet missing phone column' }, 500);
    }

    // Filter by audience + opt_text + has phone
    const recipients = contacts.filter((c) => matchesAudience(c, headers, audience));

    if (recipients.length === 0) {
      return corsResponse({ sent: 0, failed: 0, errors: [], message: 'No matching recipients' });
    }

    // Send in batches of 50
    const BATCH_SIZE = 50;
    const BATCH_DELAY_MS = 1000;
    let sent = 0;
    let failed = 0;
    const errors = [];
    const commLogRows = [];
    const now = new Date().toISOString();

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map(async (contact) => {
          const phone = contact[phoneIdx].trim();
          const contactId = contact[idIdx] || phone;
          const personalizedMessage = replaceMergeFields(message, contact, headers);

          await sendTwilioSMS({
            accountSid: env.TWILIO_ACCOUNT_SID,
            authToken: env.TWILIO_AUTH_TOKEN,
            from: env.TWILIO_PHONE_NUMBER,
            to: phone,
            body: personalizedMessage,
          });

          return { contactId, phone, status: 'sent' };
        })
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          sent++;
          commLogRows.push([
            result.value.contactId,
            'sms',
            message.substring(0, 80),
            now,
            'sent',
          ]);
        } else {
          failed++;
          const errMsg = result.reason?.message || 'Unknown error';
          errors.push(errMsg);
          commLogRows.push(['unknown', 'sms', message.substring(0, 80), now, `failed: ${errMsg}`]);
        }
      }

      if (i + BATCH_SIZE < recipients.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    // Log to CommLog
    if (commLogRows.length > 0) {
      try {
        await appendSheet(env, 'CommLog', commLogRows);
      } catch (logErr) {
        errors.push(`CommLog write failed: ${logErr.message}`);
      }
    }

    return corsResponse({ sent, failed, errors });
  } catch (err) {
    return corsResponse({ error: err.message || 'Internal server error' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
