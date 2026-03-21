import {
  sheetsGet,
  sheetsAppend,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  CONTACT_COLUMNS,
  SHEET_TAB,
  SHEET_LAST_COL,
  rowToContact,
  contactToRow,
} from "../_shared/sheets.js";

/**
 * Handle CORS preflight requests.
 */
export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/contacts
 * List all contacts with optional filtering.
 * Query params: ?support=, ?precinct=, ?search=, ?contacted=
 */
export async function onRequestGet(context) {
  var env = context.env;

  try {
    var data = await sheetsGet(env, SHEET_TAB + "!A2:" + SHEET_LAST_COL);
    var rows = data.values || [];

    var contacts = rows.map(function (row, index) {
      return rowToContact(row, index);
    });

    var url = new URL(context.request.url);
    var supportFilter = url.searchParams.get("support");
    var precinctFilter = url.searchParams.get("precinct");
    var searchFilter = url.searchParams.get("search");
    var contactedFilter = url.searchParams.get("contacted");

    if (supportFilter) {
      var supportLower = supportFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        return c.support_level && c.support_level.toLowerCase() === supportLower;
      });
    }

    if (precinctFilter) {
      var precinctLower = precinctFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        return c.precinct && c.precinct.toLowerCase() === precinctLower;
      });
    }

    if (contactedFilter) {
      var contactedLower = contactedFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        var val = (c.contacted || "").toLowerCase();
        if (contactedLower === "true" || contactedLower === "yes") {
          return val === "true" || val === "yes" || val === "1";
        }
        return !val || val === "false" || val === "no" || val === "0";
      });
    }

    if (searchFilter) {
      var searchLower = searchFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        var fullName = (c.first_name + " " + c.last_name).toLowerCase();
        var email = (c.email || "").toLowerCase();
        var phone = (c.phone || "").toLowerCase();
        var address = (c.address || "").toLowerCase();
        var precinct = (c.precinct || "").toLowerCase();
        return (
          fullName.indexOf(searchLower) !== -1 ||
          email.indexOf(searchLower) !== -1 ||
          phone.indexOf(searchLower) !== -1 ||
          address.indexOf(searchLower) !== -1 ||
          precinct.indexOf(searchLower) !== -1
        );
      });
    }

    return jsonResponse({ contacts: contacts, count: contacts.length });
  } catch (err) {
    return errorResponse("Failed to fetch contacts: " + err.message, 500);
  }
}

/**
 * POST /api/contacts
 * Create a new contact.
 */
export async function onRequestPost(context) {
  var env = context.env;

  try {
    var body = await context.request.json();

    var contact = {};

    // Copy provided fields
    for (var i = 0; i < CONTACT_COLUMNS.length; i++) {
      var col = CONTACT_COLUMNS[i];
      if (body[col] !== undefined) {
        contact[col] = String(body[col]);
      } else {
        contact[col] = "";
      }
    }

    // Defaults
    if (!contact.support_level) contact.support_level = "Unknown";
    if (!contact.hd) contact.hd = "14";
    if (!contact.contacted) contact.contacted = "No";

    var row = contactToRow(contact);
    await sheetsAppend(env, SHEET_TAB + "!A:" + SHEET_LAST_COL, [row]);

    return jsonResponse({ contact: contact, message: "Contact created" }, 201);
  } catch (err) {
    return errorResponse("Failed to create contact: " + err.message, 500);
  }
}
