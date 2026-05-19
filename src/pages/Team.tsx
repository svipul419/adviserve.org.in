/**
 * Team — §TEAM. Founder lead card only. No placeholder "TBD" practice leads.
 * Real names/photos/bios to be supplied by user.
 */
import { Link } from 'react-router-dom';
import { Linkedin, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';

// PLACEHOLDER — replace with real founder data once supplied by user.
// Spec is explicit: do not render TBD practice-lead cards.
const FOUNDER = {
  name: 'Adviserve Founders',
  role: 'Founders & Practice Leads',
  bio: [
    'A decade of enterprise training and advisory work behind us — across cloud, software engineering, data, AI, project management, and behavioural skills. We watched the same problem repeat: enterprises paying four vendors to coordinate one operating standard.',
    'Adviserve was incorporated in 2026 to remove that coordination tax. One firm, seven practices, one evidence format. Senior practitioners on the call are the ones doing the work — no bait-and-switch staffing.',
  ],
  linkedin: '/contact',
  initials: 'AD',
};

const PRACTICE_LEADS: Array<{ name: string; role: string; bio: string; linkedin: string; initials: string }> = [];

export default function Team() {
  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Team · The practitioners behind the practice | Adviserve" description="Adviserve is led by practitioners — people who ran the work for a decade before incorporating the firm." canonical="https://adviserve.in/team" />

      <EngineeringHero
        eyebrow="You will talk to these people — not a junior"
        title="The people who will own your engagement."
        gradientPhrase="own your engagement."
        subtitle="No bait-and-switch staffing. The senior practitioners you meet on the call are the ones writing your evidence pack, signing the design gate and answering the auditor. Decade of work behind the practice. New firm — same people."
        sheet="TM"
        total="07"
        label="TEAM · PRACTITIONERS"
        mark="TM"
      />

      {/* Founder + practice lead grid */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Founder lead card — col-span-2 on lg */}
            <FadeUp className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-8 rounded-2xl border border-white/10 bg-ink-base p-6 sm:p-8">
                {/* Photo placeholder */}
                <div className="w-full h-[300px] sm:h-[380px] rounded-2xl bg-[#e5e5dd] flex items-center justify-center relative overflow-hidden">
                  <span className="font-display text-[80px] text-white uppercase select-none">{FOUNDER.initials}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-blue" />
                </div>
                {/* Text */}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-3">// FOUNDER</p>
                  <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.05] tracking-[-0.01em] text-white mb-2">
                    {FOUNDER.name}
                  </h2>
                  <p className="text-accent-blue font-medium text-[14px] tracking-[0.04em] uppercase mb-5">{FOUNDER.role}</p>
                  <div className="space-y-4">
                    {FOUNDER.bio.map((para, i) => (
                      <p key={i} className="text-[15px] leading-[1.75] text-white/80">{para}</p>
                    ))}
                  </div>
                  {FOUNDER.linkedin && FOUNDER.linkedin !== '#' && (
                    <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-white/75 hover:text-accent-blueHover transition-colors">
                      <Linkedin size={18} />
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em]">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Practice lead cards render only if appointed */}
            {PRACTICE_LEADS.length === 0 ? (
              <FadeUp delay={0.1}>
                <div className="h-full rounded-2xl border border-dashed border-accent-blue/30 bg-accent-blue/[0.04] p-8 flex flex-col gap-4 justify-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75">// PRACTICE LEADS</p>
                  <h3 className="font-display text-[22px] uppercase tracking-[0.04em] text-white">Hiring across all seven practices.</h3>
                  <p className="text-[14px] leading-[1.7] text-white/75">Senior practitioners — written-first, evidence-led, audit-comfortable.</p>
                  <Link to="/careers" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-white hover:text-accent-blue transition-colors">
                    See open roles <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeUp>
            ) : (
              PRACTICE_LEADS.map((p, i) => (
                <FadeUp key={p.name} delay={0.05 * (i + 1)}>
                  <div className="h-full rounded-2xl border border-white/10 bg-ink-base p-6 flex flex-col gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#f0efeb] flex items-center justify-center">
                      <span className="font-display text-[20px] text-white uppercase">{p.initials}</span>
                    </div>
                    <h3 className="font-display text-[18px] uppercase tracking-[0.04em] text-white">{p.name}</h3>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-white/75 uppercase">{p.role}</p>
                    <p className="text-[13px] leading-[1.7] text-white/70 flex-1">{p.bio}</p>
                  </div>
                </FadeUp>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0 bg-brand-gradient" style={{ backgroundSize: '200% 200%' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6">
              Hiring across all seven practices.
            </h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">
              Senior practitioners — written-first, evidence-led, audit-comfortable. Send us a CV even if we haven't posted the role.
            </p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href="/careers" label="See open roles" size="lg" />
              <AnimatedCTAButton href="/contact?type=speculative" label="Speculative application" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
