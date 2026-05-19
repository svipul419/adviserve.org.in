/**
 * Trust — §TRUST. Audited certifications + data handling + contact.
 */
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';

const CERTIFICATIONS = [
  {
    code: 'ISO 9001:2015',
    title: 'Quality Management',
    body: 'Governs how we run the firm. Documented processes, documented decisions, documented review at every engagement gate. Quality is not a checklist. It is whether the firm produces the same standard of work in month one and in month thirty-six.',
  },
  {
    code: 'ISO/IEC 20000-1',
    title: 'IT Service Management',
    body: "Governs how we deliver and run technology engagements. Documented SLAs, change-control governance, incident protocols, continuous service improvement. This is why IT engagements at Adviserve don't end at handoff.",
  },
  {
    code: 'ISO/IEC 27001',
    title: 'Information Security Management',
    body: 'Governs how we handle data — yours and ours. Risk-based controls, encryption at rest and in transit, role-based access, audit logs, continuous control review. Every cybersecurity, compliance, and SaaS engagement runs inside this envelope by default.',
  },
];

const DATA_CARDS = [
  { title: 'Encryption', body: 'AES-256 at rest. TLS 1.3 in transit.' },
  { title: 'Access', body: 'Role-based, audit-logged.' },
  { title: 'Audit', body: 'Tamper-evident logs, continuous control review.' },
];

export default function Trust() {
  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Trust · Audited standards behind every engagement | Adviserve" description="Three audited certifications. One way of working. Documented at every gate." canonical="https://adviserve.in/trust" />

      <EngineeringHero
        eyebrow="When procurement asks, send this"
        title="Your due-diligence pack, already audited."
        gradientPhrase="already audited."
        subtitle="Three independent auditors. ISO 9001, ISO/IEC 20000-1, ISO/IEC 27001. Sub-processor list, encryption posture, access logs — one page, current, ready to send."
        sheet="TRT"
        total="07"
        label="TRUST · CERTIFICATIONS"
        mark="TRT"
      />

      {/* Certifications */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-10">// THE THREE CERTIFICATIONS</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((c, i) => (
              <FadeUp key={c.code} delay={0.05 * i}>
                <div className="h-full rounded-xl border border-white/10 bg-ink-base p-6 flex flex-col gap-3">
                  <span className="self-start chip-iso">
                    {c.code}
                  </span>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-white/75 uppercase">{c.title}</p>
                  <p className="text-[14px] leading-[1.75] text-white/80">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.2}>
            <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">Certificates available on request.</p>
          </FadeUp>
        </div>
      </section>

      {/* How we handle your data */}
      <section className="py-20 lg:py-24 bg-ink-base border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7">// HOW WE HANDLE YOUR DATA</p>
            <p className="text-[17px] leading-[1.8] text-white/85 max-w-3xl">
              As a DPDP first-mover practice, our own data handling is governed by the same standard we apply to client engagements. Personal data flows are documented. Retention policies are explicit. Breach and grievance processes are operationalised.
            </p>
          </FadeUp>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DATA_CARDS.map((c, i) => (
              <FadeUp key={c.title} delay={0.05 * i}>
                <div className="rounded-xl border border-white/10 bg-ink-raised p-5">
                  <p className="font-display text-[15px] uppercase tracking-[0.04em] text-white mb-2">{c.title}</p>
                  <p className="text-[13px] leading-[1.7] text-white/70">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.25}>
            <p className="mt-8 text-[14px] text-white/70">
              Sub-processor list and full security posture available on request — <a href="mailto:trust@adviserve.in" className="font-mono text-[12px] tracking-[0.14em] text-white hover:text-accent-blue transition-colors">trust@adviserve.in</a>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-10">// CONTACT</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-ink-base p-6">
              <p className="font-display text-[16px] uppercase tracking-[0.04em] text-white">Security questionnaires and due diligence</p>
              <a href="mailto:trust@adviserve.in" className="mt-3 inline-block font-mono text-[13px] tracking-[0.12em] text-white hover:text-accent-blue transition-colors">trust@adviserve.in</a>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink-base p-6">
              <p className="font-display text-[16px] uppercase tracking-[0.04em] text-white">DPDP-specific inquiries</p>
              <a href="mailto:compliance@adviserve.in" className="mt-3 inline-block font-mono text-[13px] tracking-[0.12em] text-white hover:text-accent-blue transition-colors">compliance@adviserve.in</a>
            </div>
          </div>
          <FadeUp delay={0.2}>
            <div className="mt-12">
              <AnimatedCTAButton href="/consultation" label="Book a consultation" size="lg" />
              <Link to="/dpdp-assessment" className="ml-4 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-white hover:text-accent-blue transition-colors">
                Free DPDP self-assessment →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
