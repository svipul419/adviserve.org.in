/**
 * ServiceCategory — slug-driven practice detail page (Task 5 rebuild).
 *
 * Section structure per spec §-blocks:
 *   1. Dark hero
 *   2. "The problem we solve" — 3 paragraphs, no bullets
 *   3. "What the engagement looks like" — 4 numbered stages
 *      (Legal practice swaps for engagement modes)
 *   4. "What you walk away with" — 4–6 bullets
 *   5. "Why this practice, not a generalist" — single paragraph
 *   6. Related services chip row
 *   7. Final CTA
 *
 * Corporate Training appends the catalogue scope (#catalogue anchor) before
 * the related chip row.
 */
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';
import { DEFAULT_SERVICE_PRACTICES, DEFAULT_SERVICES } from '../lib/defaults';

function NotFoundBlock() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Service Not Found" />
      <h2 className="text-2xl font-bold text-white mb-2">Practice not found.</h2>
      <Link to="/services" className="text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors">Browse all practices</Link>
    </div>
  );
}

export default function ServiceCategory() {
  const { slug } = useParams<{ slug: string }>();
  const detail = slug ? DEFAULT_SERVICE_PRACTICES[slug] : undefined;
  const meta = slug ? DEFAULT_SERVICES.find((s) => s.slug === slug) : undefined;

  if (!detail) {
    if (!meta) return <NotFoundBlock />;
    // Minimal hero if a slug exists in DEFAULT_SERVICES but content map not yet seeded.
    return (
      <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
        <SEOHead title={`${meta.title} | Adviserve`} description={meta.description ?? ''} />
        <EngineeringHero
          eyebrow={meta.title.toUpperCase()}
          title={meta.title}
          subtitle={meta.description ?? ''}
          sheet="SVC"
          total="07"
          label="SERVICE · CATEGORY"
          mark="SVC"
        >
          <AnimatedCTAButton href="/contact" label="Talk to the practice" size="lg" />
        </EngineeringHero>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title={`${detail.eyebrow.charAt(0) + detail.eyebrow.slice(1).toLowerCase()} · ${detail.h1Line1} ${detail.h1Line2} | Adviserve`}
        description={detail.subtitle}
        canonical={`https://adviserve.org.in/services/${detail.slug}`}
      />

      <EngineeringHero
        eyebrow={detail.eyebrow}
        title={`${detail.h1Line1} ${detail.h1Line2}`}
        gradientPhrase={detail.h1Line2}
        subtitle={detail.subtitle}
        sheet="SVC"
        total="07"
        label={`SERVICE · ${detail.slug.toUpperCase()}`}
        mark="SVC"
      >
        <div className="flex flex-wrap gap-3">
          <AnimatedCTAButton href={detail.primaryCtaHref} label={detail.primaryCtaText} size="lg" />
          <AnimatedCTAButton href={detail.secondaryCtaHref} label={detail.secondaryCtaText} size="lg" variant="secondary" />
        </div>
      </EngineeringHero>

      {/* The problem we solve — 3 paragraphs */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // THE PROBLEM WE SOLVE
            </p>
            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] leading-[1.15] tracking-[-0.01em] text-white mb-8">
              The work in front of you.
            </h2>
          </FadeUp>
          <div className="space-y-6">
            {detail.problem.map((para, i) => (
              <FadeUp key={i} delay={0.05 * (i + 1)}>
                <p className="text-[17px] leading-[1.8] text-white/85">{para}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement stages (or legal modes) — 4 numbered */}
      <section id={detail.legalModes ? 'modes' : 'engagement'} className="py-20 lg:py-24 bg-ink-base border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // {detail.legalModes ? 'ENGAGEMENT MODES' : 'WHAT THE ENGAGEMENT LOOKS LIKE'}
            </p>
            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] leading-[1.15] tracking-[-0.01em] text-white mb-12 max-w-3xl">
              {detail.legalModes ? 'Three modes, picked by the work.' : 'Four stages, one signed-off plan.'}
            </h2>
          </FadeUp>
          <div className={`grid gap-6 ${(detail.legalModes ?? detail.stages).length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {(detail.legalModes ?? detail.stages).map((s, i) => (
              <FadeUp key={s.num} delay={0.05 * i}>
                <div className="h-full rounded-xl border border-white/10 bg-ink-raised p-6 flex flex-col gap-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-accent-blue">/{s.num}</span>
                  <h3 className="font-display text-[18px] uppercase tracking-[0.04em] text-white">{s.title}</h3>
                  <p className="text-[13px] leading-[1.7] text-white/70">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* What you walk away with — bullets */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // WHAT YOU WALK AWAY WITH
            </p>
          </FadeUp>
          <ul className="space-y-4">
            {detail.walkAway.map((b, i) => (
              <FadeUp key={b} delay={0.04 * i}>
                <li className="flex items-start gap-3 text-[16px] leading-[1.75] text-white/85">
                  <CheckCircle2 size={18} className="text-white/75 flex-shrink-0 mt-1" />
                  <span>{b}</span>
                </li>
              </FadeUp>
            ))}
          </ul>
        </div>
      </section>

      {/* Catalogue (corporate-training only) */}
      {detail.catalogue && (
        <section id="catalogue" className="py-20 lg:py-24 bg-ink-base border-t hairline">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <FadeUp>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7 flex items-center gap-3">
                <span className="w-7 h-[1px] bg-white/20" /> // CATALOGUE SCOPE
              </p>
              <h2 className="font-display text-[clamp(28px,3.4vw,40px)] leading-[1.15] tracking-[-0.01em] text-white mb-12 max-w-3xl">
                Two groups. One delivery standard.
              </h2>
            </FadeUp>
            <div className="space-y-12">
              {detail.catalogue.map((g) => (
                <div key={g.group}>
                  <h3 className="font-display text-[18px] uppercase tracking-[0.04em] text-white mb-6">{g.group}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {g.items.map((t) => (
                      <div key={t.name} className="rounded-xl border border-white/10 bg-ink-raised p-5">
                        <p className="font-display text-[15px] uppercase tracking-[0.04em] text-white mb-2">{t.name}</p>
                        <p className="text-[12px] leading-[1.7] text-white/70">{t.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why this practice — single paragraph */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // WHY THIS PRACTICE, NOT A GENERALIST
            </p>
            <p className="text-[17px] leading-[1.8] text-white/85">{detail.whyNotGeneralist}</p>
          </FadeUp>
        </div>
      </section>

      {/* Related */}
      <section className="py-12 bg-ink-base border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-4">// RELATED</p>
          <div className="flex flex-wrap gap-2">
            {detail.related.map((r) => (
              <Link key={r.href} to={r.href} className="inline-flex items-center font-mono text-[11px] tracking-[0.14em] text-white border border-white/10 bg-ink-raised hover:border-accent-blueHover/40 hover:text-accent-blueHover px-3 py-1.5 rounded-full transition-colors">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0 bg-brand-gradient" style={{ backgroundSize: '200% 200%' }} />
        <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(40% 60% at 20% 20%, rgba(255,255,255,.45), transparent), radial-gradient(50% 50% at 80% 80%, rgba(255,255,255,.25), transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6">{detail.finalCtaText}.</h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">Same operating standard. Same documentation discipline. Same audit trail.</p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href={detail.finalCtaHref} label={detail.finalCtaText} size="lg" />
              <AnimatedCTAButton href="/services" label="See all practices" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
