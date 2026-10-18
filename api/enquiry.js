// POST /api/enquiry — Vercel Node.js serverless function.
// 1. Validates + sanitises the enquiry server-side
// 2. Rejects duplicates (same Enquiry ID, or same email + theme within 10 minutes)
// 3. Appends one row to the "GLOARO Business Enquiries" Google Sheet
// 4. Sends an email notification to the GLOARO inbox via authenticated SMTP
// All credentials are read from server-side environment variables only.

import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { getTheme, getCategory } from '../src/data/themes.js';

const env = process.env;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const sheetsConfigured = () =>
  Boolean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_SHEET_ID);
const emailConfigured = () =>
  Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.NOTIFY_EMAIL);

// ---------- helpers ----------
const clean = (v, max = 500) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

// Neutralise spreadsheet formula injection (=, +, -, @ at start)
// (phone-like values such as "+91 98765 43210" are left untouched)
const sheetSafe = (v) =>
  /^[=@\t\r]/.test(v) || /^[+\-](?![\d\s().-]+$)/.test(v) ? `'${v}` : v;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-().]{7,20}$/;

function validate(body) {
  const errors = {};
  const data = {
    enquiryId: clean(body.enquiryId, 40),
    customerName: clean(body.customerName, 80),
    businessName: clean(body.businessName, 120),
    phone: clean(body.phone, 20),
    email: clean(body.email, 120).toLowerCase(),
    category: clean(body.category, 60),
    themeId: clean(body.themeId, 60),
    requirements: clean(body.requirements, 1500),
    leadSource: clean(body.leadSource, 120),
    utm: clean(body.utm, 400),
  };

  if (data.customerName.length < 2) errors.customerName = 'Please enter your full name.';
  if (data.businessName.length < 2) errors.businessName = 'Please enter your business name.';
  const digits = data.phone.replace(/\D/g, '');
  if (!PHONE_RE.test(data.phone) || digits.length < 7 || digits.length > 15)
    errors.phone = 'Enter a valid phone number (7–15 digits, optional +country code).';
  if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address.';

  const theme = getTheme(data.themeId);
  if (!theme) errors.themeId = 'Please select a valid theme.';
  const category = getCategory(data.category);
  if (!category) errors.category = 'Please select a valid business category.';
  if (theme && category && theme.category !== category.id)
    errors.themeId = 'Selected theme does not belong to the selected category.';

  if (!/^GLR-[A-Z0-9-]{6,32}$/.test(data.enquiryId)) data.enquiryId = makeEnquiryId();

  return { errors, data, theme, category };
}

function makeEnquiryId() {
  const d = new Date();
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GLR-${ymd}-${rand}`;
}

// ---------- Google Sheets ----------
async function sheetsToken() {
  const client = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const { token } = await client.getAccessToken();
  return token;
}

const tab = () => encodeURIComponent(env.GOOGLE_SHEET_TAB || 'Enquiries');
const sheetsBase = () => `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values`;

async function findDuplicate(token, data) {
  const r = await fetch(`${sheetsBase()}/${tab()}!A:I`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`Sheets read failed (${r.status}): ${await r.text()}`);
  const { values = [] } = await r.json();
  const now = Date.now();
  for (const row of values.slice(1)) {
    const [id, ts, , , , email, , , themeId] = row;
    if (id === data.enquiryId) return id;
    const t = Date.parse(ts);
    if (email === data.email && themeId === data.themeId && t && now - t < DUPLICATE_WINDOW_MS) return id;
  }
  return null;
}

async function appendRow(token, row) {
  const url = `${sheetsBase()}/${tab()}!A1:N1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!r.ok) throw new Error(`Sheets append failed (${r.status}): ${await r.text()}`);
}

// ---------- Email ----------
async function sendEmail(lead) {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 465),
    secure: Number(env.SMTP_PORT || 465) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  const rows = [
    ['Enquiry ID', lead.enquiryId],
    ['Submitted', lead.submittedAt],
    ['Customer', lead.customerName],
    ['Business', lead.businessName],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Category', lead.categoryName],
    ['Theme', `${lead.themeName} (${lead.themeId})`],
    ['Theme URL', lead.themeUrl],
    ['Lead source', lead.leadSource || '—'],
    ['Campaign / UTM', lead.utm || '—'],
    ['Requirements', lead.requirements || '—'],
  ];
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#14254a;color:#fff;padding:18px 22px">
      <div style="font-size:12px;letter-spacing:2px;color:#e0b04a">GLOARO PVT LTD</div>
      <div style="font-size:20px;font-weight:bold;margin-top:4px">New website enquiry — ${escapeHtml(lead.themeName)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 22px;color:#6b7280;width:150px;border-bottom:1px solid #f1f1f1">${k}</td><td style="padding:10px 22px;border-bottom:1px solid #f1f1f1">${escapeHtml(v)}</td></tr>`
        )
        .join('')}
    </table>
  </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const info = await transporter.sendMail({
    from: env.MAIL_FROM || env.SMTP_USER,
    to: env.NOTIFY_EMAIL,
    replyTo: lead.email,
    subject: `New enquiry ${lead.enquiryId} · ${lead.businessName} · ${lead.themeName}`,
    text,
    html,
  });
  // Only treat as delivered to provider if SMTP accepted the recipient.
  if (!info.accepted || info.accepted.length === 0) throw new Error('SMTP did not accept recipient');
  return info.messageId;
}

// ---------- handler ----------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: bots fill hidden "website" field
  if (body.website) return res.status(200).json({ ok: true, enquiryId: makeEnquiryId(), mode: 'filtered' });

  const { errors, data, theme, category } = validate(body);
  if (Object.keys(errors).length) {
    return res.status(422).json({ ok: false, error: 'Please correct the highlighted fields.', fields: errors });
  }

  const siteUrl = (env.SITE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
  const lead = {
    ...data,
    submittedAt: new Date().toISOString(),
    categoryName: category.name,
    themeName: `${theme.name} — ${theme.type}`,
    themeUrl: `${siteUrl}/themes/${theme.id}`,
  };

  const result = { ok: true, enquiryId: lead.enquiryId, sheet: 'not_configured', email: 'not_configured' };

  // 1) Google Sheets — the lead is only "accepted" once the row is saved.
  if (sheetsConfigured()) {
    try {
      const token = await sheetsToken();
      const dup = await findDuplicate(token, lead);
      if (dup) {
        return res.status(409).json({
          ok: false,
          duplicate: true,
          enquiryId: dup,
          error: 'We already received this enquiry. Our team will contact you shortly.',
        });
      }
      await appendRow(token, [
        lead.enquiryId,
        lead.submittedAt,
        lead.customerName,
        lead.businessName,
        lead.phone,
        lead.email,
        lead.categoryName,
        lead.themeName,
        lead.themeId,
        lead.themeUrl,
        lead.leadSource || 'Direct',
        lead.utm,
        'New',
        lead.requirements,
      ].map((v) => sheetSafe(String(v ?? ''))));
      result.sheet = 'saved';
    } catch (err) {
      console.error('[enquiry] Google Sheets error:', err.message);
      return res.status(502).json({
        ok: false,
        error: 'We could not save your enquiry right now. Please try again in a minute.',
      });
    }
  } else {
    console.warn('[enquiry] Google Sheets not configured — running in demo mode.', lead.enquiryId);
  }

  // 2) Email — failure is logged but does not lose the lead (already in sheet).
  if (emailConfigured()) {
    try {
      const messageId = await sendEmail(lead);
      result.email = 'accepted';
      console.log('[enquiry] Email accepted by SMTP', lead.enquiryId, messageId);
    } catch (err) {
      result.email = 'failed';
      console.error('[enquiry] Email delivery failed for', lead.enquiryId, '-', err.message);
    }
  }

  result.mode = sheetsConfigured() ? 'live' : 'demo';
  return res.status(200).json(result);
}
