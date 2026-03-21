// ──────────────────────────────────────────────
// POST /api/forms/submit
// Handle website form submissions (volunteer, yard sign, contact, donate)
// ──────────────────────────────────────────────

import {
  sheetsGet,
  sheetsAppend,
  sheetsUpdate,
  CORS_HEADERS,
  jsonResponse,
  errorResponse,
  CONTACT_COLUMNS,
  SHEET_TAB,
  SHEET_LAST_COL,
} from "../_shared/sheets.js";

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

function findExistingContact(rows, email, phone) {
  const emailIdx = CONTACT_COLUMNS.indexOf('email');
  const phoneIdx = CONTACT_COLUMNS.indexOf('phone');

  for (let i = 0; i < rows.length; i++) {
    const rowEmail = (rows[i][emailIdx] || '').trim().toLowerCase();
    const rowPhone = (rows[i][phoneIdx] || '').replace(/\D/g, '');

    if (email && rowEmail === email.trim().toLowerCase()) {
      return { row: rows[i], rowIndex: i + 2 }; // +2 because data starts at row 2 (1-indexed, skip header)
    }
    if (phone) {
      const normalizedPhone = phone.replace(/\D/g, '');
      if (rowPhone && normalizedPhone && rowPhone === normalizedPhone) {
        return { row: rows[i], rowIndex: i + 2 };
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
      return errorResponse('Missing required field: form_type', 400);
    }

    // Validate required fields for this form type
    const validationErrors = validateFields(form_type, fields);
    if (validationErrors.length > 0) {
      return errorResponse(validationErrors.join('; '), 400);
    }

    // Read existing contacts to check for duplicates
    const data = await sheetsGet(env, SHEET_TAB + '!A2:' + SHEET_LAST_COL);
    const rows = data.values || [];

    const existing = rows.length > 0
      ? findExistingContact(rows, fields.email, fields.phone)
      : null;

    let contactId;

    if (existing) {
      // Update existing contact — merge new data without overwriting existing values
      contactId = 'row_' + existing.rowIndex;
      const updatedRow = [...existing.row];

      // Ensure row is long enough for all columns
      while (updatedRow.length < CONTACT_COLUMNS.length) {
        updatedRow.push('');
      }

      // Update fields that are provided and non-empty
      for (const [key, value] of Object.entries(fields)) {
        const colIdx = CONTACT_COLUMNS.indexOf(key);
        if (colIdx !== -1 && value && value.toString().trim()) {
          updatedRow[colIdx] = value.toString().trim();
        }
      }

      // Append form type to notes
      const notesIdx = CONTACT_COLUMNS.indexOf('notes');
      if (notesIdx !== -1) {
        const existingNotes = updatedRow[notesIdx] || '';
        const formNote = form_type + '-form';
        if (!existingNotes.includes(formNote)) {
          updatedRow[notesIdx] = existingNotes ? `${existingNotes}; ${formNote}` : formNote;
        }
      }

      // Write back the updated row
      const rowRange = `${SHEET_TAB}!A${existing.rowIndex}:${SHEET_LAST_COL}${existing.rowIndex}`;
      await sheetsUpdate(env, rowRange, [updatedRow]);
    } else {
      // Create new contact
      const newRow = CONTACT_COLUMNS.map((col) => {
        if (col === 'support_level') return 'Unknown';
        if (col === 'hd') return '14';
        if (col === 'contacted') return 'No';
        if (col === 'notes') return form_type + '-form';
        return fields[col] ? fields[col].toString().trim() : '';
      });

      await sheetsAppend(env, SHEET_TAB + '!A:' + SHEET_LAST_COL, [newRow]);
      contactId = 'new';
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

    return jsonResponse({
      success: true,
      message: messages[form_type] || 'Form submitted successfully.',
      contact_id: contactId,
      action,
    });
  } catch (err) {
    return errorResponse(err.message || 'Internal server error', 500);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
