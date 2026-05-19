import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SlideshowCard = {
  id: string;
  tagline: string;
  title: string;
  description: string;
  imageUrl: string;
  color: string;
  href: string;
};

// ─── TextStaggerHover — per-character stagger animation on active ─────────────

function TextStaggerHover({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <span className="inline-flex flex-wrap" aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={
            isActive
              ? { y: [0, -5, 0], color: ['#0A0E1A', '#6DD4C4', '#0A0E1A'] }
              : { y: 0, color: '#0A0E1A' }
          }
          transition={{ duration: 0.45, delay: isActive ? i * 0.03 : 0, ease: 'easeInOut' }}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── HoverSliderImageWrap — clip-path reveal per image swap ───────────────────

function HoverSliderImageWrap({ card }: { card: SlideshowCard }) {
  return (
    <motion.div
      key={card.id}
      className="absolute inset-0"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      <img
        src={card.imageUrl}
        alt={card.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: card.color, opacity: 0.55 }}
      />
      {/* bottom vignette for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </motion.div>
  );
}

// ─── HoverSlider — main export ────────────────────────────────────────────────

export function HoverSlider({ cards }: { cards: SlideshowCard[] }) {
  const [activeId, setActiveId] = useState<string>(cards[0]?.id ?? '');
  const activeCard = cards.find((c) => c.id === activeId) ?? cards[0];

  if (!cards.length) return null;

  return (
    <div>
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] border border-white/10 rounded-2xl overflow-hidden">
        {/* LEFT: stacked text labels */}
        <div className="flex flex-col divide-y divide-white/10 border-b lg:border-b-0 lg:border-r border-white/10">
          {cards.map((card, i) => {
            const isActive = card.id === activeId;
            return (
              <button
                key={card.id}
                type="button"
                className={`group text-left px-8 py-7 transition-colors duration-200 ${
 isActive ? 'bg-ink-base' : 'bg-white hover:bg-ink-base/40'
 }`}
                onMouseEnter={() => setActiveId(card.id)}
                onClick={() => setActiveId(card.id)}
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-accent-blue/80 shrink-0 select-none">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(18px,2vw,26px)] font-medium leading-none">
                    <TextStaggerHover text={card.tagline} isActive={isActive} />
                  </span>
                  <motion.span
                    className="ml-auto text-accent-blue"
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiArrowUpRight className="w-5 h-5" aria-hidden />
                  </motion.span>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: single swapping image */}
        <div className="relative overflow-hidden min-h-[260px] lg:min-h-0">
          <AnimatePresence mode="wait">
            <HoverSliderImageWrap key={activeId} card={activeCard!} />
          </AnimatePresence>
        </div>
      </div>

      {/* BELOW: detail panel for active product */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6 items-start"
        >
          <div className="flex-1">
            <h3 className="font-display text-[clamp(18px,2vw,26px)] leading-snug text-white mb-3">
              {activeCard?.title}
            </h3>
            <p className="text-[15px] text-white/65 leading-relaxed max-w-prose">
              {activeCard?.description}
            </p>
          </div>
          <Link
            to={activeCard?.href ?? '#'}
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-accent-blue px-6 py-3 text-sm font-medium text-white hover:bg-accent-blueHover/90 transition-colors"
          >
            Learn more <FiArrowUpRight aria-hidden />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── AnimatedSlideshow (kept — not used on homepage) ─────────────────────────

export function AnimatedSlideshow({ cards }: { cards: SlideshowCard[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      {cards.map((card) => {
        const isHovered = hoveredId === card.id;
        return (
          <Link
            key={card.id}
            to={card.href}
            className="relative overflow-hidden rounded-2xl aspect-[4/3] block"
            onMouseEnter={() => setHoveredId(card.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: isHovered ? 1.06 : 1 }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: card.color }}
              animate={{ opacity: isHovered ? 0.60 : 0.75 }}
              transition={{ duration: 0.35 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
              <span className="font-mono text-[10px] tracking-[0.22em] text-white/65 uppercase mb-1.5">
                {card.tagline}
              </span>
              <h3 className="font-display text-[clamp(18px,2vw,22px)] leading-snug text-white mb-2">
                {card.title}
              </h3>
              <motion.div
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className={isHovered ? '' : 'pointer-events-none'}
              >
                <p className="text-[13px] text-white/80 leading-relaxed mb-4 max-w-sm">
                  {card.description}
                </p>
              </motion.div>
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 text-white text-sm font-medium"
              >
                <span>Learn more</span>
                <FiArrowUpRight className="w-4 h-4" aria-hidden />
              </motion.div>
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl ring-inset"
              animate={{ boxShadow: isHovered ? 'inset 0 0 0 1.5px rgba(255,255,255,0.25)' : 'inset 0 0 0 0px rgba(255,255,255,0)' }}
              transition={{ duration: 0.25 }}
            />
          </Link>
        );
      })}
    </div>
  );
}
