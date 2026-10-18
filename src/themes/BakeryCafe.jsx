import { useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './bakery-cafe.css';

const BAKES = [
  { id: 'croissant', n: 'Butter Croissant', p: 120, t: 'Fresh at 7am' },
  { id: 'strawberry-cake', n: 'Strawberry Shortcake', p: 220, t: 'Bestseller' },
  { id: 'cookie', n: 'Brown-butter Cookie', p: 90, t: 'Warm & gooey' },
  { id: 'sourdough', n: 'Sourdough Loaf', p: 260, t: '48-hr ferment' },
  { id: 'cupcake', n: 'Pistachio Cupcake', p: 140, t: 'New' },
  { id: 'doughnut', n: 'Cinnamon Doughnut', p: 110, t: 'Sugar-dusted' },
];

const DAYS = [['Mon – Fri', '7:00 am – 8:00 pm'], ['Saturday', '8:00 am – 9:00 pm'], ['Sunday', '8:00 am – 6:00 pm']];

export default function BakeryCafe() {
  const [box, setBox] = useState({});
  const count = Object.values(box).reduce((a, b) => a + b, 0);
  const total = BAKES.reduce((s, b) => s + (box[b.n] || 0) * b.p, 0);
  const add = (n, d) => setBox((x) => ({ ...x, [n]: Math.max(0, (x[n] || 0) + d) }));

  return (
    <div className="bk">
      <header className="bk-nav">
        <div className="bk-logo"><span>🥐</span> Crumb <i>&amp;</i> Co.</div>
        <nav><a href="#bk-today">Today</a><a href="#bk-coffee">Coffee</a><a href="#bk-order">Pre-order</a><a href="#bk-gallery">Gallery</a><a href="#bk-hours">Visit us</a></nav>
        <a href="#bk-order" className="bk-cart">🧺 Box <b key={count}>{count}</b></a>
      </header>

      <section className="bk-hero">
        <div className="bk-hero-copy">
          <span className="bk-pill">☀️ Baked fresh every morning</span>
          <h1>Small batches.<br /><span>Big</span> smiles.</h1>
          <p>Neighbourhood bakery &amp; coffee bar. Flaky croissants, slow sourdough and the city’s silkiest flat white.</p>
          <div className="bk-cta">
            <a href="#bk-order" className="bk-btn">Pre-order for pickup</a>
            <a href="#bk-today" className="bk-btn bk-btn-ghost">See today’s bakes</a>
          </div>
        </div>
        <div className="bk-hero-art">
          <div className="bk-blob bk-img-main"><Photo eager id="pastries" w={640} h={640} alt="Fresh croissants on the counter" /></div>
          <div className="bk-blob bk-img-side"><Photo eager id="latte-art" w={360} h={360} alt="Flat whites with latte art" /></div>
          <div className="bk-sticker">Since<br /><b>2019</b></div>
        </div>
      </section>

      <div className="bk-wave" aria-hidden="true" />

      <section className="bk-today" id="bk-today">
        <div className="bk-board">
          <h2>Today’s specials</h2>
          <ul>
            <li><span>Blueberry Danish</span><span>₹ 150</span></li>
            <li><span>Salted Caramel Latte</span><span>₹ 210</span></li>
            <li><span>Mushroom &amp; Thyme Quiche</span><span>₹ 240</span></li>
            <li><span>Lemon Drizzle Slice</span><span>₹ 130</span></li>
          </ul>
          <p className="bk-chalk">✎ Ask about our vegan bakes!</p>
        </div>
        <div className="bk-coffee" id="bk-coffee">
          <h3>Coffee bar</h3>
          {[['Espresso', 120], ['Flat White', 180], ['Cappuccino', 170], ['Cold Brew', 190], ['Masala Chai', 110]].map(([n, p]) => (
            <div key={n} className="bk-row"><span>{n}</span><i /><b>₹ {p}</b></div>
          ))}
        </div>
      </section>

      <section className="bk-order" id="bk-order">
        <div className="bk-head">
          <h2>Build your box</h2>
          <p>Pick your favourites and collect them warm from the counter.</p>
        </div>
        <div className="bk-grid">
          {BAKES.map((b, i) => (
            <article key={b.n} className="bk-card" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="bk-img"><Photo id={b.id} w={480} h={360} alt={b.n} /></div>
              <span className="bk-tag">{b.t}</span>
              <h3>{b.n}</h3>
              <div className="bk-card-foot">
                <b>₹ {b.p}</b>
                {box[b.n] ? (
                  <div className="bk-qty"><button onClick={() => add(b.n, -1)}>−</button><span>{box[b.n]}</span><button onClick={() => add(b.n, 1)}>+</button></div>
                ) : (
                  <button className="bk-add" onClick={() => add(b.n, 1)}>Add +</button>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className={`bk-summary ${count ? 'on' : ''}`}>
          <span>🧺 {count} item{count === 1 ? '' : 's'} · <b>₹ {total}</b></span>
          <button className="bk-btn" onClick={() => setBox({})}>Reserve for pickup</button>
        </div>
      </section>

      <section className="bk-insta" id="bk-gallery">
        <h2>@crumbandco</h2>
        <div className="bk-tiles">
          {['bakery-interior', 'coffee-cup', 'baker-hands', 'bread-basket', 'cake-slice', 'bakery-display'].map((id) => (
            <div key={id} className="bk-tile"><Photo id={id} w={400} h={400} alt={id.replace('-', ' ')} /></div>
          ))}
        </div>
      </section>

      <footer className="bk-foot" id="bk-hours">
        <div>
          <div className="bk-logo"><span>🥐</span> Crumb <i>&amp;</i> Co.</div>
          <p>4 Lavelle Lane, Indiranagar<br />hello@crumbandco.in</p>
        </div>
        <div className="bk-hours">
          <h3>Opening hours</h3>
          {DAYS.map(([d, h]) => <div key={d}><span>{d}</span><b>{h}</b></div>)}
        </div>
        <div className="bk-map"><Photo id="cafe-storefront" w={520} h={320} alt="Our storefront on Lavelle Lane" /><span>📍 Lavelle Lane</span></div>
      </footer>
    </div>
  );
}
