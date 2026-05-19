import { useState, FormEvent, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronDown, CheckCircle, Calendar } from 'lucide-react';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import { formApi } from '../lib/api';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { DEFAULT_SERVICE_OPTIONS, DEFAULT_BUSINESS_HOURS, DEFAULT_FAQS } from '../lib/defaults';
import type { BusinessHour, ServiceOption, FAQ } from '../lib/defaults';
import SEOHead from '../components/SEOHead';
import { generateFAQSchema } from '../lib/structuredData';
import { FadeUp } from '../components/animations';
import EngineeringHero from '../components/sections/EngineeringHero';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service_interest: '', message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [lastSubmit, setLastSubmit] = useState(0);
  const [subscribeConsent, setSubscribeConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { content } = useSiteContent('contact');
  const { settings } = useSiteSettings('contact');

  const heroRef = useRef<HTMLElement>(null);
  const heroBlobRef = useRef<HTMLDivElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const faqContainerRef = useRef<HTMLDivElement>(null);
  const floatingCircleRef = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);

  // Hero heading dramatic entrance + blob parallax + floating shapes
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Hero heading dramatic entrance
    if (heroHeadingRef.current) {
      gsap.fromTo(heroHeadingRef.current,
        { scale: 0.6, y: 60, rotateX: -20, opacity: 0, transformPerspective: 1200 },
        { scale: 1, y: 0, rotateX: 0, opacity: 1, duration: 1.4, ease: 'expo.out', delay: 0.2 }
      );
    }

    // Blob parallax on scroll
    if (heroBlobRef.current) {
      gsap.to(heroBlobRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroBlobRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Floating geometric shapes parallax
    [shape1Ref, shape2Ref, shape3Ref].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y: -(40 + i * 30),
        rotation: 15 + i * 10,
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
        y: `+=${8 + i * 4}`,
        duration: 3 + i * 0.7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }, { scope: heroRef });

  // Form slide from left, Sidebar slide from right
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (formContainerRef.current) {
      gsap.fromTo(formContainerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: formContainerRef.current, start: 'top 82%' },
        }
      );
    }

    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sidebarRef.current, start: 'top 82%' },
        }
      );
    }
  }, { dependencies: [] });

  // FAQ items stagger with bounce
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!faqContainerRef.current) return;
    gsap.fromTo(
      faqContainerRef.current.querySelectorAll('.faq-item'),
      { y: 60, scale: 0.95, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: faqContainerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { scope: faqContainerRef, dependencies: [content], revertOnUpdate: true });

  // Floating circle between sections
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!floatingCircleRef.current) return;
    gsap.to(floatingCircleRef.current, {
      y: -40,
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: floatingCircleRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { dependencies: [] });

  // headerFv removed — hero now uses EngineeringHero component
  void parseJsonContent<Record<string, boolean>>(content.contact_header_field_visibility, {});
  const formFv = parseJsonContent<Record<string, boolean>>(content.contact_form_field_visibility, {});
  const sidebarFv = parseJsonContent<Record<string, boolean>>(content.contact_sidebar_field_visibility, {});

  const serviceOptions = parseJsonContent<ServiceOption[]>(content.service_options, DEFAULT_SERVICE_OPTIONS);
  const businessHours = parseJsonContent<BusinessHour[]>(content.business_hours, DEFAULT_BUSINESS_HOURS);
  const faqs = parseJsonContent<FAQ[]>(content.faqs, DEFAULT_FAQS);

  const formLabels = parseJsonContent<{name:string;email:string;phone:string;company:string;message:string}>(
    content.contact_form_labels,
    { name: 'Full Name', email: 'Email', phone: 'Phone', company: 'Company', message: 'Message' },
  );
  const formPlaceholders = parseJsonContent<{name:string;email:string;phone:string;company:string;message:string}>(
    content.contact_form_placeholders,
    { name: 'Your name', email: 'you@company.com', phone: '+91 00000 00000', company: 'Acme Inc.', message: 'Your message here' },
  );
  const submitBtnText  = content.contact_form_btn_submit  || 'Get In Touch';
  const resetBtnText   = content.contact_form_btn_reset   || 'Send another message';
  const formDisclaimer = content.contact_form_disclaimer  || 'No spam. No automated sales sequences. Just a real person reading your message and getting back to you.';
  const scheduleTitle  = content.contact_schedule_title   || 'Schedule Directly';
  const scheduleBtnText = content.contact_schedule_btn    || 'Book a Time Slot';

  const contactEmail = content.contact_email || settings.company_email || 'info@adviserve.com';
  const contactPhone = content.contact_phone || settings.company_phone || '';
  const contactAddress = content.contact_address || settings.company_address || 'India';

  const hoursVisible = content.business_hours !== undefined || !content.contact_title;
  const contactInfoVisible = content.contact_sidebar_title !== undefined || !content.contact_title;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Spam protection: honeypot
    if (honeypot) return;
    // Spam protection: 5-second debounce
    const now = Date.now();
    if (now - lastSubmit < 5000) {
      setError('Please wait a few seconds before submitting again.');
      return;
    }
    setLastSubmit(now);
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await formApi.submitContact({ ...formData, website: honeypot });
      setLoading(false);
      setSuccess(true);
      if (formData.email && subscribeConsent) {
        const nameParts = formData.name.trim().split(' ');
        await formApi.subscribe({
          email: formData.email.trim(),
          first_name: nameParts[0] || undefined,
          last_name: nameParts.slice(1).join(' ') || undefined,
          company: formData.company || undefined,
          source: 'contact_form',
        });
      }
      setFormData({ name: '', email: '', phone: '', company: '', service_interest: '', message: '' });
      setSubscribeConsent(false);
      // Scroll to success message
      setTimeout(() => formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch {
      setLoading(false);
      setError('Failed to submit your message. Please try again.');
    }
  };

  const inputCls = "w-full px-4 py-3.5 min-h-[44px] bg-white border border-white/10 text-white text-[14px] placeholder:text-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-1 focus-visible:ring-offset-[#F9F9F6] transition-colors";

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title="Contact Adviserve | Free 30-Minute Business Advisory Consultation"
        description="Get in touch with Adviserve for recruitment, HR, legal, strategy, training, or IT consulting. Book a free consultation or send us a message — response within 24 hours."
        canonical="https://adviserve.in/contact"
        structuredData={generateFAQSchema(faqs.map(f => ({ question: f.question, answer: f.answer })))}
      />

      <EngineeringHero
        eyebrow="Contact"
        title={content.contact_title || 'Send the question. Get a straight answer in one business day.'}
        gradientPhrase="one business day."
        subtitle={content.contact_intro || "Tell us what is on your desk — DPDP deadline, vendor questionnaire, hiring gap, IT estate. A senior practitioner replies inside 24 hours with a straight answer: yes we fit, no we do not, here is what it would cost. Not an SDR. Not a bot."}
        sheet="CTC"
        total="07"
        label="CONTACT · INTAKE"
        mark="CTC"
      />

      {/* Form + Sidebar */}
      <section className="pb-24 lg:pb-32 relative">
        {/* Vertical gradient line alongside form */}
        <div className="hidden lg:block absolute left-[calc(50%-320px)] top-0 bottom-0 w-[1px]" style={{ background: 'linear-gradient(to bottom, transparent, rgba(100,200,200,0.15) 30%, rgba(100,200,200,0.15) 70%, transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            {/* Form */}
            <div ref={formContainerRef} style={{ opacity: 0 }}>
              {success ? (
                <div className="bg-ink-raised border border-accent-blue/30 p-12 text-center" role="status" aria-live="polite">
                  <CheckCircle className="w-12 h-12 text-accent-blue mx-auto mb-5" />
                  {formFv['form_title'] !== false && <h3 className="font-display text-[32px] uppercase text-white mb-3">{content.form_title || 'Message Sent'}</h3>}
                  {formFv['success_message'] !== false && <p className="text-[14px] text-white/75 max-w-sm mx-auto">{content.success_message || "We've received your inquiry and will respond within 24 hours."}</p>}
                  <button onClick={() => setSuccess(false)} className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 hover:text-accent-blue transition-colors min-h-[44px] inline-flex items-center px-3 py-3">
                    {resetBtnText}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot — invisible to humans, bots fill it */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]" role="alert" aria-live="polite">{error}</div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-2 block">{formLabels.name} *</label>
                      <input id="contact-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={formPlaceholders.name} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-2 block">{formLabels.email} *</label>
                      <input id="contact-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={formPlaceholders.email} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-phone" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-2 block">{formLabels.phone}</label>
                      <input id="contact-phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={formPlaceholders.phone} className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="contact-company" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-2 block">{formLabels.company}</label>
                      <input id="contact-company" type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder={formPlaceholders.company} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-service" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-2 block">Service Interest</label>
                    <div className="relative">
                      <select id="contact-service" value={formData.service_interest} onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })} className={`${inputCls} appearance-none pr-10`}>
                        <option value="">Select a service...</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/75 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 mb-2 block">{formLabels.message} *</label>
                    <textarea id="contact-message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={formPlaceholders.message} className={`${inputCls} resize-none`} />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group/check">
                    <input
                      type="checkbox"
                      checked={subscribeConsent}
                      onChange={(e) => setSubscribeConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-accent-blue bg-ink-raised border border-white/10 rounded flex-shrink-0"
                    />
                    <span className="text-[12px] text-white/75 leading-relaxed">
                      I'd like to receive occasional updates, insights, and news from Adviserve. You can unsubscribe at any time.
                    </span>
                  </label>
                  <AnimatedCTAButton
                    type="submit"
                    disabled={loading}
                    label={loading ? 'Sending...' : submitBtnText}
                    showArrow={!loading}
                    size="lg"
                    className="w-full md:w-auto"
                  />
                  {formFv['disclaimer'] !== false && <p className="text-[12px] text-[#7a7a8e] mt-4 leading-relaxed">
                    {formDisclaimer}
                  </p>}
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div ref={sidebarRef} className="space-y-4" style={{ opacity: 0 }}>
              {contactInfoVisible && (
                <div className="bg-ink-raised border border-white/10 p-8">
                  {sidebarFv['sidebar_title'] !== false && <h3 className="font-display text-[22px] uppercase text-white mb-6">{content.contact_sidebar_title || 'Get In Touch'}</h3>}
                  <div className="space-y-5">
                    {sidebarFv['email'] !== false && <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 group min-h-[44px]">
                      <Mail size={15} className="text-accent-blue/60 flex-shrink-0" />
                      <span className="text-[14px] text-white/75 group-hover:text-accent-blueHover transition-colors">{contactEmail}</span>
                    </a>}
                    {sidebarFv['phone'] !== false && contactPhone && (
                      <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 group min-h-[44px]">
                        <Phone size={15} className="text-accent-blue/60 flex-shrink-0" />
                        <span className="text-[14px] text-white/75 group-hover:text-accent-blueHover transition-colors">{contactPhone}</span>
                      </a>
                    )}
                    {sidebarFv['address'] !== false && <div className="flex items-start gap-3">
                      <MapPin size={15} className="text-accent-blue/60 mt-0.5 flex-shrink-0" />
                      <span className="text-[14px] text-white/75 whitespace-pre-line">{contactAddress}</span>
                    </div>}
                  </div>
                </div>
              )}

              {hoursVisible && (
                <div className="bg-ink-raised border border-white/10 p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock size={14} className="text-accent-blue" />
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/75">{content.business_hours_title || 'Business Hours'}</h4>
                  </div>
                  <div className="space-y-3">
                    {businessHours.map((bh) => (
                      <div key={bh.day} className="flex justify-between text-[13px]">
                        <span className="text-white/75">{bh.day}</span>
                        <span className="text-white/75 font-mono text-[11px]">{bh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Book a consultation card */}
              {sidebarFv['schedule'] !== false && <div className="bg-accent-blue/[0.04] border border-accent-blue/20 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-accent-blue" />
                  <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/75">{scheduleTitle}</h4>
                </div>
                <p className="text-[13px] text-white/75 leading-relaxed mb-5">
                  Prefer to pick a time? Book a free 30-minute consultation directly on our calendar.
                </p>
                <AnimatedCTAButton href="/book" label={scheduleBtnText} className="w-full justify-center" />
              </div>}
            </div>
          </div>
        </div>
      </section>

      {/* Floating decorative circle between form and FAQ */}
      <div className="relative flex justify-center py-4">
        <div
          ref={floatingCircleRef}
          className="w-20 h-20 rounded-full border border-accent-blue/[0.1] flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-accent-blue/[0.05]" />
        </div>
      </div>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 lg:py-24 px-6 sm:px-12 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 mb-5 flex items-center gap-3">
                <span className="w-7 h-[1px] bg-white/20" /> FAQ
              </p>
              <h2 className="font-display text-[clamp(40px,5vw,60px)] uppercase text-white mb-12">Common Questions</h2>
            </FadeUp>
            <div ref={faqContainerRef} className="space-y-[2px]">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item bg-white border border-white/10 overflow-hidden transition-colors ${openFAQ === i ? 'border-accent-blue/30' : ''}`} style={{ opacity: 0 }}>
                  <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} aria-expanded={openFAQ === i} className="w-full flex items-center justify-between p-6 min-h-[44px] text-left text-[15px] text-white hover:text-accent-blueHover transition-colors gap-4">
                    <span>{faq.question}</span>
                    <span className={`w-11 h-11 min-w-[44px] min-h-[44px] border border-white/10 flex items-center justify-center flex-shrink-0 text-white/75 text-[18px] font-light transition-all ${openFAQ === i ? 'border-accent-blue text-accent-blue bg-accent-blue/[0.15] rotate-45' : ''}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-400 ${openFAQ === i ? 'max-h-[300px] pb-6 px-6' : 'max-h-0'}`}>
                    <p className="text-[14px] leading-[1.75] text-white/75">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
