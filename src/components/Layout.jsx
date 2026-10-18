import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Icon from './Icon.jsx';

const EASE = [0.16, 1, 0.3, 1];
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/themes', label: 'Themes' },
  { href: '/#how', label: 'How it works' },
  { href: '/#categories', label: 'Categories' },
];

export function Logo({ compact = false }) {
  return (
    <Link to="/" className="brand" aria-label="GLOARO home">
      <img src="/gloaro-mark.png" alt="" className="brand-mark" width="40" height="40" />
      {!compact && (
        <span className="brand-text">
          <span className="brand-name">GLOARO</span>
          <span className="brand-sub">PVT LTD</span>
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 10);
    setHidden(y > 240 && y > prev && !open);
  });

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) =>
            l.to ? (
              <NavLink key={l.label} to={l.to} end={l.end} className="nav-a">
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  </>
                )}
              </NavLink>
            ) : (
              <a key={l.label} href={l.href} className="nav-a">{l.label}</a>
            )
          )}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/enquire" className="btn btn-primary btn-sm">Create Your Website</Link>
          </motion.div>
        </nav>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav-mobile"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {LINKS.map((l, i) => (
              <motion.div key={l.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                {l.to ? <NavLink to={l.to} end={l.end}>{l.label}</NavLink> : <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>}
              </motion.div>
            ))}
            <Link to="/enquire" className="btn btn-primary">Create Your Website</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <img src="/gloaro-logo.webp" alt="GLOARO PVT LTD — Innovative Digital Future & Digital Network" className="footer-logo" />
        </div>
        <div className="footer-cols">
          <div>
            <h4>Explore</h4>
            <Link to="/themes">All themes</Link>
            <Link to="/themes?category=restaurant-food">Restaurant & Food</Link>
            <Link to="/themes?category=business-services">Business & Services</Link>
          </div>
          <div>
            <h4>Get started</h4>
            <Link to="/enquire">Create your website</Link>
            <a href="/#how">How it works</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} GLOARO PVT LTD. All rights reserved.</span>
        <span>Innovative Digital Future & Digital Network</span>
      </div>
    </footer>
  );
}
