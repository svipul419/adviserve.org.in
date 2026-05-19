/**
 * EngineeringHero — reusable cover-sheet hero.
 *
 * Bone-white blueprint paper + cyan hairline grid + full cover-sheet chrome
 * (corner crosshairs, top dimension callout, wireframe sheet numeral,
 * drafting title-block, vertical rotated rail). H1 in Top Stories typographic
 * spec with a brand-gradient highlight on a chosen phrase.
 *
 * Drop into any public page hero to make it part of the dossier.
 */
import { ReactNode } from 'react';
import { FadeUp } from '../animations';

const ACCENT = '#1e9df1';
const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
})();

interface EngineeringHeroProps {
  /** Mono eyebrow (no leading `// `). */
  eyebrow: string;
  /** Full title text. If `gradientPhrase` is supplied, the matching substring
   *  is replaced with the gradient span; otherwise the last word is highlighted. */
  title: string;
  gradientPhrase?: string;
  /** Body subtitle paragraph. */
  subtitle?: ReactNode;
  /** Sheet number rendered in stamps + numeral, e.g. "02" or "ABT". */
  sheet?: string;
  /** Total sheets in the dossier, default 07. */
  total?: string;
  /** Section label printed in title-block + dimension callout. */
  label?: string;
  /** Wireframe corner numeral. Defaults to `sheet`. */
  mark?: string;
  /** Optional content block rendered below the subtitle (CTAs etc.). */
  children?: ReactNode;
  /** Extra classes for the outer <section>. */
  className?: string;
}

export default function EngineeringHero({
  eyebrow,
  title,
  gradientPhrase,
  subtitle,
  sheet = '02',
  total = '07',
  label = 'SHEET',
  mark,
  children,
  className = '',
}: EngineeringHeroProps) {
  const numeral = mark ?? sheet;

  // Render the title with a gradient highlight on the chosen phrase. Falls
  // back to highlighting the last word when no phrase is provided.
  const renderedTitle = (() => {
    if (gradientPhrase && title.includes(gradientPhrase)) {
      const [head, ...rest] = title.split(gradientPhrase);
      return (
        <>
          {head}
          <span style={{
            background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>{gradientPhrase}</span>
          {rest.join(gradientPhrase)}
        </>
      );
    }
    const words = title.split(/\s+/);
    const cut = Math.max(words.length - 1, 1);
    return (
      <>
        {words.slice(0, cut).join(' ')}{' '}
        <span style={{
          background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}>{words.slice(cut).join(' ')}</span>
      </>
    );
  })();

  return (
    <section
      className={`relative pt-[120px] pb-24 lg:pb-32 overflow-hidden ${className}`}
      style={{
        background: `
          linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
          linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
          linear-gradient(rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
          linear-gradient(90deg, rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
          #FBFDFF
        `,
        borderBottom: `1px solid ${ACCENT}22`,
      }}
    >
      {/* Center vignette */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 80% at 50% 50%, rgba(251,253,255,0.92) 0%, rgba(251,253,255,0.55) 60%, transparent 90%)' }}
      />

      {/* 4 corner registration crosshairs */}
      {([
        { key: 'tl', top: 14, left: 14 },
        { key: 'tr', top: 14, right: 14 },
        { key: 'bl', bottom: 14, left: 14 },
        { key: 'br', bottom: 14, right: 14 },
      ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number }>).map((m) => (
        <span key={m.key} aria-hidden="true" className="absolute pointer-events-none z-[2]"
          style={{ width: 16, height: 16, top: m.top, left: m.left, right: m.right, bottom: m.bottom }}>
          <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `${ACCENT}AA` }} />
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `${ACCENT}AA` }} />
          <span style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px solid ${ACCENT}AA` }} />
        </span>
      ))}

      {/* Top dimension callout */}
      <div aria-hidden="true" className="absolute top-[140px] left-[clamp(2rem,5vw,5rem)] right-[clamp(2rem,5vw,5rem)] z-[2] flex items-center pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>◀</span>
        <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
        <span className="px-2 font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: `${ACCENT}DD` }}>
          SHEET {sheet} / {total} · {label}
        </span>
        <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
        <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>▶</span>
      </div>

      {/* Wireframe numeral */}
      <span aria-hidden="true" className="absolute right-[clamp(1rem,3vw,3rem)] bottom-[clamp(-2rem,-1vw,0rem)] z-[2] font-display leading-none pointer-events-none select-none"
        style={{ fontSize: 'clamp(10rem, 22vw, 24rem)', color: 'transparent', WebkitTextStroke: `1.5px ${ACCENT}44`, letterSpacing: '-0.05em' }}>
        {numeral}
      </span>

      {/* Drafting title-block */}
      <div className="absolute bottom-[clamp(1rem,2.5vw,2rem)] right-[clamp(1rem,2.5vw,2rem)] z-[3] pointer-events-none hidden sm:grid grid-cols-2 text-[9.5px] font-mono tracking-[0.18em] uppercase leading-[1.6]"
        style={{ color: `${ACCENT}DD`, background: 'rgba(251,253,255,0.92)', border: `1px solid ${ACCENT}55`, minWidth: 220 }}>
        <div className="px-3 py-1.5 border-r border-b" style={{ borderColor: `${ACCENT}55` }}>
          <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>SCALE</div>
          <div className="font-bold">1 : 1</div>
        </div>
        <div className="px-3 py-1.5 border-b" style={{ borderColor: `${ACCENT}55` }}>
          <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>DATE</div>
          <div className="font-bold">{today}</div>
        </div>
        <div className="px-3 py-1.5 col-span-2">
          <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>SECTION · {sheet} / {total}</div>
          <div className="font-bold text-[10.5px]" style={{ color: ACCENT, letterSpacing: '0.14em' }}>{label}</div>
        </div>
      </div>

      {/* Vertical rotated rail */}
      <div aria-hidden="true" className="hidden md:flex absolute right-3 top-1/2 z-[3] -translate-y-1/2 origin-center -rotate-90 items-center gap-3 pointer-events-none">
        <span className="block w-8 h-px" style={{ background: `${ACCENT}55` }} />
        <span className="font-mono text-[10px] tracking-[0.32em] uppercase whitespace-nowrap" style={{ color: `${ACCENT}DD` }}>
          Adviserve · {label}
        </span>
        <span className="block w-8 h-px" style={{ background: `${ACCENT}55` }} />
      </div>

      {/* Content */}
      <div className="relative z-[4] max-w-7xl mx-auto px-6 sm:px-12">
        <FadeUp>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-7 flex items-center gap-2" style={{ color: `${ACCENT}DD` }}>
            <span className="w-7 h-px" style={{ background: ACCENT }} />
            // {eyebrow}
          </p>
          <h1
            className="font-display text-[clamp(36px,5.4vw,76px)] leading-[1.06] tracking-[-0.02em] text-[#0B1426] max-w-[18ch] mb-8"
            style={{ fontWeight: 400 }}
          >
            {renderedTitle}
          </h1>
          {subtitle && (
            <p className="text-[17px] leading-[1.65] text-[rgba(11,20,38,0.66)] max-w-2xl">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </FadeUp>
      </div>
    </section>
  );
}
