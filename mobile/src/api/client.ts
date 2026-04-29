import { getToken } from '../auth/storage';

const BASE_URL = 'https://kara.wickowaypoint.com';

async function request(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

export const apiClient = {
  get: (path: string) => request(path, { method: 'GET' }),

  post: (path: string, body: any) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: (path: string, body: any) =>
    request(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (path: string) => request(path, { method: 'DELETE' }),
};
