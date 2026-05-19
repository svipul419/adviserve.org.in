/**
 * StickyFeatureSection — sticky-stacking feature cards.
 *
 * Adapted from the user-supplied 21st.dev pattern. Each card pins at the
 * same `top` so successive cards stack on top of the previous one as the
 * reader scrolls, creating a deck of layered drawing sheets.
 *
 * Adviserve adaptations:
 *   • Yellow/amber/orange tints → brand-blue palette (matches site theme).
 *   • Generic AI feature copy → four Adviserve practice highlights.
 *   • Sans titles → font-display serif at Top-Stories typographic spec.
 *   • Engineering chrome: per-card index (01–04), hairline rules, corner
 *     tick, mono "PRACTICE" eyebrow with the brand-gradient highlight word.
 */
import { useEffect, useRef, useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ACCENT = '#1e9df1';

interface Feature {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  bg: string;
  border: string;
}

const FEATURES: Feature[] = [
  {
    index: '01', eyebrow: 'PRACTICE',
    title: 'Reply to the next vendor questionnaire in hours, not weeks.',
    description: 'Cybersecurity that produces evidence your procurement team can send. ISMS, controls, sub-processor list and breach response — answered same-day.',
    cta: 'See the security work', href: '/services/cybersecurity',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400&q=85&auto=format&fit=crop',
    bg: '#F4F9FF', border: 'rgba(30,157,241,0.20)',
  },
  {
    index: '02', eyebrow: 'PRACTICE',
    title: 'Map your DPDP gaps before the regulator does.',
    description: 'Compliance and RegTech delivered under counsel. Data inventory, consent log, breach playbook, audit-ready evidence pack in a quarter.',
    cta: 'Find your DPDP gaps', href: '/services/compliance-regtech',
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1400&q=85&auto=format&fit=crop',
    bg: '#E4F0FE', border: 'rgba(30,157,241,0.22)',
  },
  {
    index: '03', eyebrow: 'PRACTICE',
    title: 'Hire someone defensible — who performs in 90 days.',
    description: 'Calibrated shortlists, role-outcome scoring, training that closes screening gaps. We sign our name to every hire we recommend.',
    cta: 'Hire someone who delivers', href: '/services/hr-services',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&q=85&auto=format&fit=crop',
    bg: '#D2E5FB', border: 'rgba(30,157,241,0.26)',
  },
  {
    index: '04', eyebrow: 'PRACTICE',
    title: 'Run your IT estate without the drift after handoff.',
    description: 'IT as managed service — runbooks, SLAs, audit trails from day one. The work you signed off on stays running.',
    cta: 'Make IT hold together', href: '/services/it-services',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop',
    bg: '#BFDDFB', border: 'rgba(30,157,241,0.30)',
  },
  {
    index: '05', eyebrow: 'PRACTICE',
    title: 'Counsel who reads the architecture, not just the agreement.',
    description: 'Legal consulting that sits inside the security, compliance and IT teams. Same review gates. Same evidence. Clauses defended by the work.',
    cta: 'Talk to counsel who gets it', href: '/services/legal-consulting',
    image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1400&q=85&auto=format&fit=crop',
    bg: '#A8CDF8', border: 'rgba(30,157,241,0.32)',
  },
  {
    index: '06', eyebrow: 'PRACTICE',
    title: 'Stop renting your compliance, hiring and HR stack.',
    description: 'Three SaaS products built to our operating standard — encrypted, role-based, audit-logged. Bespoke modules when off-the-shelf does not fit.',
    cta: 'See what we are building', href: '/services/saas-products',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&q=85&auto=format&fit=crop',
    bg: '#90BDF4', border: 'rgba(30,157,241,0.36)',
  },
  {
    index: '07', eyebrow: 'PRACTICE',
    title: 'Build people who do the work better next quarter.',
    description: 'Corporate training designed against role outcomes, measured at Kirkpatrick L3 / L4. Behavior change on the job, not recall in the room.',
    cta: 'Train for outcomes', href: '/services/corporate-training',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&q=85&auto=format&fit=crop',
    bg: '#79ADEF', border: 'rgba(30,157,241,0.40)',
  },
];

function useScrollReveal(threshold = 0.15) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function AnimatedHeader() {
  const [hRef, hInView] = useScrollReveal();
  const [pRef, pInView] = useScrollReveal();
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-5 flex items-center justify-center gap-2" style={{ color: `${ACCENT}DD` }}>
        <span className="w-7 h-px" style={{ background: ACCENT }} />
        <span>// Practices · Stacked View</span>
        <span className="w-7 h-px" style={{ background: ACCENT }} />
      </p>
      <h2
        ref={hRef as React.RefObject<HTMLHeadingElement>}
        className={`font-display text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] text-[#0B1426] transition-all duration-700 ease-out ${hInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ fontWeight: 400 }}
      >
        Pick a practice, the others{' '}
        <span style={{
          background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}>wire in.</span>
      </h2>
      <p
        ref={pRef as React.RefObject<HTMLParagraphElement>}
        className={`text-[15px] leading-[1.7] max-w-[64ch] mx-auto mt-4 text-[rgba(11,20,38,0.66)] transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        Scroll. Each sheet pins on top of the last — same way our practices stack on a real engagement.
      </p>
    </div>
  );
}

export default function StickyFeatureSection() {
  const uid = useId();
  return (
    <section className="relative bg-background">
      <div className="px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="py-20 md:py-32 flex flex-col items-center">
            <AnimatedHeader />

            <div className="w-full">
              {FEATURES.map((f, i) => (
                <article
                  key={`${uid}-${i}`}
                  className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10 p-8 md:p-12 rounded-3xl mb-16 sticky overflow-hidden"
                  style={{
                    top: '120px',
                    background: f.bg,
                    border: `1px solid ${f.border}`,
                    boxShadow: '0 30px 60px -40px rgba(11,20,38,0.30)',
                  }}
                >
                  {/* Corner registration tick top-left */}
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-3 pointer-events-none"
                    style={{
                      width: 14, height: 14,
                      borderTop: `1.5px solid ${ACCENT}AA`,
                      borderLeft: `1.5px solid ${ACCENT}AA`,
                    }}
                  />
                  {/* Corner registration tick bottom-right */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 pointer-events-none"
                    style={{
                      width: 14, height: 14,
                      borderBottom: `1.5px solid ${ACCENT}AA`,
                      borderRight: `1.5px solid ${ACCENT}AA`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-center">
                    <p className="font-mono text-[10px] tracking-[0.32em] uppercase mb-5 flex items-center gap-2" style={{ color: `${ACCENT}DD` }}>
                      <span className="font-bold tabular-nums" style={{ color: ACCENT }}>{f.index}</span>
                      <span className="w-4 h-px" style={{ background: `${ACCENT}66` }} />
                      <span>{f.eyebrow}</span>
                    </p>
                    <h3
                      className="font-display text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[-0.015em] text-[#0B1426] mb-5"
                      style={{ fontWeight: 400 }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[rgba(11,20,38,0.72)] mb-7 max-w-[52ch]">
                      {f.description}
                    </p>
                    <Link
                      to={f.href}
                      className="group inline-flex items-center gap-2 self-start font-mono text-[11px] tracking-[0.22em] uppercase font-bold transition-colors text-[#0B1426] hover:text-[#1e9df1]"
                    >
                      <span>{f.cta}</span>
                      <span className="w-8 h-px transition-all group-hover:w-12" style={{ background: ACCENT }} />
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="relative z-10 mt-2 md:mt-0">
                    <div className="relative overflow-hidden rounded-2xl" style={{ border: `1px solid ${ACCENT}33`, boxShadow: '0 18px 40px -22px rgba(11,20,38,0.30)' }}>
                      <img
                        src={f.image}
                        alt={f.title}
                        loading="lazy"
                        className="w-full h-auto aspect-[4/3] object-cover"
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.onerror = null;
                          t.src = 'https://placehold.co/800x600/EFF7FF/1e9df1?text=Adviserve';
                        }}
                      />
                      {/* Plate label tag on the image */}
                      <span
                        className="absolute top-3 left-3 px-2 py-1 font-mono text-[9px] tracking-[0.24em] uppercase"
                        style={{
                          background: 'rgba(251,253,255,0.95)',
                          border: `1px solid ${ACCENT}66`,
                          color: ACCENT,
                        }}
                      >
                        Plate {f.index} / {String(FEATURES.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
