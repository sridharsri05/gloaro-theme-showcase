import { useEffect, useRef, useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './corporate.css';

function useCount(target, run, ms = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return v;
}

function Stat({ n, suffix, label, run }) {
  const v = useCount(n, run);
  return <div className="co-stat"><b>{v.toLocaleString('en-IN')}{suffix}</b><span>{label}</span></div>;
}

const SERVICES = [
  ['◆', 'Strategy & Advisory', 'Market entry, growth planning and board-level advisory for mid-size enterprises.'],
  ['▲', 'Finance & Compliance', 'Audit readiness, GST and tax structuring, and risk frameworks that scale.'],
  ['●', 'Technology Consulting', 'ERP selection, cloud migration and digital transformation roadmaps.'],
  ['■', 'People & Operations', 'Org design, process automation and leadership development programmes.'],
];
const TEAM = [['Ananya Rao', 'Managing Partner', 'AR'], ['Vikram Mehta', 'Head of Strategy', 'VM'], ['Sara D’Souza', 'Director, Finance', 'SD'], ['Rahul Nair', 'CTO', 'RN']];

export default function Corporate() {
  const statsRef = useRef(null);
  const [run, setRun] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: .3 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div className="co">
      <header className="co-nav">
        <div className="co-logo"><span className="co-mark" />Meridian<b>Corp</b></div>
        <nav><a href="#co-services">Services</a><a href="#co-clients">Clients</a><a href="#co-about">About</a><a href="#co-team">Leadership</a><a href="#co-contact">Contact</a></nav>
        <a href="#co-contact" className="co-btn co-btn-sm">Book a consultation</a>
      </header>

      <section className="co-hero">
        <div>
          <span className="co-tag"><i /> Trusted by 240+ enterprises across India</span>
          <h1>Clarity for the decisions that <span>shape your company.</span></h1>
          <p>Meridian is an independent consulting firm helping leadership teams grow with confidence — from strategy to execution.</p>
          <div className="co-cta">
            <a href="#co-contact" className="co-btn">Talk to an advisor →</a>
            <a href="#co-services" className="co-btn co-btn-line">Our services</a>
          </div>
        </div>
        <div className="co-dash" aria-hidden="true">
          <div className="co-dash-head"><span>Growth overview</span><em>FY 2026</em></div>
          <div className="co-bars">{[42, 58, 50, 72, 66, 88, 94].map((h, i) => <i key={i} style={{ '--h': `${h}%`, animationDelay: `${i * 90}ms` }} />)}</div>
          <div className="co-dash-row">
            <div><b>+38%</b><span>Revenue</span></div>
            <div><b>-21%</b><span>Op. cost</span></div>
            <div><b>4.9★</b><span>Client NPS</span></div>
          </div>
          <div className="co-chip c1">✔ Audit ready</div>
          <div className="co-chip c2">↗ Q3 target met</div>
          <div className="co-hero-photo"><Photo id="meeting" w={480} h={360} alt="Advisory team in a meeting" /></div>
        </div>
      </section>

      <section className="co-logos" id="co-clients">
        {['NORTHWIND', 'ASTRA', 'VERTEX', 'BLUEPEAK', 'HELIOS', 'KAVERI'].map((l) => <span key={l}>{l}</span>)}
      </section>

      <section className="co-services" id="co-services">
        <div className="co-head"><span className="co-eyebrow">What we do</span><h2>Services built around outcomes</h2></div>
        <div className="co-grid">
          {SERVICES.map(([ic, t, d]) => (
            <article key={t} className="co-card"><span className="co-ic">{ic}</span><h3>{t}</h3><p>{d}</p><a href="#co-contact">Learn more →</a></article>
          ))}
        </div>
      </section>

      <section className="co-stats" ref={statsRef} id="co-about">
        <Stat n={240} suffix="+" label="Enterprise clients" run={run} />
        <Stat n={18} suffix=" yrs" label="Industry experience" run={run} />
        <Stat n={1200} suffix="+" label="Projects delivered" run={run} />
        <Stat n={96} suffix="%" label="Client retention" run={run} />
      </section>

      <section className="co-team" id="co-team">
        <div className="co-head"><span className="co-eyebrow">Leadership</span><h2>The people behind the advice</h2></div>
        <div className="co-team-grid">
          {TEAM.map(([n, r], idx) => (
            <div key={n} className="co-person"><div className="co-avatar"><Photo id={`portrait-${idx + 1}`} w={220} h={220} alt={`${n}, ${r}`} /></div><h3>{n}</h3><span>{r}</span></div>
          ))}
        </div>
      </section>

      <section className="co-contact" id="co-contact">
        <div>
          <span className="co-eyebrow light">Get in touch</span>
          <h2>Let’s talk about your next phase of growth.</h2>
          <p>📍 Level 9, One BKC, Mumbai<br />📞 +91 22 6000 1234<br />✉ hello@meridiancorp.in</p>
        </div>
        <form className="co-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          {sent ? (
            <div className="co-sent"><b>✓</b><h3>Thanks — we’ll be in touch within one business day.</h3><button type="button" className="co-btn" onClick={() => setSent(false)}>Send another</button></div>
          ) : (
            <>
              <input placeholder="Full name" required />
              <input placeholder="Work email" type="email" required />
              <select defaultValue=""><option value="" disabled>Service of interest</option>{SERVICES.map(([, t]) => <option key={t}>{t}</option>)}</select>
              <textarea placeholder="How can we help?" rows={3} />
              <button className="co-btn">Request a call</button>
            </>
          )}
        </form>
      </section>

      <footer className="co-foot"><div className="co-logo"><span className="co-mark" />Meridian<b>Corp</b></div><span>© 2026 Meridian Corp. All rights reserved.</span></footer>
    </div>
  );
}
