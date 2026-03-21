import { getToken } from '../auth/storage';

const BASE_URL = 'https://kara.wickowaypoint.com';

/**
 * Upload a photo via FormData POST.
 * NOTE: The /api/photos/upload endpoint may need to be created on the Worker.
 */
export async function uploadPhoto(
  uri: string,
  context: string,
): Promise<{ url: string }> {
  const token = await getToken();

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `${context}-${Date.now()}.jpg`,
  } as any);
  formData.append('context', context);

  const res = await fetch(`${BASE_URL}/api/photos/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error('Photo upload failed');
  }

  return res.json();
}
