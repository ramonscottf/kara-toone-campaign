import {
  sheetsGet,
  sheetsUpdate,
  sheetsDelete,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  CONTACT_COLUMNS,
  SHEET_TAB,
  SHEET_LAST_COL,
  SHEET_TAB_GID,
  rowToContact,
  parseRowId,
} from "../_shared/sheets.js";

/**
 * Handle CORS preflight requests.
 */
export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Find a contact by its synthetic row ID (e.g. "row_5").
 * Returns { contact, rowIndex, row } or null.
 * rowIndex is 0-based index within data rows.
 */
async function findContactById(env, contactId) {
  var sheetRow = parseRowId(contactId);
  if (!sheetRow) return null;

  var data = await sheetsGet(env, SHEET_TAB + "!A2:" + SHEET_LAST_COL);
  var rows = data.values || [];
  var dataRowIndex = sheetRow - 2; // Convert sheet row to 0-based data index

  if (dataRowIndex < 0 || dataRowIndex >= rows.length) {
    return null;
  }

  return {
    contact: rowToContact(rows[dataRowIndex], dataRowIndex),
    rowIndex: dataRowIndex,
    row: rows[dataRowIndex],
  };
}

/**
 * GET /api/contacts/:id
 */
export async function onRequestGet(context) {
  var env = context.env;
  var contactId = context.params.id;

  try {
    var result = await findContactById(env, contactId);

    if (!result) {
      return errorResponse("Contact not found", 404);
    }

    return jsonResponse({ contact: result.contact });
  } catch (err) {
    return errorResponse("Failed to fetch contact: " + err.message, 500);
  }
}

/**
 * PATCH /api/contacts/:id
 * Update specific fields of a contact.
 */
export async function onRequestPatch(context) {
  var env = context.env;
  var contactId = context.params.id;

  try {
    var body = await context.request.json();
    var result = await findContactById(env, contactId);

    if (!result) {
      return errorResponse("Contact not found", 404);
    }

    // Merge updates into existing row
    var updatedRow = result.row.slice();

    // Ensure the row has enough columns
    while (updatedRow.length < CONTACT_COLUMNS.length) {
      updatedRow.push("");
    }

    var hasChanges = false;
    for (var i = 0; i < CONTACT_COLUMNS.length; i++) {
      var col = CONTACT_COLUMNS[i];
      if (body[col] !== undefined) {
        updatedRow[i] = String(body[col]);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return errorResponse("No valid fields to update", 400);
    }

    // Sheet row number: rowIndex is 0-based data row, +2 for header and 1-based indexing
    var sheetRowNumber = result.rowIndex + 2;
    var range = SHEET_TAB + "!A" + sheetRowNumber + ":" + SHEET_LAST_COL + sheetRowNumber;

    await sheetsUpdate(env, range, [updatedRow]);

    var updatedContact = rowToContact(updatedRow, result.rowIndex);
    return jsonResponse({ contact: updatedContact, message: "Contact updated" });
  } catch (err) {
    return errorResponse("Failed to update contact: " + err.message, 500);
  }
}

/**
 * DELETE /api/contacts/:id
 */
export async function onRequestDelete(context) {
  var env = context.env;
  var contactId = context.params.id;

  try {
    var result = await findContactById(env, contactId);

    if (!result) {
      return errorResponse("Contact not found", 404);
    }

    // Sheet row index for delete: rowIndex is 0-based data, +1 for header row
    var deleteStartIndex = result.rowIndex + 1;
    var deleteEndIndex = deleteStartIndex + 1;

    await sheetsDelete(env, SHEET_TAB_GID, deleteStartIndex, deleteEndIndex);

    return jsonResponse({ message: "Contact deleted", id: contactId });
  } catch (err) {
    return errorResponse("Failed to delete contact: " + err.message, 500);
  }
}
