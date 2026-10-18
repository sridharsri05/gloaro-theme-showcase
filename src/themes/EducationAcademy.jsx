import { useState } from 'react';
import { Photo } from '../lib/images.jsx';
import { usePages, PageNav, Burger } from '../lib/pages.jsx';
import './education-academy.css';

const PAGES = [['home', 'Home'], ['programs', 'Programs'], ['admissions', 'Admissions'], ['campus', 'Campus & Faculty'], ['contact', 'Contact']].map(([id, label]) => ({ id, label }));

const PROGRAMS = [
  { n: 'B.Sc. Computer Science', lvl: 'Undergraduate', dur: '3 years', fee: '1.2 L / yr', id: 'laptops-desk', d: 'Software engineering, data science and AI with a 6-month industry internship.' },
  { n: 'B.Com (Hons.) Finance', lvl: 'Undergraduate', dur: '3 years', fee: '95 K / yr', id: 'writing', d: 'Accounting, markets and fintech, with CFA Level 1 preparation built in.' },
  { n: 'MBA · Business Analytics', lvl: 'Postgraduate', dur: '2 years', fee: '3.4 L / yr', id: 'coworking', d: 'Case-based learning with live consulting projects for partner companies.' },
  { n: 'M.A. Psychology', lvl: 'Postgraduate', dur: '2 years', fee: '1.1 L / yr', id: 'students-cafe', d: 'Clinical and organisational tracks with 400 supervised practicum hours.' },
  { n: 'Diploma · UX Design', lvl: 'Diploma', dur: '12 months', fee: '1.8 L', id: 'students-laptop', d: 'Portfolio-first programme taught by working designers. Evening batches available.' },
  { n: 'Foundation Year', lvl: 'Pre-university', dur: '1 year', fee: '80 K', id: 'kids-class', d: 'Bridge programme for Class 12 students entering science or commerce streams.' },
];
const FACULTY = [['Dr. Meera Iyer', 'Dean, School of Computing', 'teacher-woman'], ['Prof. Samuel Thomas', 'Finance & Economics', 'portrait-2'], ['Dr. Anjali Rao', 'Psychology', 'teacher-2'], ['Nikhil Sen', 'Head of Design', 'teacher-3']];
const LEVELS = ['All', 'Undergraduate', 'Postgraduate', 'Diploma', 'Pre-university'];

export default function EducationAcademy() {
  const { page, go, menuOpen, toggleMenu } = usePages('home');
  const [lvl, setLvl] = useState('All');
  const [applied, setApplied] = useState(false);
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState(0);
  const list = lvl === 'All' ? PROGRAMS : PROGRAMS.filter((p) => p.lvl === lvl);

  return (
    <div className="ed">
      <header className={`ed-nav ${menuOpen ? 'open' : ''}`}>
        <a href="#home" className="ed-logo" onClick={(e) => { e.preventDefault(); go('home'); }}><span className="ed-mark">BM</span>Bright Minds <small>Academy</small></a>
        <PageNav pages={PAGES} page={page} go={go} className="ed-links" />
        <div className="ed-nav-right"><button className="ed-btn ed-btn-sm" onClick={() => go('admissions')}>Apply now</button><Burger open={menuOpen} onClick={toggleMenu} /></div>
      </header>

      {page === 'home' && (
        <main key="home" className="ed-page">
          <section className="ed-hero">
            <div className="ed-hero-copy">
              <span className="ed-pill">Admissions open for 2026–27</span>
              <h1>Learn by doing. <em>Graduate ready.</em></h1>
              <p>A NAAC ‘A+’ accredited institution in Bengaluru offering undergraduate, postgraduate and professional programmes with industry placements at the core.</p>
              <div className="ed-cta"><button className="ed-btn" onClick={() => go('programs')}>Explore programs</button><button className="ed-btn ed-btn-line" onClick={() => go('campus')}>Tour the campus</button></div>
              <div className="ed-stats"><div><b>94%</b><span>Placement rate</span></div><div><b>6,200</b><span>Students</span></div><div><b>180+</b><span>Faculty</span></div></div>
            </div>
            <div className="ed-hero-art"><div className="ed-hero-main"><Photo eager id="graduation" w={900} h={760} alt="Graduates celebrating on campus" /></div><div className="ed-hero-side"><Photo eager id="students-group" w={420} h={420} alt="Students in a lecture" /></div><div className="ed-badge">NAAC<br /><b>A+</b></div></div>
          </section>
          <section className="ed-logos">{['TCS', 'INFOSYS', 'DELOITTE', 'FLIPKART', 'KPMG', 'ZOMATO'].map((l) => <span key={l}>{l}</span>)}</section>
          <section className="ed-section">
            <div className="ed-head"><div><span className="ed-kicker">Programs</span><h2>Find your path</h2></div><button className="ed-link" onClick={() => go('programs')}>All programs →</button></div>
            <div className="ed-grid">{PROGRAMS.slice(0, 3).map((p) => <article key={p.n} className="ed-card" onClick={() => go('programs')}><div className="ed-card-img"><Photo id={p.id} w={640} h={420} alt={p.n} /><span>{p.lvl}</span></div><div className="ed-card-body"><h3>{p.n}</h3><p>{p.d}</p><small>{p.dur} · ₹ {p.fee}</small></div></article>)}</div>
          </section>
          <section className="ed-why">
            <div className="ed-why-img"><Photo id="students-class" w={800} h={900} alt="Students working together" /></div>
            <div>
              <span className="ed-kicker">Why Bright Minds</span>
              <h2>Small classes. Real projects. Mentors who answer.</h2>
              <ul className="ed-checks"><li>1:14 faculty-to-student ratio</li><li>Every programme includes a paid internship</li><li>On-campus incubator with ₹ 2 Cr seed fund</li><li>Scholarships for 30% of each cohort</li></ul>
              <button className="ed-btn" onClick={() => go('admissions')}>Start your application</button>
            </div>
          </section>
          <section className="ed-events"><div className="ed-head"><div><span className="ed-kicker">Upcoming</span><h2>Events &amp; open days</h2></div></div><div className="ed-event-list">{[['14 Nov', 'Open Day · Main campus', '10 am – 2 pm'], ['22 Nov', 'MBA info session (online)', '6 pm'], ['05 Dec', 'Design portfolio clinic', '3 pm – 5 pm']].map(([d, t, h]) => <div key={t}><b>{d}</b><div><h3>{t}</h3><span>{h}</span></div><button className="ed-link" onClick={() => go('contact')}>Register →</button></div>)}</div></section>
        </main>
      )}

      {page === 'programs' && (
        <main key="programs" className="ed-page">
          <section className="ed-section">
            <div className="ed-head"><div><span className="ed-kicker">Programs</span><h2>{list.length} programmes</h2></div><div className="ed-filters">{LEVELS.map((l) => <button key={l} className={lvl === l ? 'on' : ''} onClick={() => setLvl(l)}>{l}</button>)}</div></div>
            <div className="ed-list" key={lvl}>{list.map((p) => (
              <article key={p.n} className="ed-row"><div className="ed-row-img"><Photo id={p.id} w={480} h={360} alt={p.n} /></div><div className="ed-row-body"><span className="ed-lvl">{p.lvl}</span><h3>{p.n}</h3><p>{p.d}</p><ul><li><b>Duration</b>{p.dur}</li><li><b>Fees</b>₹ {p.fee}</li><li><b>Intake</b>July 2026</li></ul></div><div className="ed-row-cta"><button className="ed-btn" onClick={() => go('admissions')}>Apply</button><button className="ed-link" onClick={() => go('contact')}>Download brochure</button></div></article>
            ))}</div>
          </section>
        </main>
      )}

      {page === 'admissions' && (
        <main key="admissions" className="ed-page">
          <section className="ed-adm">
            <div>
              <span className="ed-kicker">Admissions 2026–27</span>
              <h2>Three steps to a seat</h2>
              <ol className="ed-steps">{[['Apply online', 'Fill the form (10 minutes). Application fee ₹ 500, waived for scholarship applicants.'], ['Entrance & interview', 'BMAT online test, then a 20-minute conversation with faculty.'], ['Offer & enrol', 'Offers within 7 days. Pay the first instalment to confirm your seat.']].map(([t, d], i) => <li key={t} className={step === i ? 'on' : ''}><span>{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
              <div className="ed-dates"><h3>Key dates</h3><div><span>Applications close</span><b>31 March 2026</b></div><div><span>BMAT test</span><b>12 April 2026</b></div><div><span>Classes begin</span><b>14 July 2026</b></div></div>
              <div className="ed-schol"><b>Scholarships</b><p>Merit (up to 100% tuition), sports, and need-based grants. Tick the box in the form and we’ll assess you automatically.</p></div>
            </div>
            <form className="ed-form" onSubmit={(e) => { e.preventDefault(); setApplied(true); setStep(1); }}>
              {applied ? <div className="ed-sent"><b>✓ Application received</b><p>Your application ID is <code>BMA-2026-0417</code>. Check your email for the BMAT test link.</p><button type="button" className="ed-link" onClick={() => { setApplied(false); setStep(0); }}>Submit another</button></div> : (
                <>
                  <h3>Online application</h3>
                  <label>Programme<select>{PROGRAMS.map((p) => <option key={p.n}>{p.n}</option>)}</select></label>
                  <div className="ed-two"><label>Full name<input required placeholder="As on marksheet" /></label><label>Date of birth<input type="date" required /></label></div>
                  <div className="ed-two"><label>Email<input type="email" required placeholder="you@email.com" /></label><label>Phone<input type="tel" required placeholder="+91" /></label></div>
                  <label>Last qualification<select><option>Class 12 (2026)</option><option>Class 12 (2025 or earlier)</option><option>Bachelor’s degree</option><option>Other</option></select></label>
                  <label>Percentage / CGPA<input placeholder="e.g. 86% or 8.6" /></label>
                  <label className="ed-check"><input type="checkbox" /> I want to be considered for a scholarship</label>
                  <button className="ed-btn ed-btn-full">Submit application · ₹ 500</button>
                </>
              )}
            </form>
          </section>
        </main>
      )}

      {page === 'campus' && (
        <main key="campus" className="ed-page">
          <section className="ed-campus-hero"><Photo eager id="campus" w={1600} h={700} alt="Bright Minds main campus" className="ed-campus-bg" /><div><span className="ed-kicker light">Campus</span><h2>22 acres in the heart of Bengaluru</h2></div></section>
          <section className="ed-section">
            <div className="ed-facilities">{[['library', 'Library', '2.4 lakh volumes, 24×7 reading halls'], ['lecture', 'Smart classrooms', '60 recorded, hybrid-ready rooms'], ['laptops-desk', 'Innovation lab', 'Maker space, GPU cluster, incubator'], ['students-cafe', 'Student centre', 'Cafés, clubs and 40 societies'], ['classroom', 'Seminar halls', 'Three auditoriums up to 1,200 seats'], ['books', 'Hostels', 'On-campus housing for 2,000 students']].map(([id, t, d]) => <div key={t} className="ed-fac"><div className="ed-fac-img"><Photo id={id} w={600} h={420} alt={t} /></div><h3>{t}</h3><p>{d}</p></div>)}</div>
          </section>
          <section className="ed-section ed-faculty">
            <div className="ed-head center"><span className="ed-kicker">Faculty</span><h2>Taught by people who’ve done the work</h2></div>
            <div className="ed-fac-grid">{FACULTY.map(([n, r, id]) => <div key={n} className="ed-person"><div className="ed-person-img"><Photo id={id} w={420} h={520} alt={n} /></div><h3>{n}</h3><span>{r}</span></div>)}</div>
          </section>
        </main>
      )}

      {page === 'contact' && (
        <main key="contact" className="ed-page">
          <section className="ed-contact">
            <div>
              <span className="ed-kicker">Contact</span>
              <h2>Ask us anything</h2>
              <p>Admissions counsellors are available Mon–Sat, 9 am – 6 pm. Campus tours run every Saturday at 11 am.</p>
              <div className="ed-channels"><div><b>Admissions</b><span>+91 80 4500 2000<br />admissions@brightminds.edu.in</span></div><div><b>Campus</b><span>Bright Minds Academy, Hosur Road, Electronic City Phase 1, Bengaluru 560100</span></div><div><b>Hostel & fees</b><span>+91 80 4500 2010</span></div><div><b>Placements</b><span>placements@brightminds.edu.in</span></div></div>
              <div className="ed-map"><Photo id="students-library" w={800} h={400} alt="Students outside the library" /><span>📍 Electronic City campus</span></div>
            </div>
            <form className="ed-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              {sent ? <div className="ed-sent"><b>✓ Message sent</b><p>A counsellor will reply within one working day.</p><button type="button" className="ed-link" onClick={() => setSent(false)}>Send another</button></div> : (
                <>
                  <h3>Send an enquiry</h3>
                  <label>I am a<select><option>Prospective student</option><option>Parent / guardian</option><option>School counsellor</option><option>Recruiter</option></select></label>
                  <label>Name<input required /></label>
                  <div className="ed-two"><label>Email<input type="email" required /></label><label>Phone<input type="tel" /></label></div>
                  <label>Programme of interest<select><option>Not sure yet</option>{PROGRAMS.map((p) => <option key={p.n}>{p.n}</option>)}</select></label>
                  <label>Message<textarea rows={4} /></label>
                  <button className="ed-btn ed-btn-full">Send message</button>
                </>
              )}
            </form>
          </section>
        </main>
      )}

      <footer className="ed-foot">
        <div><div className="ed-logo"><span className="ed-mark">BM</span>Bright Minds <small>Academy</small></div><p>NAAC A+ · UGC recognised · Est. 1998</p></div>
        <nav>{PAGES.map((p) => <a key={p.id} href={`#${p.id}`} onClick={(e) => { e.preventDefault(); go(p.id); }}>{p.label}</a>)}</nav>
        <span>© 2026 Bright Minds Education Trust</span>
      </footer>
    </div>
  );
}
