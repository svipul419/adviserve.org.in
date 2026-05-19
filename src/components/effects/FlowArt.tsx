'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
  /** Sheet number printed in the drafting stamp. */
  sheet?: number;
  /** Total sheets in the dossier. */
  total?: number;
  /** Short label printed in the title-block. */
  label?: string;
  /** Cyan accent for the blueprint grid + chrome. */
  accent?: string;
  /** Blueprint paper color. Defaults to a cool white; vary per sheet to give
   *  each section its own tonal identity. */
  paper?: string;
}

const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
})();

/**
 * FlowSection — engineering-blueprint card.
 *
 * Each section reads like a technical drawing sheet: bone-white surface with
 * a cyan hairline grid, registration crosshairs at the four corners, a
 * dimension callout for the sheet width, a wireframe section numeral in the
 * bottom-right corner, and a drafting title-block with sheet metadata.
 *
 * Pair with FlowArt parent for rotate-on-scroll choreography.
 */
export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  innerClassName,
  style = {},
  children,
  'aria-label': ariaLabel,
  sheet = 1,
  total = 7,
  label = '',
  accent = '#1e9df1',
  paper = '#FBFDFF',
}) => {
  const sheetNo = String(sheet).padStart(2, '0');
  const totalNo = String(total).padStart(2, '0');
  const accentSoft = `${accent}1F`;  // 12% alpha — grid line color
  const accentMid  = `${accent}55`;  // 33% alpha — markers
  const accentDeep = `${accent}AA`;  // 67% alpha — stamp ink

  return (
    <section
      data-flow-section
      data-sheet={sheet}
      aria-label={ariaLabel}
      className={cx(
        'relative w-full overflow-hidden rounded-[clamp(20px,2.2vw,36px)] max-w-[1720px] mx-auto',
        'min-h-[clamp(820px,94vh,1120px)]',
        'shadow-[0_24px_60px_-36px_rgba(11,20,38,0.22)]',
        className,
      )}
      style={{
        background: paper,
        border: `1px solid ${accent}22`,
        ...style,
      }}
    >
      {/* Hairline blueprint grid — fine 36px, coarse 180px */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${accentSoft} 1px, transparent 1px),
            linear-gradient(90deg, ${accentSoft} 1px, transparent 1px),
            linear-gradient(${accent}33 1px, transparent 1px),
            linear-gradient(90deg, ${accent}33 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px, 36px 36px, 180px 180px, 180px 180px',
        }}
      />

      {/* Soft vignette so center reads cleaner than the edges */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 50%, rgba(251,253,255,0.95) 0%, rgba(251,253,255,0.55) 60%, transparent 85%)',
        }}
      />

      {/* Registration crosshairs at the four corners */}
      {([
        { key: 'tl', top: 14, left: 14 },
        { key: 'tr', top: 14, right: 14 },
        { key: 'bl', bottom: 14, left: 14 },
        { key: 'br', bottom: 14, right: 14 },
      ] as const).map((m) => (
        <span
          key={m.key}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{ width: 18, height: 18, ...m }}
        >
          {/* Cross */}
          <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: accentDeep }} />
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: accentDeep }} />
          {/* Circle */}
          <span
            style={{
              position: 'absolute',
              inset: 4,
              borderRadius: '50%',
              border: `1px solid ${accentDeep}`,
            }}
          />
        </span>
      ))}

      {/* Top-edge dimension callout — width measurement */}
      <div
        aria-hidden="true"
        className="absolute top-7 left-[clamp(3rem,7vw,7rem)] right-[clamp(3rem,7vw,7rem)] pointer-events-none flex items-center"
      >
        <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: accentDeep }}>
          ◀
        </span>
        <span className="flex-1 mx-2 h-px" style={{ background: accentMid }} />
        <span className="px-2 font-mono text-[9.5px] tracking-[0.24em] uppercase" style={{ color: accentDeep }}>
          SHEET {sheetNo} / {totalNo}
        </span>
        <span className="flex-1 mx-2 h-px" style={{ background: accentMid }} />
        <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: accentDeep }}>
          ▶
        </span>
      </div>

      {/* Wireframe section numeral — bottom-right, oversized */}
      <span
        aria-hidden="true"
        className="absolute right-[clamp(1rem,3vw,3rem)] bottom-[clamp(-2rem,-1vw,0rem)] font-display leading-none pointer-events-none select-none"
        style={{
          fontSize: 'clamp(10rem, 22vw, 24rem)',
          color: 'transparent',
          WebkitTextStroke: `1.5px ${accent}44`,
          letterSpacing: '-0.05em',
        }}
      >
        {sheetNo}
      </span>

      {/* Drafting title-block — bottom-right grid */}
      <div
        className="absolute bottom-[clamp(1rem,2.5vw,2rem)] right-[clamp(1rem,2.5vw,2rem)] pointer-events-none hidden sm:grid grid-cols-2 text-[9.5px] font-mono tracking-[0.18em] uppercase leading-[1.6]"
        style={{ color: `${accent}DD`, background: 'rgba(251,253,255,0.92)', border: `1px solid ${accentMid}`, minWidth: 220 }}
      >
        <div className="px-3 py-1.5 border-r border-b" style={{ borderColor: accentMid }}>
          <div style={{ color: `${accent}99`, fontSize: 8 }}>SCALE</div>
          <div className="font-bold">1 : 1</div>
        </div>
        <div className="px-3 py-1.5 border-b" style={{ borderColor: accentMid }}>
          <div style={{ color: `${accent}99`, fontSize: 8 }}>DATE</div>
          <div className="font-bold">{today}</div>
        </div>
        <div className="px-3 py-1.5 col-span-2">
          <div style={{ color: `${accent}99`, fontSize: 8 }}>SECTION · {sheetNo} / {totalNo}</div>
          <div className="font-bold text-[10.5px]" style={{ color: accent, letterSpacing: '0.14em' }}>
            {label || 'ADVISERVE'}
          </div>
        </div>
      </div>

      {/* Vertical rule on left + tickmarks (architectural ruler) */}
      <div
        aria-hidden="true"
        className="absolute top-16 bottom-16 left-[clamp(1rem,2vw,2rem)] w-2 pointer-events-none"
      >
        <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px" style={{ background: accentMid }} />
        <span
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, ${accentDeep} 0 1px, transparent 1px 18px), repeating-linear-gradient(to bottom, ${accentMid} 0 1px, transparent 1px 6px)`,
            backgroundSize: '1px 18px, 1px 6px',
          }}
        />
      </div>

      {/* Vertical rotated section label on the right edge */}
      {label && (
        <div
          aria-hidden="true"
          className="hidden md:flex absolute right-[clamp(1rem,2vw,2rem)] top-1/2 -translate-y-1/2 origin-center -rotate-90 items-center gap-3 pointer-events-none"
        >
          <span className="block w-8 h-px" style={{ background: accentMid }} />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase whitespace-nowrap" style={{ color: accentDeep }}>
            {label}
          </span>
          <span className="block w-8 h-px" style={{ background: accentMid }} />
        </div>
      )}

      {/* Inner — GSAP rotates this */}
      <div
        data-flow-inner
        className={cx(
          'flow-art-container relative flex w-full flex-col gap-6 px-[clamp(3.5rem,5vw,6rem)] pt-[clamp(3.5rem,7vw,5rem)] pb-[clamp(3rem,6vw,5rem)]',
          'will-change-transform',
          innerClassName,
        )}
        style={{ transformOrigin: 'bottom left', ...style }}
      >
        {children}
      </div>
    </section>
  );
};

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;
      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });
        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        const startAngle = i === 0 ? 12 : 30;
        gsap.set(inner, { rotation: startAngle, transformOrigin: 'bottom left' });
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
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      ScrollTrigger.refresh();
      return () => { triggers.forEach((t) => t.kill()); };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx(
        'w-full overflow-x-hidden bg-background py-6 sm:py-8 lg:py-10 flex flex-col gap-8 sm:gap-10 lg:gap-12',
        className,
      )}
      style={{ paddingLeft: 'clamp(2px, 0.3vw, 6px)', paddingRight: 'clamp(2px, 0.3vw, 6px)' }}
    >
      {children}
    </main>
  );
};

export default FlowArt;
