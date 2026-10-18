import { useMemo, useState } from 'react';
import { Photo } from '../lib/images.jsx';
import { usePages, PageNav, Burger } from '../lib/pages.jsx';
import './real-estate.css';

const PAGES = [['home', 'Home'], ['properties', 'Properties'], ['agents', 'Agents'], ['about', 'About'], ['contact', 'Contact']].map(([id, label]) => ({ id, label }));

const LISTINGS = [
  { n: 'Palm Grove Villa', id: 'villa-pool-house', loc: 'Whitefield, Bengaluru', p: 4.8, unit: 'Cr', kind: 'Buy', type: 'Villa', bed: 4, bath: 4, area: 3800, tag: 'New' },
  { n: 'Skyline Residences · 1402', id: 'city-towers', loc: 'Lower Parel, Mumbai', p: 1.2, unit: 'L/mo', kind: 'Rent', type: 'Apartment', bed: 3, bath: 3, area: 1850, tag: 'Furnished' },
  { n: 'Lakeview Modern', id: 'modern-house', loc: 'Jubilee Hills, Hyderabad', p: 6.5, unit: 'Cr', kind: 'Buy', type: 'Villa', bed: 5, bath: 5, area: 5200, tag: 'Pool' },
  { n: 'The Courtyard Townhouse', id: 'townhouse', loc: 'Koregaon Park, Pune', p: 2.1, unit: 'Cr', kind: 'Buy', type: 'Townhouse', bed: 3, bath: 3, area: 2400, tag: '' },
  { n: 'Garden Loft', id: 'interior-loft', loc: 'Indiranagar, Bengaluru', p: 85, unit: 'K/mo', kind: 'Rent', type: 'Apartment', bed: 2, bath: 2, area: 1200, tag: 'Pet friendly' },
  { n: 'Cedar Cottage', id: 'cottage', loc: 'Coonoor, Nilgiris', p: 1.4, unit: 'Cr', kind: 'Buy', type: 'Cottage', bed: 3, bath: 2, area: 2100, tag: 'Hill view' },
  { n: 'Sunset Terrace', id: 'balcony', loc: 'Candolim, Goa', p: 1.6, unit: 'L/mo', kind: 'Rent', type: 'Villa', bed: 3, bath: 3, area: 2600, tag: 'Sea view' },
  { n: 'Timber House', id: 'house-wood', loc: 'Alibaug, Maharashtra', p: 3.2, unit: 'Cr', kind: 'Buy', type: 'Villa', bed: 4, bath: 3, area: 3100, tag: '' },
];
const AGENTS = [
  ['Rhea Kapoor', 'Founder & Principal Broker', 'portrait-1', '14 yrs · 320 closings'],
  ['Arjun Menon', 'Luxury Villas', 'agent-man', '9 yrs · Whitefield & Sarjapur'],
  ['Sana Qureshi', 'Rentals & Leasing', 'portrait-3', '7 yrs · 4.9★ tenant rating'],
  ['Dev Bhatia', 'Commercial & NRI desk', 'portrait-4', '11 yrs · Mumbai & Pune'],
];

export default function RealEstate() {
  const { page, go, menuOpen, toggleMenu } = usePages('home');
  const [kind, setKind] = useState('All');
  const [type, setType] = useState('All');
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState(false);
  const list = useMemo(() => LISTINGS.filter((l) => (kind === 'All' || l.kind === kind) && (type === 'All' || l.type === type)), [kind, type]);
  const selected = LISTINGS.find((l) => l.n === open);
  const price = (l) => `₹ ${l.p} ${l.unit}`;

  const Card = ({ l }) => (
    <article className="re-card" onClick={() => { setOpen(l.n); go('properties'); }}>
      <div className="re-card-img"><Photo id={l.id} w={720} h={520} alt={l.n} /><span className="re-kind">{l.kind === 'Buy' ? 'For sale' : 'For rent'}</span>{l.tag && <span className="re-tag">{l.tag}</span>}</div>
      <div className="re-card-body">
        <b>{price(l)}</b>
        <h3>{l.n}</h3>
        <p>{l.loc}</p>
        <ul><li>{l.bed} bed</li><li>{l.bath} bath</li><li>{l.area.toLocaleString('en-IN')} sq ft</li></ul>
      </div>
    </article>
  );

  return (
    <div className="re">
      <header className={`re-nav ${menuOpen ? 'open' : ''}`}>
        <a href="#home" className="re-logo" onClick={(e) => { e.preventDefault(); go('home'); }}>Haven<span>Estates</span></a>
        <PageNav pages={PAGES} page={page} go={go} className="re-links" />
        <div className="re-nav-right">
          <button className="re-btn re-btn-sm" onClick={() => go('contact')}>List your property</button>
          <Burger open={menuOpen} onClick={toggleMenu} />
        </div>
      </header>

      {page === 'home' && (
        <main key="home" className="re-page">
          <section className="re-hero">
            <Photo eager id="house-dusk" w={1600} h={900} alt="Modern home at dusk" className="re-hero-bg" />
            <div className="re-hero-copy">
              <span className="re-kicker">Bengaluru · Mumbai · Hyderabad · Goa</span>
              <h1>Find the home that<br /><em>feels like yours.</em></h1>
              <p>Curated villas, apartments and holiday homes — verified, visited and photographed by our own team.</p>
            </div>
            <form className="re-search" onSubmit={(e) => { e.preventDefault(); go('properties'); }}>
              <label>I want to<select value={kind} onChange={(e) => setKind(e.target.value)}><option>All</option><option>Buy</option><option>Rent</option></select></label>
              <label>Property type<select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Villa</option><option>Apartment</option><option>Townhouse</option><option>Cottage</option></select></label>
              <label>Location<input placeholder="City or neighbourhood" /></label>
              <button className="re-btn">Search homes</button>
            </form>
          </section>
          <section className="re-stats"><div><b>1,240</b><span>Homes sold</span></div><div><b>₹ 2,800 Cr</b><span>Transacted</span></div><div><b>18</b><span>Years in business</span></div><div><b>4.9★</b><span>Client rating</span></div></section>
          <section className="re-section">
            <div className="re-head"><div><span className="re-kicker">Featured</span><h2>Homes we love this month</h2></div><button className="re-link" onClick={() => go('properties')}>View all properties →</button></div>
            <div className="re-grid">{LISTINGS.slice(0, 3).map((l) => <Card key={l.n} l={l} />)}</div>
          </section>
          <section className="re-split">
            <div className="re-split-img"><Photo id="living-room" w={800} h={900} alt="Bright living room" /></div>
            <div className="re-split-copy">
              <span className="re-kicker">Why Haven</span>
              <h2>Every home verified. Every price explained.</h2>
              <ul className="re-checks"><li>Title and approvals checked by our legal desk</li><li>Honest valuation report with comparable sales</li><li>Dedicated agent from first visit to registration</li><li>Home loans arranged with 6 partner banks</li></ul>
              <button className="re-btn" onClick={() => go('about')}>How we work</button>
            </div>
          </section>
          <section className="re-cta"><h2>Thinking of selling?</h2><p>Get a free valuation within 48 hours and professional photography on us.</p><button className="re-btn re-btn-light" onClick={() => go('contact')}>Request a valuation</button></section>
        </main>
      )}

      {page === 'properties' && (
        <main key="properties" className="re-page">
          {selected ? (
            <section className="re-detail">
              <button className="re-link" onClick={() => setOpen(null)}>← Back to all properties</button>
              <div className="re-detail-gallery">
                <div className="re-detail-main"><Photo eager id={selected.id} w={1200} h={800} alt={selected.n} /></div>
                <div><Photo id="living-room" w={600} h={400} alt="Living room" /></div>
                <div><Photo id="apartment-living" w={600} h={400} alt="Lounge" /></div>
              </div>
              <div className="re-detail-grid">
                <div>
                  <span className="re-kind inline">{selected.kind === 'Buy' ? 'For sale' : 'For rent'}</span>
                  <h1>{selected.n}</h1>
                  <p className="re-loc">{selected.loc}</p>
                  <ul className="re-facts"><li><b>{selected.bed}</b>Bedrooms</li><li><b>{selected.bath}</b>Bathrooms</li><li><b>{selected.area.toLocaleString('en-IN')}</b>Sq ft</li><li><b>{selected.type}</b>Type</li></ul>
                  <h3>About this home</h3>
                  <p>A light-filled {selected.type.toLowerCase()} in {selected.loc.split(',')[0]} with generous living spaces, a private garden terrace and a modular kitchen. Walking distance to schools, cafés and the metro.</p>
                  <h3>Amenities</h3>
                  <ul className="re-amen">{['Covered parking', 'Power backup', '24×7 security', 'Clubhouse & gym', 'Rainwater harvesting', 'EV charging'].map((a) => <li key={a}>✓ {a}</li>)}</ul>
                </div>
                <aside className="re-enquiry">
                  <b className="re-price">{price(selected)}</b>
                  {sent ? <div className="re-sent">✓ Visit requested. {AGENTS[1][0]} will call you within the hour.</div> : (
                    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                      <input placeholder="Your name" required /><input type="tel" placeholder="Phone" required /><input type="date" defaultValue={new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10)} />
                      <button className="re-btn">Schedule a visit</button>
                    </form>
                  )}
                  <div className="re-agent-mini"><div className="re-avatar"><Photo id="agent-man" w={120} h={120} alt="Arjun Menon" /></div><div><b>Arjun Menon</b><span>Listing agent · +91 98450 00123</span></div></div>
                </aside>
              </div>
            </section>
          ) : (
            <section className="re-section">
              <div className="re-head"><div><span className="re-kicker">Properties</span><h2>{list.length} homes available</h2></div>
                <div className="re-filters">
                  <div className="re-seg">{['All', 'Buy', 'Rent'].map((k) => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>)}</div>
                  <select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Villa</option><option>Apartment</option><option>Townhouse</option><option>Cottage</option></select>
                </div>
              </div>
              <div className="re-grid">{list.map((l) => <Card key={l.n} l={l} />)}</div>
              {!list.length && <p className="re-empty">No homes match those filters yet — try another type.</p>}
            </section>
          )}
        </main>
      )}

      {page === 'agents' && (
        <main key="agents" className="re-page">
          <section className="re-section">
            <div className="re-head center"><span className="re-kicker">Our team</span><h2>Agents who know every street</h2><p>Local specialists, salaried not commission-chasing, so the advice is always yours.</p></div>
            <div className="re-agents">{AGENTS.map(([n, r, id, s]) => (
              <article key={n} className="re-agent"><div className="re-agent-img"><Photo id={id} w={520} h={620} alt={n} /></div><h3>{n}</h3><span>{r}</span><small>{s}</small><button className="re-link" onClick={() => go('contact')}>Contact {n.split(' ')[0]} →</button></article>
            ))}</div>
          </section>
          <section className="re-cta"><h2>Join Haven</h2><p>We’re hiring agents in Chennai and Kochi.</p><button className="re-btn re-btn-light" onClick={() => go('contact')}>Apply now</button></section>
        </main>
      )}

      {page === 'about' && (
        <main key="about" className="re-page">
          <section className="re-split">
            <div className="re-split-img"><Photo eager id="house-keys" w={800} h={900} alt="Keys to a new home" /></div>
            <div className="re-split-copy">
              <span className="re-kicker">About Haven</span>
              <h2>Started in 2008 with one promise: no surprises.</h2>
              <p>Haven began as a two-person brokerage in Indiranagar. Today we are 60 people across four cities, but every listing still goes through the same checklist our founder wrote on day one.</p>
              <p>We photograph every home ourselves, publish the real price history, and never list a property we wouldn’t buy.</p>
            </div>
          </section>
          <section className="re-section">
            <div className="re-head center"><span className="re-kicker">How we work</span><h2>Four steps from search to keys</h2></div>
            <ol className="re-steps">{[['Brief', 'A 20-minute call to understand budget, timing and must-haves.'], ['Shortlist', 'Five to eight verified homes with honest pros and cons.'], ['Visit & negotiate', 'Accompanied visits, then we negotiate with real comparables.'], ['Close', 'Legal checks, loan paperwork and registration handled end to end.']].map(([t, d], i) => <li key={t}><span>0{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
          </section>
          <section className="re-gallery">{['villa-modern', 'house-white', 'house-pool-white', 'apartment-living'].map((id) => <div key={id}><Photo id={id} w={600} h={600} alt="" /></div>)}</section>
        </main>
      )}

      {page === 'contact' && (
        <main key="contact" className="re-page">
          <section className="re-contact">
            <div>
              <span className="re-kicker">Contact</span>
              <h2>Talk to a Haven advisor</h2>
              <p>Buying, renting, selling or just curious what your home is worth — we reply within one business hour.</p>
              <div className="re-offices">{[['Bengaluru', '12 100 Ft Road, Indiranagar'], ['Mumbai', 'Level 4, Peninsula Corporate Park, Lower Parel'], ['Hyderabad', 'Road No. 36, Jubilee Hills'], ['Goa', 'Fort Aguada Road, Candolim']].map(([c, a]) => <div key={c}><b>{c}</b><span>{a}</span></div>)}</div>
              <p className="re-meta">📞 +91 80 4000 9000 · ✉ hello@havenestates.in</p>
            </div>
            <form className="re-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              {sent ? <div className="re-sent big">✓ Thanks! An advisor will call you shortly.<button type="button" className="re-link" onClick={() => setSent(false)}>Send another</button></div> : (
                <>
                  <label>I’d like to<select><option>Buy a home</option><option>Rent a home</option><option>Sell my property</option><option>Rent out my property</option><option>Get a valuation</option></select></label>
                  <label>Name<input required placeholder="Full name" /></label>
                  <label>Phone<input type="tel" required placeholder="+91" /></label>
                  <label>Email<input type="email" placeholder="you@email.com" /></label>
                  <label>Message<textarea rows={4} placeholder="Budget, location, timeline…" /></label>
                  <button className="re-btn">Send message</button>
                </>
              )}
            </form>
          </section>
        </main>
      )}

      <footer className="re-foot">
        <div><div className="re-logo">Haven<span>Estates</span></div><p>RERA registered · PRM/KA/RERA/1251/310/AG/180123</p></div>
        <nav>{PAGES.map((p) => <a key={p.id} href={`#${p.id}`} onClick={(e) => { e.preventDefault(); go(p.id); }}>{p.label}</a>)}</nav>
        <span>© 2026 Haven Estates LLP</span>
      </footer>
    </div>
  );
}
