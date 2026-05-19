/**
 * Spotlight — wraps a card. Pointer position sets --mx/--my CSS vars on element,
 * letting `.spotlight-card::before` radial highlight track cursor on hover.
 */
import { useRef, type ReactNode } from 'react';

export default function Spotlight({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const disabled = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    if (rafRef.current) return;
    const el = ref.current;
    if (!el) return;
    const clientX = e.clientX, clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((clientY - r.top) / r.height) * 100}%`);
    });
  }

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}
