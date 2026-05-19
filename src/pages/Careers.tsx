import { useRef, useState } from 'react';
import { MapPin, Clock, ArrowRight, Heart, Laptop, TrendingUp, Users, BookOpen, Coffee, Zap, Globe, Layers, Star, Award, Target, Eye, X } from 'lucide-react';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import FileUpload from '../components/FileUpload';
import { FadeUp } from '../components/animations';
import SEOHead from '../components/SEOHead';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import { publicApi } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  DEFAULT_CAREERS_BENEFITS, DEFAULT_CAREERS_CULTURE, DEFAULT_CAREERS_POSITIONS,
} from '../lib/defaults';
import type { CareersBenefitCMS, CareersCultureCMS, CareerPositionCMS } from '../lib/defaults';
import type { LucideIcon } from 'lucide-react';
import EngineeringHero from '../components/sections/EngineeringHero';

// Icon maps for CMS-stored icon name strings → Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  Laptop, BookOpen, TrendingUp, Zap, Globe, Layers, Star, Award, Target, Heart, Users, Coffee, Eye,
  // Also support lowercase keys from CareersEditor ICON_OPTIONS
  laptop: Laptop, 'book-open': BookOpen, 'trending-up': TrendingUp, zap: Zap, globe: Globe,
  layers: Layers, star: Star, award: Award, target: Target, heart: Heart, users: Users, coffee: Coffee,
};

export default function Careers() {
  const heroRef = useRef<HTMLElement>(null);
  const { settings } = useSiteSettings();
  const { content } = useSiteContent('careers');
  const { data: apiPositions } = useQuery({ queryKey: ['jobPositions'], queryFn: publicApi.getJobPositions });

  const careersEmail = settings.company_email || 'info@adviserve.com';

  // CMS-managed content with DEFAULT fallbacks
  const heroVisible = content.hero_visible !== 'false';
  const ctaVisible = content.cta_visible !== 'false';
  const heroTitle = content.hero_title || 'You want to do real work,\nnot decks about real work.';
  const heroSubtitle = content.hero_subtitle || 'You will sit inside a client engagement, sign your name on the work, and answer for it. No army of juniors. No tooling-only roles. Open positions across all seven practices.';
  const ctaTitle = content.cta_title || "Don't see your role?";
  const ctaDesc = content.cta_description || 'Send us your CV. We accept speculative applications across all seven practices and review every one.';
  const benefitsList = parseJsonContent<CareersBenefitCMS[]>(content.benefits, DEFAULT_CAREERS_BENEFITS);
  const cultureList = parseJsonContent<CareersCultureCMS[]>(content.culture, DEFAULT_CAREERS_CULTURE);
  const jobPositions: CareerPositionCMS[] = (apiPositions && apiPositions.length > 0) ? apiPositions : DEFAULT_CAREERS_POSITIONS;

  // heroFv removed — hero now uses EngineeringHero component
  void parseJsonContent<Record<string, boolean>>(content.careers_hero_field_visibility, {});
  const ctaFv = parseJsonContent<Record<string, boolean>>(content.careers_cta_field_visibility, {});
  const modalFv = parseJsonContent<Record<string, boolean>>(content.careers_modal_field_visibility, {});

  // Apply modal CMS content
  const modalHeader = content.apply_modal_header || 'Apply Now';
  const modalLabels = parseJsonContent<{ name: string; email: string; phone: string; linkedin: string; resume: string; cover: string }>(
    content.apply_modal_labels,
    { name: 'Full Name', email: 'Email', phone: 'Phone', linkedin: 'LinkedIn URL', resume: 'Resume', cover: 'Cover Message' },
  );
  const modalCoverPlaceholder = content.apply_modal_placeholder_cover || "Tell us why you're a great fit…";
  const modalSubmitBtn = content.apply_modal_btn_submit || 'Submit Application';
  const modalReceivedTitle = content.apply_modal_received_title || 'Application Received';
  const modalReceivedText = content.apply_modal_received_text || "We'll review your application and get back to you within 5 business days.";

  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroBlob1Ref = useRef<HTMLDivElement>(null);
  const heroBlob2Ref = useRef<HTMLDivElement>(null);
  const heroShape1Ref = useRef<HTMLDivElement>(null);
  const heroShape2Ref = useRef<HTMLDivElement>(null);
  const heroShape3Ref = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);
  const ctaGlowRef = useRef<HTMLDivElement>(null);
  const decorCircle1Ref = useRef<HTMLDivElement>(null);
  const decorCircle2Ref = useRef<HTMLDivElement>(null);

  const [selectedJob, setSelectedJob] = useState<CareerPositionCMS | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (position: CareerPositionCMS) => {
    setSelectedJob(position);
    setModalOpen(true);
  };

  // Hero dramatic entrance + parallax
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Heading dramatic entrance
    if (heroHeadingRef.current) {
      gsap.fromTo(heroHeadingRef.current,
        { scale: 0.5, rotateX: -30, y: 80, opacity: 0, transformPerspective: 1200 },
        { scale: 1, rotateX: 0, y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', delay: 0.2 }
      );
    }

    // Blob parallax
    [heroBlob1Ref, heroBlob2Ref].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y: -(60 + i * 40),
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Floating geometric shapes
    [heroShape1Ref, heroShape2Ref, heroShape3Ref].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y: -(30 + i * 25),
        rotation: 20 + i * 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      // Infinite float
      gsap.to(ref.current, {
        y: `+=${6 + i * 4}`,
        duration: 3.5 + i * 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }, { scope: heroRef });

  // Benefits fly forward from z:-150
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!benefitsRef.current) return;

    const cards = benefitsRef.current.querySelectorAll('.benefit-card');
    gsap.fromTo(cards,
      { z: -150, scale: 0.8, opacity: 0, transformPerspective: 1200 },
      {
        z: 0, scale: 1, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: benefitsRef.current, start: 'top 78%', toggleActions: 'play none none none' },
      }
    );
  }, { dependencies: [benefitsList], revertOnUpdate: true });

  // Position cards slide in from right
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!positionsRef.current) return;

    const cards = positionsRef.current.querySelectorAll('.position-card');
    gsap.fromTo(cards,
      { x: 100, opacity: 0, rotateY: 8, transformPerspective: 1200 },
      {
        x: 0, opacity: 1, rotateY: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: positionsRef.current, start: 'top 78%', toggleActions: 'play none none none' },
      }
    );
  }, { dependencies: [jobPositions], revertOnUpdate: true });

  // Culture cards domino wave
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cultureRef.current) return;

    const cards = cultureRef.current.querySelectorAll('.culture-card');
    gsap.fromTo(cards,
      { y: 50, rotateZ: -3, opacity: 0, rotateX: -8, transformPerspective: 1200 },
      {
        y: 0, rotateZ: 0, rotateX: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: cultureRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      }
    );

    // Icons float infinitely once visible
    const icons = cultureRef.current.querySelectorAll('.culture-icon');
    icons.forEach((icon, i) => {
      gsap.to(icon, {
        y: -6,
        duration: 2 + i * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5 + i * 0.15,
        scrollTrigger: {
          trigger: cultureRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, { dependencies: [cultureList], revertOnUpdate: true });

  // CTA text scale + glow intensify
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (ctaTextRef.current) {
      gsap.fromTo(ctaTextRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }

    if (ctaGlowRef.current) {
      gsap.fromTo(ctaGlowRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1, scale: 1.2, duration: 1.5, ease: 'power1.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }
  }, { dependencies: [] });

  // Decorative circles between sections
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    [decorCircle1Ref, decorCircle2Ref].forEach((ref) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y: -30,
        rotation: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }, { dependencies: [] });

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title={content.meta_title}
        description={content.meta_description}
        canonical={content.canonical_url}
        ogImage={content.og_image}
      />

      {heroVisible && (
        <EngineeringHero
          eyebrow="Build the firm with us"
          title={heroTitle || 'Senior practitioners. Names you can sign.'}
          gradientPhrase={(heroTitle || 'Senior practitioners. Names you can sign.').split(/\s+/).slice(-2).join(' ')}
          subtitle={heroSubtitle}
          sheet="CRR"
          total="07"
          label="CAREERS · ROLES"
          mark="CRR"
        />
      )}

      {/* Why Work With Us */}
      <section className="section-padding bg-ink-base border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="max-w-2xl mx-auto text-center mb-16">
            <p className="font-mono text-accent-blue text-sm tracking-wide mb-5">// What you actually get</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] font-extrabold text-white mb-5 leading-tight tracking-tight uppercase">
              Work you can name, in writing.
            </h2>
            <p className="text-lg text-white/75 leading-relaxed">
              You own a piece of a client engagement end-to-end. You write the deliverable. Your name goes on it. The board sees your work, not a deck about your work.
            </p>
          </FadeUp>

          <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" style={{ perspective: '1200px' }}>
            {benefitsList.map((benefit) => {
              const BenefitIcon = ICON_MAP[benefit.icon] || Laptop;
              return (
                <div
                  key={benefit.title}
                  className="benefit-card group relative bg-[#f3f2ee] rounded-none p-8 border border-white/10 hover:border-accent-blueHover/30 transition-all duration-500 overflow-hidden"
                  style={{ opacity: 0 }}
                >
                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 bg-accent-blue/[0.0] group-hover:bg-accent-blueHover/[0.03] transition-all duration-500 pointer-events-none" />
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="w-12 h-12 bg-accent-blue/[0.06] rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-accent-blueHover group-hover:scale-125 transition-all duration-300">
                      <BenefitIcon className="w-5 h-5 text-accent-blue group-hover:text-black transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-white/75 leading-relaxed text-[15px]">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating decorative element between Benefits and Positions */}
      <div className="relative flex justify-center py-6">
        <div
          ref={decorCircle1Ref}
          className="w-16 h-16 rounded-full border border-accent-blue/[0.08] flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-accent-blue/[0.05] rotate-45" />
        </div>
      </div>

      {/* Open Positions */}
      <section className="section-padding bg-ink-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="max-w-2xl mx-auto text-center mb-16">
            <p className="font-mono text-accent-blue text-sm tracking-wide mb-5">// Open Roles</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] font-extrabold text-white mb-5 leading-tight tracking-tight uppercase">
              Current Openings
            </h2>
            <p className="text-lg text-white/75 leading-relaxed">
              Every role at Adviserve comes with real ownership, direct client impact, and a team that has your back.
            </p>
          </FadeUp>

          <div ref={positionsRef} className="space-y-4 max-w-4xl mx-auto">
            {jobPositions.map((position, index) => (
              <div
                key={`position-${index}`}
                role="button"
                tabIndex={0}
                onClick={() => openModal(position)}
                onKeyDown={(e) => e.key === 'Enter' && openModal(position)}
                className="position-card group block bg-ink-raised rounded-none p-6 md:p-8 border border-white/10 hover:border-accent-blueHover/30 transition-all duration-500 cursor-pointer text-left w-full"
                style={{ opacity: 0 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-blue bg-accent-blue/[0.06] px-2.5 py-1 rounded-md">{position.department}</span>
                      <span className="text-[11px] font-medium text-white/75 flex items-center gap-1">
                        <MapPin size={10} /> {position.location}
                      </span>
                      <span className="text-[11px] font-medium text-white/75 flex items-center gap-1">
                        <Clock size={10} /> {position.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-blueHover transition-colors">{position.title}</h3>
                    <p className="text-white/75 text-sm leading-relaxed">{position.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-2 text-accent-blue font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                      Apply Now <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating decorative element between Positions and Culture */}
      <div className="relative flex justify-center py-6">
        <div
          ref={decorCircle2Ref}
          className="w-14 h-14 rounded-full border border-[#e8e8e0] flex items-center justify-center"
        >
          <div className="w-5 h-5 rounded-full bg-accent-blue/[0.04]" />
        </div>
      </div>

      {/* Life at Adviserve */}
      <section className="py-16 lg:py-20 bg-ink-base text-white relative overflow-hidden border-t border-white/10">
        <div className="hidden sm:block absolute top-0 right-0 w-[400px] h-[400px] bg-accent-blue/[0.03] rounded-full -mr-48 -mt-48 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-3 uppercase">Life at Adviserve</h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">We take our work seriously, but never ourselves. Here's what makes our culture tick.</p>
          </FadeUp>

          <div ref={cultureRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cultureList.map((item) => {
              const CultureIcon = ICON_MAP[item.icon] || Users;
              return (
                <div
                  key={item.title}
                  className="culture-card group bg-[#f3f2ee] rounded-none p-8 border border-white/10 hover:border-accent-blueHover/30 transition-all duration-500"
                  style={{ opacity: 0 }}
                >
                  <div className="culture-icon w-12 h-12 bg-[#f3f2ee] rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent-blueHover/20 group-hover:scale-110 transition-all duration-300">
                    <CultureIcon className="w-5 h-5 text-accent-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/75 leading-relaxed text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {modalOpen && selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => setModalOpen(false)}
          modalHeader={modalHeader}
          modalLabels={modalLabels}
          modalCoverPlaceholder={modalCoverPlaceholder}
          modalSubmitBtn={modalSubmitBtn}
          modalReceivedTitle={modalReceivedTitle}
          modalReceivedText={modalReceivedText}
          modalFv={modalFv}
        />
      )}

      {/* CTA */}
      {ctaVisible && <section ref={ctaRef} className="section-padding bg-ink-base border-t border-white/10 relative overflow-hidden">
        {/* Glow that intensifies on scroll */}
        <div ref={ctaGlowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/[0.04] rounded-full blur-[120px] pointer-events-none" style={{ opacity: 0 }} />
        <div ref={ctaTextRef} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" style={{ opacity: 0 }}>
          {ctaFv['title'] !== false && <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-tight uppercase">
            {ctaTitle}
          </h2>}
          {ctaFv['description'] !== false && <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {ctaDesc}
          </p>}
          <AnimatedCTAButton href={`mailto:${careersEmail}`} label="Send a Speculative Application" size="lg" />
        </div>
      </section>}
    </div>
  );
}

// ─── Application Modal ────────────────────────────────────────────────────────

interface AppForm {
  name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  cover_message: string;
}

function ApplicationModal({
  job,
  onClose,
  modalHeader,
  modalLabels,
  modalCoverPlaceholder,
  modalSubmitBtn,
  modalReceivedTitle,
  modalReceivedText,
  modalFv = {},
}: {
  job: CareerPositionCMS;
  onClose: () => void;
  modalHeader: string;
  modalLabels: { name: string; email: string; phone: string; linkedin: string; resume: string; cover: string };
  modalCoverPlaceholder: string;
  modalSubmitBtn: string;
  modalReceivedTitle: string;
  modalReceivedText: string;
  modalFv?: Record<string, boolean>;
}) {
  const [form, setForm] = useState<AppForm>({
    name: '', email: '', phone: '', linkedin_url: '', cover_message: '',
  });
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof AppForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeUrl) {
      setError('Please upload your resume before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: job.title,
          applicant_name: form.name,
          email: form.email,
          phone: form.phone,
          linkedin_url: form.linkedin_url || undefined,
          resume_url: resumeUrl,
          cover_message: form.cover_message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-ink-raised rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            {modalFv['header'] !== false && <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 mb-1">{modalHeader}</p>}
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{job.department} · {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-0.5 flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="text-accent-blue" size={24} />
            </div>
            {modalFv['received'] !== false && <h3 className="text-xl font-bold text-gray-900 mb-2">{modalReceivedTitle}</h3>}
            {modalFv['received'] !== false && <p className="text-gray-500 text-sm mb-6">
              {modalReceivedText}
            </p>}
            <button
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-[0.14em] bg-accent-blue text-white rounded-lg px-8 py-3 hover:bg-accent-blueHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {modalFv['labels'] !== false && <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {modalLabels.name} <span className="text-red-500">*</span>
                </label>}
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={set('name')}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                  placeholder="Your full name"
                />
              </div>
              <div>
                {modalFv['labels'] !== false && <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {modalLabels.email} <span className="text-red-500">*</span>
                </label>}
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {modalFv['labels'] !== false && <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {modalLabels.phone} <span className="text-red-500">*</span>
                </label>}
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={set('phone')}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                {modalFv['labels'] !== false && <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {modalLabels.linkedin}
                </label>}
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={set('linkedin_url')}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                  placeholder="linkedin.com/in/…"
                />
              </div>
            </div>

            <div>
              {modalFv['labels'] !== false && <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {modalLabels.resume} <span className="text-red-500">*</span>
              </label>}
              <FileUpload
                onUpload={(url) => setResumeUrl(url)}
                accept=".pdf,.doc,.docx"
                maxSizeMB={5}
              />
            </div>

            {modalFv['cover_placeholder'] !== false && <div>
              {modalFv['labels'] !== false && <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {modalLabels.cover} <span className="text-gray-400 font-normal">(optional)</span>
              </label>}
              <textarea
                rows={4}
                value={form.cover_message}
                onChange={set('cover_message')}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue resize-none"
                placeholder={modalCoverPlaceholder}
              />
            </div>}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              {modalFv['submit_btn'] !== false && <AnimatedCTAButton
                type="submit"
                disabled={submitting}
                label={submitting ? 'Submitting…' : modalSubmitBtn}
                showArrow={!submitting}
              />}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
