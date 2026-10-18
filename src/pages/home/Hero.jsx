import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import Icon from '../../components/Icon.jsx';
import DemoLink from '../../components/DemoLink.jsx';
import { THEMES, getCategory } from '../../data/themes.js';
import { Photo } from '../../lib/images.jsx';
import { EASE, Magnetic } from './motion-kit.jsx';

const LINES = [
  ['Websites', 'that', 'look', 'like'],
  ['your', 'business'],
  ['already', 'won.'],
];

// A tiny, stylised mock of each theme (cheaper than a live iframe in the hero)
export function MiniMock({ theme }) {
  const { bg, ink, accent, font, headline } = theme.look;
  return (
    <div className="mm" style={{ background: bg, color: ink }}>
      <div className="mm-chrome"><i /><i /><i /></div>
      <div className="mm-nav">
        <b style={{ fontFamily: font }}>{theme.name}</b>
        <span><i style={{ background: ink }} /><i style={{ background: ink }} /><i style={{ background: ink }} /></span>
      </div>
      <div className="mm-body">
        <div className="mm-copy">
          <h4 style={{ fontFamily: font }}>{headline}</h4>
          <p><i style={{ background: ink }} /><i style={{ background: ink }} /></p>
          <span className="mm-btn" style={{ background: accent }} />
        </div>
        <div className="mm-art" style={{ background: accent }}>
          <span style={{ background: bg }} />
        </div>
      </div>
    </div>
  );
}

// 3D coverflow: active card front and centre, neighbours recede and rotate into depth.
// Auto-advances, pauses on hover, supports arrows, dots, drag/swipe and keyboard.
// The active card tilts toward the cursor with a moving glare (CodePen-style tilt card).
const SIDE = 3; // cards visible on each side
function ThemeCoverflow() {
  const n = THEMES.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  const stage = useRef(null);
  const go = (d) => setActive((a) => (a + d + n) % n);

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => go(1), 3200);
    return () => clearInterval(t);
  }, [paused, n]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKey = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
  const onTilt = (e, el) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - y) * 14, ry: (x - 0.5) * 18, gx: x * 100, gy: y * 100, on: true });
  };
  const offTilt = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  return (
    <div className="h-cover" aria-label="Featured theme previews" tabIndex={0} onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); offTilt(); }}>
      <motion.div className="h-cover-stage" ref={stage}
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12}
        onDragEnd={(_, info) => { if (info.offset.x < -40 || info.velocity.x < -300) go(1); else if (info.offset.x > 40 || info.velocity.x > 300) go(-1); }}>
        {THEMES.map((t, i) => {
          let off = i - active; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          const hidden = abs > SIDE;
          const isActive = off === 0;
          const cat = getCategory(t.category);
          const transform = isActive
            ? `translate3d(-50%, 0, 0) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.on ? 1.04 : 1})`
            : `translate3d(calc(-50% + ${off * 58}%), 0, ${-abs * 150}px) rotateY(${-off * 38}deg) scale(${1 - abs * 0.07})`;
          return (
            <div key={t.id} className={`cf-card ${isActive ? 'is-active' : ''} ${hidden ? 'is-hidden' : ''}`}
              style={{ transform, zIndex: 10 - abs, opacity: hidden ? 0 : 1 - abs * 0.18, filter: isActive ? 'none' : `brightness(${1 - abs * 0.12})`, transition: tilt.on && isActive ? 'transform .12s ease-out' : undefined }}
              onMouseMove={isActive ? (e) => onTilt(e, e.currentTarget) : undefined} onMouseLeave={isActive ? offTilt : undefined}
              onClick={!isActive ? () => setActive(i) : undefined} aria-hidden={hidden}>
              <DemoLink themeId={t.id} aria-label={`Open ${t.name} live demo`} tabIndex={isActive ? 0 : -1} draggable={false} onClick={(e) => { if (!isActive) e.preventDefault(); }}>
                <div className="thumb-chrome"><i /><i /><i /><span>{t.id}</span></div>
                <div className="thumb-img">
                  <Photo id={t.thumb} w={720} h={450} alt={`${t.name} — ${t.type}`} eager={abs <= 1} draggable={false} />
                  <span className="thumb-cat">{cat?.name}</span>
                  <span className="thumb-cta"><Icon name="eye" size={14} /> Open live demo</span>
                </div>
                <div className="thumb-body">
                  <b style={{ fontFamily: t.look.font }}>{t.name}</b>
                  <span>{t.type}</span>
                  <i className="thumb-dots">{t.palette.map((c) => <em key={c} style={{ background: c }} />)}</i>
                </div>
                {isActive && <span className="cf-glare" style={{ '--gx': `${tilt.gx}%`, '--gy': `${tilt.gy}%`, opacity: tilt.on ? 1 : 0 }} />}
              </DemoLink>
            </div>
          );
        })}
      </motion.div>
      <div className="h-cover-ctrl">
        <button type="button" className="cf-arrow" onClick={() => go(-1)} aria-label="Previous theme"><Icon name="back" size={18} /></button>
        <div className="cf-dots" role="tablist">
          {THEMES.map((t, i) => <button key={t.id} type="button" role="tab" aria-selected={i === active} aria-label={t.name} className={i === active ? 'on' : ''} onClick={() => setActive(i)} />)}
        </div>
        <button type="button" className="cf-arrow" onClick={() => go(1)} aria-label="Next theme"><Icon name="arrow" size={18} /></button>
      </div>
      <div className="cf-caption" aria-live="polite"><b>{THEMES[active].name}</b> · {THEMES[active].type}</div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const orbX = useTransform(smx, (v) => v * 60);
  const orbY = useTransform(smy, (v) => v * 60);
  const orbX2 = useTransform(smx, (v) => v * -80);
  const orbY2 = useTransform(smy, (v) => v * -50);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  let w = 0;
  return (
    <section ref={ref} className="h-hero" onMouseMove={onMove}>
      <div className="h-hero-bg" aria-hidden="true">
        <motion.span className="h-orb h-orb-gold" style={{ x: orbX, y: orbY }} />
        <motion.span className="h-orb h-orb-navy" style={{ x: orbX2, y: orbY2 }} />
        <span className="h-dots" />
      </div>

      <motion.div className="container h-hero-copy" style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}>
        <motion.div
          className="h-badge"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.img
            src="/gloaro-mark.png" alt="" width="22" height="22"
            animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          <span>Business Theme Showcase</span>
          <b>{THEMES.length} live demos</b>
        </motion.div>

        <h1 className="h-title" aria-label="Websites that look like your business already won.">
          {LINES.map((line, li) => (
            <span className="h-line" key={li} aria-hidden="true">
              {line.map((word) => {
                const d = 0.15 + w++ * 0.06;
                const gold = li === 2;
                return (
                  <span className="h-word-mask" key={word}>
                    <motion.span
                      className={`h-word ${gold ? 'is-gold' : ''}`}
                      initial={{ y: '110%', rotate: 4 }}
                      animate={{ y: '0%', rotate: 0 }}
                      transition={{ duration: 0.9, ease: EASE, delay: d }}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              })}
              {li === 2 && (
                <svg className="h-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="gold-underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#b8781a" />
                      <stop offset="35%" stopColor="#d9a032" />
                      <stop offset="70%" stopColor="#f0c25c" />
                      <stop offset="100%" stopColor="#d9a032" />
                    </linearGradient>
                  </defs>
                  <path
                    className="h-underline-path"
                    d="M4 14 C 60 4, 140 4, 200 10 S 280 16, 296 6"
                    fill="none"
                    stroke="url(#gold-underline-gradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          ))}
        </h1>

        <motion.p
          className="h-lead"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
        >
          Browse industry-ready themes, click through a real live demo, and let GLOARO build it with
          your brand, content and goals.
        </motion.p>

        <motion.div
          className="h-cta"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
        >
          <Magnetic>
            <Link to="/themes" className="btn btn-primary btn-lg">Explore themes <Icon name="arrow" size={18} /></Link>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link to="/enquire" className="btn btn-ghost btn-lg">Create Your Website</Link>
          </Magnetic>
        </motion.div>
      </motion.div>

      <ThemeCoverflow />

      <motion.a
        href="#statement" className="h-scroll-hint" aria-label="Scroll down"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.a>
    </section>
  );
}
