import {
  sheetsGet,
  sheetsUpdate,
  sheetsDelete,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  CONTACT_COLUMNS,
  rowToContact,
} from "../_shared/sheets.js";

/**
 * Handle CORS preflight requests.
 */
export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Find a contact row by ID. Returns { contact, rowIndex } or null.
 * rowIndex is 0-based index within the data rows (excluding header).
 */
async function findContactById(env, contactId) {
  var data = await sheetsGet(env, "Contacts!A2:Y");
  var rows = data.values || [];

  for (var i = 0; i < rows.length; i++) {
    if (rows[i][0] === contactId) {
      return { contact: rowToContact(rows[i]), rowIndex: i, row: rows[i] };
    }
  }

  return null;
}

/**
 * GET /api/contacts/:id
 * Retrieve a single contact by ID.
 */
export async function onRequestGet(context) {
  var env = context.env;
  var contactId = context.params.id;

  try {
    var result = findContactById(env, contactId);
    // findContactById is async
    result = await result;

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
      if (col === "id" || col === "created_at") {
        continue; // Never update these
      }
      if (body[col] !== undefined) {
        updatedRow[i] = String(body[col]);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return errorResponse("No valid fields to update", 400);
    }

    // Set updated_at
    var updatedAtIndex = CONTACT_COLUMNS.indexOf("updated_at");
    updatedRow[updatedAtIndex] = new Date().toISOString();

    // Sheet row number: rowIndex is 0-based data row, +2 for header and 1-based indexing
    var sheetRowNumber = result.rowIndex + 2;
    var range = "Contacts!A" + sheetRowNumber + ":Y" + sheetRowNumber;

    await sheetsUpdate(env, range, [updatedRow]);

    var updatedContact = rowToContact(updatedRow);
    return jsonResponse({ contact: updatedContact, message: "Contact updated" });
  } catch (err) {
    return errorResponse("Failed to update contact: " + err.message, 500);
  }
}

/**
 * DELETE /api/contacts/:id
 * Remove a contact from the sheet.
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
    // sheetsDelete expects 0-based row indices where row 0 is the header
    var deleteStartIndex = result.rowIndex + 1;
    var deleteEndIndex = deleteStartIndex + 1;

    // Use sheet tab ID 0 (first sheet) — adjust if Contacts is a different tab
    await sheetsDelete(env, 0, deleteStartIndex, deleteEndIndex);

    return jsonResponse({ message: "Contact deleted", id: contactId });
  } catch (err) {
    return errorResponse("Failed to delete contact: " + err.message, 500);
  }
}
