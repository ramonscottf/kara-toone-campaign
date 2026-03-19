export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Authorization code not found', { status: 400 });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'Ov23lioEN5NhGom24hFh',
        client_secret: context.env.GITHUB_CLIENT_SECRET || 'efe502060ab75ac3af88b6899914a0531001a4bc',
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(`Authorization failed: ${data.error_description}`, { status: 401 });
    }

    const token = data.access_token;
    const provider = 'github';

    const html = `
      <html>
        <head>
          <title>Decap CMS Authorization</title>
        </head>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("receiveMessage %o", e);
                window.opener.postMessage(
                  'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
                  e.origin
                );
                window.removeEventListener("message", receiveMessage, false);
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:${provider}", "*");
            })();
          </script>
          <p>Redirecting...</p>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response(`Authorization error: ${error.message}`, { status: 500 });
  }
}
