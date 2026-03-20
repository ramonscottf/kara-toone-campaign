// ──────────────────────────────────────────────
// POST /api/forms/submit
// Handle website form submissions (volunteer, yard sign, contact, donate)
// ──────────────────────────────────────────────

// ── Inline Sheets helpers ────────────────────

async function getAccessToken(env) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();
  if (!data.access_token) throw new Error('Failed to obtain Google access token');
  return data.access_token;
}

async function readSheet(env, tab, range) {
  const token = await getAccessToken(env);
  const sheetId = env.GOOGLE_SHEET_ID;
  const fullRange = `${tab}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(fullRange)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.values || [];
}

async function appendSheet(env, tab, rows) {
  const token = await getAccessToken(env);
  const sheetId = env.GOOGLE_SHEET_ID;
  const range = `${tab}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: rows }),
  });
}

async function updateSheetRow(env, tab, rowRange, values) {
  const token = await getAccessToken(env);
  const sheetId = env.GOOGLE_SHEET_ID;
  const fullRange = `${tab}!${rowRange}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(fullRange)}?valueInputOption=USER_ENTERED`;
  await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [values] }),
  });
}

// ── CORS helpers ─────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ── Contact column definitions ───────────────

const CONTACT_COLUMNS = [
  'id', 'first_name', 'last_name', 'email', 'phone',
  'address', 'city', 'zip', 'precinct', 'type',
  'source', 'confirmed', 'support_level', 'priority', 'contacted',
  'contact_attempts', 'last_contact_date', 'email_opened', 'phone_answered',
  'opt_email', 'opt_text', 'notes', 'tags', 'created_at', 'updated_at',
];

// ── ID generator ─────────────────────────────

function generateId() {
  const now = Date.now();
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `C${now}-${rand}`;
}

// ── Validation ───────────────────────────────

const REQUIRED_FIELDS = {
  volunteer: ['first_name', 'last_name', 'email', 'phone'],
  yardsign: ['first_name', 'last_name', 'address', 'city', 'zip'],
  contact: ['first_name', 'email'],
  donate: ['first_name', 'last_name', 'email'],
};

function validateFields(formType, fields) {
  const required = REQUIRED_FIELDS[formType];
  if (!required) return [`Unknown form type: ${formType}`];

  const missing = required.filter((f) => !fields[f] || !fields[f].toString().trim());
  if (missing.length > 0) {
    return [`Missing required fields: ${missing.join(', ')}`];
  }

  // Basic email validation
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return ['Invalid email address'];
  }

  return [];
}

// ── Find existing contact by email or phone ──

function findExistingContact(rows, headers, email, phone) {
  const emailIdx = headers.indexOf('email');
  const phoneIdx = headers.indexOf('phone');

  for (let i = 1; i < rows.length; i++) {
    const rowEmail = (rows[i][emailIdx] || '').trim().toLowerCase();
    const rowPhone = (rows[i][phoneIdx] || '').replace(/\D/g, '');

    if (email && rowEmail === email.trim().toLowerCase()) {
      return { row: rows[i], rowIndex: i + 1 };
    }
    if (phone) {
      const normalizedPhone = phone.replace(/\D/g, '');
      if (rowPhone && normalizedPhone && rowPhone === normalizedPhone) {
        return { row: rows[i], rowIndex: i + 1 };
      }
    }
  }
  return null;
}

// ── Welcome email templates ──────────────────

const WELCOME_TEMPLATES = {
  volunteer: {
    subject: 'Thanks for volunteering with Kara Toone!',
    html: `<p>Hi {first_name},</p>
<p>Thank you so much for signing up to volunteer! Your support means the world to our campaign.</p>
<p>We'll be in touch soon with upcoming volunteer opportunities in your area.</p>
<p>Best,<br>Team Kara Toone</p>`,
  },
  yardsign: {
    subject: 'Your yard sign request is confirmed!',
    html: `<p>Hi {first_name},</p>
<p>Thanks for requesting a Kara Toone yard sign! We'll coordinate delivery to your address soon.</p>
<p>Best,<br>Team Kara Toone</p>`,
  },
  contact: {
    subject: 'Thanks for reaching out to Kara Toone',
    html: `<p>Hi {first_name},</p>
<p>Thank you for contacting our campaign. We've received your message and will get back to you shortly.</p>
<p>Best,<br>Team Kara Toone</p>`,
  },
  donate: {
    subject: 'Thank you for your support!',
    html: `<p>Hi {first_name},</p>
<p>Thank you for your generous contribution to the Kara Toone campaign. Your support makes a real difference.</p>
<p>Best,<br>Team Kara Toone</p>`,
  },
};

// ── Send welcome email via Resend ────────────

async function sendWelcomeEmail(env, email, firstName, formType) {
  const template = WELCOME_TEMPLATES[formType];
  if (!template || !email || !env.RESEND_API_KEY) return;

  const html = template.html.replace(/\{first_name\}/gi, firstName || 'Friend');
  const fromAddress = `Kara Toone <${env.RESEND_FROM_EMAIL || 'noreply@kara.wickowaypoint.com'}>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        reply_to: 'votekaratoone@gmail.com',
        to: [email],
        subject: template.subject,
        html,
      }),
    });
  } catch {
    // Non-fatal: don't fail the form submission if welcome email fails
  }
}

// ── Form type to contact type mapping ────────

const FORM_TYPE_MAP = {
  volunteer: 'volunteer',
  yardsign: 'yardsign',
  contact: 'supporter',
  donate: 'donor',
};

// ── Main handler ─────────────────────────────

export async function onRequestPost(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const body = await request.json();
    const { form_type, ...fields } = body;

    if (!form_type) {
      return corsResponse({ error: 'Missing required field: form_type' }, 400);
    }

    // Validate required fields for this form type
    const validationErrors = validateFields(form_type, fields);
    if (validationErrors.length > 0) {
      return corsResponse({ error: validationErrors.join('; ') }, 400);
    }

    const now = new Date().toISOString();

    // Read existing contacts to check for duplicates
    const rows = await readSheet(env, 'Contacts', 'A1:Z');
    const headers = rows.length > 0
      ? rows[0].map((h) => h.trim().toLowerCase())
      : CONTACT_COLUMNS;

    const existing = rows.length >= 2
      ? findExistingContact(rows, headers, fields.email, fields.phone)
      : null;

    let contactId;

    if (existing) {
      // Update existing contact — merge new data without overwriting existing values
      contactId = existing.row[headers.indexOf('id')] || generateId();
      const updatedRow = [...existing.row];

      // Ensure row is long enough for all columns
      while (updatedRow.length < CONTACT_COLUMNS.length) {
        updatedRow.push('');
      }

      // Update fields that are provided and non-empty
      for (const [key, value] of Object.entries(fields)) {
        const colIdx = headers.indexOf(key);
        if (colIdx !== -1 && value && value.toString().trim()) {
          updatedRow[colIdx] = value.toString().trim();
        }
      }

      // Update type if it adds a new role (append with comma)
      const typeIdx = headers.indexOf('type');
      const newType = FORM_TYPE_MAP[form_type] || form_type;
      const existingType = (updatedRow[typeIdx] || '').toLowerCase();
      if (typeIdx !== -1 && !existingType.includes(newType)) {
        updatedRow[typeIdx] = existingType ? `${updatedRow[typeIdx]},${newType}` : newType;
      }

      // Update source to note the new form submission
      const sourceIdx = headers.indexOf('source');
      if (sourceIdx !== -1) {
        const existingSource = updatedRow[sourceIdx] || '';
        const newSource = `${form_type}-form`;
        if (!existingSource.includes(newSource)) {
          updatedRow[sourceIdx] = existingSource ? `${existingSource},${newSource}` : newSource;
        }
      }

      // Update timestamps
      const updatedAtIdx = headers.indexOf('updated_at');
      if (updatedAtIdx !== -1) updatedRow[updatedAtIdx] = now;

      // Ensure opt-in defaults
      const optEmailIdx = headers.indexOf('opt_email');
      if (optEmailIdx !== -1 && !updatedRow[optEmailIdx]) updatedRow[optEmailIdx] = 'true';
      const optTextIdx = headers.indexOf('opt_text');
      if (optTextIdx !== -1 && !updatedRow[optTextIdx]) updatedRow[optTextIdx] = 'true';

      // Write back the updated row
      const rowRange = `A${existing.rowIndex}:${String.fromCharCode(64 + CONTACT_COLUMNS.length)}${existing.rowIndex}`;
      await updateSheetRow(env, 'Contacts', rowRange, updatedRow);
    } else {
      // Create new contact
      contactId = generateId();
      const newRow = CONTACT_COLUMNS.map((col) => {
        if (col === 'id') return contactId;
        if (col === 'type') return FORM_TYPE_MAP[form_type] || form_type;
        if (col === 'source') return `${form_type}-form`;
        if (col === 'contacted') return 'false';
        if (col === 'contact_attempts') return '0';
        if (col === 'email_opened') return 'false';
        if (col === 'phone_answered') return 'false';
        if (col === 'opt_email') return 'true';
        if (col === 'opt_text') return 'true';
        if (col === 'created_at') return now;
        if (col === 'updated_at') return now;
        return fields[col] ? fields[col].toString().trim() : '';
      });

      await appendSheet(env, 'Contacts', [newRow]);
    }

    // Send welcome email (non-blocking — fire and forget)
    if (fields.email) {
      await sendWelcomeEmail(env, fields.email, fields.first_name, form_type);
    }

    const action = existing ? 'updated' : 'created';
    const messages = {
      volunteer: `Thank you for volunteering! We'll be in touch soon.`,
      yardsign: `Your yard sign request has been submitted!`,
      contact: `Thanks for reaching out! We'll get back to you shortly.`,
      donate: `Thank you for your generous support!`,
    };

    return corsResponse({
      success: true,
      message: messages[form_type] || 'Form submitted successfully.',
      contact_id: contactId,
      action,
    });
  } catch (err) {
    return corsResponse({ error: err.message || 'Internal server error' }, 500);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
