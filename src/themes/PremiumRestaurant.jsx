import { useState } from 'react';
import { Photo } from '../lib/images.jsx';
import './premium-restaurant.css';

const MENU = {
  Starters: [
    ['Charred Leek Velouté', 'smoked butter, chive oil, rye crumb', '₹ 650'],
    ['Tandoori Scallops', 'saffron beurre blanc, pickled shallot', '₹ 1,150'],
    ['Heirloom Beet Tartare', 'goat curd, hazelnut, aged balsamic', '₹ 720'],
  ],
  Mains: [
    ['Slow-smoked Lamb Shoulder', 'black garlic jus, pomme purée', '₹ 1,850'],
    ['Wild Mushroom Risotto', 'truffle, parmesan foam, sage', '₹ 1,250'],
    ['Malabar Sea Bass', 'coconut moilee, curry leaf, lime', '₹ 1,690'],
  ],
  Desserts: [
    ['Saffron Crème Brûlée', 'cardamom tuile, rose petals', '₹ 590'],
    ['Dark Chocolate Délice', 'smoked sea salt, espresso ice', '₹ 640'],
    ['Mango & Chilli Pavlova', 'passion fruit, mint', '₹ 560'],
  ],
};

export default function PremiumRestaurant() {
  const [tab, setTab] = useState('Starters');
  const [booked, setBooked] = useState(false);
  const [guests, setGuests] = useState(2);

  return (
    <div className="pr">
      <header className="pr-nav">
        <div className="pr-logo">Saffron <em>&amp;</em> Smoke</div>
        <nav><a href="#pr-story">Story</a><a href="#pr-menu">Menu</a><a href="#pr-book">Reservations</a><a href="#pr-gallery">Gallery</a><a href="#pr-visit">Visit</a></nav>
        <a href="#pr-book" className="pr-btn pr-btn-sm">Book a table</a>
      </header>

      <section className="pr-hero">
        <div className="pr-hero-copy">
          <span className="pr-kicker">Est. 2014 · Modern Indian Fine Dining</span>
          <h1>Fire, spice<br /><i>&amp; quiet</i> ceremony.</h1>
          <p>A seven-course seasonal tasting menu, cooked over live embers and served at only twelve tables each evening.</p>
          <div className="pr-hero-cta">
            <a href="#pr-book" className="pr-btn">Reserve your evening</a>
            <a href="#pr-menu" className="pr-link">View the menu →</a>
          </div>
        </div>
        <div className="pr-hero-art">
          <div className="pr-hero-img"><Photo eager id="dining-plate" w={720} h={860} alt="Plated tasting-menu course" /></div>
          <div className="pr-hero-img small"><Photo eager id="chef-fire" w={420} h={420} alt="Chef finishing a dish" /></div>
          <div className="pr-badge">Michelin<br /><b>Recommended</b></div>
        </div>
      </section>

      <section className="pr-strip">
        <span>Tasting menu · 7 courses</span><span>Wine pairing by our sommelier</span><span>Open Tue–Sun · 7 pm – 11 pm</span>
      </section>

      <section className="pr-story" id="pr-story">
        <div className="pr-story-art"><Photo id="chef-portrait" w={640} h={800} alt="Chef Arjun Kapoor" /></div>
        <div>
          <span className="pr-kicker">Our story</span>
          <h2>Chef Arjun Kapoor cooks the memories of his grandmother’s kitchen with the technique of Paris.</h2>
          <p>Every dish begins at our partner farms in the Western Ghats. What arrives in the morning decides the menu by evening — nothing frozen, nothing rushed.</p>
          <div className="pr-sign">— Arjun Kapoor, Chef-Owner</div>
        </div>
      </section>

      <section className="pr-menu" id="pr-menu">
        <span className="pr-kicker">À la carte</span>
        <h2>The Autumn Menu</h2>
        <div className="pr-tabs" role="tablist">
          {Object.keys(MENU).map((k) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k}</button>
          ))}
        </div>
        <ul className="pr-items" key={tab}>
          {MENU[tab].map(([n, d, p], i) => (
            <li key={n} style={{ animationDelay: `${i * 90}ms` }}>
              <div><h3>{n}</h3><p>{d}</p></div><span className="pr-dots" /><b>{p}</b>
            </li>
          ))}
        </ul>
      </section>

      <section className="pr-book" id="pr-book">
        <div className="pr-book-card">
          {booked ? (
            <div className="pr-booked">
              <div className="pr-tick">✓</div>
              <h2>Table held for {guests}</h2>
              <p>This is a demo — in your live site, confirmations arrive by SMS and email.</p>
              <button className="pr-btn" onClick={() => setBooked(false)}>Make another booking</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setBooked(true); }}>
              <span className="pr-kicker">Reservations</span>
              <h2>Reserve a table</h2>
              <div className="pr-form">
                <label>Date<input type="date" required defaultValue={new Date(Date.now() + 864e5).toISOString().slice(0, 10)} /></label>
                <label>Time<select defaultValue="20:00"><option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option><option>21:00</option></select></label>
                <label>Guests
                  <div className="pr-stepper">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
                    <span>{guests}</span>
                    <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))}>+</button>
                  </div>
                </label>
                <label>Name<input placeholder="Your name" required /></label>
              </div>
              <button className="pr-btn pr-btn-full">Check availability</button>
            </form>
          )}
        </div>
      </section>

      <section className="pr-gallery" id="pr-gallery" aria-label="Gallery">
        {[['restaurant-interior', 'Dining room'], ['cocktail-bar', 'The bar'], ['dessert-plating', 'Plating dessert'], ['wine-cellar', 'Wine selection']].map(([id, alt]) => (
          <div key={id} className="pr-shot"><Photo id={id} w={600} h={600} alt={alt} /></div>
        ))}
      </section>

      <section className="pr-reviews">
        {[
          ['“The most thoughtful tasting menu in the city.”', 'Food & Travel'],
          ['“Every course tells a story. Unforgettable.”', 'Condé Nast Traveller'],
          ['“Smoke, spice and serious skill.”', 'The Hindu'],
        ].map(([q, s]) => <blockquote key={s}><p>{q}</p><cite>{s}</cite></blockquote>)}
      </section>

      <footer className="pr-foot" id="pr-visit">
        <div className="pr-logo">Saffron <em>&amp;</em> Smoke</div>
        <div><b>Visit</b><p>12 Residency Road, Bengaluru</p></div>
        <div><b>Hours</b><p>Tue–Sun · 7 pm – 11 pm</p></div>
        <div><b>Contact</b><p>+91 80 4000 1234</p></div>
      </footer>
    </div>
  );
}
