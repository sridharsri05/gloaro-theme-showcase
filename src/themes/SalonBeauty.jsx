import { useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './salon-beauty.css';

const SERVICES = {
  Hair: [['Cut & blow-dry', '45 min', 1200], ['Global colour', '2 hr', 3500], ['Balayage / highlights', '2.5 hr', 5500], ['Keratin smoothing', '3 hr', 7000]],
  Skin: [['Signature facial', '60 min', 2200], ['HydraGlow treatment', '75 min', 3800], ['Brow shaping & tint', '30 min', 650]],
  Nails: [['Classic manicure', '40 min', 700], ['Gel extensions', '90 min', 2400], ['Spa pedicure', '60 min', 1100]],
  Bridal: [['Bridal trial', '2 hr', 6000], ['Bridal hair & makeup', '3 hr', 18000], ['Party makeup', '60 min', 3500]],
};
const TEAM = [['Nisha Verma', 'Creative director · Colour', 'stylist-woman'], ['Rohan Pillai', 'Senior stylist · Cuts', 'barber-portrait'], ['Tara Sood', 'Skin & brows specialist', 'beautician']];
const TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

export default function SalonBeauty() {
  const [tab, setTab] = useState('Hair');
  const [book, setBook] = useState({ service: 'Cut & blow-dry', stylist: 'Any available', date: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10), time: '11:30' });
  const [done, setDone] = useState(false);
  const allServices = Object.values(SERVICES).flat().map((s) => s[0]);

  return (
    <div className="sl">
      <header className="sl-nav">
        <div className="sl-logo">Lumière<span>.</span></div>
        <nav><a href="#sl-services">Services</a><a href="#sl-team">Stylists</a><a href="#sl-gallery">Gallery</a><a href="#sl-book">Book</a><a href="#sl-contact">Contact</a></nav>
        <a href="#sl-book" className="sl-btn sl-btn-sm">Book appointment</a>
      </header>

      <section className="sl-hero">
        <div className="sl-hero-copy">
          <span className="sl-kicker">Hair · Skin · Nails · Bridal</span>
          <h1>Look like the <em>best version</em> of you.</h1>
          <p>An award-winning studio in Koramangala. Precision cuts, luminous colour and skincare that actually listens to your skin.</p>
          <div className="sl-cta"><a href="#sl-book" className="sl-btn">Book an appointment</a><a href="#sl-services" className="sl-link">See price list</a></div>
          <div className="sl-trust"><span>★★★★★</span> 4.9 from 1,200+ Google reviews</div>
        </div>
        <div className="sl-hero-art">
          <div className="sl-arch"><Photo eager id="salon-model" w={720} h={920} alt="Client getting a blow-dry at Lumière" /></div>
          <div className="sl-float"><Photo eager id="nail-art" w={320} h={320} alt="Gel nail art" /></div>
          <div className="sl-offer">New guests<br /><b>20% off</b></div>
        </div>
      </section>

      <section className="sl-marquee" aria-hidden="true"><div>{Array.from({ length: 2 }).map((_, k) => <span key={k}>Balayage ✦ Keratin ✦ HydraGlow Facial ✦ Gel Nails ✦ Bridal Makeup ✦ Brow Lamination ✦&nbsp;</span>)}</div></section>

      <section className="sl-services" id="sl-services">
        <div className="sl-head"><span className="sl-kicker">Price list</span><h2>Services &amp; pricing</h2></div>
        <div className="sl-tabs" role="tablist">{Object.keys(SERVICES).map((k) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k}</button>)}</div>
        <ul className="sl-list" key={tab}>
          {SERVICES[tab].map(([n, d, p], i) => (
            <li key={n} style={{ animationDelay: `${i * 70}ms` }}>
              <div><h3>{n}</h3><span>{d}</span></div><i /><b>₹ {p.toLocaleString('en-IN')}</b>
              <a href="#sl-book" onClick={() => setBook((b) => ({ ...b, service: n }))}>Book</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="sl-team" id="sl-team">
        <div className="sl-head"><span className="sl-kicker">The team</span><h2>Meet your stylists</h2></div>
        <div className="sl-team-grid">
          {TEAM.map(([n, r, id]) => (
            <article key={n} className="sl-person"><div className="sl-person-img"><Photo id={id} w={520} h={640} alt={n} /></div><h3>{n}</h3><span>{r}</span></article>
          ))}
        </div>
      </section>

      <section className="sl-gallery" id="sl-gallery">
        {[['balayage', 'Natural curls styling'], ['salon-interior', 'The studio'], ['facial', 'Signature facial'], ['bridal-makeup', 'Makeup kit'], ['haircut', 'Gents grooming'], ['lashes', 'Brow & lash work']].map(([id, alt]) => (
          <div key={id} className="sl-shot"><Photo id={id} w={600} h={600} alt={alt} /></div>
        ))}
      </section>

      <section className="sl-book" id="sl-book">
        <div className="sl-book-img"><Photo id="salon-chair" w={720} h={900} alt="Styling station at Lumière" /></div>
        <div className="sl-book-card">
          {done ? (
            <div className="sl-done"><div className="sl-tick">✓</div><h2>You’re booked, see you soon!</h2><p><b>{book.service}</b> with {book.stylist} on {book.date} at {book.time}. In your live site, a WhatsApp confirmation goes out instantly.</p><button className="sl-btn" onClick={() => setDone(false)}>Book another</button></div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
              <span className="sl-kicker">Online booking</span>
              <h2>Reserve your slot</h2>
              <label>Service<select value={book.service} onChange={(e) => setBook({ ...book, service: e.target.value })}>{allServices.map((s) => <option key={s}>{s}</option>)}</select></label>
              <label>Stylist<select value={book.stylist} onChange={(e) => setBook({ ...book, stylist: e.target.value })}><option>Any available</option>{TEAM.map(([n]) => <option key={n}>{n}</option>)}</select></label>
              <label>Date<input type="date" value={book.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setBook({ ...book, date: e.target.value })} /></label>
              <div className="sl-times" role="radiogroup" aria-label="Time">{TIMES.map((t) => <button type="button" key={t} role="radio" aria-checked={book.time === t} className={book.time === t ? 'on' : ''} onClick={() => setBook({ ...book, time: t })}>{t}</button>)}</div>
              <label>Your name<input placeholder="Full name" required /></label>
              <label>WhatsApp number<input type="tel" placeholder="+91" required /></label>
              <button className="sl-btn sl-btn-full">Confirm booking</button>
            </form>
          )}
        </div>
      </section>

      <footer className="sl-foot" id="sl-contact">
        <div><div className="sl-logo">Lumière<span>.</span></div><p>80 Feet Road, Koramangala, Bengaluru</p></div>
        <div><b>Hours</b><p>Tue–Sun · 10 am – 8 pm<br />Closed Mondays</p></div>
        <div><b>Contact</b><p>+91 98450 12345<br />hello@lumiere.studio</p></div>
        <div><b>Social</b><p>Instagram · Google · Pinterest</p></div>
      </footer>
    </div>
  );
}
