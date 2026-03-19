export async function onRequestGet(context) {
  const clientId = 'Ov23lioEN5NhGom24hFh';
  const redirectUri = 'https://kara.wickowaypoint.com/api/callback';
  const scope = 'repo,user';

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

  return Response.redirect(authUrl, 301);
}
