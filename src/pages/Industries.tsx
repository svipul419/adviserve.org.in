/**
 * Industries — §INDUSTRIES. Six-cell grid: 5 industry cards + 1 CTA card.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';

const INDUSTRIES = [
  { name: 'Financial Services & BFSI', body: 'You are stacked under RBI, SEBI, DPDP and sectoral norms — and your auditor wants evidence next month. Compliance, security and legal engagements move fastest in your shoes.' },
  { name: 'Manufacturing & Industrial', body: 'Your OT and IT teams answer to different bosses and use different vocabularies. We bring the security posture, IT modernisation and people-capability work into one engagement.' },
  { name: 'IT, SaaS & Technology Services', body: 'You answer a vendor questionnaire a week and you are still hiring engineers. We handle the evidence pack and the calibrated hires — so your CTO stops being a recruiter.' },
  { name: 'Real Estate & Infrastructure', body: 'You manage hundreds of contractors, a slow procurement cycle, and compliance debt that compounds quarterly. We absorb the coordination — you keep the projects moving.' },
  { name: 'Pharma & Life Sciences', body: 'Regulatory documentation, data governance, GxP-adjacent training. We sit alongside your QA team — same evidence formats, same review gates.' },
];

export default function Industries() {
  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Industries · Sector contexts | Adviserve" description="Disciplines are universal. Contexts are not. We engage with sector context — not without it." canonical="https://adviserve.org.in/industries" />

      {/* Hero — engineering cover sheet */}
      <EngineeringHero
        eyebrow="Work in your sector, not generic"
        title="We have already worked where you operate."
        gradientPhrase="where you operate."
        subtitle="Security in banking is not security in manufacturing. DPDP in pharma is not DPDP in real estate. The disciplines transfer; the regulators, the auditors and the operating realities do not. Pick your sector below."
        sheet="IND"
        total="07"
        label="INDUSTRIES · SECTORS"
        mark="IND"
      />

      {/* Grid */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind, i) => (
              <FadeUp key={ind.name} delay={Math.min(0.05 * i, 0.2)}>
                <div className="h-full rounded-xl border border-[rgba(11,20,38,0.10)] bg-background p-6 flex flex-col gap-3 hover:border-[#1e9df1]/35 hover:shadow-[0_18px_40px_-22px_rgba(30,157,241,0.30)] transition-all">
                  <h3 className="font-display text-[20px] uppercase tracking-[0.04em] text-white">{ind.name}</h3>
                  <p className="text-[14px] leading-[1.7] text-white/75">{ind.body}</p>
                </div>
              </FadeUp>
            ))}
            <FadeUp delay={0.25}>
              <Link to="/contact" className="group h-full rounded-xl border border-dashed border-accent-blue/40 bg-accent-blue/[0.05] hover:bg-accent-blueHover/10 transition-colors p-6 flex flex-col gap-3">
                <h3 className="font-display text-[20px] uppercase tracking-[0.04em] text-white">Your sector is not listed?</h3>
                <p className="text-[14px] leading-[1.7] text-white/75 flex-1">Send us a one-line description. We will tell you whether the discipline transfers — and which of our practices fits your operating reality.</p>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/75 mt-auto">
                  Send a one-liner <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Final CTA — blue gradient with white text, intentional accent band. */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #1e9df1 0%, #1a82d4 50%, #0F2F66 100%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6">Bring us a sector-specific problem. We bring the standard.</h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">Thirty minutes. Tell us what regulator you answer to and what is breaking. We will tell you which practice fits and what it will cost.</p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href="/consultation" label="Bring us the question" size="lg" />
              <AnimatedCTAButton href="/services" label="See the seven practices" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
