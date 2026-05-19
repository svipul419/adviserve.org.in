/**
 * About — Adviserve (Task 3 rebuild per §ABOUT)
 *
 * Five sub-sections in order:
 *   00.01° Hero (ASCIIText H1)
 *   00.02° The founding rationale (4 paragraphs, max-w-3xl, no bullets, no subheads)
 *   00.03° Holding-company contrast (two columns, no cards)
 *   00.04° The operating standard (single highlight card, brand-cream surface)
 *   00.05° Final CTA
 */
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import useReveal from '../components/designer/useReveal';
import EngineeringHero from '../components/sections/EngineeringHero';

export default function About() {
  useReveal();

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title="About Adviserve · Why this firm exists"
        description="Adviserve was incorporated in February 2026 to undo the fragmentation enterprises have been paying for — one firm, seven disciplines, one operating standard."
        canonical="https://adviserve.in/about"
      />

      {/* 00.01° HERO — Engineering blueprint cover sheet */}
      <EngineeringHero
        eyebrow="Why you should care who we are"
        title="You should not have to read four vendor reports to answer one board question."
        gradientPhrase="one board question."
        subtitle="Hire one team that already shares evidence, decisions, and accountability across seven practices. One operating standard. One answer."
        sheet="ABT"
        total="07"
        label="ABOUT · WHO WE ARE"
        mark="ABT"
      />

      {/* 00.02° THE FOUNDING RATIONALE */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // WHY THIS FIRM EXISTS — FOR YOU
            </p>
          </FadeUp>
          <div className="space-y-6">
            <FadeUp delay={0.05}>
              <p className="text-[17px] leading-[1.8] text-white/85">
                You are running a real operation. Your DPDP gap is a legal question, a security question and a hiring question — and right now you are asking three different vendors. Their reports do not align. Their timelines do not match. Their evidence is in three different formats. You spend more time stitching their work together than acting on it.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[17px] leading-[1.8] text-white/85">
                Adviserve was built so you stop doing that. One team owns the work across seven practices: cybersecurity, compliance, HR & staffing, IT consulting, legal, SaaS products, corporate training. Same intake. Same review gates. Same evidence format. When the auditor or the board asks, you answer in one document — not four.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="text-[17px] leading-[1.8] text-white/85">
                The seven practices were chosen because they are the practices that touch each other in your operating reality. Your security team needs the compliance team's findings. Your legal team needs the security architecture. Your HR team needs to close the skill gaps your IT estate exposes. We removed the handoffs between those teams so you do not have to manage them anymore.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-[17px] leading-[1.8] text-white/85">
                The company is young. The discipline is not. The founders ran enterprise training and advisory work for a decade before incorporating Adviserve in 2026 — and the firm runs against three audited ISO certifications from day one. We do not ask you to trust us. We ask you to read the trust page, take the DPDP self-assessment, and judge the work.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 00.03° HOLDING-COMPANY CONTRAST */}
      <section className="py-20 lg:py-24 bg-ink-base border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-10 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // WHAT THIS MEANS FOR YOUR DAY
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <FadeUp delay={0.05}>
              <h3 className="font-display text-[22px] uppercase tracking-[0.04em] text-white/55 mb-6">If you hire four vendors</h3>
              <ul className="space-y-4 text-[16px] leading-[1.75] text-white/75">
                <li>You become the switchboard between them.</li>
                <li>You translate their reports into one story for your board.</li>
                <li>You manage four contracts, four invoices, four review cycles.</li>
                <li>The handoffs are your problem when something breaks.</li>
              </ul>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h3 className="font-display text-[22px] uppercase tracking-[0.04em] text-white mb-6">If you hire Adviserve</h3>
              <ul className="space-y-4 text-[16px] leading-[1.75] text-white">
                <li>You get one team — they coordinate, not you.</li>
                <li>One report. One evidence pack. Board-ready, audit-ready.</li>
                <li>One contract. One SLA. One quarterly review.</li>
                <li>When something breaks, the same team picks it up. No finger-pointing.</li>
              </ul>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <p className="mt-14 text-center font-display text-[clamp(20px,2.4vw,28px)] leading-[1.4] text-white max-w-3xl mx-auto">
              You stop coordinating vendors. You start running the business.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 00.04° THE OPERATING STANDARD */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <div className="rounded-2xl bg-ink-base border border-white/10 p-8 lg:p-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-5">// PROOF YOU CAN HAND TO PROCUREMENT</p>
              <h3 className="font-display text-[clamp(26px,3vw,38px)] leading-[1.15] tracking-[-0.01em] text-white mb-6">
                Three independent auditors say we do what we say.
              </h3>
              <p className="text-[16px] leading-[1.8] text-white/80">
                You do not have to take our word for our process. ISO 9001:2015 means our quality system is audited. ISO/IEC 20000-1 means our IT service delivery is audited. ISO/IEC 27001 means our information security is audited. When your procurement team asks for our security posture, our sub-processor list, our audit logs — we hand over one document. You do not chase, you do not wait.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="chip-iso">ISO 9001:2015</span>
                <span className="chip-iso">ISO/IEC 20000-1</span>
                <span className="chip-iso">ISO/IEC 27001</span>
              </div>
              <Link to="/trust" className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] text-white hover:text-accent-blue transition-colors">
                Send this to your procurement team →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 00.05° FINAL CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #1e9df1 0%, #1a82d4 50%, #0F2F66 100%)' }} />
        <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(40% 60% at 20% 20%, rgba(255,255,255,.45), transparent), radial-gradient(50% 50% at 80% 80%, rgba(255,255,255,.25), transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6">
              You have a problem. We can tell you in 30 minutes whether we fit.
            </h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">
              Bring the question — DPDP, security, hiring, IT, anything in the middle. We will tell you which practice owns it, what it will cost, and how soon we can start. If we are not the right fit, we will say so.
            </p>
            <AnimatedCTAButton href="/consultation" label="Bring us the question" size="lg" />
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
