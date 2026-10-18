// Per-theme colour customisation (primary / secondary / header), persisted in localStorage.
// Every theme stylesheet reads: --p (primary), --s (secondary), --hdr (header bg), --hdr-ink (header text).

const KEY = (themeId) => `gloaro_palette_${themeId}`;

export const PRESETS = [
  { id: 'default', name: 'Original', p: null, s: null },
  { id: 'ocean', name: 'Ocean', p: '#0ea5e9', s: '#0f172a' },
  { id: 'forest', name: 'Forest', p: '#16a34a', s: '#052e16' },
  { id: 'royal', name: 'Royal', p: '#7c3aed', s: '#1e1b4b' },
  { id: 'rose', name: 'Rose', p: '#e11d48', s: '#4c0519' },
  { id: 'sunset', name: 'Sunset', p: '#f97316', s: '#431407' },
  { id: 'gold', name: 'Gold', p: '#d9a032', s: '#13244a' },
  { id: 'mono', name: 'Mono', p: '#111111', s: '#3f3f46' },
];

export const HEADER_MODES = [
  { id: 'default', name: 'Original' },
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'primary', name: 'Primary' },
  { id: 'custom', name: 'Custom' },
];

export const DEFAULT_PALETTE = { preset: 'default', p: null, s: null, header: 'default', hdr: '#ffffff' };

export function loadPalette(themeId) {
  try {
    const raw = localStorage.getItem(KEY(themeId));
    return raw ? { ...DEFAULT_PALETTE, ...JSON.parse(raw) } : { ...DEFAULT_PALETTE };
  } catch { return { ...DEFAULT_PALETTE }; }
}

export function savePalette(themeId, palette) {
  try { localStorage.setItem(KEY(themeId), JSON.stringify(palette)); } catch { /* storage unavailable */ }
}

export function clearPalette(themeId) {
  try { localStorage.removeItem(KEY(themeId)); } catch { /* ignore */ }
}

// Relative luminance → pick readable text colour for a given background.
export function inkFor(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return '#111111';
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.42 ? '#111111' : '#ffffff';
}

// Turns a palette into CSS custom properties for the theme wrapper.
// Unset values are omitted so each theme's own defaults apply via var(--p, fallback).
export function paletteVars(palette, theme) {
  const vars = {};
  const p = palette.p;
  const s = palette.s;
  if (p) vars['--p'] = p;
  if (s) vars['--s'] = s;
  let hdr = null;
  if (palette.header === 'light') hdr = '#ffffff';
  else if (palette.header === 'dark') hdr = s || theme?.look?.ink || '#111111';
  else if (palette.header === 'primary') hdr = p || theme?.look?.accent || '#111111';
  else if (palette.header === 'custom') hdr = palette.hdr || '#ffffff';
  if (hdr) { vars['--hdr'] = hdr; vars['--hdr-ink'] = inkFor(hdr); }
  return vars;
}

export function describePalette(palette) {
  if (!palette) return 'Original colours';
  const parts = [];
  parts.push(palette.preset !== 'default' || palette.p || palette.s
    ? `Primary ${palette.p || 'original'} · Secondary ${palette.s || 'original'}`
    : 'Original colours');
  if (palette.header && palette.header !== 'default') parts.push(`Header: ${palette.header === 'custom' ? palette.hdr : palette.header}`);
  return parts.join(' · ');
}
