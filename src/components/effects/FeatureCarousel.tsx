/**
 * FeatureCarousel — "Practice Inspection Console".
 *
 * Engineering-blueprint reinterpretation of the seven-practice rotator:
 *   • Left rail = drafting index (07 indexed entries, hairline dividers,
 *     active row gets a cyan plate + leader-line pointing right at the plate).
 *   • Right pane = inspection plate. Bone-paper card, cyan hairline border,
 *     corner registration crosshairs at all four corners, top dimension
 *     callout, vertical rotated label on the right rail, drafting title-block
 *     bottom-right with SCALE / DATE / SECTION / SPEC, and a scan-line that
 *     sweeps once each time the specimen advances.
 *
 * Auto-rotates every 4 s, pauses on hover. Sharp rectangles only — no
 * rounded "card" silhouettes — so the unit reads as a drafting sheet and
 * stays consistent with FlowSection and TrustedBySection.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Users,
  Server,
  Scale,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const ACCENT = '#1e9df1';
const INK = '#0B1426';
const PAPER = '#FBFDFF';
const AUTO_PLAY_INTERVAL = 4000;

interface Feature {
  id: string;
  label: string;
  icon: LucideIcon;
  image: string;
  description: string;
  tags: string[];
}

const FEATURES: Feature[] = [
  {
    id: 'cyber',
    label: 'Cybersecurity',
    icon: Shield,
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&auto=format&fit=crop',
    description: 'Board-ready security reports. Vendor questionnaires answered same-day.',
    tags: ['ISO/IEC 27001', 'Pen-tested', 'Board-grade'],
  },
  {
    id: 'comply',
    label: 'Compliance & RegTech',
    icon: ShieldCheck,
    image:
      'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&q=85&auto=format&fit=crop',
    description: 'DPDP gaps mapped, fixed under counsel, evidence-packed for audit.',
    tags: ['DPDP-aligned', 'Counsel-signed', 'Audit-ready'],
  },
  {
    id: 'hr',
    label: 'HR & Staffing',
    icon: Users,
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&auto=format&fit=crop',
    description: 'Calibrated shortlists. Hires who perform in 90 days.',
    tags: ['Outcome-calibrated', 'Role-fit', 'Defensible'],
  },
  {
    id: 'it',
    label: 'IT Consulting',
    icon: Server,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop',
    description: 'IT as managed service — runbooks, SLAs, audit trails from day one.',
    tags: ['SLAs', 'Runbooks', 'Audit trails'],
  },
  {
    id: 'legal',
    label: 'Legal Consulting',
    icon: Scale,
    image:
      'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1200&q=85&auto=format&fit=crop',
    description: 'Counsel who reads the architecture, not just the agreement.',
    tags: ['Tech-fluent', 'Retainer', 'Embedded'],
  },
  {
    id: 'saas',
    label: 'SaaS Products',
    icon: Cpu,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=85&auto=format&fit=crop',
    description: 'Encrypted, audit-logged software your team will use.',
    tags: ['Encrypted', 'Audit-logged', 'Modular'],
  },
  {
    id: 'train',
    label: 'Corporate Training',
    icon: GraduationCap,
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=85&auto=format&fit=crop',
    description: 'Designed against role outcomes. Measured against the job.',
    tags: ['Outcome-calibrated', 'Kirkpatrick L3+L4', 'LMS-ready'],
  },
];

const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
})();

export default function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  const currentIndex = ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;
  const active = FEATURES[currentIndex];
  const ActiveIcon = active.icon;
  const sheetNo = String(currentIndex + 1).padStart(2, '0');
  const totalNo = String(FEATURES.length).padStart(2, '0');

  const nextStep = useCallback(() => setStep((p) => p + 1), []);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [nextStep, isPaused]);

  const goTo = (i: number) => {
    const diff = (i - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff !== 0) setStep((s) => s + diff);
  };

  // CAD cursor + parallax tilt — track mouse over image plate.
  const mx = useMotionValue(-1);
  const my = useMotionValue(-1);
  const [plateHover, setPlateHover] = useState(false);
  const [plateSize, setPlateSize] = useState({ w: 0, h: 0 });

  const tiltX = useSpring(useTransform(my, [0, plateSize.h || 1], [2.5, -2.5]), {
    stiffness: 140,
    damping: 18,
    mass: 0.5,
  });
  const tiltY = useSpring(useTransform(mx, [0, plateSize.w || 1], [-2.5, 2.5]), {
    stiffness: 140,
    damping: 18,
    mass: 0.5,
  });

  const onPlateMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
    if (rect.width !== plateSize.w || rect.height !== plateSize.h) {
      setPlateSize({ w: rect.width, h: rect.height });
    }
  };
  const onPlateEnter = () => setPlateHover(true);
  const onPlateLeave = () => {
    setPlateHover(false);
    mx.set(-1);
    my.set(-1);
  };

  const xPct = useTransform(mx, (v) => (plateSize.w ? Math.round((v / plateSize.w) * 1000) / 10 : 0));
  const yPct = useTransform(my, (v) => (plateSize.h ? Math.round((v / plateSize.h) * 1000) / 10 : 0));
  const [xPctVal, setXPctVal] = useState(0);
  const [yPctVal, setYPctVal] = useState(0);
  useEffect(() => {
    const u1 = xPct.on('change', (v) => setXPctVal(v));
    const u2 = yPct.on('change', (v) => setYPctVal(v));
    return () => { u1(); u2(); };
  }, [xPct, yPct]);

  // Title character splitter for kinetic reveal.
  const titleChars = useMemo(() => active.label.split(''), [active.label]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-7xl mx-auto"
      style={{ color: INK }}
      data-section-color="dark"
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0"
        style={{
          border: `1px solid ${ACCENT}33`,
          background: PAPER,
        }}
      >
        {/* ─────────────────────────────────────────── Left: Drafting index */}
        <aside
          className="relative flex flex-col"
          style={{
            borderRight: `1px dashed ${ACCENT}44`,
            background: `linear-gradient(180deg, rgba(30,157,241,0.04), rgba(30,157,241,0.00))`,
          }}
        >
          {/* Index header */}
          <div
            className="px-5 py-4 flex items-center gap-2 font-mono text-[9.5px] tracking-[0.26em] uppercase"
            style={{
              color: `${ACCENT}DD`,
              borderBottom: `1px solid ${ACCENT}33`,
            }}
          >
            <span className="w-3 h-px" style={{ background: ACCENT }} />
            <span>Index · Practices</span>
            <span className="flex-1 h-px" style={{ background: `${ACCENT}33` }} />
            <span style={{ color: ACCENT }}>
              {sheetNo} / {totalNo}
            </span>
          </div>

          {/* Index rows */}
          <ul className="flex-1 flex flex-col">
            {FEATURES.map((f, i) => {
              const isActive = i === currentIndex;
              const num = String(i + 1).padStart(2, '0');
              const Icon = f.icon;
              return (
                <li
                  key={f.id}
                  style={
                    i < FEATURES.length - 1
                      ? { borderBottom: `1px dashed ${ACCENT}22` }
                      : undefined
                  }
                >
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-300 group/idx',
                      isActive ? 'bg-[rgba(30,157,241,0.10)]' : 'hover:bg-[rgba(30,157,241,0.04)]',
                    )}
                    style={{
                      borderLeft: `2px solid ${isActive ? ACCENT : 'transparent'}`,
                    }}
                  >
                    {/* Index number */}
                    <span
                      className="font-mono text-[10px] tracking-[0.22em] tabular-nums"
                      style={{ color: isActive ? ACCENT : `${ACCENT}99` }}
                    >
                      {num}
                    </span>

                    {/* Hairline tick */}
                    <span
                      className="w-2.5 h-px transition-all"
                      style={{
                        background: isActive ? ACCENT : `${ACCENT}55`,
                        width: isActive ? 18 : 10,
                      }}
                    />

                    {/* Icon */}
                    <Icon
                      size={14}
                      strokeWidth={1.6}
                      style={{ color: isActive ? ACCENT : `${ACCENT}99` }}
                      className="flex-shrink-0"
                    />

                    {/* Label */}
                    <span
                      className="font-display text-[14px] tracking-[-0.005em] flex-1 transition-colors"
                      style={{
                        color: isActive ? INK : 'rgba(11,20,38,0.62)',
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      {f.label}
                    </span>

                    {/* Leader-line pointer on active row (visible only ≥lg)
                        — adds a sonar ping on switch + a countdown arc that
                        ticks down with the auto-rotate timer. */}
                    {isActive && (
                      <motion.span
                        layoutId="idx-leader"
                        aria-hidden="true"
                        className="absolute right-[-1px] top-1/2 -translate-y-1/2 hidden lg:flex items-center"
                      >
                        <span
                          className="block h-px"
                          style={{ width: 22, background: ACCENT }}
                        />
                        <span className="relative inline-flex items-center justify-center w-4 h-4">
                          {/* Sonar ping — single-shot expanding ring on activate */}
                          <motion.span
                            key={`ping-${active.id}`}
                            initial={{ scale: 0.4, opacity: 0.9 }}
                            animate={{ scale: 2.6, opacity: 0 }}
                            transition={{ duration: 1.1, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full"
                            style={{ border: `1px solid ${ACCENT}`, pointerEvents: 'none' }}
                          />
                          {/* Countdown arc — restarts every interval */}
                          {!isPaused && (
                            <svg
                              key={`arc-${active.id}-${step}`}
                              className="absolute inset-0 -rotate-90"
                              viewBox="0 0 24 24"
                              width={16}
                              height={16}
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke={`${ACCENT}33`}
                                strokeWidth="1.5"
                              />
                              <motion.circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                stroke={ACCENT}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 10}
                                initial={{ strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 10 }}
                                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                              />
                            </svg>
                          )}
                          {/* Core dot */}
                          <span
                            className="relative block w-1.5 h-1.5 rounded-full"
                            style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
                          />
                        </span>
                      </motion.span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer caption */}
          <div
            className="px-5 py-3 font-mono text-[8.5px] tracking-[0.24em] uppercase"
            style={{
              color: `${ACCENT}99`,
              borderTop: `1px solid ${ACCENT}33`,
            }}
          >
            ◇ Auto-rotate · {AUTO_PLAY_INTERVAL / 1000}s · hover to pause
          </div>
        </aside>

        {/* ─────────────────────────────────────────── Right: Inspection plate */}
        <div className="relative" style={{ minHeight: 520 }}>
          {/* Background grid */}
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(${ACCENT}1A 1px, transparent 1px),
                linear-gradient(90deg, ${ACCENT}1A 1px, transparent 1px),
                linear-gradient(${ACCENT}33 1px, transparent 1px),
                linear-gradient(90deg, ${ACCENT}33 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px, 36px 36px, 180px 180px, 180px 180px',
            }}
          />

          {/* Corner registration crosshairs */}
          {(
            [
              { key: 'tl', top: 10, left: 10 },
              { key: 'tr', top: 10, right: 10 },
              { key: 'bl', bottom: 10, left: 10 },
              { key: 'br', bottom: 10, right: 10 },
            ] as ReadonlyArray<{
              key: string;
              top?: number;
              right?: number;
              bottom?: number;
              left?: number;
            }>
          ).map((m) => (
            <span
              key={m.key}
              aria-hidden="true"
              className="absolute pointer-events-none z-[5]"
              style={{
                width: 14,
                height: 14,
                top: m.top,
                left: m.left,
                right: m.right,
                bottom: m.bottom,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  height: 1,
                  background: `${ACCENT}AA`,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: 1,
                  background: `${ACCENT}AA`,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 3,
                  borderRadius: '50%',
                  border: `1px solid ${ACCENT}AA`,
                }}
              />
            </span>
          ))}

          {/* Top dimension callout */}
          <div
            aria-hidden="true"
            className="absolute top-3 left-12 right-12 flex items-center pointer-events-none z-[4]"
          >
            <span
              className="font-mono text-[8.5px] tracking-[0.24em] uppercase"
              style={{ color: `${ACCENT}DD` }}
            >
              ◀
            </span>
            <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
            <span
              className="px-2 font-mono text-[9px] tracking-[0.26em] uppercase"
              style={{ color: `${ACCENT}DD` }}
            >
              SPEC {sheetNo} / {totalNo} · {active.label}
            </span>
            <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
            <span
              className="font-mono text-[8.5px] tracking-[0.24em] uppercase"
              style={{ color: `${ACCENT}DD` }}
            >
              ▶
            </span>
          </div>

          {/* Vertical rotated label on right edge */}
          <div
            aria-hidden="true"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 origin-center -rotate-90 items-center gap-3 pointer-events-none z-[4]"
          >
            <span className="block w-6 h-px" style={{ background: `${ACCENT}66` }} />
            <span
              className="font-mono text-[9px] tracking-[0.32em] uppercase whitespace-nowrap"
              style={{ color: `${ACCENT}DD` }}
            >
              ON INSPECTION
            </span>
            <span className="block w-6 h-px" style={{ background: `${ACCENT}66` }} />
          </div>

          {/* Wireframe section numeral */}
          <span
            aria-hidden="true"
            className="absolute -right-2 -bottom-3 font-display leading-none pointer-events-none select-none z-[1]"
            style={{
              fontSize: 'clamp(7rem, 16vw, 16rem)',
              color: 'transparent',
              WebkitTextStroke: `1.2px ${ACCENT}26`,
              letterSpacing: '-0.05em',
            }}
          >
            {sheetNo}
          </span>

          {/* Inspection content stack */}
          <div className="relative z-[3] flex flex-col h-full px-8 md:px-12 lg:px-14 pt-14 pb-10 gap-6">
            {/* Image plate — parallax tilt on mouse, CAD crosshair cursor */}
            <motion.div
              ref={plateRef}
              onMouseEnter={onPlateEnter}
              onMouseLeave={onPlateLeave}
              onMouseMove={onPlateMove}
              className="relative w-full overflow-hidden cursor-none"
              style={{
                aspectRatio: '16 / 9',
                border: `1px solid ${ACCENT}55`,
                boxShadow: '0 14px 40px -24px rgba(11,20,38,0.35)',
                rotateX: tiltX,
                rotateY: tiltY,
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt={active.label}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.08, filter: 'grayscale(1)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'grayscale(0)' }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Cyan grading overlay */}
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(140deg, rgba(30,157,241,0.18) 0%, rgba(11,20,38,0.10) 60%, rgba(11,20,38,0.45) 100%)`,
                  mixBlendMode: 'multiply',
                }}
              />

              {/* Hairline frame inside the image */}
              <span
                aria-hidden="true"
                className="absolute inset-2 pointer-events-none"
                style={{ border: `1px dashed rgba(251,253,255,0.35)` }}
              />

              {/* Scan-line — sweeps once per active change */}
              <motion.span
                key={`scan-${active.id}`}
                aria-hidden="true"
                initial={{ left: '-2%', opacity: 0 }}
                animate={{ left: '102%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.25, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 pointer-events-none"
                style={{
                  width: 2,
                  background: `linear-gradient(180deg, transparent, ${ACCENT} 30%, ${ACCENT} 70%, transparent)`,
                  boxShadow: `0 0 18px ${ACCENT}`,
                }}
              />

              {/* Top-left LIVE badge */}
              <div
                data-section-color="dark"
                className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 pointer-events-none"
                style={{
                  background: 'rgba(11,20,38,0.65)',
                  border: `1px solid ${ACCENT}66`,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span className="relative inline-flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full opacity-75 animate-ping" style={{ background: ACCENT }} />
                  <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                </span>
                <span
                  className="font-mono text-[9px] tracking-[0.28em] uppercase"
                  style={{ color: PAPER }}
                >
                  Live · 24 fps
                </span>
              </div>

              {/* Bottom-left index stamp on image */}
              <div
                data-section-color="dark"
                className="absolute bottom-3 left-3 px-2 py-1 pointer-events-none"
                style={{
                  background: 'rgba(11,20,38,0.72)',
                  border: `1px solid ${ACCENT}66`,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span
                  className="font-mono text-[9px] tracking-[0.28em] uppercase"
                  style={{ color: PAPER }}
                >
                  № {sheetNo} · {active.label}
                </span>
              </div>

              {/* Ambient telemetry — top-right + bottom-right micro readouts */}
              <div
                data-section-color="dark"
                aria-hidden="true"
                className="absolute top-3 right-3 flex flex-col items-end gap-1 pointer-events-none font-mono text-[8.5px] tracking-[0.24em] uppercase"
                style={{ color: `${PAPER}DD` }}
              >
                <span className="px-1.5 py-0.5" style={{ background: 'rgba(11,20,38,0.55)', border: `1px solid ${ACCENT}55` }}>
                  RES · 4K
                </span>
                <span className="px-1.5 py-0.5" style={{ background: 'rgba(11,20,38,0.55)', border: `1px solid ${ACCENT}55` }}>
                  GAIN · 1:1
                </span>
              </div>
              <div
                data-section-color="dark"
                aria-hidden="true"
                className="absolute bottom-3 right-3 px-1.5 py-0.5 pointer-events-none font-mono text-[8.5px] tracking-[0.24em] uppercase"
                style={{
                  color: `${PAPER}DD`,
                  background: 'rgba(11,20,38,0.55)',
                  border: `1px solid ${ACCENT}55`,
                }}
              >
                FPS · 24 · OK
              </div>

              {/* CAD crosshair cursor — vertical + horizontal lines through pointer,
                  plus a centered cyan dot and X/Y dimension readouts */}
              {plateHover && (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 pointer-events-none z-[6]"
                    style={{
                      width: 1,
                      x: mx,
                      background: `linear-gradient(180deg, transparent, ${ACCENT}DD 20%, ${ACCENT}DD 80%, transparent)`,
                      boxShadow: `0 0 6px ${ACCENT}`,
                    }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-0 right-0 pointer-events-none z-[6]"
                    style={{
                      height: 1,
                      y: my,
                      background: `linear-gradient(90deg, transparent, ${ACCENT}DD 20%, ${ACCENT}DD 80%, transparent)`,
                      boxShadow: `0 0 6px ${ACCENT}`,
                    }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute pointer-events-none z-[7] rounded-full"
                    style={{
                      x: mx,
                      y: my,
                      width: 8,
                      height: 8,
                      marginLeft: -4,
                      marginTop: -4,
                      background: ACCENT,
                      boxShadow: `0 0 10px ${ACCENT}, 0 0 22px ${ACCENT}AA`,
                    }}
                  />
                  <motion.span
                    aria-hidden="true"
                    data-section-color="dark"
                    className="absolute pointer-events-none z-[7] font-mono text-[9px] tracking-[0.18em] uppercase px-1.5 py-0.5"
                    style={{
                      x: mx,
                      y: my,
                      marginLeft: 12,
                      marginTop: 12,
                      background: 'rgba(11,20,38,0.78)',
                      border: `1px solid ${ACCENT}88`,
                      color: PAPER,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    X {xPctVal.toFixed(1)} · Y {yPctVal.toFixed(1)}
                  </motion.span>
                </>
              )}
            </motion.div>

            {/* Specimen header — icon + title */}
            <div className="flex items-center gap-4">
              <span
                className="flex items-center justify-center w-12 h-12 flex-shrink-0"
                style={{
                  border: `1px solid ${ACCENT}66`,
                  background: 'rgba(30,157,241,0.06)',
                }}
              >
                <ActiveIcon size={20} strokeWidth={1.6} style={{ color: ACCENT }} />
              </span>
              <AnimatePresence mode="popLayout">
                <motion.h3
                  key={active.id + '-title'}
                  className="font-display text-[clamp(22px,2.8vw,34px)] leading-[1.1] tracking-[-0.015em] flex flex-wrap"
                  style={{ color: INK, fontWeight: 400 }}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{
                    show: { transition: { staggerChildren: 0.025 } },
                    exit: { transition: { staggerChildren: 0.012, staggerDirection: -1 } },
                  }}
                >
                  {titleChars.map((c, i) => (
                    <motion.span
                      key={`${active.id}-${i}`}
                      className="inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 14, rotateX: -45 },
                        show: { opacity: 1, y: 0, rotateX: 0 },
                        exit: { opacity: 0, y: -10, rotateX: 30 },
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                    >
                      {c === ' ' ? ' ' : c}
                    </motion.span>
                  ))}
                  <motion.span
                    aria-hidden="true"
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 },
                      exit: { opacity: 0 },
                    }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    style={{ color: ACCENT }}
                  >
                    .
                  </motion.span>
                </motion.h3>
              </AnimatePresence>
            </div>

            {/* Description */}
            <AnimatePresence mode="popLayout">
              <motion.p
                key={active.id + '-desc'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="text-[15px] leading-[1.7] max-w-[58ch]"
                style={{ color: 'rgba(11,20,38,0.78)' }}
              >
                {active.description}
              </motion.p>
            </AnimatePresence>

            {/* Tag chips */}
            <AnimatePresence mode="popLayout">
              <motion.ul
                key={active.id + '-tags'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-wrap gap-2"
              >
                {active.tags.map((t, i) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{
                      color: `${ACCENT}DD`,
                      background: 'rgba(30,157,241,0.06)',
                      border: `1px solid ${ACCENT}55`,
                    }}
                  >
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: ACCENT, fontSize: 9 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="w-2 h-px" style={{ background: `${ACCENT}55` }} />
                    {t}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>

            {/* Drafting title-block — bottom row */}
            <div
              className="mt-auto pt-5 grid grid-cols-4 font-mono text-[9.5px] tracking-[0.18em] uppercase leading-[1.55]"
              style={{
                color: `${ACCENT}DD`,
                borderTop: `1px solid ${ACCENT}33`,
              }}
            >
              <div>
                <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>Scale</div>
                <div className="font-bold" style={{ color: INK }}>
                  1 : 1
                </div>
              </div>
              <div>
                <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>Date</div>
                <div className="font-bold" style={{ color: INK }}>
                  {today}
                </div>
              </div>
              <div>
                <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>
                  Section · {sheetNo} / {totalNo}
                </div>
                <div
                  className="font-bold"
                  style={{ color: ACCENT, letterSpacing: '0.14em' }}
                >
                  {active.label}
                </div>
              </div>
              <div className="flex items-end justify-end gap-1">
                {FEATURES.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="block h-1 transition-all"
                    style={{
                      width: i === currentIndex ? 18 : 6,
                      background: i === currentIndex ? ACCENT : `${ACCENT}44`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
