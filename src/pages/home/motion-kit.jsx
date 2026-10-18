// Small reusable Framer Motion building blocks for the home page.
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

// Fade + rise when scrolled into view
export function FadeUp({ children, delay = 0, y = 32, className = '', as = 'div', ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Staggered container + item variants
export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
export const rise = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

// Button/element that is pulled toward the cursor
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.div>
  );
}

// Number that counts up once visible
export function Counter({ to, suffix = '', prefix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// Card with a soft spotlight that follows the cursor (CSS vars)
export function Spotlight({ children, className = '', ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div className={`spotlight ${className}`} onMouseMove={onMove} {...rest}>
      {children}
    </motion.div>
  );
}
