import { useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './digital-agency.css';

const WORK = [
  { n: 'Orbit Bank', t: 'Fintech app rebrand', c: '#ff4d2e', s: '+212% sign-ups', id: 'phone-app' },
  { n: 'Nomad Threads', t: 'D2C e-commerce launch', c: '#2e5bff', s: '₹4.2 Cr in 90 days', id: 'fashion' },
  { n: 'Kiro Health', t: 'Patient portal UX', c: '#11b37a', s: '4.8★ app rating', id: 'doctor' },
  { n: 'Hearth Coffee', t: 'Brand identity & packaging', c: '#ffb800', s: '32 cafés rolled out', id: 'coffee-packaging' },
];
const STEPS = [['Discover', 'Workshops, audits and research to find the real problem.'], ['Design', 'Identity, UX and prototypes tested with real users.'], ['Build', 'Fast, accessible websites and apps, shipped weekly.'], ['Grow', 'Performance marketing and CRO that compound.']];
const NEEDS = ['Branding', 'Website', 'Mobile app', 'E-commerce', 'SEO', 'Ads'];

export default function DigitalAgency() {
  const [picked, setPicked] = useState(['Website']);
  const [budget, setBudget] = useState(5);
  const [sent, setSent] = useState(false);
  const toggle = (n) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  return (
    <div className="ag">
      <header className="ag-nav">
        <div className="ag-logo">pulse<span>●</span>studio</div>
        <nav><a href="#ag-services">Services</a><a href="#ag-work">Work</a><a href="#ag-process">Process</a><a href="#ag-brief">Start a project</a><a href="#ag-contact">Contact</a></nav>
      </header>

      <section className="ag-hero">
        <h1>
          <span className="ag-line"><span>We make</span></span>
          <span className="ag-line"><span>brands <em>impossible</em></span></span>
          <span className="ag-line"><span>to ignore<b className="ag-blob" aria-hidden="true" /></span></span>
        </h1>
        <div className="ag-hero-foot">
          <p>Independent digital studio for ambitious companies. Strategy, design and code — under one roof in Pune.</p>
          <a href="#ag-brief" className="ag-round">Start<br />a project<span>↗</span></a>
        </div>
      </section>

      <div className="ag-marquee" id="ag-services" aria-hidden="true">
        <div>{Array.from({ length: 2 }).map((_, k) => <span key={k}>Branding ✺ Websites ✺ Product Design ✺ E-commerce ✺ Motion ✺ Growth ✺&nbsp;</span>)}</div>
      </div>

      <section className="ag-work" id="ag-work">
        <div className="ag-head"><h2>Selected work</h2><span>(2024 — 2026)</span></div>
        <div className="ag-grid">
          {WORK.map((w, i) => (
            <article key={w.n} className={`ag-case ${i % 3 === 0 ? 'wide' : ''}`} style={{ '--c': w.c }}>
              <div className="ag-case-art"><Photo id={w.id} w={960} h={540} alt={w.t} /><span className="ag-shape" /><span className="ag-shape s2" /><b>{w.n}</b></div>
              <div className="ag-case-meta"><div><h3>{w.n}</h3><p>{w.t}</p></div><span className="ag-stat">{w.s}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="ag-process" id="ag-process">
        <h2>How we work</h2>
        <ol>
          {STEPS.map(([t, d], i) => (
            <li key={t}><span>0{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ol>
      </section>

      <section className="ag-brief" id="ag-brief">
        {sent ? (
          <div className="ag-sent"><h2>Brief received ✺</h2><p>We reply to every brief within 24 hours.</p><button className="ag-btn" onClick={() => setSent(false)}>Send another</button></div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <h2>Got a project?<br /><em>Let’s make it loud.</em></h2>
            <p className="ag-q">I need help with…</p>
            <div className="ag-chips">
              {NEEDS.map((n) => <button type="button" key={n} className={picked.includes(n) ? 'on' : ''} onClick={() => toggle(n)}>{n}</button>)}
            </div>
            <p className="ag-q">Budget: <b>₹ {budget}L{budget >= 25 ? '+' : ''}</b></p>
            <input type="range" min="2" max="25" value={budget} onChange={(e) => setBudget(+e.target.value)} className="ag-range" aria-label="Budget in lakhs" />
            <div className="ag-fields"><input placeholder="Your name" required /><input type="email" placeholder="Email" required /></div>
            <button className="ag-btn">Send brief ↗</button>
          </form>
        )}
      </section>

      <footer className="ag-foot" id="ag-contact"><div className="ag-logo">pulse<span>●</span>studio</div><span>hello@pulse.studio</span><span>Instagram · Behance · LinkedIn</span></footer>
    </div>
  );
}
