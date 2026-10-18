// Enquiries are stored in the browser (localStorage) — no backend required for the MVP.
const KEY = 'gloaro_enquiries';
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export function listEnquiries() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
}

/**
 * Saves an enquiry. Returns { ok, enquiryId, duplicate, mode: 'local' }.
 * A submission with the same email + theme within 10 minutes is treated as a duplicate.
 */
export function saveEnquiry(payload) {
  const list = listEnquiries();
  const now = Date.now();
  const email = (payload.email || '').trim().toLowerCase();
  const dup = list.find((e) =>
    e.email?.toLowerCase() === email && e.themeId === payload.themeId && now - new Date(e.createdAt).getTime() < DUPLICATE_WINDOW_MS);
  if (dup) return { ok: true, duplicate: true, enquiryId: dup.enquiryId, mode: 'local' };

  const record = {
    ...payload,
    email,
    customerName: payload.customerName?.trim(),
    businessName: payload.businessName?.trim(),
    phone: payload.phone?.trim(),
    createdAt: new Date(now).toISOString(),
    status: 'new',
  };
  delete record.website; // honeypot
  const saved = write([record, ...list].slice(0, 500));
  if (!saved) return { ok: false, error: 'Could not save your enquiry in this browser. Please try again.' };
  return { ok: true, duplicate: false, enquiryId: record.enquiryId, mode: 'local' };
}

export function clearEnquiries() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
