import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform,
} from 'framer-motion';
import Icon from '../../components/Icon.jsx';
import { ThemePreview } from '../../components/ThemeCard.jsx';
import DemoLink from '../../components/DemoLink.jsx';
import { CATEGORIES, THEMES, getCategory, themesByCategory } from '../../data/themes.js';
import { Counter, EASE, FadeUp, Magnetic, Spotlight, rise, stagger } from './motion-kit.jsx';
import { MiniMock } from './Hero.jsx';

/* ------------------------------------------------------------------ */
/* Industry marquee                                                    */
/* ------------------------------------------------------------------ */
const INDUSTRIES = ['Fine dining', 'Bakeries', 'Cafés', 'Consultancies', 'Agencies', 'Clinics', 'Builders', 'Rentals', 'Schools', 'Colleges', 'Boutiques', 'Grocers'];

export function Marquee() {
  return (
    <div className="h-marquee" aria-hidden="true">
      <motion.div className="h-marquee-track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 36, ease: 'linear', repeat: Infinity }}>
        {[...INDUSTRIES, ...INDUSTRIES].map((x, i) => (
          <span key={i}>{x}<img src="/gloaro-mark.png" alt="" /></span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-linked statement: words light up as you scroll               */
/* ------------------------------------------------------------------ */
const STATEMENT =
  'GLOARO turns proven website themes into launch-ready business sites — so you can *see* *your* *website* before we build it, and go live faster.';

function Word({ progress, range, children, gold }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <span className="st-word">
      <motion.span style={{ opacity, y }} className={gold ? 'is-gold' : ''}>{children}</motion.span>{' '}
    </span>
  );
}

export function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = STATEMENT.split(' ');
  return (
    <section className="h-statement" id="statement">
      <div className="container">
        <span className="eyebrow">Why we built this</span>
        <p ref={ref} className="st-text">
          {words.map((raw, i) => {
            const gold = raw.startsWith('*');
            const start = i / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, start + 1.5 / words.length]} gold={gold}>
                {raw.replace(/\*/g, '')}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky horizontal theme scroller                                    */
/* ------------------------------------------------------------------ */
export function ThemeScroller() {
  const section = useRef(null);
  const track = useRef(null);
  const dist = useRef(0);
  const [height, setHeight] = useState('auto');
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      dist.current = Math.max(0, track.current.scrollWidth - window.innerWidth + 60);
      const buffer = Math.round(window.innerHeight * 0.4);
      setHeight(`${window.innerHeight + dist.current + buffer}px`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 0.84, 1], [0, -dist.current, -dist.current]);
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(THEMES.length - 1, Math.max(0, Math.floor((v / 0.84) * THEMES.length * 0.999))));
  });

  return (
    <section ref={section} className="h-scroller" style={{ height }} aria-label="Live themes">
      <div className="h-scroller-sticky">
        <div className="container h-scroller-head">
          <div>
            <span className="eyebrow">Live themes</span>
            <h2>{THEMES.length} distinct looks.<br />Not one template in disguise.</h2>
          </div>
          <div className="h-scroller-meta">
            <span className="h-count">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.b key={active} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                  0{active + 1}
                </motion.b>
              </AnimatePresence>
              <i>/ 0{THEMES.length}</i>
            </span>
            <span className="h-bar"><motion.i style={{ scaleX: bar }} /></span>
          </div>
        </div>

        <motion.div ref={track} className="h-track" style={{ x }}>
          {THEMES.map((t, i) => {
            const cat = getCategory(t.category);
            return (
              <motion.article
                key={t.id}
                className="h-slide"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
              >
                <DemoLink themeId={t.id} className="h-slide-media" aria-label={`${t.name} live demo`}>
                  <ThemePreview themeId={t.id} title={t.name} />
                  <span className="h-slide-cta"><Icon name="eye" size={18} /> Open live demo</span>
                </DemoLink>
                <div className="h-slide-body">
                  <div className="h-slide-top">
                    <span className="chip">{cat.name}</span>
                    <span className="h-slide-num">0{i + 1}</span>
                  </div>
                  <h3>{t.name} <small>{t.type}</small></h3>
                  <p>{t.description}</p>
                  <div className="h-slide-actions">
                    <DemoLink themeId={t.id} className="btn btn-outline btn-sm"><Icon name="eye" size={16} /> Live Demo</DemoLink>
                    <Link to={`/enquire/${t.id}`} className="btn btn-primary btn-sm">Create Your Website <Icon name="arrow" size={16} /></Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
          <div className="h-slide h-slide-end">
            <img src="/gloaro-mark.png" alt="" />
            <h3>{CATEGORIES.length} industries, {THEMES.length} themes</h3>
            <p>Every category is live — open the gallery to compare them side by side.</p>
            <Link to="/themes" className="btn btn-gold">Browse the gallery <Icon name="arrow" size={16} /></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bento categories                                                    */
/* ------------------------------------------------------------------ */
export function Categories() {
  return (
    <section className="section h-cats" id="categories">
      <div className="container">
        <FadeUp className="section-head">
          <span className="eyebrow">Categories</span>
          <h2>Built for the way <em>your</em> industry sells</h2>
          <p>{CATEGORIES.filter((c) => !c.live).length ? `${CATEGORIES.filter((c) => c.live).length} categories are live today. ${CATEGORIES.filter((c) => !c.live).length} more are being designed.` : `All ${CATEGORIES.length} categories are live with real-photo demos.`}</p>
        </FadeUp>
        <motion.div className="bento" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {CATEGORIES.map((c) => {
            const themes = themesByCategory(c.id);
            const body = (
              <>
                <div className="bento-top">
                  <motion.span className="bento-icon" whileHover={{ rotate: -12, scale: 1.1 }}><Icon name={c.icon} size={24} /></motion.span>
                  {c.live ? <span className="bento-live"><i /> Live</span> : <span className="soon">Coming soon</span>}
                </div>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
                {c.live && (
                  <div className="bento-mocks">
                    {themes.map((t, i) => (
                      <motion.div key={t.id} className="bento-mock" style={{ rotate: i ? 4 : -4 }} whileHover={{ y: -10, rotate: 0, scale: 1.04 }}>
                        <MiniMock theme={t} />
                      </motion.div>
                    ))}
                  </div>
                )}
                {c.live && <span className="bento-foot">{themes.length} themes <Icon name="arrow" size={16} /></span>}
              </>
            );
            return (
              <motion.div key={c.id} variants={rise} className={`bento-cell ${c.live ? 'is-live' : 'is-soon'}`}>
                {c.live ? (
                  <Spotlight className="bento-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                    <Link to={`/themes?category=${c.id}`} className="bento-link">{body}</Link>
                  </Spotlight>
                ) : (
                  <div className="bento-card" aria-disabled="true">{body}</div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process timeline with scroll-filled line                            */
/* ------------------------------------------------------------------ */
const STEPS = [
  ['layout', 'Choose a category', 'Pick your industry and browse themes designed around how your customers buy.'],
  ['eye', 'Open the live demo', 'Click through a real, working website. Every theme has its own shareable link.'],
  ['sparkle', 'Create your website', 'Tell us about your business. The theme you chose is already filled in.'],
  ['phone', 'We take it from here', 'The GLOARO team reviews your enquiry, calls you back and starts building.'],
];

export function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.55'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  return (
    <section className="section section-tint h-process" id="how">
      <div className="container h-process-grid">
        <div className="h-process-head">
          <FadeUp>
            <span className="eyebrow">How it works</span>
            <h2>From browsing to building in four steps</h2>
            <p className="muted">No long forms, no guesswork. You see the website before anything is built.</p>
            <Magnetic className="inline"><Link to="/themes" className="btn btn-primary">Start browsing <Icon name="arrow" size={16} /></Link></Magnetic>
          </FadeUp>
        </div>
        <div className="h-timeline" ref={ref}>
          <span className="h-line-track"><motion.i style={{ scaleY: fill }} /></span>
          {STEPS.map(([ic, t, d], i) => (
            <motion.div
              key={t} className="h-step"
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
            >
              <motion.span className="h-step-dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}>
                <Icon name={ic} size={20} />
              </motion.span>
              <div className="h-step-card">
                <span className="h-step-n">Step 0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats band                                                          */
/* ------------------------------------------------------------------ */
export function Stats() {
  const items = [
    [THEMES.length, '', 'Live demo themes'],
    [CATEGORIES.length, '', 'Industries in the roadmap'],
    [60, 's', 'To send an enquiry'],
    [100, '%', 'Mobile-responsive layouts'],
  ];
  return (
    <section className="h-stats">
      <motion.div className="container h-stats-grid" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
        {items.map(([n, s, l]) => (
          <motion.div key={l} variants={rise} className="h-stat">
            <b>{n === 60 ? '< ' : ''}<Counter to={n} suffix={s} /></b>
            <span className="h-stat-label">{l}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why GLOARO — spotlight cards                                        */
/* ------------------------------------------------------------------ */
export function Why() {
  const items = [
    ['bolt', 'Launch faster', 'Proven layouts mean less back-and-forth and a quicker go-live.'],
    ['layout', 'Industry-specific', 'Sections that match how restaurants, firms and agencies actually sell.'],
    ['shield', 'Secure by design', 'Enquiries are validated on the server. Secrets never reach the browser.'],
    ['phone', 'Human follow-up', 'Every enquiry lands in the GLOARO inbox for a personal reply.'],
  ];
  return (
    <section className="section h-why">
      <div className="container">
        <FadeUp className="section-head">
          <span className="eyebrow">Why GLOARO</span>
          <h2>A partner for your digital future, not just a template.</h2>
        </FadeUp>
        <motion.div className="h-why-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {items.map(([ic, t, d]) => (
            <motion.div key={t} variants={rise}>
              <Spotlight className="h-why-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                <span className="why-icon"><Icon name={ic} size={20} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Spotlight>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */
const FAQ = [
  ['Is the live demo the actual website I get?', 'It’s the starting point. We keep the layout and interactions you liked, then replace the content, photos, colours and branding with yours.'],
  ['Can I change the design after choosing a theme?', 'Yes. Mention it in “Additional requirements” or on our call. We can add pages, sections, booking, online ordering and more.'],
  ['What happens after I submit an enquiry?', 'Your enquiry gets a unique ID and reaches the GLOARO team straight away. We contact you by phone or email to discuss scope and timeline.'],
  ['My industry isn’t listed yet. Can you still help?', 'Absolutely. Pick the closest theme, or send a general enquiry, and tell us about your business.'],
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section h-faq">
      <div className="container h-faq-grid">
        <FadeUp>
          <span className="eyebrow">FAQ</span>
          <h2>Questions, answered</h2>
          <p className="muted">Still curious? Send an enquiry and we’ll walk you through it.</p>
        </FadeUp>
        <div className="h-faq-list">
          {FAQ.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={q} delay={i * 0.06} className={`h-faq-item ${isOpen ? 'is-open' : ''}`}>
                <button className="h-faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{q}</span>
                  <motion.span className="h-faq-icon" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="a" className="h-faq-a"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */
export function Cta() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  return (
    <section className="section h-cta-wrap" ref={ref}>
      <div className="container">
        <motion.div className="h-cta-card" style={{ scale }}>
          <motion.img src="/gloaro-mark.png" alt="" className="h-cta-mark" style={{ rotate }} aria-hidden="true" />
          <FadeUp className="h-cta-copy">
            <span className="eyebrow">Ready when you are</span>
            <h2>Seen a theme you like?<br />Let’s make it yours.</h2>
            <p>Tell us about your business in under a minute. We’ll take it from there.</p>
            <div className="h-cta-actions">
              <Magnetic><Link to="/enquire" className="btn btn-gold btn-lg">Create Your Website <Icon name="arrow" size={18} /></Link></Magnetic>
              <Link to="/themes" className="h-cta-link">or browse all themes →</Link>
            </div>
          </FadeUp>
        </motion.div>
      </div>
    </section>
  );
}
