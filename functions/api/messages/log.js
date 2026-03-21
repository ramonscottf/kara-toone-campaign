// ──────────────────────────────────────────────
// GET /api/messages/log
// Retrieve communication log with optional filtering
// ──────────────────────────────────────────────

import {
  sheetsGet,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
} from "../_shared/sheets.js";

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
    const data = await sheetsGet(env, 'CommLog!A1:E');
    const rows = data.values || [];

    if (rows.length < 2) {
      return jsonResponse({ logs: [], count: 0 });
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

    return jsonResponse({ logs, count: logs.length });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
