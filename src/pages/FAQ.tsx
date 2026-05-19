import { useState, useRef, useMemo, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import EngineeringHero from '../components/sections/EngineeringHero';

/* ───── FAQ Data ───── */

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// \u00a7FAQ — eight questions across three categories. No claimed metrics.
const DEFAULT_FAQ_DATA: FAQItem[] = [
  // About Adviserve
  { category: 'About Adviserve', question: 'Adviserve was incorporated in February 2026. How can the firm claim experience?', answer: "The firm is months old. The work is not. Adviserve's founders ran training and advisory work across Indian enterprises for the prior decade. The certifications, the methodology, and the operating standard are carried forward from that practice. We do not claim a corporate track record we have not earned — but we are not new at the work." },
  { category: 'About Adviserve', question: 'What does "one operating standard" actually mean?', answer: "It means the security team reads the legal team's drafts. The compliance team reads the HR team's notes. The IT team reads the cybersecurity team's findings. Every engagement runs through documented intake, documented diagnosis, documented design, documented evidence — under three ISO certifications that govern quality, IT service delivery, and information security. The standard is what those certifications force us to do every day." },
  { category: 'About Adviserve', question: 'Do you work outside India?', answer: 'India is the home market. We engage internationally through partnerships and remote-first delivery where the work permits.' },

  // Engagements & pricing
  { category: 'Engagements & pricing', question: 'How does an engagement start?', answer: "A thirty-minute conversation. If we're a fit, we run a structured intake — usually one to two weeks — that produces a written diagnostic. The diagnostic is the contract for the engagement, not the proposal." },
  { category: 'Engagements & pricing', question: "What's the pricing model?", answer: 'Three modes, picked by the work. Project-based for defined deliverables. Retainer for ongoing portfolios. Embedded for transformation programmes where exposure changes as the system changes. Indicative pricing is shared after the diagnostic, not before.' },
  { category: 'Engagements & pricing', question: 'Can we engage on a retainer or only project-based?', answer: 'Both. Legal counsel, DPDP monitoring, IT managed service, and ongoing capability programmes are typically retainer. Cybersecurity assessments, executive search, and training programmes are typically project-based.' },

  // Compliance, security, data
  { category: 'Compliance, security, data', question: "What's your DPDP readiness for the May 2027 enforcement?", answer: 'Adviserve is positioned as a DPDP first-mover practice — both legal advisory and platform-led tooling (Adviserve Comply, in pilot). Engagements run inside an ISO 27001-aligned envelope. Start with the free fifteen-minute self-assessment to scope your own readiness.' },
  { category: 'Compliance, security, data', question: 'How do you handle data security on client engagements?', answer: 'Client data runs inside an ISO/IEC 27001-aligned ISMS. Encryption at rest and in transit, role-based access, audit logs, documented sub-processor list available on request. Full posture is published on the Trust page.' },
];

// Categories derived dynamically from data

/* ───── Accordion Item ───── */

function AccordionItem({ item, isOpen, onToggle, panelId }: { item: FAQItem; isOpen: boolean; onToggle: () => void; panelId: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const triggerId = `faq-trigger-${panelId}`;

  // Measure content height + track reflows via ResizeObserver when open
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      setMeasuredHeight(el.scrollHeight);
      const ro = new ResizeObserver(() => {
        setMeasuredHeight(el.scrollHeight);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [isOpen, item.answer]);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        id={triggerId}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className={`text-[15px] font-medium leading-snug pr-4 transition-colors ${isOpen ? 'text-accent-blue' : 'text-white group-hover:text-accent-blueHover'}`}>
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-white/55 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-blue' : ''}`}
        />
      </button>
      <div
        ref={contentRef}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? `${measuredHeight}px` : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <p className="text-[14px] leading-[1.75] text-white/75 pb-5 px-1">{item.answer}</p>
      </div>
    </div>
  );
}

/* ───── FAQ Page ───── */

export default function FAQ() {
  const { content } = useSiteContent('faq');
  const faqItems = parseJsonContent<FAQItem[]>(content.faq_items, DEFAULT_FAQ_DATA);
  const chromeFv = parseJsonContent<Record<string, boolean>>(content.faq_chrome_field_visibility, {});
  const ctaFv = parseJsonContent<Record<string, boolean>>(content.faq_cta_field_visibility, {});
  const categories = useMemo(() => ['All', ...Array.from(new Set(faqItems.map(item => item.category)))], [faqItems]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  /* Hero entrance */
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;
    const heading = heroRef.current.querySelector('h1');
    const subtitle = heroRef.current.querySelector('.hero-subtitle');
    const mono = heroRef.current.querySelector('.hero-mono');
    if (mono) gsap.fromTo(mono, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    if (heading) gsap.fromTo(heading, { scale: 0.5, y: 80, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 });
    if (subtitle) gsap.fromTo(subtitle, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.5 });
  }, { scope: heroRef });

  /* Filter bar entrance */
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!filterRef.current) return;
    gsap.fromTo(filterRef.current, { y: -20, scale: 0.95, opacity: 0 }, {
      y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: filterRef.current, start: 'top 90%' },
    });
  });

  /* FAQ items stagger */
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!faqRef.current) return;
    const items = faqRef.current.querySelectorAll('.faq-section');
    if (!items.length) return;
    gsap.fromTo(items, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: faqRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, { dependencies: [activeCategory, searchQuery], revertOnUpdate: true });

  /* Filter logic */
  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = !searchQuery.trim()
        || item.question.toLowerCase().includes(searchQuery.toLowerCase())
        || item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  /* Structured data for FAQPage */
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title={content.meta_title}
        description={content.meta_description}
        canonical={content.canonical_url}
        ogImage={content.og_image}
        structuredData={faqStructuredData}
      />

      <EngineeringHero
        eyebrow="Before you book the call"
        title={`${content.faq_hero_heading || 'Before you book the call, read the answers first.'}`}
        gradientPhrase="read the answers first."
        subtitle={content.faq_hero_intro || 'Engagement model, pricing, certifications, DPDP timing, how we scope. The answers we give procurement teams before they ask.'}
        sheet="FAQ"
        total="07"
        label="FAQ · ANSWERS"
        mark="FAQ"
      />

      {/* Search + Category Filter */}
      {chromeFv['search'] !== false && <div ref={filterRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20 w-full">
        <div className="bg-ink-raised rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="search-faq" className="sr-only">Search FAQs</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/75" />
            <input
              id="search-faq"
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenIndex(null); }}
              placeholder={content.faq_search_placeholder || 'Search questions...'}
              className="w-full pl-12 pr-10 py-3 min-h-[44px] bg-[#f3f2ee] rounded-xl text-white text-[15px] placeholder:text-[#7a7a8e] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 border border-white/10 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 min-w-[44px] min-h-[44px] rounded-md bg-text-primary/10 flex items-center justify-center">
                <X size={12} className="text-white/75" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
 activeCategory === cat
 ? 'bg-accent-blue text-white shadow-sm'
 : 'bg-[#f3f2ee] text-white/75 hover:bg-[#f0efeb] hover:text-white/75 border border-white/10'
 }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>}

      {/* FAQ Items */}
      <section className="flex-1 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div ref={faqRef} className="max-w-4xl mx-auto">
          {filteredItems.length === 0 ? (
            <FadeUp>
              <div className="text-center py-16">
                <h3 className="text-xl font-bold text-white mb-2">No questions found</h3>
                <p className="text-white/75 text-sm max-w-sm mx-auto">
                  Try broader search terms or select a different category.
                </p>
              </div>
            </FadeUp>
          ) : (
            (() => {
              /* Group by category when showing All */
              const grouped = activeCategory === 'All'
                ? (['General', 'Services', 'Pricing', 'Getting Started'] as const).map((cat) => ({
                    category: cat,
                    items: filteredItems.filter((i) => i.category === cat),
                  })).filter((g) => g.items.length > 0)
                : [{ category: activeCategory, items: filteredItems }];

              let globalIndex = 0;

              return grouped.map((group) => (
                <div key={group.category} className="faq-section mb-12 last:mb-0">
                  <h3 className="font-display text-[22px] uppercase text-white mb-6 flex items-center gap-3">
                    <span className="w-7 h-[1px] bg-white/20" />
                    {group.category}
                  </h3>
                  <div className="bg-ink-raised rounded-2xl border border-white/10 px-6">
                    {group.items.map((item) => {
                      const idx = globalIndex++;
                      return (
                        <AccordionItem
                          key={item.question}
                          item={item}
                          isOpen={openIndex === idx}
                          onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                          panelId={`faq-panel-${idx}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ));
            })()
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-center bg-ink-base">
        <FadeUp>
          {ctaFv['heading'] !== false && <h2 className="font-display text-[clamp(36px,5vw,56px)] leading-[0.94] uppercase text-white mb-6">
            {content.faq_cta_heading || 'Still Have Questions?'}
          </h2>}
          {ctaFv['body'] !== false && <p className="text-[15px] text-white/75 max-w-[400px] mx-auto leading-[1.75] mb-8">
            {content.faq_cta_body || 'Our team is happy to help. Get in touch for a free 30-minute consultation.'}
          </p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {ctaFv['primary_cta'] !== false && <AnimatedCTAButton href={content.faq_cta_primary_href || '/contact'} label={content.faq_cta_primary_text || 'Contact Us'} />}
            {ctaFv['secondary_cta'] !== false && <AnimatedCTAButton href={content.faq_cta_secondary_href || '/book'} label={content.faq_cta_secondary_text || 'Or book a free call'} variant="secondary" />}
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
