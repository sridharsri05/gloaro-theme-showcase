import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getTheme, getCategory } from '../data/themes.js';
import { THEME_COMPONENTS } from '../themes/index.js';
import { DEFAULT_PALETTE, loadPalette, savePalette, clearPalette, paletteVars } from '../lib/palette.js';
import ShareBar from '../components/ShareBar.jsx';
import ColorSwitcher from '../components/ColorSwitcher.jsx';
import Icon from '../components/Icon.jsx';
import NotFound from './NotFound.jsx';

export default function ThemeDemo() {
  const { themeId } = useParams();
  const [params] = useSearchParams();
  const embed = params.get('embed') === '1';
  const theme = getTheme(themeId);
  const Theme = THEME_COMPONENTS[themeId];
  const [open, setOpen] = useState(null); // 'share' | 'colors' | null
  // Colours come from localStorage, or from share-able URL params (?p=%23hex&s=%23hex&header=dark).
  const fromUrl = () => {
    const hex = (v) => (/^#?[0-9a-f]{6}$/i.test(v || '') ? (v.startsWith('#') ? v : `#${v}`) : null);
    const p = hex(params.get('p')); const s = hex(params.get('s')); const header = params.get('header');
    if (!p && !s && !header) return null;
    return { ...loadPalette(themeId), preset: 'custom', p: p || null, s: s || null, header: header || 'default', hdr: hex(params.get('hdr')) || '#ffffff' };
  };
  const [palette, setPalette] = useState(() => fromUrl() || loadPalette(themeId));

  useEffect(() => { setPalette(fromUrl() || loadPalette(themeId)); }, [themeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Embedded previews follow colour changes made in the full demo (same browser).
  useEffect(() => {
    if (!embed) return;
    const sync = (e) => { if (!e.key || e.key === `gloaro_palette_${themeId}`) setPalette(loadPalette(themeId)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [embed, themeId]);

  useEffect(() => {
    if (theme) document.title = `${theme.name} · ${theme.type} — GLOARO Live Demo`;
    return () => { document.title = 'GLOARO — Business Theme Showcase'; };
  }, [theme]);

  const vars = useMemo(() => (theme ? paletteVars(palette, theme) : {}), [palette, theme]);

  if (!theme || !Theme) return <NotFound />;
  const cat = getCategory(theme.category);

  const change = (next) => { setPalette(next); savePalette(themeId, next); };
  const reset = () => { setPalette({ ...DEFAULT_PALETTE }); clearPalette(themeId); };
  const customised = palette.p || palette.s || palette.header !== 'default';

  if (embed) return <div className="demo-embed" style={vars}><Theme /></div>;

  return (
    <div className="demo">
      <div className="demo-bar" role="region" aria-label="GLOARO demo controls">
        <Link to={`/themes?category=${theme.category}`} className="demo-back">
          <Icon name="back" size={18} /> <span>Back to gallery</span>
        </Link>
        <div className="demo-title">
          <img src="/gloaro-mark.png" alt="GLOARO" width="26" height="26" />
          <div>
            <strong>{theme.name}</strong>
            <span>{cat.name} · Live demo</span>
          </div>
        </div>
        <div className="demo-actions">
          <div className={`demo-pop-wrap ${open === 'colors' ? 'is-open' : ''}`}>
            <button className={`btn btn-ghost btn-sm demo-colors-toggle ${customised ? 'is-custom' : ''}`} onClick={() => setOpen((o) => (o === 'colors' ? null : 'colors'))} aria-expanded={open === 'colors'}>
              <span className="demo-dots" aria-hidden="true">
                <i style={{ background: palette.p || theme.look.accent }} /><i style={{ background: palette.s || theme.look.ink }} />
              </span>
              <span>Colours</span>
            </button>
            <div className="demo-pop demo-pop-colors">
              <ColorSwitcher theme={theme} palette={palette} onChange={change} onReset={reset} />
            </div>
          </div>
          <div className={`demo-pop-wrap ${open === 'share' ? 'is-open' : ''}`}>
            <button className="btn btn-ghost btn-sm demo-share-toggle" onClick={() => setOpen((o) => (o === 'share' ? null : 'share'))} aria-expanded={open === 'share'}>
              <Icon name="share" size={16} /> <span>Share</span>
            </button>
            <div className="demo-pop"><ShareBar theme={theme} /></div>
          </div>
          <Link to={`/enquire/${theme.id}`} className="btn btn-gold btn-sm">
            Create Your Website <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
      <div className="demo-frame" style={vars}>
        <Theme />
      </div>
    </div>
  );
}
