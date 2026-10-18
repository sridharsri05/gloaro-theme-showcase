// Emails each enquiry to the GLOARO inbox without a backend.
// Uses FormSubmit's free AJAX endpoint (no account / API key).
// First-time setup: FormSubmit emails NOTIFY_EMAIL once asking to activate the address — click that link once.
export const NOTIFY_EMAIL = 'srissri441@gmail.com';
const ENDPOINT = `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`;

function lines(r) {
  const palette = r.palette || {};
  return [
    `Enquiry ID: ${r.enquiryId}`,
    `Name: ${r.customerName}`,
    `Business: ${r.businessName}`,
    `Phone: ${r.phone}`,
    `Email: ${r.email}`,
    `Category: ${r.category}`,
    `Theme: ${r.themeName || r.themeId} (${r.themeId})`,
    `Colours: primary ${palette.p || 'original'} · secondary ${palette.s || 'original'} · header ${palette.header || 'original'}${palette.header === 'custom' ? ' ' + palette.hdr : ''}`,
    `Requirements: ${r.requirements || '—'}`,
    `Source: ${r.leadSource || 'Direct'}${r.utm ? ' · ' + r.utm : ''}`,
    `Submitted: ${r.createdAt || new Date().toISOString()}`,
  ];
}

/** Sends the enquiry email. Resolves { ok: true } or { ok: false, error }. Never throws. */
export async function sendEnquiryEmail(r) {
  const body = {
    _subject: `New website enquiry · ${r.businessName} · ${r.themeName || r.themeId}`,
    _template: 'table',
    _captcha: 'false',
    _replyto: r.email,
    'Enquiry ID': r.enquiryId,
    'Customer name': r.customerName,
    'Business name': r.businessName,
    Phone: r.phone,
    Email: r.email,
    Category: r.category,
    Theme: `${r.themeName || ''} (${r.themeId})`,
    'Chosen colours': lines(r)[7].replace('Colours: ', ''),
    Requirements: r.requirements || '—',
    'Lead source': `${r.leadSource || 'Direct'}${r.utm ? ' · ' + r.utm : ''}`,
    Submitted: r.createdAt || new Date().toISOString(),
  };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    let data = {};
    try { data = await res.json(); } catch { /* non-JSON */ }
    if (res.ok && (data.success === 'true' || data.success === true)) return { ok: true };
    return { ok: false, error: data.message || `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e?.name === 'AbortError' ? 'Timed out' : (e?.message || 'Network error') };
  }
}

/** mailto: fallback that opens the visitor's email app with the enquiry prefilled. */
export function enquiryMailto(r) {
  const subject = `Website enquiry · ${r.businessName} · ${r.themeName || r.themeId}`;
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines(r).join('\n'))}`;
}

// Floating WhatsApp button config (dummy number — replace with the real business number).
export const WHATSAPP_NUMBER = '919655500357';
export const whatsappLink = (text = 'Hi GLOARO, I’d like to know more about getting a website built.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
