import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { Navbar, Footer } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import ThemeDemo from './pages/ThemeDemo.jsx';
import Enquire from './pages/Enquire.jsx';
import NotFound from './pages/NotFound.jsx';
import WhatsAppFab from './components/WhatsAppFab.jsx';

const EASE = [0.16, 1, 0.3, 1];

function Page({ children, footer = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } }}
    >
      <main id="main">{children}</main>
      {footer && <Footer />}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export default function App() {
  const location = useLocation();
  const isDemo = /^\/themes\/[^/]+/.test(location.pathname);
  const prevPath = useRef(location.pathname);

  // Same-page hash links (e.g. /#how) scroll smoothly; cross-page waits for the transition.
  useEffect(() => {
    const samePage = prevPath.current === location.pathname;
    prevPath.current = location.pathname;
    if (!location.hash) return;
    const t = setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
    }, samePage ? 0 : 450);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  // Theme demos render full-screen with their own GLOARO bar, outside the animated page
  // transition so they are never left waiting on (or hidden by) an exit animation.
  const embed = new URLSearchParams(location.search).get('embed') === '1';
  if (isDemo) {
    return (
      <MotionConfig reducedMotion="never">
        <Routes location={location} key={location.pathname}>
          <Route path="/themes/:themeId" element={<main id="main"><ThemeDemo /></main>} />
        </Routes>
        {!embed && <WhatsAppFab text={`Hi GLOARO, I’m looking at the ${location.pathname.split('/')[2]} demo and want to know more.`} />}
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="never">
      <Navbar />
      <ScrollProgress />
      <AnimatePresence mode="wait" onExitComplete={() => { if (!window.location.hash) window.scrollTo(0, 0); }}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/themes" element={<Page><Gallery /></Page>} />
          <Route path="/enquire" element={<Page><Enquire /></Page>} />
          <Route path="/enquire/:themeId" element={<Page><Enquire /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <WhatsAppFab />
    </MotionConfig>
  );
}
