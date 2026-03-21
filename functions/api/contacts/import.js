import {
  sheetsGet,
  sheetsAppend,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  CONTACT_COLUMNS,
  SHEET_TAB,
  SHEET_LAST_COL,
  contactToRow,
} from "../_shared/sheets.js";

/**
 * Handle CORS preflight requests.
 */
export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Parse a CSV string into an array of objects.
 * Handles quoted fields with commas and newlines.
 */
function parseCsv(csvText) {
  var lines = [];
  var current = "";
  var inQuotes = false;

  for (var i = 0; i < csvText.length; i++) {
    var ch = csvText[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote
        if (i + 1 < csvText.length && csvText[i + 1] === '"') {
          current += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === "\n") {
        lines.push(current);
        current = "";
      } else if (ch === "\r") {
        // skip carriage return, newline will follow
      } else {
        current += ch;
      }
    }
  }
  if (current.length > 0) {
    lines.push(current);
  }

  if (lines.length < 2) {
    return [];
  }

  var headers = splitCsvLine(lines[0]);
  var results = [];

  for (var j = 1; j < lines.length; j++) {
    var values = splitCsvLine(lines[j]);
    if (values.length === 0 || (values.length === 1 && values[0].trim() === "")) {
      continue;
    }
    var obj = {};
    for (var k = 0; k < headers.length; k++) {
      var header = headers[k].trim().toLowerCase().replace(/\s+/g, "_");
      obj[header] = (k < values.length) ? values[k].trim() : "";
    }
    results.push(obj);
  }

  return results;
}

/**
 * Split a single CSV line into fields, respecting quoted values.
 */
function splitCsvLine(line) {
  var fields = [];
  var current = "";
  var inQuotes = false;

  for (var i = 0; i < line.length; i++) {
    var ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);

  return fields;
}

/**
 * Build a dedup key from a contact for matching.
 */
function dedupKey(contact) {
  var name = ((contact.first_name || "") + "|" + (contact.last_name || "")).toLowerCase().trim();
  var phone = (contact.phone || "").replace(/\D/g, "");
  return name + ":" + phone;
}

/**
 * POST /api/contacts/import
 * Bulk import contacts from CSV text or rows array.
 *
 * Body: { csv: "csv string" } or { rows: [ { first_name, last_name, ... }, ... ] }
 */
export async function onRequestPost(context) {
  var env = context.env;

  try {
    var body = await context.request.json();
    var incoming = [];

    if (body.csv && typeof body.csv === "string") {
      incoming = parseCsv(body.csv);
    } else if (body.rows && Array.isArray(body.rows)) {
      incoming = body.rows;
    } else {
      return errorResponse("Request body must include 'csv' string or 'rows' array", 400);
    }

    if (incoming.length === 0) {
      return errorResponse("No valid rows to import", 400);
    }

    // Fetch existing contacts for deduplication
    var existing = await sheetsGet(env, SHEET_TAB + "!A2:" + SHEET_LAST_COL);
    var existingRows = existing.values || [];
    var existingKeys = {};

    for (var e = 0; e < existingRows.length; e++) {
      var exContact = {};
      for (var c = 0; c < CONTACT_COLUMNS.length; c++) {
        exContact[CONTACT_COLUMNS[c]] = existingRows[e][c] || "";
      }
      existingKeys[dedupKey(exContact)] = true;
    }

    // Process incoming and deduplicate
    var newRows = [];
    var skipped = 0;

    for (var i = 0; i < incoming.length; i++) {
      var item = incoming[i];
      var key = dedupKey(item);

      if (existingKeys[key]) {
        skipped++;
        continue;
      }

      // Mark as seen to also deduplicate within the import batch
      existingKeys[key] = true;

      // Build contact object with defaults
      var contact = {};
      for (var j = 0; j < CONTACT_COLUMNS.length; j++) {
        var col = CONTACT_COLUMNS[j];
        contact[col] = item[col] !== undefined ? String(item[col]) : "";
      }

      if (!contact.support_level) contact.support_level = "Unknown";
      if (!contact.hd) contact.hd = "14";
      if (!contact.contacted) contact.contacted = "No";

      newRows.push(contactToRow(contact));
    }

    if (newRows.length === 0) {
      return jsonResponse({
        imported: 0,
        skipped: skipped,
        message: "All contacts already exist (duplicates skipped)",
      });
    }

    // Append all new rows in a single batch
    await sheetsAppend(env, SHEET_TAB + "!A:" + SHEET_LAST_COL, newRows);

    return jsonResponse({
      imported: newRows.length,
      skipped: skipped,
      total: incoming.length,
      message: "Import complete",
    }, 201);
  } catch (err) {
    return errorResponse("Failed to import contacts: " + err.message, 500);
  }
}
