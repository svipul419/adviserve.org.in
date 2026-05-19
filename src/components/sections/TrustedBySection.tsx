/**
 * TrustedBySection — animated attestation band.
 *
 * Engineering blueprint surface + sparkle layer + scroll-driven reveal
 * choreography + infinite horizontal marquee for logos + a counter chip
 * that ticks up to a verification number once the section enters view.
 *
 * Motion choreography on enter (via IntersectionObserver):
 *   0.00s  Top dimension callout fades + slides up
 *   0.10s  Eyebrow + ◀ ── // Attestation ── ▶
 *   0.20s  Headline word-by-word stagger (gradient highlight word at end)
 *   0.40s  Subhead fade
 *   0.55s  Marquee track starts scrolling + scan line sweeps once
 *   0.70s  Counter starts ticking 0 → 247
 *
 * Plus: ambient native CSS sparkle layer (no deps), 8 logo cards in a
 * double-row infinite marquee scrolling in opposite directions, hover-
 * flip initials tiles, ISO footnote.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#1e9df1';
const SPARKLE_COUNT = 60;

interface Logo { name: string; src: string; }

const LOGOS: Logo[] = [
  { name: 'Training Basket',  src: '/logos/training-basket.webp' },
  { name: 'Blogic',           src: '/logos/blogic.png' },
  { name: 'Ethics',           src: '/logos/ethics.webp' },
  { name: 'Veershakti Consultants', src: '/logos/veershakti.png' },
  { name: 'Airscape',         src: '/logos/airscape.svg' },
  { name: 'Trijal',           src: '/logos/trijal.png' },
];

interface Sparkle {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  hue: string;
}

function makeSparkles(seed: number): Sparkle[] {
  const rand = (n: number) => {
    const x = Math.sin(seed + n * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    top: rand(i * 2) * 100,
    left: rand(i * 2 + 1) * 100,
    size: 1 + rand(i * 3) * 2.5,
    delay: rand(i * 4) * 5,
    duration: 3 + rand(i * 5) * 4,
    hue: ['#1e9df1', '#0F5594', '#00D4FF'][Math.floor(rand(i * 6) * 3)],
  }));
}

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined') return;
    // Reduced motion → reveal immediately, skip all entry animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.18 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, revealed] as const;
}

const HEADLINE_HEAD = 'Trusted by experts';
const HEADLINE_TAIL = 'used by leaders';

export default function TrustedBySection() {
  const sparkles = useMemo(() => makeSparkles(Date.now()), []);
  const [sectionRef, revealed] = useReveal();
  const flowRef = useRef<HTMLDivElement | null>(null);

  // Duplicate the logo list so the marquee loops seamlessly.
  const marqueeLogos = useMemo(() => [...LOGOS, ...LOGOS], []);

  // Word-level stagger for the headline.
  const headWords = HEADLINE_HEAD.split(' ');
  const tailWords = HEADLINE_TAIL.split(' ');

  // FlowArt rotate-on-scroll — inner panel tilts 30° → 0° as section enters.
  // Mirrors src/components/effects/FlowArt.tsx choreography (bottom-left origin,
  // scrub tied to scroll position). Skipped under prefers-reduced-motion.
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const section = sectionRef.current;
      const inner = flowRef.current;
      if (!section || !inner) return;

      gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
      const tween = gsap.to(inner, {
        rotation: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 30%',
          scrub: true,
        },
      });
      ScrollTrigger.refresh();
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    },
    { scope: sectionRef as React.RefObject<HTMLElement> },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
          linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
          linear-gradient(rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
          linear-gradient(90deg, rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
          #FBFDFF
        `,
        borderTop: `1px solid ${ACCENT}33`,
        borderBottom: `1px solid ${ACCENT}33`,
      }}
    >
      {/* Sparkle layer */}
      <span aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full trusted-sparkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.hue,
              boxShadow: `0 0 ${s.size * 2}px ${s.hue}`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              opacity: 0,
            }}
          />
        ))}
      </span>

      {/* Center vignette */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(110% 80% at 50% 50%, rgba(251,253,255,0.70) 0%, rgba(251,253,255,0.32) 60%, transparent 90%)' }}
      />

      {/* Horizontal scan line — sweeps left→right once when section reveals */}
      {revealed && (
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 z-[2] pointer-events-none trusted-scanline"
          style={{
            width: 2,
            background: `linear-gradient(180deg, transparent, ${ACCENT}DD 30%, ${ACCENT}DD 70%, transparent)`,
            boxShadow: `0 0 16px ${ACCENT}AA`,
          }}
        />
      )}

      {/* Corner registration crosshairs */}
      {([
        { key: 'tl', top: 14, left: 14 },
        { key: 'tr', top: 14, right: 14 },
        { key: 'bl', bottom: 14, left: 14 },
        { key: 'br', bottom: 14, right: 14 },
      ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number }>).map((m) => (
        <span
          key={m.key}
          aria-hidden="true"
          className="absolute pointer-events-none z-[2]"
          style={{ width: 14, height: 14, top: m.top, left: m.left, right: m.right, bottom: m.bottom }}
        >
          <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `${ACCENT}AA` }} />
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `${ACCENT}AA` }} />
          <span style={{ position: 'absolute', inset: 3, borderRadius: '50%', border: `1px solid ${ACCENT}AA` }} />
        </span>
      ))}

      <div
        ref={flowRef}
        className="relative z-[3] max-w-7xl mx-auto px-6 sm:px-12 py-20 lg:py-28 will-change-transform"
        style={{ transformOrigin: 'bottom left' }}
      >
        {/* Top dimension callout */}
        <div
          className="flex items-center mb-10 trusted-fade"
          style={{ '--trusted-delay': '0ms' } as React.CSSProperties}
          data-revealed={revealed}
        >
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>◀</span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="px-2 font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: `${ACCENT}DD` }}>
            ATTESTED · 00 / 07
          </span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>▶</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Eyebrow */}
          <p
            className="font-mono text-[10px] tracking-[0.32em] uppercase mb-5 flex items-center justify-center gap-2 trusted-fade"
            style={{ color: `${ACCENT}DD`, '--trusted-delay': '100ms' } as React.CSSProperties}
            data-revealed={revealed}
          >
            <span className="w-7 h-px" style={{ background: ACCENT }} />
            // Attestation
            <span className="w-7 h-px" style={{ background: ACCENT }} />
          </p>

          {/* Headline — word-level stagger */}
          <h2
            className="font-display text-[clamp(20px,3.6vw,44px)] leading-[1.1] tracking-[-0.02em] text-[#0B1426] mb-4 whitespace-nowrap overflow-hidden"
            style={{ fontWeight: 400 }}
          >
            {headWords.map((w, i) => (
              <span
                key={`h-${i}`}
                className="inline-block trusted-word"
                style={{ '--trusted-delay': `${200 + i * 60}ms` } as React.CSSProperties}
                data-revealed={revealed}
              >
                {w}{i < headWords.length - 1 ? ' ' : ''}
              </span>
            ))}
            <span
              aria-hidden="true"
              className="inline-block trusted-arrow mx-[clamp(0.4em,1vw,0.8em)] align-middle"
              style={{ '--trusted-delay': `${200 + headWords.length * 60}ms` } as React.CSSProperties}
              data-revealed={revealed}
            >
              <span
                className="inline-block font-mono"
                style={{
                  fontSize: '0.55em',
                  letterSpacing: '0.1em',
                  color: '#1e9df1',
                  transform: 'translateY(-0.06em)',
                }}
              >
                ⟶
              </span>
            </span>
            {' '}
            {tailWords.map((w, i) => (
              <span
                key={`t-${i}`}
                className="inline-block trusted-word"
                style={{
                  '--trusted-delay': `${200 + (headWords.length + i) * 60}ms`,
                  background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                } as React.CSSProperties}
                data-revealed={revealed}
              >
                {w}{i < tailWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>

          {/* Subhead */}
          <p
            className="text-[15px] leading-[1.7] max-w-[60ch] mx-auto text-[rgba(11,20,38,0.66)] trusted-fade"
            style={{ '--trusted-delay': '400ms' } as React.CSSProperties}
            data-revealed={revealed}
          >
            Practitioners across banking, healthcare, SaaS and manufacturing route their compliance, security and hiring work through one team — and one operating standard.
          </p>
        </div>

        {/*
          Marquee — "Engineering Gauge" treatment.

          Two rows are framed top + bottom by tickmarked hairline rails, and a
          vertical cyan inspection band sits behind the center of the strip so
          logos appear briefly "lens-lit" as they pass through. Each row carries
          its own drafting index label + scroll-direction arrow on the left rail.
        */}
        <div
          className="relative trusted-fade"
          style={{ '--trusted-delay': '650ms' } as React.CSSProperties}
          data-revealed={revealed}
        >
          {/* Inspection band — vertical cyan glow column behind both rows */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none z-[1]"
            style={{
              width: 'clamp(80px, 14vw, 200px)',
              background: `radial-gradient(50% 80% at 50% 50%, ${ACCENT}1F 0%, ${ACCENT}0A 50%, transparent 100%)`,
            }}
          />
          {/* Inspection band — hairline marker top + bottom of band */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-[3] font-mono text-[8.5px] tracking-[0.32em] uppercase"
            style={{ color: `${ACCENT}DD` }}
          >
            <span className="px-2 py-0.5" style={{ background: '#FBFDFF', border: `1px solid ${ACCENT}55` }}>
              · Inspection Zone ·
            </span>
          </span>

          {/* Fade-out gradients at the marquee edges */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-12 sm:w-20 pointer-events-none z-[3]"
            style={{ background: 'linear-gradient(90deg, #FBFDFF, transparent)' }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-12 sm:w-20 pointer-events-none z-[3]"
            style={{ background: 'linear-gradient(270deg, #FBFDFF, transparent)' }}
          />

          {/* Single specimen rail — partners scroll left under the inspection lens */}
          <MarqueeRow
            label="Partners"
            direction="left"
          >
            <ul
              className="flex items-stretch gap-3 sm:gap-4 trusted-marquee trusted-marquee-left"
              style={{ width: 'max-content' }}
            >
              {marqueeLogos.map((logo, i) => (
                <LogoCard key={`r-${i}`} logo={logo} index={(i % LOGOS.length) + 1} />
              ))}
            </ul>
          </MarqueeRow>
        </div>

        {/* ISO footnote */}
        <p
          className="mt-10 text-center font-mono text-[10px] tracking-[0.22em] uppercase trusted-fade"
          style={{ color: `${ACCENT}99`, '--trusted-delay': '800ms' } as React.CSSProperties}
          data-revealed={revealed}
        >
          Anchored by ISO 9001 · ISO/IEC 20000-1 · ISO/IEC 27001
        </p>
      </div>

      <style>{`
        @keyframes trustedSparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.7); }
          50%      { opacity: 0.85; transform: scale(1); }
        }
        .trusted-sparkle {
          animation-name: trustedSparkleTwinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: opacity, transform;
        }

        /* Generic fade-up reveal driven by the data-revealed attribute. */
        .trusted-fade {
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) var(--trusted-delay, 0ms),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1) var(--trusted-delay, 0ms);
        }
        .trusted-fade[data-revealed="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        /* Arrow separator — fades in + scales up when revealed. */
        .trusted-arrow {
          opacity: 0;
          transform: translateY(8px) scale(0.6);
          transition:
            opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--trusted-delay, 0ms),
            transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--trusted-delay, 0ms);
        }
        .trusted-arrow[data-revealed="true"] {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Per-word headline reveal. */
        .trusted-word {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--trusted-delay, 0ms),
            transform 600ms cubic-bezier(0.16, 1, 0.3, 1) var(--trusted-delay, 0ms);
        }
        .trusted-word[data-revealed="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        /* Vertical scan line sweep — left→right once, then loops slowly. */
        @keyframes trustedScanSweep {
          0%   { left: -2%;  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 102%; opacity: 0; }
        }
        .trusted-scanline {
          animation: trustedScanSweep 6s linear 0.55s infinite;
        }

        /* Marquee — duplicated track translates -50% so the second half
           seamlessly takes over from the first. */
        @keyframes trustedMarqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes trustedMarqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .trusted-marquee {
          animation-duration: 36s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .trusted-marquee-left  { animation-name: trustedMarqueeLeft; }
        .trusted-marquee-right { animation-name: trustedMarqueeRight; }
        .group\\/marquee:hover .trusted-marquee {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .trusted-sparkle,
          .trusted-marquee,
          .trusted-scanline { animation: none !important; }
          .trusted-sparkle { opacity: 0.35 !important; }
          .trusted-fade,
          .trusted-word,
          .trusted-arrow { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}

/**
 * MarqueeRow — wraps one logo row in a drafting "specimen rail":
 *   • top + bottom hairline rules
 *   • vertical end-caps (┃) at far left + right of the rail
 *   • left-rail callout with row index letter (A/B), label, and a scroll
 *     direction glyph (◀ / ▶) so the reader can tell at a glance which way
 *     this rail moves.
 */
function MarqueeRow({
  label,
  direction,
  className,
  children,
}: {
  label: string;
  direction: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group/marquee relative overflow-hidden ${className ?? ''}`}
      style={{
        borderTop: `1px dashed ${ACCENT}44`,
        borderBottom: `1px dashed ${ACCENT}44`,
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      {/* Row label — sits on the left rail, above the tickmarks */}
      <div
        className="absolute left-2 top-1 z-[4] hidden sm:flex items-center gap-1.5 font-mono text-[9px] tracking-[0.22em] uppercase pointer-events-none"
        style={{ color: `${ACCENT}DD` }}
      >
        <span className="hidden md:inline">{label}</span>
        <span aria-hidden="true" className="ml-0.5" style={{ color: ACCENT }}>
          {direction === 'left' ? '◀' : '▶'}
        </span>
      </div>

      {/* Tickmark band — drafting ruler running edge to edge */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] pointer-events-none z-[2]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${ACCENT}55 0 1px, transparent 1px 32px)`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] pointer-events-none z-[2]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${ACCENT}55 0 1px, transparent 1px 32px)`,
        }}
      />

      {children}
    </div>
  );
}

/**
 * LogoCard — specimen mount. Wider than before so wide-aspect logos (Training
 * Basket, Veershakti) don't crop, and an index stamp + corner brackets give
 * each card the drafting "part on inspection plate" feel.
 */
function LogoCard({ logo, index }: { logo: Logo; index: number }) {
  const stamp = String(index).padStart(2, '0');
  return (
    <li
      className="group/card relative flex items-center justify-center px-7 py-6 transition-all duration-300 hover:bg-[rgba(30,157,241,0.06)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-12px_rgba(30,157,241,0.45)] flex-shrink-0"
      style={{
        background: 'rgba(251,253,255,0.82)',
        border: `1px solid ${ACCENT}33`,
        backdropFilter: 'blur(2px)',
        minWidth: 260,
        width: 280,
        height: 140,
      }}
      aria-label={logo.name}
    >
      {/* Drafting corner brackets — appear on hover */}
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-1.5 w-2.5 h-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ borderTop: `1px solid ${ACCENT}`, borderLeft: `1px solid ${ACCENT}` }}
      />
      <span
        aria-hidden="true"
        className="absolute top-1.5 right-1.5 w-2.5 h-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ borderTop: `1px solid ${ACCENT}`, borderRight: `1px solid ${ACCENT}` }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ borderBottom: `1px solid ${ACCENT}`, borderLeft: `1px solid ${ACCENT}` }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ borderBottom: `1px solid ${ACCENT}`, borderRight: `1px solid ${ACCENT}` }}
      />

      {/* Specimen index stamp — top-left mono */}
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-2 font-mono text-[8.5px] tracking-[0.22em] uppercase pointer-events-none"
        style={{ color: `${ACCENT}99` }}
      >
        № {stamp}
      </span>

      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        className="max-h-[92px] max-w-[220px] w-auto object-contain transition-transform duration-500 group-hover/card:scale-[1.08]"
      />
    </li>
  );
}
