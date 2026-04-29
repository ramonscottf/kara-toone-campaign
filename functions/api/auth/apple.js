/**
 * Apple Sign In authentication endpoint.
 * POST /api/auth/apple
 *
 * Receives an Apple identity token, verifies it against Apple's public keys,
 * looks up or creates the user in the Users sheet, and returns a signed JWT.
 */

import { signJwt } from '../_shared/jwt.js';
import { sheetsGet, sheetsAppend, CORS_HEADERS, jsonResponse, errorResponse } from '../_shared/sheets.js';

// Cache Apple's JWKS for 1 hour
let appleKeysCache = null;
let appleKeysCacheExpiry = 0;

/**
 * Fetch Apple's public keys (JWKS).
 */
async function getApplePublicKeys() {
  const now = Date.now();
  if (appleKeysCache && appleKeysCacheExpiry > now) {
    return appleKeysCache;
  }

  const res = await fetch('https://appleid.apple.com/auth/keys');
  if (!res.ok) throw new Error('Failed to fetch Apple JWKS');

  const jwks = await res.json();
  appleKeysCache = jwks.keys;
  appleKeysCacheExpiry = now + 3600000; // 1 hour
  return appleKeysCache;
}

/**
 * Base64url decode to ArrayBuffer.
 */
function base64urlToBuffer(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Verify an Apple identity token.
 * @param {string} identityToken - The JWT from Apple Sign In.
 * @returns {Promise<object>} Decoded token payload.
 */
async function verifyAppleToken(identityToken) {
  const parts = identityToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  // Decode header to find key ID
  const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
  const header = JSON.parse(headerStr);

  // Find matching Apple public key
  const appleKeys = await getApplePublicKeys();
  const matchingKey = appleKeys.find(k => k.kid === header.kid);
  if (!matchingKey) throw new Error('No matching Apple public key found');

  // Import the RSA public key
  const key = await crypto.subtle.importKey(
    'jwk',
    matchingKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  // Verify signature
  const signingInput = new TextEncoder().encode(parts[0] + '.' + parts[1]);
  const signature = base64urlToBuffer(parts[2]);

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    signature,
    signingInput
  );

  if (!valid) throw new Error('Invalid token signature');

  // Decode and validate payload
  const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadStr);

  // Check issuer
  if (payload.iss !== 'https://appleid.apple.com') {
    throw new Error('Invalid token issuer');
  }

  // Check expiration
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}

/**
 * Look up user in the Users sheet by Apple ID (sub claim).
 * Returns user object or null.
 */
async function findUser(env, appleId) {
  try {
    const data = await sheetsGet(env, 'Users!A:F');
    const rows = data.values || [];
    if (rows.length < 2) return null; // Only header row

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === appleId) {
        return {
          apple_id: rows[i][0] || '',
          email: rows[i][1] || '',
          name: rows[i][2] || '',
          role: rows[i][3] || 'volunteer',
          created_at: rows[i][4] || '',
          row_index: i + 1, // 1-based for Sheets
        };
      }
    }
    return null;
  } catch (err) {
    // If the Users sheet doesn't exist yet, return null
    console.error('Error reading Users sheet:', err.message);
    return null;
  }
}

/**
 * Create a new user in the Users sheet.
 */
async function createUser(env, appleId, email, name) {
  const now = new Date().toISOString();
  const role = 'volunteer'; // Default for new users

  await sheetsAppend(env, 'Users!A:F', [
    [appleId, email, name, role, now, now]
  ]);

  return { apple_id: appleId, email, name, role, created_at: now };
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { identityToken, fullName, email: providedEmail } = body;

    if (!identityToken) {
      return errorResponse('Missing identityToken', 400);
    }

    // Verify the Apple identity token
    const applePayload = await verifyAppleToken(identityToken);
    const appleId = applePayload.sub;
    const email = applePayload.email || providedEmail || '';

    // Look up or create user
    let user = await findUser(env, appleId);

    if (!user) {
      // Build display name from Apple's fullName object
      let displayName = '';
      if (fullName) {
        const parts = [fullName.givenName, fullName.familyName].filter(Boolean);
        displayName = parts.join(' ');
      }
      if (!displayName) displayName = email.split('@')[0] || 'Campaign User';

      user = await createUser(env, appleId, email, displayName);
    }

    // Sign our app JWT
    const jwtSecret = env.APP_JWT_SECRET;
    if (!jwtSecret) {
      return errorResponse('Server auth not configured', 500);
    }

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      sub: appleId,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + 30 * 24 * 3600, // 30 days
    };

    const token = await signJwt(jwtPayload, jwtSecret);

    return jsonResponse({
      token,
      user: {
        id: appleId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Apple auth error:', err);
    return errorResponse('Authentication failed: ' + err.message, 401);
  }
}
