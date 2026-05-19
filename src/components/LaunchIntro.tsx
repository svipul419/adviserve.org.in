/**
 * LaunchIntro — plotter initialization splash.
 *
 * Bone-white blueprint paper. Centered Adviserve logo. Four corner brackets
 * draw in. A horizontal hairline sweeps top→bottom once. A bottom progress
 * meter advances 0 → 100% over the splash duration with a live percent + mono
 * status text. Skip button always available. Total ~2.6s, hard cap 3.4s.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const PAPER  = '#FBFDFF';
const STROKE = '#1e9df1';

const DURATION_MS = 2600;

export default function LaunchIntro({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);

  const finish = (e?: React.MouseEvent | React.SyntheticEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setExiting(true);
    (window as unknown as Record<string, unknown>).__adviserveIntroDone = true;
    window.dispatchEvent(new Event('adviserve:intro-done'));
    setTimeout(onDone, 420);
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { finish(); return; }

    // Progress ticker — drives the live percentage display.
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const auto = setTimeout(finish, DURATION_MS);
    const cap = setTimeout(finish, 3400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(auto);
      clearTimeout(cap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Adviserve"
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        backgroundColor: PAPER,
        opacity: exiting ? 0 : 1,
        transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity',
        pointerEvents: exiting ? 'none' : 'auto',
        padding: 'clamp(4px, 0.55vw, 8px)',
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center"
        style={{
          borderRadius: 'clamp(20px, 2.2vw, 36px)',
          background: PAPER,
          boxShadow: '0 24px 60px -32px rgba(11,20,38,0.18)',
        }}
      >
        {/* Hairline blueprint grid */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            backgroundImage: `
              linear-gradient(${STROKE}1F 1px, transparent 1px),
              linear-gradient(90deg, ${STROKE}1F 1px, transparent 1px),
              linear-gradient(${STROKE}33 1px, transparent 1px),
              linear-gradient(90deg, ${STROKE}33 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px, 36px 36px, 180px 180px, 180px 180px',
          }}
        />

        {/* Sweeping scan line — top → bottom over 1.8s. CSS-only so it never
            blocks the main thread. */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${STROKE}AA 25%, ${STROKE}EE 50%, ${STROKE}AA 75%, transparent)`,
            boxShadow: `0 0 12px ${STROKE}88`,
            animation: 'launch-scan 1.8s ease-in-out forwards',
            top: 0,
          }}
        />

        {/* Corner brackets that draw in */}
        {([
          { key: 'tl', top: 18,    left: 18,    br: '2px 0 0 2px' },
          { key: 'tr', top: 18,    right: 18,   br: '2px 2px 0 0' },
          { key: 'bl', bottom: 18, left: 18,    br: '0 0 2px 2px' },
          { key: 'br', bottom: 18, right: 18,   br: '0 2px 2px 0' },
        ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number; br: string }>).map((m, i) => (
          <motion.span
            key={m.key}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none"
            style={{
              top: m.top,
              left: m.left,
              right: m.right,
              bottom: m.bottom,
              width: 22,
              height: 22,
              borderStyle: 'solid',
              borderColor: STROKE,
              borderWidth: m.br,
            }}
          />
        ))}

        {/* Logo — center, soft breathing pulse */}
        <motion.img
          src="/adviserve-logo.svg"
          alt="Adviserve"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: [1, 1.025, 1] }}
          transition={{
            opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' },
          }}
          className="relative z-10 select-none pointer-events-none"
          style={{ width: 'clamp(140px, 18vw, 260px)', height: 'auto' }}
        />

        {/* Bottom progress meter — bumped to a customer-visible width and
            type-scale so the loading state actually reads from across a room. */}
        <div
          className="absolute bottom-14 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-stretch"
          style={{ width: 'min(560px, 78vw)' }}
        >
          <div className="flex items-baseline justify-between font-mono uppercase mb-3" style={{ color: `${STROKE}EE` }}>
            <span className="text-[15px] sm:text-[17px] tracking-[0.32em] font-bold">Initializing</span>
            <span className="text-[28px] sm:text-[34px] tracking-[0.04em] tabular-nums font-bold leading-none">
              {String(pct).padStart(3, '0')}<span className="text-[18px] sm:text-[22px] ml-1 opacity-80">%</span>
            </span>
          </div>
          <div
            className="relative overflow-hidden rounded-full"
            style={{ background: `${STROKE}24`, height: 6 }}
          >
            <span
              className="absolute top-0 bottom-0 left-0 rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${STROKE} 0%, #00D4FF 50%, ${STROKE} 100%)`,
                boxShadow: `0 0 14px ${STROKE}99`,
                transition: 'width 60ms linear',
              }}
            />
          </div>
          <div className="flex items-baseline justify-between font-mono text-[11px] sm:text-[12px] tracking-[0.24em] uppercase mt-3" style={{ color: `${STROKE}BB` }}>
            <span>Cover Sheet · 00 / 07</span>
            <span>Rev A · 2026</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => finish(e)}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="absolute bottom-10 right-10 sm:bottom-12 sm:right-12 px-5 py-2.5 rounded-full text-[12px] tracking-[0.18em] uppercase font-mono transition-all hover:-translate-y-0.5"
        style={{
          background: STROKE,
          color: '#FFFFFF',
          zIndex: 10001,
          boxShadow: '0 12px 28px -10px rgba(30,157,241,0.55)',
        }}
        aria-label="Skip intro"
      >
        Skip →
      </button>

      <style>{`
        @keyframes launch-scan {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

LaunchIntro.alreadySeen = (): boolean => false;
