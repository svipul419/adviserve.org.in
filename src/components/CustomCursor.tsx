/**
 * CustomCursor — multicolor cursor system:
 *   1. Tiny dot (1:1 pointer position, magenta)
 *   2. Outer ring (lerp-follow, white blur)
 *   3. Color trail (3 lagging dots — blue, azure, magenta)
 *   4. Expand on interactive (a, button, .magnetic) with blue→magenta gradient ring
 *
 * Touch + reduced-motion guards. RAF-driven. Native cursor preserved for a11y.
 */
import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, .magnetic, .cursor-hover';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const t1 = useRef({ x: 0, y: 0 });
  const t2 = useRef({ x: 0, y: 0 });
  const t3 = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const tr1 = t1Ref.current;
    const tr2 = t2Ref.current;
    const tr3 = t3Ref.current;
    if (!dot || !ring || !tr1 || !tr2 || !tr3) return;

    let raf = 0;
    let paused = document.hidden;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // dot snaps 1:1
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      if (paused) return;
      // ring lerps fastest
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ring.dataset.scale ?? '1'})`;

      // staggered trail dots lag more
      t1.current.x += (pos.current.x - t1.current.x) * 0.13;
      t1.current.y += (pos.current.y - t1.current.y) * 0.13;
      tr1.style.transform = `translate3d(${t1.current.x}px, ${t1.current.y}px, 0) translate(-50%, -50%)`;

      t2.current.x += (pos.current.x - t2.current.x) * 0.09;
      t2.current.y += (pos.current.y - t2.current.y) * 0.09;
      tr2.style.transform = `translate3d(${t2.current.x}px, ${t2.current.y}px, 0) translate(-50%, -50%)`;

      t3.current.x += (pos.current.x - t3.current.x) * 0.06;
      t3.current.y += (pos.current.y - t3.current.y) * 0.06;
      tr3.style.transform = `translate3d(${t3.current.x}px, ${t3.current.y}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };

    const expand = () => {
      ring.dataset.scale = '2';
      ring.style.borderColor = 'transparent';
      ring.style.background = 'radial-gradient(circle, rgba(33,150,243,0.06) 0%, rgba(217,70,166,0.10) 70%, transparent 100%)';
      ring.style.boxShadow = '0 0 0 1.5px rgba(217,70,166,0.55), 0 8px 24px rgba(33,150,243,0.18)';
    };
    const shrink = () => {
      ring.dataset.scale = '1';
      ring.style.borderColor = 'rgba(11,20,38,0.45)';
      ring.style.background = 'transparent';
      ring.style.boxShadow = 'none';
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE_SELECTOR)) expand();
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE_SELECTOR)) shrink();
    };
    const onVis = () => {
      paused = document.hidden;
      if (!paused) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Trail: outermost magenta, mid azure, inner blue. Mix-blend-mode: difference keeps them visible on dark + light */}
      <div
        ref={t3Ref}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9996] w-3 h-3 rounded-full pointer-events-none"
        style={{ background: '#D946A6', opacity: 0.22, filter: 'blur(3px)', willChange: 'transform' }}
      />
      <div
        ref={t2Ref}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9997] w-2.5 h-2.5 rounded-full pointer-events-none"
        style={{ background: '#00D4FF', opacity: 0.35, filter: 'blur(2px)', willChange: 'transform' }}
      />
      <div
        ref={t1Ref}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] w-2 h-2 rounded-full pointer-events-none"
        style={{ background: '#2196F3', opacity: 0.5, willChange: 'transform' }}
      />
      {/* Outer ring — mix-blend-difference makes it visible on both light + dark sections */}
      <div
        ref={ringRef}
        aria-hidden="true"
        data-scale="1"
        className="fixed top-0 left-0 z-[9999] w-9 h-9 rounded-full pointer-events-none"
        style={{
          border: '1.5px solid rgba(255,255,255,0.85)',
          mixBlendMode: 'difference',
          transition: 'border-color 200ms, box-shadow 220ms, background 220ms',
          willChange: 'transform',
        }}
      />
      {/* Dot — snaps to pointer */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[10000] w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{ background: '#D946A6', boxShadow: '0 0 8px rgba(217,70,166,0.65)', willChange: 'transform' }}
      />
    </>
  );
}
