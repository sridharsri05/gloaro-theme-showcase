import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import DemoLink from './DemoLink.jsx';
import { getCategory } from '../data/themes.js';

// Live, scaled-down preview of the actual theme route (no static screenshots to go stale).
export function ThemePreview({ themeId, title }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1280));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);
  return (
    <div className="preview" ref={box}>
      <div className="preview-chrome"><i /><i /><i /><span>gloaro.app/themes/{themeId}</span></div>
      <div className="preview-viewport">
        {!loaded && <div className="preview-skeleton" />}
        {visible && (
          <iframe
            title={`${title} preview`}
            src={`/themes/${themeId}?embed=1`}
            tabIndex={-1}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{ transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
}

export default function ThemeCard({ theme }) {
  const cat = getCategory(theme.category);
  return (
    <article className="theme-card">
      <DemoLink themeId={theme.id} className="theme-card-media" aria-label={`Open ${theme.name} live demo`}>
        <ThemePreview themeId={theme.id} title={theme.name} />
        <span className="theme-card-hover"><Icon name="eye" size={18} /> Live Demo</span>
      </DemoLink>
      <div className="theme-card-body">
        <div className="theme-card-meta">
          <span className="chip">{cat?.name}</span>
          <span className="palette">{theme.palette.map((c) => <i key={c} style={{ background: c }} />)}</span>
        </div>
        <h3>{theme.name} <small>· {theme.type}</small></h3>
        <p>{theme.description}</p>
        <ul className="features">
          {theme.features.map((f) => <li key={f}><Icon name="check" size={14} stroke={2.4} />{f}</li>)}
        </ul>
        <div className="theme-card-actions">
          <DemoLink themeId={theme.id} className="btn btn-outline btn-sm"><Icon name="eye" size={16} /> Live Demo</DemoLink>
          <Link to={`/enquire/${theme.id}`} className="btn btn-primary btn-sm">Create Your Website <Icon name="arrow" size={16} /></Link>
        </div>
        <div className="theme-id">Theme ID: <code>{theme.id}</code></div>
      </div>
    </article>
  );
}
