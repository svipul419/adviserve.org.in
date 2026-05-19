/**
 * InsightCarousel — single-card highlight rotator for Research/Insights.
 *
 * Adapted from the user-supplied TestimonialCarousel pattern:
 *   • Square image plate on the left (engineering frame with cyan border +
 *     corner registration crosshairs).
 *   • Card on the right overlapping the image's right edge with a -80px shift,
 *     elevated by drop-shadow. Holds tag pill, title, date, and a primary CTA.
 *   • Prev / Next + dot pagination at the bottom.
 *
 * For items without an `image`, the Adviserve logo renders on a drafting
 * bone-paper plate with the cyan grid, registration crosshairs, and a top
 * dimension callout — same vocabulary as the rest of the site.
 *
 * Tailwind + react-router-dom + framer-motion. No next/image, no next/link.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const ACCENT = '#1e9df1';
const INK = '#0B1426';
const PAPER = '#FBFDFF';
const FALLBACK_LOGO = '/adviserve-logo.svg';

export interface InsightItem {
  tag: string;
  title: string;
  date?: string;
  href: string;
  image?: string;
  body?: string;
}

export interface InsightCarouselProps {
  items: InsightItem[];
  className?: string;
}

export default function InsightCarousel({ items, className }: InsightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = items[currentIndex] ?? items[0];

  const handleNext = () =>
    setCurrentIndex((i) => (i + 1) % items.length);
  const handlePrevious = () =>
    setCurrentIndex((i) => (i - 1 + items.length) % items.length);

  const hasImage = Boolean(current.image);
  const sheetNo = String(currentIndex + 1).padStart(2, '0');
  const totalNo = String(items.length).padStart(2, '0');

  return (
    <div className={cn('w-full max-w-6xl mx-auto px-4', className)}>
      {/* ────────────────────────────────────── Desktop layout */}
      <div className="hidden md:flex relative items-center">
        {/* Image / logo plate */}
        <div
          className="relative w-[470px] h-[470px] overflow-hidden flex-shrink-0"
          style={{
            border: `1px solid ${ACCENT}55`,
            background: PAPER,
          }}
        >
          {/* Corner registration crosshairs on the plate */}
          {(
            [
              { key: 'tl', top: 10, left: 10 },
              { key: 'tr', top: 10, right: 10 },
              { key: 'bl', bottom: 10, left: 10 },
              { key: 'br', bottom: 10, right: 10 },
            ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number }>
          ).map((m) => (
            <span
              key={m.key}
              aria-hidden="true"
              className="absolute pointer-events-none z-[3]"
              style={{ width: 14, height: 14, top: m.top, left: m.left, right: m.right, bottom: m.bottom }}
            >
              <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `${ACCENT}AA` }} />
              <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `${ACCENT}AA` }} />
              <span style={{ position: 'absolute', inset: 3, borderRadius: '50%', border: `1px solid ${ACCENT}AA` }} />
            </span>
          ))}

          {/* Top dimension callout */}
          <div
            aria-hidden="true"
            className="absolute top-3 left-12 right-12 flex items-center pointer-events-none z-[3]"
          >
            <span className="font-mono text-[8.5px] tracking-[0.24em] uppercase" style={{ color: hasImage ? PAPER : `${ACCENT}DD` }}>◀</span>
            <span className="flex-1 mx-2 h-px" style={{ background: hasImage ? 'rgba(251,253,255,0.55)' : `${ACCENT}55` }} />
            <span className="px-2 font-mono text-[9px] tracking-[0.26em] uppercase" style={{ color: hasImage ? PAPER : `${ACCENT}DD` }}>
              SHEET {sheetNo} / {totalNo}
            </span>
            <span className="flex-1 mx-2 h-px" style={{ background: hasImage ? 'rgba(251,253,255,0.55)' : `${ACCENT}55` }} />
            <span className="font-mono text-[8.5px] tracking-[0.24em] uppercase" style={{ color: hasImage ? PAPER : `${ACCENT}DD` }}>▶</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.href}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {hasImage ? (
                <>
                  <img
                    src={current.image}
                    alt={current.title}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(140deg, rgba(11,20,38,0.10) 0%, rgba(11,20,38,0.32) 100%)' }}
                  />
                </>
              ) : (
                <>
                  {/* Cyan blueprint grid */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(${ACCENT}1F 1px, transparent 1px),
                        linear-gradient(90deg, ${ACCENT}1F 1px, transparent 1px),
                        linear-gradient(${ACCENT}33 1px, transparent 1px),
                        linear-gradient(90deg, ${ACCENT}33 1px, transparent 1px)
                      `,
                      backgroundSize: '36px 36px, 36px 36px, 180px 180px, 180px 180px',
                    }}
                  />
                  {/* Adviserve logo centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={FALLBACK_LOGO}
                      alt="Adviserve"
                      draggable={false}
                      className="w-[55%] h-auto object-contain"
                      style={{ filter: 'drop-shadow(0 6px 22px rgba(30,157,241,0.20))' }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlapping copy card */}
        <div
          className="relative ml-[-80px] z-10 max-w-xl flex-1 px-9 py-9"
          style={{
            background: PAPER,
            border: `1px solid ${ACCENT}33`,
            boxShadow: '0 28px 60px -28px rgba(11,20,38,0.32)',
          }}
        >
          {/* Drafting micro-stamp top-right */}
          <span
            aria-hidden="true"
            className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.28em] uppercase"
            style={{ color: `${ACCENT}99` }}
          >
            № {sheetNo}
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Tag pill */}
              <span
                className="inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] uppercase mb-5"
                style={{
                  color: ACCENT,
                  background: 'rgba(30,157,241,0.10)',
                  border: `1px solid ${ACCENT}55`,
                }}
              >
                <span className="w-2 h-px" style={{ background: ACCENT }} />
                {current.tag}
              </span>

              {/* Title */}
              <h2
                className="font-display text-[28px] lg:text-[34px] leading-[1.12] tracking-[-0.015em] mb-5"
                style={{ color: INK, fontWeight: 500 }}
              >
                {current.title}
              </h2>

              {/* Body / date */}
              {current.body && (
                <p
                  className="text-[15px] leading-[1.7] mb-5"
                  style={{ color: 'rgba(11,20,38,0.72)' }}
                >
                  {current.body}
                </p>
              )}

              {current.date && (
                <p
                  className="font-mono text-[10.5px] tracking-[0.22em] uppercase mb-7 flex items-center gap-2"
                  style={{ color: `${ACCENT}DD` }}
                >
                  <span className="w-4 h-px" style={{ background: `${ACCENT}88` }} />
                  {current.date}
                </p>
              )}

              {/* CTA */}
              <Link
                to={current.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.22em] uppercase transition-all duration-200 hover:gap-3"
                style={{
                  color: PAPER,
                  background: INK,
                  border: `1px solid ${INK}`,
                }}
              >
                Read more
                <ArrowUpRight size={14} strokeWidth={2} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ────────────────────────────────────── Mobile layout */}
      <div className="md:hidden max-w-md mx-auto">
        {/* Image / logo plate */}
        <div
          className="relative w-full aspect-square overflow-hidden mb-5"
          style={{
            border: `1px solid ${ACCENT}55`,
            background: PAPER,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {hasImage ? (
                <img
                  src={current.image}
                  alt={current.title}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={FALLBACK_LOGO}
                    alt="Adviserve"
                    draggable={false}
                    className="w-[55%] h-auto object-contain"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Copy */}
        <div className="px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title + '-m'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className="inline-flex items-center gap-2 px-2 py-0.5 font-mono text-[9.5px] tracking-[0.22em] uppercase mb-3"
                style={{
                  color: ACCENT,
                  background: 'rgba(30,157,241,0.10)',
                  border: `1px solid ${ACCENT}55`,
                }}
              >
                {current.tag}
              </span>
              <h2
                className="font-display text-[22px] leading-[1.15] tracking-[-0.01em] mb-3"
                style={{ color: INK, fontWeight: 500 }}
              >
                {current.title}
              </h2>
              {current.date && (
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-5" style={{ color: `${ACCENT}DD` }}>
                  {current.date}
                </p>
              )}
              <Link
                to={current.href}
                className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10.5px] tracking-[0.22em] uppercase"
                style={{
                  color: PAPER,
                  background: INK,
                }}
              >
                Read more
                <ArrowUpRight size={13} strokeWidth={2} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-center items-center gap-5 mt-10">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous insight"
          className="flex items-center justify-center w-12 h-12 transition-all duration-200 hover:scale-105"
          style={{
            background: PAPER,
            border: `1px solid ${ACCENT}88`,
            color: ACCENT,
            boxShadow: '0 6px 18px -10px rgba(11,20,38,0.30)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = ACCENT;
            e.currentTarget.style.color = PAPER;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = PAPER;
            e.currentTarget.style.color = ACCENT;
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to insight ${i + 1}`}
              className="block h-1.5 transition-all duration-300"
              style={{
                width: i === currentIndex ? 24 : 8,
                background: i === currentIndex ? ACCENT : `${ACCENT}44`,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next insight"
          className="flex items-center justify-center w-12 h-12 transition-all duration-200 hover:scale-105"
          style={{
            background: PAPER,
            border: `1px solid ${ACCENT}88`,
            color: ACCENT,
            boxShadow: '0 6px 18px -10px rgba(11,20,38,0.30)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = ACCENT;
            e.currentTarget.style.color = PAPER;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = PAPER;
            e.currentTarget.style.color = ACCENT;
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
