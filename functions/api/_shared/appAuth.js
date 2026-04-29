/**
 * Middleware for app authentication.
 * Validates JWT from Authorization header and attaches user info to context.
 */

import { verifyJwt } from './jwt.js';
import { CORS_HEADERS, errorResponse } from './sheets.js';

/**
 * Extract and verify the app JWT from the Authorization header.
 * Returns the decoded user payload or null.
 */
export async function authenticateRequest(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  const secret = env.APP_JWT_SECRET;
  if (!secret) {
    console.error('APP_JWT_SECRET not configured');
    return null;
  }

  return verifyJwt(token, secret);
}

/**
 * Require authentication. Returns an error response if not authenticated.
 * Otherwise returns the user payload.
 */
export async function requireAuth(request, env) {
  const user = await authenticateRequest(request, env);
  if (!user) {
    return { error: errorResponse('Unauthorized', 401) };
  }
  return { user };
}

/**
 * Require a specific role. Returns error if user doesn't have the required role.
 * Role hierarchy: admin > staff > volunteer
 */
export async function requireRole(request, env, requiredRole) {
  const result = await requireAuth(request, env);
  if (result.error) return result;

  const roleHierarchy = { admin: 3, staff: 2, volunteer: 1 };
  const userLevel = roleHierarchy[result.user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    return { error: errorResponse('Forbidden: insufficient role', 403) };
  }

  return result;
}
