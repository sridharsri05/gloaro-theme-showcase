// Captures UTM / source info on first landing and keeps it for the session,
// so the enquiry form can send it even after the visitor navigates around.

const KEY = 'gloaro_attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

const safeGet = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; }
};
const safeSet = (v) => {
  try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage unavailable */ }
};

export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  UTM_KEYS.forEach((k) => { if (params.get(k)) utm[k] = params.get(k).slice(0, 80); });
  const existing = safeGet();
  if (Object.keys(utm).length || !existing) {
    let referrer = '';
    try {
      if (document.referrer && new URL(document.referrer).host !== window.location.host)
        referrer = new URL(document.referrer).host;
    } catch { /* ignore */ }
    safeSet({ utm, referrer, landing: window.location.pathname, at: new Date().toISOString() });
  }
}

export function getAttribution() {
  const a = safeGet() || { utm: {}, referrer: '' };
  const utm = a.utm || {};
  const leadSource = utm.utm_source
    ? `${utm.utm_source}${utm.utm_medium ? ' / ' + utm.utm_medium : ''}`
    : a.referrer
      ? `Referral: ${a.referrer}`
      : 'Direct';
  const utmString = Object.entries(utm).map(([k, v]) => `${k}=${v}`).join('&');
  return { leadSource, utm: utmString, landing: a.landing || '' };
}

export function themeShareUrl(themeId, source) {
  const url = new URL(`/themes/${themeId}`, window.location.origin);
  if (source) {
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', 'social_share');
    url.searchParams.set('utm_campaign', 'theme_showcase');
  }
  return url.toString();
}

export function newEnquiryId() {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
    .replace(/-/g, '').slice(0, 6).toUpperCase();
  return `GLR-${ymd}-${rand}`;
}
