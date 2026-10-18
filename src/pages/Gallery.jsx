import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeCard from '../components/ThemeCard.jsx';
import Icon from '../components/Icon.jsx';
import { CATEGORIES, THEMES } from '../data/themes.js';

const EASE = [0.16, 1, 0.3, 1];

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const active = params.get('category') || 'all';
  const list = active === 'all' ? THEMES : THEMES.filter((t) => t.category === active);
  const activeCat = CATEGORIES.find((c) => c.id === active);

  const select = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('category'); else next.set('category', id);
    setParams(next, { replace: true });
  };

  const filters = [{ id: 'all', name: 'All', live: true, count: THEMES.length }, ...CATEGORIES.map((c) => ({ ...c, count: THEMES.filter((t) => t.category === c.id).length }))];

  return (
    <section className="section page-top">
      <div className="container">
        <motion.div className="section-head" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <span className="eyebrow">Theme gallery</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <h1 className="h2">{activeCat ? activeCat.name : 'All business themes'}</h1>
              <p>{activeCat ? activeCat.blurb : 'Pick a category, open a live demo, and request the one that fits your business.'}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div className="filters" role="tablist" aria-label="Filter by category"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>
          {filters.map((c) => (
            <button key={c.id} role="tab" aria-selected={active === c.id} disabled={!c.live}
              className={`filter ${active === c.id ? 'is-active' : ''}`} onClick={() => select(c.id)} title={c.live ? '' : 'Coming soon'}>
              {active === c.id && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="filter-label">
                {c.icon && <Icon name={c.icon} size={16} />} {c.name} <span className="filter-count">{c.live ? c.count : 'Soon'}</span>
              </span>
            </button>
          ))}
        </motion.div>

        <motion.div className="theme-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE, delay: i * 0.07 } }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
              >
                <ThemeCard theme={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="empty">Themes for this category are coming soon.</p>}
      </div>
    </section>
  );
}
