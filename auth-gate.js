/**
 * Wicko Auth Gate — client-side soft auth for internal pages.
 *
 * Behavior:
 *  - On load, hides the entire page until access code is entered.
 *  - Stores auth in sessionStorage (clears when tab closes).
 *  - Shared across /connect, /war-room, /admin, /inventory uses session keys
 *    so an unlock on one stays unlocked on the others within the same tab.
 *
 * NOT a security boundary. This is a "don't show this to random visitors"
 * gate — appropriate for noindex internal tooling. For real protection,
 * use Worker-based auth (kara-command, kara-canvass do this server-side).
 *
 * Access code: karatoone2026 (rotate by editing ACCESS_CODE below).
 */
(function () {
  const ACCESS_CODE = 'karatoone2026';
  const SESSION_KEY = 'kara-internal-auth';

  // If already authed in this session, do nothing.
  if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

  // Hide all body content immediately to prevent flash.
  const style = document.createElement('style');
  style.textContent = `
    body > *:not(.wicko-gate) { display: none !important; }
    body.wicko-gated { overflow: hidden; }
    .wicko-gate {
      position: fixed; inset: 0; z-index: 999999;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #0d1f3c 0%, #0a1424 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
    }
    .wicko-gate-card {
      background: #142a4a;
      border: 1px solid #2a4775;
      border-radius: 16px;
      padding: 40px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,.4);
      text-align: center;
      color: #f4f5f7;
    }
    .wicko-gate-mark {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 56px;
      color: #d4af37;
      letter-spacing: 4px;
      line-height: 1;
      margin-bottom: 8px;
    }
    .wicko-gate-sub {
      font-size: 12px;
      color: #6f7e98;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 28px;
    }
    .wicko-gate-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .wicko-gate-desc {
      font-size: 14px;
      color: #b9c4d8;
      margin-bottom: 28px;
      line-height: 1.5;
    }
    .wicko-gate-input {
      width: 100%;
      padding: 14px 18px;
      background: #0a1424;
      border: 1px solid #2a4775;
      border-radius: 10px;
      color: #f4f5f7;
      font-size: 15px;
      font-family: inherit;
      margin-bottom: 12px;
      outline: none;
      transition: border-color .15s;
      box-sizing: border-box;
    }
    .wicko-gate-input:focus { border-color: #d4af37; }
    .wicko-gate-btn {
      width: 100%;
      padding: 14px;
      background: #d4af37;
      color: #0d1f3c;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      font-family: inherit;
      cursor: pointer;
      letter-spacing: .5px;
      transition: background .15s;
    }
    .wicko-gate-btn:hover { background: #c9a227; }
    .wicko-gate-error {
      color: #d8556a;
      font-size: 13px;
      margin-top: 12px;
      display: none;
    }
    .wicko-gate-back {
      margin-top: 20px;
      font-size: 12px;
      color: #6f7e98;
    }
    .wicko-gate-back a {
      color: #b9c4d8;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);

  // Build gate (we wait for body to exist).
  function mount() {
    if (!document.body) {
      requestAnimationFrame(mount);
      return;
    }
    document.body.classList.add('wicko-gated');

    const pageTitle = (document.title || 'Internal').replace(' — Kara Toone','').replace('Kara Toone — ','');

    const gate = document.createElement('div');
    gate.className = 'wicko-gate';
    gate.innerHTML = `
      <div class="wicko-gate-card">
        <div class="wicko-gate-mark">KARA</div>
        <div class="wicko-gate-sub">Internal · ${pageTitle}</div>
        <div class="wicko-gate-title">Access Code Required</div>
        <div class="wicko-gate-desc">This is an internal campaign tool. Enter the access code to continue.</div>
        <input type="password" class="wicko-gate-input" id="wicko-gate-pin" placeholder="Access code" autofocus autocomplete="off">
        <button type="button" class="wicko-gate-btn" id="wicko-gate-btn">Unlock</button>
        <div class="wicko-gate-error" id="wicko-gate-error">Wrong code. Try again.</div>
        <div class="wicko-gate-back"><a href="/">← Back to campaign site</a></div>
      </div>
    `;
    document.body.insertBefore(gate, document.body.firstChild);

    const input = document.getElementById('wicko-gate-pin');
    const btn   = document.getElementById('wicko-gate-btn');
    const err   = document.getElementById('wicko-gate-error');

    function tryAuth() {
      const v = (input.value || '').toLowerCase().trim();
      if (v === ACCESS_CODE) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        // Remove gate, restore page.
        gate.remove();
        document.body.classList.remove('wicko-gated');
        style.remove();
      } else {
        err.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }
    btn.addEventListener('click', tryAuth);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
    setTimeout(() => input.focus(), 50);
  }
  mount();
})();
