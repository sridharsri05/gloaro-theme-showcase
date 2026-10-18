import { useCallback, useState } from 'react';

// Tiny in-theme "router" for multi-page demo themes.
// Pages are switched with React state so demos stay self-contained and embeddable.
export function usePages(initial) {
  const [page, setPage] = useState(initial);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = useCallback((id) => {
    setPage(id);
    setMenuOpen(false);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* embed */ }
  }, []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  return { page, go, menuOpen, toggleMenu };
}

/** Nav links for a page list: [{ id, label }] */
export function PageNav({ pages, page, go, className = '' }) {
  return (
    <nav className={className} aria-label="Site pages">
      {pages.map((p) => (
        <a key={p.id} href={`#${p.id}`} aria-current={page === p.id ? 'page' : undefined} className={page === p.id ? 'on' : ''}
          onClick={(e) => { e.preventDefault(); go(p.id); }}>{p.label}</a>
      ))}
    </nav>
  );
}

export function Burger({ open, onClick }) {
  return (
    <button type="button" className={`pg-burger ${open ? 'open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={onClick}>
      <i /><i /><i />
    </button>
  );
}
