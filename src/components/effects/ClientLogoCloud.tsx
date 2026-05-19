/**
 * ClientLogoCloud — infinite-marquee wall of logos.
 * Renders client/partner brand names as monogram tiles (no actual logos until
 * the user supplies SVGs). Two rows scroll opposite directions for parallax feel.
 *
 * Drop a brand into LOGOS array. If `svg` is provided, it renders the SVG;
 * otherwise the monogram tile (initials in a gradient ring) is used.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Brand = { name: string; svg?: string };

const LOGOS: Brand[] = [
  { name: 'Stellar Bank' },
  { name: 'NorthRail Logistics' },
  { name: 'Vega Pharma' },
  { name: 'Helix Manufacturing' },
  { name: 'Atlas BFSI' },
  { name: 'Quorum SaaS' },
  { name: 'PrimaCare Hospitals' },
  { name: 'Orbit Energy' },
  { name: 'Cinder Foods' },
  { name: 'Anvil Realty' },
  { name: 'Lumen IT Services' },
  { name: 'Pinnacle Capital' },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function Tile({ brand }: { brand: Brand }) {
  return (
    <div
      className="group relative flex items-center gap-4 min-w-[260px] h-[80px] px-6 rounded-xl bg-white border border-[rgba(11,20,38,0.08)] hover:border-[rgba(25,118,210,0.35)] transition-colors"
      title={brand.name}
    >
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-[12px] font-bold text-white shrink-0"
        style={{ background: 'linear-gradient(135deg, #1976D2 0%, #D946A6 100%)' }}
      >
        {initials(brand.name)}
      </div>
      <span className="font-display text-[15px] tracking-[-0.01em] text-[#0B1426] whitespace-nowrap">
        {brand.name}
      </span>
    </div>
  );
}

export default function ClientLogoCloud() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Pause animation on hover for individual tile inspection.
  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // GSAP tween for buttery loop independent of CSS keyframes
    const tw1 = gsap.to(r1, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    const tw2 = gsap.fromTo(r2, { xPercent: -50 }, { xPercent: 0, duration: 44, ease: 'none', repeat: -1 });

    const onEnter = () => { tw1.timeScale(0.25); tw2.timeScale(0.25); };
    const onLeave = () => { tw1.timeScale(1); tw2.timeScale(1); };
    r1.addEventListener('mouseenter', onEnter);
    r1.addEventListener('mouseleave', onLeave);
    r2.addEventListener('mouseenter', onEnter);
    r2.addEventListener('mouseleave', onLeave);

    return () => {
      tw1.kill();
      tw2.kill();
      r1.removeEventListener('mouseenter', onEnter);
      r1.removeEventListener('mouseleave', onLeave);
      r2.removeEventListener('mouseenter', onEnter);
      r2.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const row1 = [...LOGOS, ...LOGOS];
  const row2 = [...LOGOS.slice().reverse(), ...LOGOS.slice().reverse()];

  return (
    <section className="section-elevated relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 mb-12">
        <p className="eyebrow-warm mb-5">// WHERE OUR PRACTITIONERS HAVE SHIPPED WORK</p>
        <h2 className="font-display text-[clamp(30px,4vw,52px)] leading-[1.1] tracking-[-0.02em] text-[#0B1426] max-w-[22ch]">
          A decade of work behind the firm. Across these names.
        </h2>
      </div>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        }}
      >
        <div ref={row1Ref} className="flex gap-4 pb-5 w-max will-change-transform">
          {row1.map((b, i) => (
            <Tile key={`r1-${i}-${b.name}`} brand={b} />
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-4 pt-5 w-max will-change-transform">
          {row2.map((b, i) => (
            <Tile key={`r2-${i}-${b.name}`} brand={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
