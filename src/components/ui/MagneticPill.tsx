/**
 * MagneticPill — wraps a pill-style button with cursor-follow magnetic motion.
 *
 * Drop in around any `<Link>` / `<a>` / `<button>` to add the Infosys-style
 * cursor-tracked translation on hover. Respects prefers-reduced-motion.
 *
 * Usage:
 *   <MagneticPill>
 *     <Link to="/x" className="...pill styles...">Label</Link>
 *   </MagneticPill>
 *
 * The wrapper renders an `inline-block` so adjacent flex/grid layouts continue
 * to align the way the unwrapped child would. The translation is applied to a
 * child <span> so the outer element does not break flex/gap math.
 */
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface MagneticPillProps {
  children: ReactNode;
  /** Multiplier for cursor offset → translation. 0.18 = soft, 0.32 = strong. */
  strength?: number;
  className?: string;
}

export default function MagneticPill({ children, strength = 0.22, className = '' }: MagneticPillProps) {
  const inner = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (prefersReducedMotion) return;
    const el = inner.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength * 1.15}px)`;
  }
  function onLeave() {
    const el = inner.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }

  return (
    <span
      className={`inline-block ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span
        ref={inner}
        className="inline-block transition-transform duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
      >
        {children}
      </span>
    </span>
  );
}
