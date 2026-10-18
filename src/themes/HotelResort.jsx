import { useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './hotel-resort.css';

const ROOMS = [
  { n: 'Ocean View Suite', id: 'suite', p: 14500, size: '62 m²', bed: 'King bed', extra: 'Private balcony · Sea view' },
  { n: 'Garden Villa', id: 'villa-pool', p: 22000, size: '95 m²', bed: 'King + daybed', extra: 'Plunge pool · Butler service' },
  { n: 'Deluxe Room', id: 'hotel-room', p: 8900, size: '38 m²', bed: 'Queen bed', extra: 'Courtyard view · Rain shower' },
];
const AMENITIES = [['∞', 'Infinity pool'], ['♨', 'Spa & hammam'], ['✈', 'Airport transfers'], ['⚘', 'Yoga pavilion'], ['☕', 'All-day dining'], ['⚓', 'Private beach']];
const REVIEWS = [
  ['“Woke up to the sound of waves every morning. Flawless service.”', 'Meera & Dev', 'Honeymoon, March'],
  ['“The villa pool and the breakfast spread alone are worth the trip.”', 'Jonathan R.', 'Family stay, 5 nights'],
  ['“Quiet, elegant and genuinely warm staff. We will be back.”', 'Aisha K.', 'Anniversary weekend'],
];

const plus = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

export default function HotelResort() {
  const [q, setQ] = useState({ in: plus(7), out: plus(10), guests: 2 });
  const [picked, setPicked] = useState(null);
  const nights = Math.max(1, Math.round((new Date(q.out) - new Date(q.in)) / 864e5) || 1);

  return (
    <div className="ht">
      <header className="ht-nav">
        <div className="ht-logo">Azure <span>Bay</span></div>
        <nav><a href="#ht-rooms">Rooms</a><a href="#ht-amen">Experiences</a><a href="#ht-gallery">Gallery</a><a href="#ht-reviews">Guests</a><a href="#ht-contact">Contact</a></nav>
        <a href="#ht-rooms" className="ht-btn ht-btn-sm">Book now</a>
      </header>

      <section className="ht-hero">
        <Photo eager id="resort-pool" w={1600} h={900} alt="Azure Bay infinity pool at dusk" className="ht-hero-bg" />
        <div className="ht-hero-copy">
          <span className="ht-kicker">Goa · Boutique beachfront resort</span>
          <h1>Where the sea<br /><em>sets the pace.</em></h1>
          <p>Twenty-eight rooms and villas on a quiet stretch of Ashwem beach — slow mornings, long lunches, nowhere to be.</p>
        </div>
        <form className="ht-search" onSubmit={(e) => { e.preventDefault(); document.getElementById('ht-rooms')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <label>Check-in<input type="date" value={q.in} min={plus(0)} onChange={(e) => setQ({ ...q, in: e.target.value })} /></label>
          <label>Check-out<input type="date" value={q.out} min={q.in} onChange={(e) => setQ({ ...q, out: e.target.value })} /></label>
          <label>Guests<select value={q.guests} onChange={(e) => setQ({ ...q, guests: +e.target.value })}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label>
          <button className="ht-btn">Check availability</button>
        </form>
      </section>

      <section className="ht-intro">
        <div className="ht-intro-img"><Photo id="hotel-breakfast" w={720} h={900} alt="Breakfast at the resort" /></div>
        <div>
          <span className="ht-kicker">The resort</span>
          <h2>Barefoot luxury, done quietly.</h2>
          <p>Low-rise laterite villas sit between coconut palms and the Arabian Sea. Every room opens onto a garden or the water, and our team of forty looks after no more than sixty guests at a time.</p>
          <div className="ht-facts"><div><b>28</b><span>Rooms & villas</span></div><div><b>4.9</b><span>Guest rating</span></div><div><b>120 m</b><span>To the beach</span></div></div>
        </div>
      </section>

      <section className="ht-rooms" id="ht-rooms">
        <div className="ht-head"><span className="ht-kicker">Rooms & rates</span><h2>Choose your stay</h2><p>{nights} night{nights > 1 ? 's' : ''} · {q.guests} guest{q.guests > 1 ? 's' : ''} · taxes included</p></div>
        <div className="ht-grid">
          {ROOMS.map((r, i) => (
            <article key={r.n} className={`ht-room ${picked === r.n ? 'on' : ''}`} style={{ animationDelay: `${i * 90}ms` }}>
              <div className="ht-room-img"><Photo id={r.id} w={720} h={520} alt={r.n} /><span className="ht-room-size">{r.size}</span></div>
              <div className="ht-room-body">
                <h3>{r.n}</h3>
                <p>{r.bed} · {r.extra}</p>
                <div className="ht-room-foot">
                  <div><b>₹ {r.p.toLocaleString('en-IN')}</b><span>/ night · ₹ {(r.p * nights).toLocaleString('en-IN')} total</span></div>
                  <button className="ht-btn ht-btn-sm" onClick={() => setPicked(picked === r.n ? null : r.n)}>{picked === r.n ? 'Selected ✓' : 'Reserve'}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className={`ht-sticky ${picked ? 'on' : ''}`}>
          <span><b>{picked}</b> · {q.in} → {q.out} · {nights} night{nights > 1 ? 's' : ''}</span>
          <button className="ht-btn ht-btn-light" onClick={() => setPicked(null)}>Continue to guest details →</button>
        </div>
      </section>

      <section className="ht-amen" id="ht-amen">
        <div className="ht-head light"><span className="ht-kicker">Experiences</span><h2>Days that fill themselves</h2></div>
        <div className="ht-amen-grid">{AMENITIES.map(([ic, t]) => <div key={t}><i>{ic}</i><span>{t}</span></div>)}</div>
      </section>

      <section className="ht-gallery" id="ht-gallery">
        {[['beach-sunset', 'The beach at sunset'], ['spa', 'Spa treatments'], ['pool-villa', 'Pool villas'], ['seafood', 'Seafood dinner'], ['yoga-beach', 'Morning yoga on the beach']].map(([id, alt], i) => (
          <div key={id} className={`ht-shot s${i}`}><Photo id={id} w={800} h={800} alt={alt} /></div>
        ))}
      </section>

      <section className="ht-reviews" id="ht-reviews">
        {REVIEWS.map(([q2, n, m]) => <blockquote key={n}><p>{q2}</p><cite>{n}<span>{m}</span></cite></blockquote>)}
      </section>

      <footer className="ht-foot" id="ht-contact">
        <div><div className="ht-logo">Azure <span>Bay</span></div><p>Ashwem Beach Road, Mandrem, Goa 403527</p></div>
        <div><b>Reservations</b><p>+91 832 400 1234<br />stay@azurebay.in</p></div>
        <div><b>Check-in / out</b><p>2:00 pm / 11:00 am<br />Early check-in on request</p></div>
        <div><b>Follow</b><p>Instagram · Tripadvisor · Google</p></div>
      </footer>
    </div>
  );
}
