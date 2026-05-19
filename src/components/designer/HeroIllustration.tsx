import { useEffect, useRef } from 'react';
import anime from 'animejs';
import gsap from 'gsap';

const motionOff = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = () => window.matchMedia('(hover: hover)').matches;

export default function HeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Blob morph + orbit dot
  useEffect(() => {
    if (motionOff()) return;
    const el = containerRef.current;
    if (!el) return;

    const blob1 = el.querySelector<SVGCircleElement>('#hero-blob-1');
    const blob2 = el.querySelector<SVGCircleElement>('#hero-blob-2');
    const dot = el.querySelector<SVGCircleElement>('#hero-orbit-dot');
    const orbitPath = el.querySelector<SVGPathElement>('#orbit-path');

    // Blob morph via GSAP
    if (blob1) {
      gsap.to(blob1, { attr: { cx: 200, cy: 180 }, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
    if (blob2) {
      gsap.to(blob2, { attr: { cx: 120, cy: 80 }, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    // Orbit dot via anime.js path following
    if (dot && orbitPath) {
      const path = anime.path('#orbit-path');
      anime({
        targets: dot,
        translateX: path('x'),
        translateY: path('y'),
        easing: 'linear',
        duration: 12000,
        loop: true,
      });
    }

    return () => {
      gsap.killTweensOf(blob1);
      gsap.killTweensOf(blob2);
      anime.remove(dot);
    };
  }, []);

  // Cursor-follow spotlight (ref-based, no React re-renders)
  useEffect(() => {
    if (motionOff() || !canHover()) return;
    const el = containerRef.current;
    const spot = spotRef.current;
    if (!el || !spot) return;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spot.style.transform = `translate(${x - 100}px, ${y - 100}px)`;
        spot.style.opacity = '1';
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(rafRef.current);
      spot.style.opacity = '0';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-photo rounded-2xl overflow-hidden relative"
      style={{ aspectRatio: '5/6' }}
    >
      {/* Base gradient fallback */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 20% 10%, #7F1D1D 0%, #3A64B0 50%, #0A0E1A 100%)' }}
      />

      {/* Morphing blobs + orbit */}
      <svg viewBox="0 0 400 480" className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ opacity: 0.7 }}>
        <defs>
          <radialGradient id="hblob1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7F1D1D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3A64B0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hblob2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3A64B0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle id="hero-blob-1" cx="120" cy="120" r="140" fill="url(#hblob1)" />
        <circle id="hero-blob-2" cx="280" cy="360" r="120" fill="url(#hblob2)" />
        <ellipse cx="200" cy="240" rx="160" ry="200" fill="none" stroke="none">
          <path id="orbit-path" d="M200,40 A160,200 0 1,1 199.99,40" fill="none" stroke="none" />
        </ellipse>
        <circle id="hero-orbit-dot" cx="0" cy="0" r="3" fill="#7F1D1D" opacity="0.8" />
      </svg>

      {/* Cursor-follow spotlight (hover-capable devices only) */}
      <div
        ref={spotRef}
        className="absolute w-[200px] h-[200px] rounded-full pointer-events-none transition-opacity duration-150"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
          mixBlendMode: 'overlay',
          opacity: 0,
        }}
      />
    </div>
  );
}
