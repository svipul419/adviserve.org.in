import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import { useSectionReveal } from '../hooks/useSectionReveal';
import SEOHead from '../components/SEOHead';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../lib/api';
import { DEFAULT_CASE_STUDY_CARDS } from '../lib/defaults';
import EngineeringHero from '../components/sections/EngineeringHero';

import type { CaseStudyCardCMS } from '../lib/defaults';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CaseStudies() {
  const { data: apiCaseStudies } = useQuery({ queryKey: ['caseStudies'], queryFn: publicApi.getCaseStudies });
  // Map API fields (snake_case) to display fields, with DEFAULT fallback
  const caseStudies: CaseStudyCardCMS[] = (apiCaseStudies && apiCaseStudies.length > 0)
    ? apiCaseStudies.map((cs: { slug: string; title: string; industry: string; practices: unknown }) => {
        let practices: string[] = [];
        try {
          const raw = Array.isArray(cs.practices)
            ? cs.practices
            : typeof cs.practices === 'string'
              ? JSON.parse(cs.practices)
              : cs.practices;
          practices = Array.isArray(raw) ? (raw as string[]) : [];
        } catch { practices = []; }
        return { slug: cs.slug, title: cs.title, industry: cs.industry, practices };
      })
    : DEFAULT_CASE_STUDY_CARDS;

  const { content } = useSiteContent('case-studies');
  // heroFv removed — hero now uses EngineeringHero component
  void parseJsonContent<Record<string, boolean>>(content.cs_hero_field_visibility, {});
  const ctaFv = parseJsonContent<Record<string, boolean>>(content.cs_cta_field_visibility, {});

  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useSectionReveal();

  // Hero text entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroTextRef.current) return;

    const mono = heroTextRef.current.querySelector('.hero-mono');
    const heading = heroTextRef.current.querySelector('h1');
    const subtitle = heroTextRef.current.querySelector('.hero-subtitle');

    if (mono) gsap.fromTo(mono, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    if (heading) gsap.fromTo(heading, { scale: 0.6, y: 80, opacity: 0, rotateX: -20, transformPerspective: 1200 }, { scale: 1, y: 0, opacity: 1, rotateX: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 });
    if (subtitle) gsap.fromTo(subtitle, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.5 });
  }, { scope: heroRef });

  // Cards stagger entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.case-card');
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0, scale: 0.95, rotateX: -8, transformPerspective: 1200 },
        {
          y: 0, opacity: 1, scale: 1, rotateX: 0,
          duration: 0.9, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });
  }, { dependencies: [caseStudies], revertOnUpdate: true });

  return (
    <div className="flex flex-col bg-ink-raised">
      <SEOHead
        title="Case Studies | Adviserve — HR, Recruitment, Legal & Business Advisory Results"
        description="Real engagements. Real outcomes. Every case study shows how integrating multiple practices under one team delivers results that siloed vendors cannot."
        canonical="https://adviserve.org.in/case-studies"
      />

      <EngineeringHero
        eyebrow="The work, not the pitch"
        title={content.cs_hero_heading || 'See what a problem like yours looked like — and how it closed.'}
        gradientPhrase="how it closed."
        subtitle={content.cs_hero_subtitle || "Engagement type, trigger, what we built, what changed. No anonymous testimonials. No round numbers. If a metric is here, we will tell you how it was measured."}
        sheet="CS"
        total="07"
        label="CASE STUDIES · OUTCOMES"
        mark="CS"
      />

      {/* Divider */}
      <div className="relative h-8 overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="w-8 h-[1px] bg-white/20" />
          <div className="w-2 h-2 border border-accent-blue/20 rotate-45" />
          <div className="w-8 h-[1px] bg-white/20" />
        </div>
      </div>

      {/* Case Study Cards */}
      <section className="py-16 md:py-24 bg-ink-base">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                to={`/case-studies/${cs.slug}`}
                className="case-card card-magnetic group relative bg-ink-base border border-white/10 p-8 hover:border-accent-blueHover/40 transition-all duration-500"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-blue/0 group-hover:bg-accent-blueHover transition-all duration-500 origin-top" />

                {/* Industry badge */}
                <span className="inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 bg-accent-blue/[0.06] px-3 py-1.5 mb-5">
                  {cs.industry}
                </span>

                {/* Title */}
                <h3 className="font-heading text-lg md:text-xl font-bold text-black leading-snug mb-6 tracking-tight">
                  {cs.title}
                </h3>

                {/* Practice tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(cs.practices) ? cs.practices : []).map((p) => (
                    <span key={p} className="text-[11px] font-medium text-black/50 border border-white/10 px-2.5 py-1">
                      {p}
                    </span>
                  ))}
                </div>

                {/* Read link */}
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 group-hover:gap-3 transition-all duration-300">
                  Read Case Study
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-reveal relative py-16 md:py-24 bg-ink-base border-t border-white/10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {ctaFv['heading'] !== false && <h2 className="section-title font-heading text-3xl md:text-4xl font-extrabold text-black mb-5 tracking-tight">
            {content.cs_cta_heading || 'Ready to be our next success story?'}
          </h2>}
          {ctaFv['body'] !== false && <p className="section-content text-black/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {content.cs_cta_body || "Every case study started with a single conversation. Tell us about your challenge, and we'll show you what's possible."}
          </p>}
          <div className="section-content flex flex-col sm:flex-row gap-4 justify-center">
            {ctaFv['primary_cta'] !== false && <AnimatedCTAButton href={content.cs_cta_primary_href || '/book'} label={content.cs_cta_primary_text || 'Book a Consultation'} />}
            {ctaFv['secondary_cta'] !== false && <AnimatedCTAButton href={content.cs_cta_secondary_href || '/services'} label={content.cs_cta_secondary_text || 'Explore Our Services'} variant="secondary" />}
          </div>
        </div>
      </section>
    </div>
  );
}
