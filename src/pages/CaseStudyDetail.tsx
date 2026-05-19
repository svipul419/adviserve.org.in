/**
 * CaseStudyDetail — slug-driven case study page.
 * Content sourced from DEFAULT_CASE_STUDIES_DETAIL.
 */
import { useParams, Link } from 'react-router-dom';
import { Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';
import { publicApi } from '../lib/api';
import { DEFAULT_CASE_STUDIES_DETAIL } from '../lib/defaults';

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  useQuery({ queryKey: ['caseStudy', slug], queryFn: () => publicApi.getCaseStudy(slug!), enabled: !!slug });

  const study = slug ? DEFAULT_CASE_STUDIES_DETAIL[slug] : undefined;

  if (!study) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-ink-base">
        <SEOHead title="Case study not found" />
        <h2 className="text-2xl font-bold text-white mb-2">Case study not found.</h2>
        <Link to="/case-studies" className="text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors">Browse all case studies</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title={`${study.company} — case study | Adviserve`}
        description={study.subtitle}
        canonical={`https://adviserve.org.in/case-studies/${study.slug}`}
      />

      <EngineeringHero
        eyebrow={study.eyebrow}
        title={study.company}
        subtitle={study.subtitle}
        sheet="CSD"
        total="07"
        label={`CASE · ${study.slug.toUpperCase()}`}
        mark="CSD"
      >
        <div className="grid grid-cols-3 gap-3 max-w-xl">
          {study.metrics.map((m) => (
            <div key={m.label} className="rounded-xl px-4 py-5 text-center" style={{ border: `1px solid #1e9df133`, background: 'rgba(30,157,241,0.06)' }}>
              <p className="font-display text-[clamp(20px,2.4vw,30px)] leading-none text-[#1e9df1]">{m.value}</p>
              <p className="mt-2 font-mono text-[9px] tracking-[0.14em] text-[rgba(11,20,38,0.55)] uppercase">{m.label}</p>
            </div>
          ))}
        </div>
      </EngineeringHero>

      {/* Strip row */}
      <section className="py-6 px-6 sm:px-12 bg-ink-raised border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2 text-[12px]">
          <div><span className="font-mono text-white/55 uppercase tracking-[0.14em] text-[10px]">Industry</span><br /><span className="text-white">{study.strip.industry}</span></div>
          <div><span className="font-mono text-white/55 uppercase tracking-[0.14em] text-[10px]">Geography</span><br /><span className="text-white">{study.strip.geography}</span></div>
          <div><span className="font-mono text-white/55 uppercase tracking-[0.14em] text-[10px]">Duration</span><br /><span className="text-white">{study.strip.duration}</span></div>
          <div><span className="font-mono text-white/55 uppercase tracking-[0.14em] text-[10px]">Practices</span><br /><span className="text-white">{study.strip.practices}</span></div>
          <div><span className="font-mono text-white/55 uppercase tracking-[0.14em] text-[10px]">Anchored by</span><br /><span className="text-white">{study.strip.anchoredBy}</span></div>
        </div>
      </section>

      {/* Body — Context, Challenge, Approach, Outcomes */}
      <section className="py-20 lg:py-24 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <FadeUp>
            <h2 className="font-heading text-[24px] leading-[1.15] text-white mb-3">Context</h2>
            <p className="text-[16px] leading-[1.8] text-white/75">{study.context}</p>
          </FadeUp>

          <FadeUp delay={0.05}>
            <h2 className="font-heading text-[24px] leading-[1.15] text-white mb-3">Challenge</h2>
            <p className="text-[16px] leading-[1.8] text-white/75">{study.challenge}</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-heading text-[24px] leading-[1.15] text-white mb-3">Approach</h2>
            {study.approach.map((p, i) => (
              <p key={i} className="text-[16px] leading-[1.8] text-white/75 mb-4">{p}</p>
            ))}
          </FadeUp>

          <FadeUp delay={0.15}>
            <h2 className="font-heading text-[24px] leading-[1.15] text-white mb-3">Outcomes</h2>
            <ul className="space-y-2">
              {study.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-[15px] leading-[1.7] text-white">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="rounded-2xl bg-accent-blue/[0.05] border border-accent-blue/30 p-8 lg:p-10 relative">
              <Quote size={28} className="text-accent-blue/40 absolute top-6 left-6" aria-hidden="true" />
              <p className="font-display text-[20px] lg:text-[24px] leading-[1.4] text-white italic pl-10">"{study.quote.text}"</p>
              <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-white/75 pl-10">— {study.quote.attribution}</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">Tech stack:</span>
              <p className="text-[14px] text-white/75 mt-2">{study.techStack}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 lg:py-20 px-6 sm:px-12 bg-ink-raised border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 mb-6">// RELATED CASES</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {study.related.map((r) => {
              const rel = DEFAULT_CASE_STUDIES_DETAIL[r.slug];
              return (
                <Link key={r.slug} to={`/case-studies/${r.slug}`} className="group rounded-xl border border-white/10 bg-ink-base p-8 hover:border-accent-blueHover/30 transition-colors">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-accent-blue">{rel?.eyebrow ?? r.label.toUpperCase()}</p>
                  <h3 className="mt-3 font-display text-[22px] uppercase tracking-[0.04em] text-white group-hover:text-accent-blueHover transition-colors">{rel?.company ?? r.label}</h3>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-white/75">{rel?.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0 bg-brand-gradient" style={{ backgroundSize: '200% 200%' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-[1.05] max-w-3xl mb-6">Build with us.</h2>
            <p className="text-white/75 text-[16px] max-w-2xl mb-8">Same operating standard. Same documentation discipline. Same audit trail.</p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href="/consultation" label="Book a consultation" size="lg" />
              <AnimatedCTAButton href="/case-studies" label="See all case studies" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
