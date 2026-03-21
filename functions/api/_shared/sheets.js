/**
 * Shared Google Sheets API helpers for Cloudflare Workers.
 * Uses Web Crypto API (RS256) for service account JWT auth.
 */

// In-memory token cache (per isolate lifetime)
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Base64url encode a buffer or string.
 */
function base64urlEncode(data) {
  let str;
  if (typeof data === "string") {
    str = btoa(data);
  } else {
    // ArrayBuffer or Uint8Array
    const bytes = new Uint8Array(data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Import a PEM-encoded RSA private key for RS256 signing via Web Crypto API.
 */
async function importPrivateKey(pem) {
  const pemContents = pem
    .replace(/-----BEGIN (RSA )?PRIVATE KEY-----/g, "")
    .replace(/-----END (RSA )?PRIVATE KEY-----/g, "")
    .replace(/\r?\n/g, "");

  const binaryStr = atob(pemContents);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

/**
 * Create a Google OAuth2 access token using a service account JWT.
 * @param {string} serviceAccountKey - JSON string of the service account key file.
 * @returns {Promise<string>} Access token.
 */
export async function getGoogleAuthToken(serviceAccountKey) {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  const keyData = typeof serviceAccountKey === "string"
    ? JSON.parse(serviceAccountKey)
    : serviceAccountKey;

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: keyData.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = encodedHeader + "." + encodedPayload;

  const privateKey = await importPrivateKey(keyData.private_key);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    encoder.encode(signingInput)
  );

  const jwt = signingInput + "." + base64urlEncode(signature);

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + jwt,
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error("Failed to get Google auth token: " + errText);
  }

  const tokenData = await tokenRes.json();
  cachedToken = tokenData.access_token;
  tokenExpiry = now + (tokenData.expires_in || 3600);

  return cachedToken;
}

/**
 * Make an authenticated request to Google Sheets API v4.
 * @param {object} env - Environment bindings (GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_KEY).
 * @param {string} method - HTTP method.
 * @param {string} range - A1 notation range (e.g. "Contacts!A:Z").
 * @param {object|null} body - Request body (for POST/PUT).
 * @param {object} [queryParams] - Additional query parameters.
 * @returns {Promise<object>} Parsed JSON response.
 */
async function sheetsRequest(env, method, range, body, queryParams) {
  const token = await getGoogleAuthToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const sheetId = env.GOOGLE_SHEETS_ID;
  const encodedRange = encodeURIComponent(range);

  let url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/" + encodedRange;

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += "?" + params.toString();
  }

  const options = {
    method: method,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Sheets API error (" + res.status + "): " + errText);
  }

  return res.json();
}

/**
 * Read values from a sheet range.
 */
export async function sheetsGet(env, range) {
  return sheetsRequest(env, "GET", range, null, {
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });
}

/**
 * Append rows to a sheet range.
 * @param {object} env
 * @param {string} range - e.g. "Contacts!A:Z"
 * @param {Array<Array<string>>} values - 2D array of row values.
 */
export async function sheetsAppend(env, range, values) {
  return sheetsRequest(
    env,
    "POST",
    range,
    { values: values },
    {
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
    }
  );
}

/**
 * Update cells in a sheet range.
 * @param {object} env
 * @param {string} range - e.g. "Contacts!A2:Z2"
 * @param {Array<Array<string>>} values - 2D array of values.
 */
export async function sheetsUpdate(env, range, values) {
  const token = await getGoogleAuthToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const sheetId = env.GOOGLE_SHEETS_ID;
  const encodedRange = encodeURIComponent(range);
  const url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId +
    "/values/" + encodedRange + "?valueInputOption=USER_ENTERED";

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: values }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Sheets update error (" + res.status + "): " + errText);
  }

  return res.json();
}

/**
 * Delete rows from a sheet using batchUpdate.
 * @param {object} env
 * @param {number} tabSheetId - The numeric sheet/tab ID (0 for first sheet).
 * @param {number} startRow - Start row index (0-based, inclusive).
 * @param {number} endRow - End row index (0-based, exclusive).
 */
export async function sheetsDelete(env, tabSheetId, startRow, endRow) {
  return sheetsBatchUpdate(env, [
    {
      deleteDimension: {
        range: {
          sheetId: tabSheetId,
          dimension: "ROWS",
          startIndex: startRow,
          endIndex: endRow,
        },
      },
    },
  ]);
}

/**
 * Execute a batch update on the spreadsheet.
 * @param {object} env
 * @param {Array<object>} requests - Array of request objects.
 */
export async function sheetsBatchUpdate(env, requests) {
  const token = await getGoogleAuthToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const sheetId = env.GOOGLE_SHEETS_ID;
  const url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + ":batchUpdate";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests: requests }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Sheets batchUpdate error (" + res.status + "): " + errText);
  }

  return res.json();
}

/**
 * Standard CORS headers.
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Create a JSON response with CORS headers.
 */
export function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({}, CORS_HEADERS, { "Content-Type": "application/json" }),
  });
}

/**
 * Create an error JSON response.
 */
export function errorResponse(message, status) {
  return jsonResponse({ error: message }, status || 500);
}

/**
 * Column definitions for the Contacts sheet.
 */
export const CONTACT_COLUMNS = [
  "id", "first_name", "last_name", "email", "phone",
  "address", "city", "zip", "precinct", "type",
  "source", "confirmed", "support_level", "priority", "contacted",
  "contact_attempts", "last_contact_date", "email_opened", "phone_answered",
  "opt_email", "opt_text", "notes", "tags", "created_at", "updated_at"
];

/**
 * Convert a row array to a contact object using CONTACT_COLUMNS.
 */
export function rowToContact(row) {
  var contact = {};
  for (var i = 0; i < CONTACT_COLUMNS.length; i++) {
    contact[CONTACT_COLUMNS[i]] = (row[i] !== undefined && row[i] !== null) ? String(row[i]) : "";
  }
  return contact;
}

/**
 * Convert a contact object to a row array using CONTACT_COLUMNS.
 */
export function contactToRow(contact) {
  return CONTACT_COLUMNS.map(function (col) {
    return contact[col] !== undefined ? String(contact[col]) : "";
  });
}

/**
 * Generate a timestamp-based unique ID.
 */
export function generateId() {
  var now = Date.now();
  var rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return "C" + now + "-" + rand;
}
