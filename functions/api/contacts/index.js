import {
  sheetsGet,
  sheetsAppend,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  CONTACT_COLUMNS,
  rowToContact,
  contactToRow,
  generateId,
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
 * Query params: ?support=, ?type=, ?precinct=, ?search=, ?priority=
 */
export async function onRequestGet(context) {
  var env = context.env;

  try {
    var data = await sheetsGet(env, "Contacts!A2:Y");
    var rows = data.values || [];

    var contacts = rows.map(function (row) {
      return rowToContact(row);
    });

    var url = new URL(context.request.url);
    var supportFilter = url.searchParams.get("support");
    var typeFilter = url.searchParams.get("type");
    var precinctFilter = url.searchParams.get("precinct");
    var searchFilter = url.searchParams.get("search");
    var priorityFilter = url.searchParams.get("priority");

    if (supportFilter) {
      var supportLower = supportFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        return c.support_level && c.support_level.toLowerCase() === supportLower;
      });
    }

    if (typeFilter) {
      var typeLower = typeFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        return c.type && c.type.toLowerCase() === typeLower;
      });
    }

    if (precinctFilter) {
      var precinctLower = precinctFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        return c.precinct && c.precinct.toLowerCase() === precinctLower;
      });
    }

    if (priorityFilter) {
      var priorityLower = priorityFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        return c.priority && c.priority.toLowerCase() === priorityLower;
      });
    }

    if (searchFilter) {
      var searchLower = searchFilter.toLowerCase();
      contacts = contacts.filter(function (c) {
        var fullName = (c.first_name + " " + c.last_name).toLowerCase();
        var email = (c.email || "").toLowerCase();
        var phone = (c.phone || "").toLowerCase();
        var address = (c.address || "").toLowerCase();
        return (
          fullName.indexOf(searchLower) !== -1 ||
          email.indexOf(searchLower) !== -1 ||
          phone.indexOf(searchLower) !== -1 ||
          address.indexOf(searchLower) !== -1
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

    var now = new Date().toISOString();
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

    // Auto-set system fields
    contact.id = generateId();
    contact.created_at = now;
    contact.updated_at = now;

    // Defaults
    if (!contact.contacted) contact.contacted = "false";
    if (!contact.contact_attempts) contact.contact_attempts = "0";
    if (!contact.email_opened) contact.email_opened = "false";
    if (!contact.phone_answered) contact.phone_answered = "false";
    if (!contact.opt_email) contact.opt_email = "true";
    if (!contact.opt_text) contact.opt_text = "true";

    var row = contactToRow(contact);
    await sheetsAppend(env, "Contacts!A:Y", [row]);

    return jsonResponse({ contact: contact, message: "Contact created" }, 201);
  } catch (err) {
    return errorResponse("Failed to create contact: " + err.message, 500);
  }
}
