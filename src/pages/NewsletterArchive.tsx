import { useEffect, useState, useRef } from 'react';
import { Calendar, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { sanitizeHTML } from '../lib/sanitize';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import EngineeringHero from '../components/sections/EngineeringHero';
import { formApi } from '../lib/api';

/* ───── Types ───── */

interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  sent_at: string;
  preview_text: string | null;
  html_content: string | null;
}

/* ───── Component ───── */

export default function NewsletterArchive() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Subscribe form
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchArchive() {
      try {
        const res = await fetch('/api/newsletter-archive');
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch {
        // silently fail
      }
      setLoading(false);
    }
    fetchArchive();
  }, []);

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

  /* Grid stagger */
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.newsletter-card');
    if (!cards.length) return;
    gsap.fromTo(cards, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, { dependencies: [loading, campaigns], revertOnUpdate: true });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    setSubscribeError('');
    try {
      await formApi.subscribe({ email, source: 'newsletter-archive' });
      setSubscribeSuccess(true);
      setEmail('');
    } catch (err: any) {
      setSubscribeError(err.message || 'Failed to subscribe. Please try again.');
    }
    setSubscribing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F6]">
      <SEOHead
        title="Newsletter Archive"
        description="Browse past editions of the Adviserve newsletter — insights on HR, hiring, compliance, and workforce strategy."
        canonical="https://adviserve.in/newsletters"
      />

      <EngineeringHero
        eyebrow="Newsletters"
        title="Newsletter Archive"
        gradientPhrase="Archive"
        subtitle="Catch up on past editions of our newsletter — practical insights on HR strategy, hiring, compliance, and more."
        sheet="NWS"
        total="07"
        label="NEWSLETTER · ARCHIVE"
        mark="NWS"
      />

      {/* Campaigns */}
      <section className="flex-1 py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-ink-raised rounded-2xl border border-[#e5e5dd] p-6">
                  <div className="shimmer h-5 rounded w-3/4 mb-3" />
                  <div className="shimmer h-4 rounded w-1/3 mb-2" />
                  <div className="shimmer h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <FadeUp>
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-ink-raised rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#e5e5dd]">
                  <Mail className="w-8 h-8 text-[#6b6b7e]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">No newsletters published yet</h3>
                <p className="text-[#6b6b7e] text-sm max-w-sm mx-auto">
                  Subscribe to be notified when we publish our first edition!
                </p>
              </div>
            </FadeUp>
          ) : (
            <div ref={gridRef} className="space-y-4">
              {campaigns.map((campaign) => {
                const isExpanded = expandedId === campaign.id;
                return (
                  <div key={campaign.id} className="newsletter-card bg-ink-raised rounded-2xl border border-[#e5e5dd] overflow-hidden transition-all duration-300 hover:border-accent-blueHover/30">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : campaign.id)}
                      className="w-full p-6 text-left flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-bold text-[#1a1a2e] mb-1 line-clamp-1 group-hover:text-accent-blueHover transition-colors">
                          {campaign.subject || campaign.name}
                        </h3>
                        <div className="flex items-center text-[11px] text-[#6b6b7e] font-medium uppercase tracking-widest mb-2">
                          <Calendar size={11} className="mr-1.5" />
                          {formatDate(campaign.sent_at)}
                        </div>
                        {campaign.preview_text && !isExpanded && (
                          <p className="text-[14px] text-[#5a5a6e] line-clamp-2 leading-relaxed">{campaign.preview_text}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 mt-1 text-[#9a9aae]">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    {isExpanded && campaign.html_content && (
                      <div className="px-6 pb-6 border-t border-[#e5e5dd]">
                        <div
                          className="prose prose-sm max-w-none pt-6 text-[#5a5a6e] [&_a]:text-accent-blue [&_img]:rounded-lg [&_img]:max-w-full"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(campaign.html_content) }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#F9F9F6]">
        <div className="max-w-xl mx-auto text-center">
          <FadeUp>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-blue mb-5">// Stay Updated</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.05] uppercase text-[#1a1a2e] mb-4">
              Subscribe To Our Newsletter
            </h2>
            <p className="text-[15px] text-[#5a5a6e] leading-[1.75] mb-8">
              Get actionable insights on HR strategy, hiring best practices, and workforce trends delivered to your inbox.
            </p>
            {subscribeSuccess ? (
              <div className="bg-accent-blue/10 text-accent-blue rounded-xl px-6 py-4 text-sm font-medium">
                You are subscribed! Check your inbox for a confirmation.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 min-h-[44px] bg-[#f3f2ee] rounded-xl text-[#1a1a2e] text-[15px] placeholder:text-[#7a7a8e] focus:outline-none focus:ring-2 focus:ring-accent-blue/30 border border-[#e5e5dd] transition-all"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] bg-[#1a1a2e] text-black px-8 py-3.5 min-h-[44px] rounded-xl hover:bg-accent-blueHover transition-all disabled:opacity-60"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            {subscribeError && (
              <p className="text-red-500 text-sm mt-3">{subscribeError}</p>
            )}
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
