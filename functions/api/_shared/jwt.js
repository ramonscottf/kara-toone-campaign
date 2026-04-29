/**
 * JWT utilities for app authentication using HMAC-SHA256.
 * Used by Apple Sign In flow and request middleware.
 */

/**
 * Base64url encode a buffer or string.
 */
function base64urlEncode(data) {
  let str;
  if (typeof data === 'string') {
    str = btoa(data);
  } else {
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64url decode to string.
 */
function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

/**
 * Import HMAC-SHA256 key from secret string.
 */
async function importHmacKey(secret) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign a JWT with HMAC-SHA256.
 * @param {object} payload - JWT claims.
 * @param {string} secret - Signing secret (APP_JWT_SECRET env var).
 * @returns {Promise<string>} Signed JWT string.
 */
export async function signJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = encodedHeader + '.' + encodedPayload;

  const key = await importHmacKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));

  return signingInput + '.' + base64urlEncode(signature);
}

/**
 * Verify and decode a JWT.
 * @param {string} token - JWT string.
 * @param {string} secret - Signing secret.
 * @returns {Promise<object|null>} Decoded payload or null if invalid/expired.
 */
export async function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const signingInput = parts[0] + '.' + parts[1];
    const signature = parts[2];

    // Decode the signature from base64url
    const sigStr = base64urlDecode(signature);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const key = await importHmacKey(secret);
    const encoder = new TextEncoder();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes.buffer,
      encoder.encode(signingInput)
    );

    if (!valid) return null;

    const payload = JSON.parse(base64urlDecode(parts[1]));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
