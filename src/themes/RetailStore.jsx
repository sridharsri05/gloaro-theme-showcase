import { useMemo, useState } from 'react';
import { Photo } from '../lib/images.jsx';
import { usePages, PageNav, Burger } from '../lib/pages.jsx';
import './retail-store.css';

const PAGES = [['home', 'Home'], ['shop', 'Shop'], ['collections', 'Collections'], ['about', 'Our story'], ['contact', 'Contact']].map(([id, label]) => ({ id, label }));

const PRODUCTS = [
  { n: 'Flyknit Runner', id: 'red-sneaker', cat: 'Shoes', p: 7999, old: 9999, tag: 'Sale' },
  { n: 'Everyday Smartwatch', id: 'smartwatch', cat: 'Accessories', p: 12499, tag: 'New' },
  { n: 'Studio Headphones', id: 'headphones', cat: 'Accessories', p: 8499 },
  { n: 'Retro Instant Camera', id: 'instant-camera', cat: 'Accessories', p: 6999 },
  { n: 'Court Low Sneaker', id: 'black-sneaker', cat: 'Shoes', p: 5499 },
  { n: 'Linen Off-shoulder Dress', id: 'white-dress', cat: 'Women', p: 3299, tag: 'New' },
  { n: 'Camel Wool Coat', id: 'coat', cat: 'Women', p: 9999, old: 12999, tag: 'Sale' },
  { n: 'Boxy Graphic Tee', id: 'red-tee', cat: 'Men', p: 1299 },
  { n: 'Chambray Shirt', id: 'denim-shirt', cat: 'Men', p: 2499 },
  { n: 'Knit Poncho', id: 'knit', cat: 'Women', p: 2799 },
  { n: 'Suede Derby · Teal', id: 'teal-shoe', cat: 'Shoes', p: 6499 },
  { n: 'Classic Wayfarer', id: 'sunglasses', cat: 'Accessories', p: 1999 },
];
const CATS = ['All', 'Women', 'Men', 'Shoes', 'Accessories'];
const COLLECTIONS = [['Autumn Edit', 'rack-neutral', 'Layers, wool and warm neutrals'], ['Street Essentials', 'street-style', 'Sneakers and oversized fits'], ['The Red Line', 'red-bag', 'Statement pieces in one colour'], ['Weekend Flatlay', 'flatlay', 'Everything for two days off']];
const fmt = (n) => `₹ ${n.toLocaleString('en-IN')}`;

export default function RetailStore() {
  const { page, go, menuOpen, toggleMenu } = usePages('home');
  const [cat, setCat] = useState('All');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [sent, setSent] = useState(false);
  const list = useMemo(() => (cat === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)), [cat]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((s, p) => s + (cart[p.n] || 0) * p.p, 0);
  const add = (n, d = 1) => { setCart((c) => { const q = Math.max(0, (c[n] || 0) + d); const next = { ...c, [n]: q }; if (!q) delete next[n]; return next; }); if (d > 0) setCartOpen(true); };

  const Card = ({ p }) => (
    <article className="rt-card">
      <div className="rt-card-img"><Photo id={p.id} w={600} h={720} alt={p.n} />{p.tag && <span className={`rt-tag ${p.tag.toLowerCase()}`}>{p.tag}</span>}<button className="rt-quick" onClick={() => add(p.n)}>Add to bag</button></div>
      <div className="rt-card-body"><span>{p.cat}</span><h3>{p.n}</h3><b>{fmt(p.p)} {p.old && <s>{fmt(p.old)}</s>}</b></div>
    </article>
  );

  return (
    <div className="rt">
      <div className="rt-bar">Free shipping over ₹ 1,999 · Easy 30-day returns · New drops every Friday</div>
      <header className={`rt-nav ${menuOpen ? 'open' : ''}`}>
        <Burger open={menuOpen} onClick={toggleMenu} />
        <a href="#home" className="rt-logo" onClick={(e) => { e.preventDefault(); go('home'); }}>NORD<span>&amp;</span>THREAD</a>
        <PageNav pages={PAGES} page={page} go={go} className="rt-links" />
        <button className="rt-cart" onClick={() => setCartOpen(true)}>Bag <b key={count}>{count}</b></button>
      </header>

      {page === 'home' && (
        <main key="home" className="rt-page">
          <section className="rt-hero">
            <div className="rt-hero-copy">
              <span className="rt-kicker">Autumn / Winter ’26</span>
              <h1>Dress for the<br /><em>days that matter.</em></h1>
              <p>Considered basics and bold statement pieces, made in small runs and priced honestly.</p>
              <div className="rt-cta"><button className="rt-btn" onClick={() => go('shop')}>Shop new arrivals</button><button className="rt-btn rt-btn-line" onClick={() => go('collections')}>View collections</button></div>
            </div>
            <div className="rt-hero-art"><div className="rt-hero-a"><Photo eager id="shopper" w={720} h={900} alt="Shopper with bags" /></div><div className="rt-hero-b"><Photo eager id="rack-green" w={480} h={480} alt="Shirts on a rack" /></div></div>
          </section>
          <section className="rt-cats">{CATS.slice(1).map((c, i) => <button key={c} onClick={() => { setCat(c); go('shop'); }}><Photo id={['white-dress', 'denim-shirt', 'black-sneaker', 'headphones'][i]} w={400} h={500} alt={c} /><span>{c}</span></button>)}</section>
          <section className="rt-section">
            <div className="rt-head"><h2>Trending now</h2><button className="rt-link" onClick={() => go('shop')}>Shop all →</button></div>
            <div className="rt-grid">{PRODUCTS.slice(0, 4).map((p) => <Card key={p.n} p={p} />)}</div>
          </section>
          <section className="rt-banner"><Photo id="sale" w={1600} h={600} alt="Sale" className="rt-banner-bg" /><div><span className="rt-kicker light">Mid-season sale</span><h2>Up to 50% off</h2><button className="rt-btn rt-btn-light" onClick={() => { setCat('All'); go('shop'); }}>Shop the sale</button></div></section>
          <section className="rt-perks">{[['🚚', 'Free shipping over ₹ 1,999'], ['↩', '30-day easy returns'], ['🔒', 'Secure UPI & card payments'], ['♻', 'Recycled packaging']].map(([i, t]) => <div key={t}><i>{i}</i>{t}</div>)}</section>
        </main>
      )}

      {page === 'shop' && (
        <main key="shop" className="rt-page">
          <section className="rt-section">
            <div className="rt-head"><h2>Shop <small>· {list.length} products</small></h2><div className="rt-filters">{CATS.map((c) => <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}</div></div>
            <div className="rt-grid" key={cat}>{list.map((p) => <Card key={p.n} p={p} />)}</div>
          </section>
        </main>
      )}

      {page === 'collections' && (
        <main key="collections" className="rt-page">
          <section className="rt-section">
            <div className="rt-head center"><span className="rt-kicker">Curated</span><h2>Collections</h2><p>Edits put together by our stylists — shop the whole look or just the piece you need.</p></div>
            <div className="rt-collections">{COLLECTIONS.map(([n, id, d], i) => (
              <article key={n} className={`rt-coll ${i === 0 ? 'wide' : ''}`} onClick={() => { setCat('All'); go('shop'); }}><Photo id={id} w={1000} h={700} alt={n} /><div><h3>{n}</h3><p>{d}</p><span>Shop the edit →</span></div></article>
            ))}</div>
          </section>
          <section className="rt-lookbook">{['boutique', 'coat', 'red-tee', 'knit', 'teal-shoe', 'sunglasses'].map((id) => <div key={id}><Photo id={id} w={500} h={500} alt="" /></div>)}</section>
        </main>
      )}

      {page === 'about' && (
        <main key="about" className="rt-page">
          <section className="rt-story">
            <div className="rt-story-img"><Photo eager id="boutique" w={800} h={1000} alt="Inside the Nord & Thread store" /></div>
            <div>
              <span className="rt-kicker">Our story</span>
              <h2>Two friends, one sewing machine, and a stall at Sunday Soul Sante.</h2>
              <p>Nord &amp; Thread started in 2017 as a weekend stall in Bengaluru selling thirty hand-finished tees. Today we design everything in-house, work with eleven family-run factories in Tiruppur and Agra, and still number every run.</p>
              <p>We don’t do fast fashion. Four drops a year, made to be worn for years.</p>
              <div className="rt-values">{[['11', 'Partner workshops'], ['4', 'Drops a year'], ['92%', 'Organic or recycled fibre'], ['2 lakh+', 'Happy customers']].map(([b, s]) => <div key={s}><b>{b}</b><span>{s}</span></div>)}</div>
            </div>
          </section>
          <section className="rt-section">
            <div className="rt-head center"><h2>Where to find us</h2></div>
            <div className="rt-stores">{[['Bengaluru · Indiranagar', '100 Ft Road · 11 am – 9 pm'], ['Mumbai · Bandra', 'Hill Road · 11 am – 9 pm'], ['Delhi · Khan Market', 'Middle Lane · 11 am – 8 pm']].map(([c, h]) => <div key={c}><b>{c}</b><span>{h}</span></div>)}</div>
          </section>
        </main>
      )}

      {page === 'contact' && (
        <main key="contact" className="rt-page">
          <section className="rt-contact">
            <div>
              <span className="rt-kicker">Contact</span>
              <h2>We’re real people, and we reply fast.</h2>
              <p>Orders, sizing, returns or wholesale — message us and we’ll answer within a few hours, seven days a week.</p>
              <div className="rt-channels"><div><b>WhatsApp</b><span>+91 90000 44556</span></div><div><b>Email</b><span>hello@nordandthread.in</span></div><div><b>Returns</b><span>returns@nordandthread.in</span></div><div><b>Wholesale</b><span>trade@nordandthread.in</span></div></div>
              <details className="rt-faq"><summary>How do returns work?</summary><p>Request a pickup within 30 days; refunds reach your account in 3–5 working days.</p></details>
              <details className="rt-faq"><summary>Do you ship internationally?</summary><p>Yes — UAE, Singapore, UK and USA, with duties included at checkout.</p></details>
            </div>
            <form className="rt-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              {sent ? <div className="rt-sent">✓ Message sent — we’ll be in touch shortly.<button type="button" className="rt-link" onClick={() => setSent(false)}>Send another</button></div> : (
                <>
                  <label>Topic<select><option>Order status</option><option>Sizing help</option><option>Return or exchange</option><option>Wholesale</option><option>Something else</option></select></label>
                  <label>Name<input required placeholder="Full name" /></label>
                  <label>Email<input type="email" required placeholder="you@email.com" /></label>
                  <label>Order number<input placeholder="NT-1234 (optional)" /></label>
                  <label>Message<textarea rows={4} required /></label>
                  <button className="rt-btn">Send message</button>
                </>
              )}
            </form>
          </section>
        </main>
      )}

      <footer className="rt-foot">
        <div><div className="rt-logo">NORD<span>&amp;</span>THREAD</div><p>Designed in Bengaluru. Made in India.</p></div>
        <nav>{PAGES.map((p) => <a key={p.id} href={`#${p.id}`} onClick={(e) => { e.preventDefault(); go(p.id); }}>{p.label}</a>)}</nav>
        <form className="rt-news" onSubmit={(e) => e.preventDefault()}><label>Get the Friday drop</label><div><input type="email" placeholder="Email address" /><button className="rt-btn rt-btn-sm">Join</button></div></form>
      </footer>

      <div className={`rt-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="rt-drawer-head"><h3>Your bag ({count})</h3><button onClick={() => setCartOpen(false)} aria-label="Close bag">✕</button></div>
        {ordered ? <div className="rt-sent">✓ Order placed! In your live store this goes to checkout with UPI, cards and COD.<button type="button" className="rt-link" onClick={() => { setOrdered(false); setCart({}); setCartOpen(false); }}>Keep shopping</button></div> : count ? (
          <>
            <ul className="rt-lines">{PRODUCTS.filter((p) => cart[p.n]).map((p) => (
              <li key={p.n}><div className="rt-line-img"><Photo id={p.id} w={120} h={140} alt={p.n} /></div><div><b>{p.n}</b><span>{fmt(p.p)}</span></div><div className="rt-qty"><button onClick={() => add(p.n, -1)}>−</button><span>{cart[p.n]}</span><button onClick={() => add(p.n, 1)}>+</button></div></li>
            ))}</ul>
            <div className="rt-drawer-foot"><div><span>Subtotal</span><b>{fmt(total)}</b></div><button className="rt-btn rt-btn-full" onClick={() => setOrdered(true)}>Checkout</button></div>
          </>
        ) : <p className="rt-empty">Your bag is empty. <button className="rt-link" onClick={() => { setCartOpen(false); go('shop'); }}>Start shopping →</button></p>}
      </div>
      {cartOpen && <div className="rt-scrim" onClick={() => setCartOpen(false)} />}
    </div>
  );
}
