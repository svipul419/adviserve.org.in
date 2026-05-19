/**
 * BlueprintCTABand — closing CTA band used across pages.
 *
 * Blue gradient backdrop (matches the Home / Services close band), white
 * text, brand serif H2 with optional gradient highlight, mono eyebrow,
 * primary + secondary actions.
 */
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FadeUp } from '../animations';
import AnimatedCTAButton from '../ui/AnimatedCTAButton';

interface BlueprintCTABandProps {
  eyebrow?: string;
  title: string;
  gradientPhrase?: string;
  subtitle?: ReactNode;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function BlueprintCTABand({
  eyebrow,
  title,
  gradientPhrase,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: BlueprintCTABandProps) {
  const renderedTitle = (() => {
    if (gradientPhrase && title.includes(gradientPhrase)) {
      const [head, ...rest] = title.split(gradientPhrase);
      return (
        <>
          {head}
          <span className="bg-clip-text" style={{
            background: 'linear-gradient(90deg, #FFFFFF 0%, #BCE0FF 60%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>{gradientPhrase}</span>
          {rest.join(gradientPhrase)}
        </>
      );
    }
    return title;
  })();

  return (
    <section className="relative overflow-hidden" data-section-color="dark">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #1e9df1 0%, #1a82d4 50%, #0F2F66 100%)' }} />
      <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(40% 60% at 20% 20%, rgba(255,255,255,.45), transparent), radial-gradient(50% 50% at 80% 80%, rgba(255,255,255,.25), transparent)' }} />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
        <FadeUp>
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-7 flex items-center gap-2 text-white/80">
              <span className="w-7 h-px bg-white/60" />
              // {eyebrow}
            </p>
          )}
          <h2
            className="font-display text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6 text-white"
            style={{ fontWeight: 400 }}
          >
            {renderedTitle}
          </h2>
          {subtitle && (
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">{subtitle}</p>
          )}
          <div className="flex flex-wrap gap-3">
            <AnimatedCTAButton href={primaryHref} label={primaryLabel} size="lg" variant="on-dark" />
            {secondaryLabel && secondaryHref && (
              <Link
                to={secondaryHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-[11px] tracking-[0.22em] uppercase text-white border border-white/40 hover:bg-white/10 transition-colors"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
