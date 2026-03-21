// ──────────────────────────────────────────────
// POST /api/messages/email
// Send email blasts via Resend API
// ──────────────────────────────────────────────

import {
  sheetsGet,
  sheetsAppend,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  SHEET_TAB,
  SHEET_LAST_COL,
  normalizeHeaders,
} from "../_shared/sheets.js";

// ── Audience filter ──────────────────────────

function matchesAudience(contact, headers, audience) {
  const idx = (name) => headers.indexOf(name);
  const val = (name) => (contact[idx(name)] || '').trim().toLowerCase();

  switch (audience) {
    case 'all-optin':
      return true; // Everyone with an email
    case 'confirmed':
      return val('support_level') === 'confirmed kara';
    case 'maybe':
      return val('support_level') === 'maybe kara';
    case 'unknown':
      return val('support_level') === 'unknown';
    default:
      return true;
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

// ── Tracking pixel ───────────────────────────

function trackingPixel(baseUrl, contactId, sendTimestamp) {
  const src = `${baseUrl}/api/webhooks/resend?track=open&cid=${encodeURIComponent(contactId)}&ts=${sendTimestamp}`;
  return `<img src="${src}" width="1" height="1" alt="" style="display:none" />`;
}

// ── Send email via Resend ────────────────────

async function sendResendEmail({ apiKey, from, replyTo, to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, reply_to: replyTo, to: [to], subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Resend error ${res.status}`);
  return data;
}

// ── Batching helper ──────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main handler ─────────────────────────────

export async function onRequestPost(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const { audience, subject, body: emailBody, from_name, reply_to } = await request.json();

    if (!audience || !subject || !emailBody) {
      return errorResponse('Missing required fields: audience, subject, body', 400);
    }

    const fromName = from_name || 'Kara Toone';
    const replyTo = reply_to || 'votekaratoone@gmail.com';
    const fromAddress = `${fromName} <${env.RESEND_FROM_EMAIL || 'noreply@kara.wickowaypoint.com'}>`;
    const baseUrl = new URL(request.url).origin;

    // Read contacts from Sheets (include header row)
    const data = await sheetsGet(env, SHEET_TAB + '!A1:' + SHEET_LAST_COL);
    const rows = data.values || [];
    if (rows.length < 2) {
      return errorResponse('No contacts found in sheet', 404);
    }

    const headers = normalizeHeaders(rows[0]);
    const contacts = rows.slice(1);
    const emailIdx = headers.indexOf('email');

    if (emailIdx === -1) {
      return errorResponse('Contacts sheet missing email column', 500);
    }

    // Filter by audience + has email
    const recipients = contacts.filter((c) => {
      const email = (c[emailIdx] || '').trim();
      return email && matchesAudience(c, headers, audience);
    });

    if (recipients.length === 0) {
      return jsonResponse({ sent: 0, failed: 0, errors: [], message: 'No matching recipients' });
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
          const email = contact[emailIdx].trim();
          const contactId = email; // Use email as identifier since no ID column
          const personalizedBody = replaceMergeFields(emailBody, contact, headers);
          const personalizedSubject = replaceMergeFields(subject, contact, headers);
          const pixel = trackingPixel(baseUrl, contactId, Date.now());
          const html = personalizedBody + pixel;

          await sendResendEmail({
            apiKey: env.RESEND_API_KEY,
            from: fromAddress,
            replyTo,
            to: email,
            subject: personalizedSubject,
            html,
          });

          return { contactId, email, status: 'sent' };
        })
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          sent++;
          commLogRows.push([
            result.value.contactId,
            'email',
            subject.substring(0, 80),
            now,
            'sent',
          ]);
        } else {
          failed++;
          const errMsg = result.reason?.message || 'Unknown error';
          errors.push(errMsg);
          commLogRows.push(['unknown', 'email', subject.substring(0, 80), now, `failed: ${errMsg}`]);
        }
      }

      // Delay between batches (skip delay after the last batch)
      if (i + BATCH_SIZE < recipients.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    // Log all sends to CommLog sheet
    if (commLogRows.length > 0) {
      try {
        await sheetsAppend(env, 'CommLog!A:E', commLogRows);
      } catch (logErr) {
        errors.push(`CommLog write failed: ${logErr.message}`);
      }
    }

    return jsonResponse({ sent, failed, errors });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
