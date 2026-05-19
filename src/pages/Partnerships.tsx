/**
 * Partnerships — §PARTNERSHIPS. Three category cards. No fabricated logos.
 */
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';

const PARTNER_CATEGORIES = [
  {
    title: 'Cloud & Infrastructure',
    body: 'AWS, Microsoft Azure, Google Cloud. Active across migration, architecture, and capability building.',
  },
  {
    title: 'Enterprise Platforms',
    body: 'ServiceNow, Salesforce, SAP. Implementation and training capability built through real engagements.',
  },
  {
    title: 'Learning & Capability',
    body: 'LMS platform — to be specified.',
  },
];

export default function Partnerships() {
  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Partnerships | Adviserve" description="Strategic technology and delivery partnerships. Active engagement, formal listings to follow." canonical="https://adviserve.org.in/partnerships" />

      <EngineeringHero
        eyebrow="If you build the tools, we bring the demand"
        title="Partner with a firm your clients already trust."
        gradientPhrase="your clients already trust."
        subtitle="Cloud, security, identity, ATS, LMS — if your platform sits inside one of our seven practices, we are interested. Co-engagements, referral economics, joint roadmaps. Send us your one-liner."
        sheet="PRT"
        total="07"
        label="PARTNERSHIPS · CO-DELIVERY"
        mark="PRT"
      />

      {/* Categories */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNER_CATEGORIES.map((c, i) => (
              <FadeUp key={c.title} delay={0.05 * i}>
                <div className="h-full rounded-xl border border-white/10 bg-ink-base p-8 flex flex-col gap-4">
                  <h3 className="font-display text-[20px] uppercase tracking-[0.04em] text-white">{c.title}</h3>
                  <p className="text-[14px] leading-[1.75] text-white/75">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.25}>
            <p className="mt-12 max-w-3xl text-[15px] leading-[1.75] text-white/70 border-l-2 border-accent-blue/30 pl-6 italic">
              Working alongside leading platforms in cloud, enterprise software, and capability. Formal partnership listings to follow as agreements finalise.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #1e9df1 0%, #1a82d4 50%, #0F2F66 100%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6">Build with us.</h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">Cloud migration, platform implementation, capability uplift — anchored by audited standards.</p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href="/consultation" label="Book a consultation" size="lg" />
              <AnimatedCTAButton href="/contact" label="Talk to the team" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
