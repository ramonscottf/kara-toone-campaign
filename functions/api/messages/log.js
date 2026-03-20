// ──────────────────────────────────────────────
// GET /api/messages/log
// Retrieve communication log with optional filtering
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

// ── CORS helpers ─────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ── CommLog column definitions ───────────────
// Expected columns: contact_id, channel, message_preview, sent_at, status

const LOG_COLUMNS = ['contact_id', 'channel', 'message_preview', 'sent_at', 'status'];

function rowToLogEntry(row) {
  const entry = {};
  for (let i = 0; i < LOG_COLUMNS.length; i++) {
    entry[LOG_COLUMNS[i]] = row[i] !== undefined && row[i] !== null ? String(row[i]) : '';
  }
  return entry;
}

// ── Main handler ─────────────────────────────

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const contactIdFilter = url.searchParams.get('contact_id');
    const channelFilter = url.searchParams.get('channel');
    const sinceFilter = url.searchParams.get('since');

    // Read CommLog sheet
    const rows = await readSheet(env, 'CommLog', 'A1:E');

    if (rows.length < 2) {
      return corsResponse({ logs: [], count: 0 });
    }

    // First row is header; skip it
    const dataRows = rows.slice(1);

    // Convert to objects
    let logs = dataRows.map(rowToLogEntry);

    // Apply filters
    if (contactIdFilter) {
      logs = logs.filter((log) => log.contact_id === contactIdFilter);
    }

    if (channelFilter) {
      const ch = channelFilter.toLowerCase();
      logs = logs.filter((log) => log.channel.toLowerCase() === ch);
    }

    if (sinceFilter) {
      // Parse the since date — accept ISO or YYYY-MM-DD format
      const sinceDate = new Date(sinceFilter);
      if (!isNaN(sinceDate.getTime())) {
        logs = logs.filter((log) => {
          const logDate = new Date(log.sent_at);
          return !isNaN(logDate.getTime()) && logDate >= sinceDate;
        });
      }
    }

    // Sort chronologically (oldest first)
    logs.sort((a, b) => {
      const dateA = new Date(a.sent_at);
      const dateB = new Date(b.sent_at);
      return dateA - dateB;
    });

    return corsResponse({ logs, count: logs.length });
  } catch (err) {
    return corsResponse({ error: err.message || 'Internal server error' }, 500);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
