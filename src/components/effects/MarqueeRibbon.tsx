/**
 * MarqueeRibbon — infinite horizontal ticker. Used as section divider.
 * Pure CSS keyframes (animate-marquee already in tailwind config).
 * Optional reverse direction. Tilt rotation = -1.5deg for editorial feel.
 */
import type { ReactNode } from 'react';

interface MarqueeRibbonProps {
  items: ReactNode[];
  reverse?: boolean;
  tone?: 'amber' | 'blue' | 'white';
  rotate?: number;
}

const TONE: Record<string, string> = {
  amber: 'text-accent-blue',
  blue:  'text-accent-blue',
  white: 'text-white/80',
};

export default function MarqueeRibbon({ items, reverse = false, tone = 'amber', rotate = 0 }: MarqueeRibbonProps) {
  const loop = [...items, ...items, ...items];
  // Outer wrapper clips the rotated band so it never escapes the viewport horizontally.
  return (
    <div aria-hidden="true" className="relative overflow-hidden w-full" style={{ overflowX: 'clip' as 'hidden' }}>
      <div
        className="relative overflow-hidden border-y border-white/8 bg-ink-base/40 backdrop-blur-sm w-[110%] -ml-[5%]"
        style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      >
        <div className={`flex items-center gap-10 py-5 whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} ${TONE[tone]} font-display text-[clamp(20px,3vw,40px)] tracking-[-0.01em]`}>
          {loop.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-10">
              <span>{it}</span>
              <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
