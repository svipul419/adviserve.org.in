/**
 * Services — Adviserve dossier sheet for the seven practices.
 *
 * Engineering blueprint vocabulary throughout: bone-paper hero with cyan
 * grid + crosshairs + dimension callout + drafting title-block, sticky-stack
 * cards for all seven practices, engagement stages rendered as numbered
 * drafting steps, blue gradient CTA at the close.
 */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import StickyFeatureSection from '../components/sections/StickyFeatureSection';

const ACCENT = '#1e9df1';
const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
})();

interface Stage { num: string; title: string; body: string }
const STAGES: Stage[] = [
  { num: '01', title: 'Diagnose', body: 'Map systems, vendors and data flows. You sign before we build.' },
  { num: '02', title: 'Design',   body: 'Architecture, RACI, milestones, SLA — documented and approved.' },
  { num: '03', title: 'Build',    body: 'Phased rollout. Audit-ready evidence at every gate.' },
  { num: '04', title: 'Run',      body: 'Managed service from day one. SLAs, change control, runbooks.' },
  { num: '05', title: 'Transfer', body: 'Your team owns the work and the evidence trail.' },
];

export default function Services() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;
    const blob = heroRef.current.querySelector('.hero-blob');
    if (blob) {
      gsap.to(blob, { y: 160, scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } });
    }
  }, { scope: heroRef });

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title="Services · Seven disciplines | Adviserve"
        description="Seven disciplines. One firm. Cybersecurity, Compliance & RegTech, HR Services, IT Consulting, Legal Consulting, SaaS Products, Corporate Training — anchored by three ISO certifications."
        canonical="https://adviserve.in/services"
      />

      {/* ═══ HERO — Cover Sheet for the practices dossier ═══ */}
      <section
        ref={heroRef}
        className="relative pt-[120px] pb-24 lg:pb-32 overflow-hidden"
        style={{
          background: `
            linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
            linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
            linear-gradient(rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
            linear-gradient(90deg, rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
            #FBFDFF
          `,
          borderBottom: `1px solid ${ACCENT}22`,
        }}
      >
        {/* Center vignette */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(120% 80% at 50% 50%, rgba(251,253,255,0.92) 0%, rgba(251,253,255,0.55) 60%, transparent 90%)' }}
        />

        {/* 4 corner registration crosshairs */}
        {([
          { key: 'tl', top: 14, left: 14 },
          { key: 'tr', top: 14, right: 14 },
          { key: 'bl', bottom: 14, left: 14 },
          { key: 'br', bottom: 14, right: 14 },
        ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number }>).map((m) => (
          <span key={m.key} aria-hidden="true" className="absolute pointer-events-none z-[2]"
            style={{ width: 16, height: 16, top: m.top, left: m.left, right: m.right, bottom: m.bottom }}>
            <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `${ACCENT}AA` }} />
            <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `${ACCENT}AA` }} />
            <span style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px solid ${ACCENT}AA` }} />
          </span>
        ))}

        {/* Top dimension callout */}
        <div aria-hidden="true" className="absolute top-[140px] left-[clamp(2rem,5vw,5rem)] right-[clamp(2rem,5vw,5rem)] z-[2] flex items-center pointer-events-none">
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>◀</span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="px-2 font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: `${ACCENT}DD` }}>
            SHEET 01 · SERVICES · DOSSIER OPEN
          </span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>▶</span>
        </div>

        {/* Wireframe SVC numeral bottom-right */}
        <span aria-hidden="true" className="absolute right-[clamp(1rem,3vw,3rem)] bottom-[clamp(-2rem,-1vw,0rem)] z-[2] font-display leading-none pointer-events-none select-none"
          style={{ fontSize: 'clamp(10rem, 22vw, 24rem)', color: 'transparent', WebkitTextStroke: `1.5px ${ACCENT}44`, letterSpacing: '-0.05em' }}>
          SVC
        </span>

        {/* Drafting title-block bottom-right */}
        <div className="absolute bottom-[clamp(1rem,2.5vw,2rem)] right-[clamp(1rem,2.5vw,2rem)] z-[3] pointer-events-none hidden sm:grid grid-cols-2 text-[9.5px] font-mono tracking-[0.18em] uppercase leading-[1.6]"
          style={{ color: `${ACCENT}DD`, background: 'rgba(251,253,255,0.92)', border: `1px solid ${ACCENT}55`, minWidth: 220 }}>
          <div className="px-3 py-1.5 border-r border-b" style={{ borderColor: `${ACCENT}55` }}>
            <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>SCALE</div>
            <div className="font-bold">1 : 1</div>
          </div>
          <div className="px-3 py-1.5 border-b" style={{ borderColor: `${ACCENT}55` }}>
            <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>DATE</div>
            <div className="font-bold">{today}</div>
          </div>
          <div className="px-3 py-1.5 col-span-2">
            <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>SECTION · SERVICES</div>
            <div className="font-bold text-[10.5px]" style={{ color: ACCENT, letterSpacing: '0.14em' }}>SEVEN PRACTICES</div>
          </div>
        </div>

        {/* Vertical rotated rail */}
        <div aria-hidden="true" className="hidden md:flex absolute right-3 top-1/2 z-[3] -translate-y-1/2 origin-center -rotate-90 items-center gap-3 pointer-events-none">
          <span className="block w-8 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase whitespace-nowrap" style={{ color: `${ACCENT}DD` }}>
            Adviserve · Practices
          </span>
          <span className="block w-8 h-px" style={{ background: `${ACCENT}55` }} />
        </div>

        <div className="relative z-[4] max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-7 flex items-center gap-2" style={{ color: `${ACCENT}DD` }}>
              <span className="w-7 h-px" style={{ background: ACCENT }} />
              // What you can hire us for
            </p>
            <h1
              className="font-display text-[clamp(36px,5.4vw,76px)] leading-[1.06] tracking-[-0.02em] text-[#0B1426] max-w-[18ch] mb-8"
              style={{ fontWeight: 400 }}
            >
              Pick the problem{' '}
              <span style={{
                background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}>we solve first.</span>
            </h1>
            <p className="text-[17px] leading-[1.65] text-[rgba(11,20,38,0.66)] max-w-2xl">
              Seven practices, one team. Hire the practice that owns your immediate trigger — the others are already wired in. When your DPDP gap turns into a security gap turns into a hiring gap, nothing falls between cracks.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ═══ STICKY STACK — all seven practices ═══ */}
      <StickyFeatureSection />

      {/* ═══ ENGAGEMENT — five numbered drafting steps ═══ */}
      <section id="engagement" className="relative py-24 lg:py-32 overflow-hidden"
        style={{
          background: `
            linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
            linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
            #FBFDFF
          `,
          borderTop: `1px solid ${ACCENT}33`,
          borderBottom: `1px solid ${ACCENT}33`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-6 flex items-center justify-center gap-2" style={{ color: `${ACCENT}DD` }}>
              <span className="w-7 h-px" style={{ background: ACCENT }} />
              // How your engagement runs
              <span className="w-7 h-px" style={{ background: ACCENT }} />
            </p>
            <h2
              className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] text-[#0B1426] mb-3 max-w-[28ch] mx-auto"
              style={{ fontWeight: 400 }}
            >
              Five stages.{' '}
              <span style={{
                background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}>No surprises in the invoice.</span>
            </h2>
            <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto text-[rgba(11,20,38,0.66)] mb-14">
              You sign off the scope before we build. You sign off the design before we run. You keep the evidence. Same five stages whether you are running a one-week DPDP audit or a year-long IT rebuild.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STAGES.map((s, i) => (
              <FadeUp key={s.num} delay={0.04 * i}>
                <div className="relative p-6 flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-26px_rgba(30,157,241,0.45)]"
                  style={{ background: '#FBFDFF', border: `1px solid ${ACCENT}40` }}>
                  {/* Corner ticks */}
                  <span aria-hidden="true" className="absolute top-2 left-2" style={{ width: 10, height: 10, borderTop: `1px solid ${ACCENT}AA`, borderLeft: `1px solid ${ACCENT}AA` }} />
                  <span aria-hidden="true" className="absolute bottom-2 right-2" style={{ width: 10, height: 10, borderBottom: `1px solid ${ACCENT}AA`, borderRight: `1px solid ${ACCENT}AA` }} />
                  {/* Top dimension rule */}
                  <div className="flex items-center gap-2 mb-4 font-mono text-[9px] tracking-[0.24em] uppercase" style={{ color: `${ACCENT}DD` }}>
                    <span className="font-bold" style={{ color: ACCENT }}>{s.num}</span>
                    <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
                    <span>STAGE</span>
                  </div>
                  <h3 className="font-display text-[clamp(20px,1.8vw,26px)] leading-[1.1] tracking-[-0.015em] text-[#0B1426] mb-2" style={{ fontWeight: 400 }}>
                    {s.title}
                  </h3>
                  <p className="font-sans text-[13px] leading-[1.6] text-[rgba(11,20,38,0.66)]">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA — blue gradient close band ═══ */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #1e9df1 0%, #1a82d4 50%, #0F2F66 100%)' }} />
        <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(40% 60% at 20% 20%, rgba(255,255,255,.45), transparent), radial-gradient(50% 50% at 80% 80%, rgba(255,255,255,.25), transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-7 flex items-center gap-2 text-white/80">
              <span className="w-7 h-px bg-white/60" />
              // Map your trigger
            </p>
            <h2
              className="font-display text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6 text-white"
              style={{ fontWeight: 400 }}
            >
              Cannot tell which practice owns your problem? Neither could most of our clients on day one.
            </h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">
              That is what the call is for. Thirty minutes. We map your trigger to a practice, give you a rough cost and timeline, and say so if you should hire someone else.
            </p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href="/consultation" label="Map my problem in 30 minutes" size="lg" variant="on-dark" />
              <Link
                to="#engagement"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-[11px] tracking-[0.22em] uppercase text-white border border-white/40 hover:bg-white/10 transition-colors"
              >
                See the five stages
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
