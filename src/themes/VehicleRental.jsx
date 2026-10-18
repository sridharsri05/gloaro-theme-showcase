import { useMemo, useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './vehicle-rental.css';

const FLEET = [
  { n: 'Fiat 500 Classic', t: 'City hatchback', cat: 'Cars', id: 'hatchback', p: 1800, seats: 4, gear: 'Manual', fuel: 'Petrol' },
  { n: 'Ford Endeavour', t: 'Full-size SUV', cat: 'SUVs', id: 'suv', p: 3200, seats: 7, gear: 'Automatic', fuel: 'Diesel' },
  { n: 'Nissan Magnite', t: 'Compact SUV', cat: 'SUVs', id: 'minivan', p: 2400, seats: 5, gear: 'Automatic', fuel: 'Petrol' },
  { n: 'KTM RC 390', t: 'Sport bike', cat: 'Bikes', id: 'royal-enfield', p: 1100, seats: 2, gear: 'Manual', fuel: 'Petrol' },
  { n: 'LiveWire One', t: 'Electric motorcycle', cat: 'Bikes', id: 'electric-bike', p: 950, seats: 2, gear: 'Automatic', fuel: 'Electric' },
  { n: 'Chevrolet Camaro', t: 'Muscle car', cat: 'Cars', id: 'jeep', p: 5900, seats: 4, gear: 'Automatic', fuel: 'Petrol' },
];
const CATS = ['All', 'Cars', 'SUVs', 'Bikes'];
const STEPS = [['Search', 'Pick a location and your dates — see live availability.'], ['Reserve', 'Pay a small deposit online. Free cancellation up to 24 hrs.'], ['Drive', 'Collect at our hub or get it delivered to your door.']];
const plus = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

export default function VehicleRental() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState({ city: 'Bengaluru', from: plus(1), to: plus(3) });
  const [picked, setPicked] = useState(null);
  const days = Math.max(1, Math.round((new Date(q.to) - new Date(q.from)) / 864e5) || 1);
  const list = useMemo(() => (cat === 'All' ? FLEET : FLEET.filter((v) => v.cat === cat)), [cat]);
  const chosen = FLEET.find((v) => v.n === picked);

  return (
    <div className="vr">
      <header className="vr-nav">
        <div className="vr-logo"><span className="vr-mark">▶</span>Drive<b>Now</b></div>
        <nav><a href="#vr-fleet">Fleet</a><a href="#vr-how">How it works</a><a href="#vr-why">Why us</a><a href="#vr-reviews">Reviews</a><a href="#vr-contact">Contact</a></nav>
        <a href="#vr-fleet" className="vr-btn vr-btn-sm">Reserve a vehicle</a>
      </header>

      <section className="vr-hero">
        <div className="vr-hero-copy">
          <span className="vr-tag">● Available today in {q.city}</span>
          <h1>Pick it up.<br /><span>Drive it anywhere.</span></h1>
          <p>Self-drive cars, SUVs and bikes from ₹450/day. Zero paperwork, unlimited kilometres, doorstep delivery.</p>
          <form className="vr-search" onSubmit={(e) => { e.preventDefault(); document.getElementById('vr-fleet')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <label>Pickup city<select value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })}>{['Bengaluru', 'Mumbai', 'Goa', 'Hyderabad', 'Chennai'].map((c) => <option key={c}>{c}</option>)}</select></label>
            <label>From<input type="date" value={q.from} min={plus(0)} onChange={(e) => setQ({ ...q, from: e.target.value })} /></label>
            <label>To<input type="date" value={q.to} min={q.from} onChange={(e) => setQ({ ...q, to: e.target.value })} /></label>
            <button className="vr-btn">Search</button>
          </form>
          <div className="vr-stats"><div><b>12k+</b><span>Trips completed</span></div><div><b>4.8★</b><span>Average rating</span></div><div><b>60+</b><span>Vehicles in fleet</span></div></div>
        </div>
        <div className="vr-hero-art">
          <div className="vr-hero-img"><Photo eager id="road-trip" w={900} h={700} alt="SUV on a mountain road" /></div>
          <div className="vr-hero-img small"><Photo eager id="rider" w={420} h={420} alt="Sport bike ready to ride" /></div>
          <div className="vr-pill">Unlimited km<br /><b>included</b></div>
        </div>
      </section>

      <section className="vr-fleet" id="vr-fleet">
        <div className="vr-head">
          <div><span className="vr-eyebrow">Our fleet</span><h2>Choose your ride</h2></div>
          <div className="vr-filters" role="tablist">{CATS.map((c) => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}</div>
        </div>
        <div className="vr-grid" key={cat}>
          {list.map((v, i) => (
            <article key={v.n} className={`vr-card ${picked === v.n ? 'on' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
              <div className="vr-card-img"><Photo id={v.id} w={720} h={480} alt={v.n} /><span className="vr-cat">{v.t}</span></div>
              <div className="vr-card-body">
                <h3>{v.n}</h3>
                <ul className="vr-specs"><li>⚇ {v.seats} seats</li><li>⚙ {v.gear}</li><li>⛽ {v.fuel}</li></ul>
                <div className="vr-card-foot">
                  <div><b>₹ {v.p.toLocaleString('en-IN')}</b><span>/ day · ₹ {(v.p * days).toLocaleString('en-IN')} for {days} day{days > 1 ? 's' : ''}</span></div>
                  <button className="vr-btn vr-btn-sm" onClick={() => setPicked(picked === v.n ? null : v.n)}>{picked === v.n ? 'Selected ✓' : 'Reserve'}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className={`vr-sticky ${chosen ? 'on' : ''}`}>
          <span><b>{chosen?.n}</b> · {q.city} · {q.from} → {q.to} · <b>₹ {chosen ? (chosen.p * days).toLocaleString('en-IN') : 0}</b></span>
          <button className="vr-btn" onClick={() => setPicked(null)}>Continue to payment →</button>
        </div>
      </section>

      <section className="vr-how" id="vr-how">
        <div className="vr-how-copy">
          <span className="vr-eyebrow">How it works</span>
          <h2>On the road in three steps</h2>
          <ol>{STEPS.map(([t, d], i) => <li key={t}><span>0{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
        </div>
        <div className="vr-how-img"><Photo id="keys-handover" w={720} h={820} alt="Car ready for collection at our hub" /></div>
      </section>

      <section className="vr-why" id="vr-why">
        {[['Zero deposit on bikes', 'Ride away with just your licence and ID.'], ['24×7 roadside assist', 'Help within 45 minutes anywhere in the city.'], ['Doorstep delivery', 'Delivered & collected at a time you choose.'], ['Sanitised every trip', 'Deep-cleaned and inspected before every handover.']].map(([t, d]) => (
          <div key={t} className="vr-perk"><h3>{t}</h3><p>{d}</p></div>
        ))}
      </section>

      <section className="vr-reviews" id="vr-reviews">
        {[['“Booked the Endeavour for Coorg in 3 minutes. Car was spotless and delivered on time.”', 'Karthik S.'], ['“Best bike rental in Goa — no deposit drama, just ride.”', 'Priya N.'], ['“Seven-seater for the family wedding, driver-less, unlimited km. Perfect.”', 'The Mehras']].map(([q2, n]) => (
          <blockquote key={n}><p>{q2}</p><cite>— {n}</cite></blockquote>
        ))}
      </section>

      <footer className="vr-foot" id="vr-contact">
        <div><div className="vr-logo"><span className="vr-mark">▶</span>Drive<b>Now</b></div><p>Hubs in Bengaluru · Mumbai · Goa · Hyderabad · Chennai</p></div>
        <div><b>Call / WhatsApp</b><p>+91 90000 12345 · 24×7</p></div>
        <div><b>Email</b><p>hello@drivenow.in</p></div>
        <span className="vr-copy">© 2026 DriveNow Rentals Pvt Ltd</span>
      </footer>
    </div>
  );
}
