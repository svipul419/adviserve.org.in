import { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, CheckCircle, AlertCircle, Send, Calendar } from 'lucide-react';
import { sanitizeHTML } from '../lib/sanitize';
import { publicApi, formApi } from '../lib/api';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { DEFAULT_SERVICES } from '../lib/defaults';
import SEOHead from '../components/SEOHead';
import { generateServiceSchema, generateBreadcrumbSchema } from '../lib/structuredData';
import EngineeringHero from '../components/sections/EngineeringHero';
import type { Service } from '../lib/types';

export default function ServiceDetail() {
  const { slug, category } = useParams<{ slug: string; category?: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [parentService, setParentService] = useState<{ title: string; slug: string } | null>(null);
  const [relatedServices, setRelatedServices] = useState<Pick<Service, 'id' | 'title' | 'slug' | 'icon' | 'description'>[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings('contact');

  const contactEmail = settings.company_email || 'info@adviserve.com';
  const contactPhone = settings.company_phone || '+1 (234) 567-890';

  useEffect(() => {
    async function fetchServiceData() {
      try {
        const serviceData = await publicApi.getService(slug!);

        if (serviceData) {
          setService(serviceData);

          // If the API returns parent info, use it for breadcrumbs
          if (serviceData.parent) {
            setParentService(serviceData.parent);
          }

          // If the API returns children/siblings, use them as related
          if (serviceData.children) {
            setRelatedServices(
              serviceData.children
                .filter((c: any) => c.slug !== slug)
                .slice(0, 3)
            );
          } else {
            // Fetch siblings via parent slug if we have a category
            if (category) {
              try {
                const parentData = await publicApi.getService(category);
                if (parentData) {
                  if (!serviceData.parent) {
                    setParentService({ title: parentData.title, slug: parentData.slug });
                  }
                  if (parentData.children) {
                    setRelatedServices(
                      parentData.children
                        .filter((c: any) => c.slug !== slug)
                        .slice(0, 3)
                    );
                  }
                }
              } catch {
                // Ignore error fetching parent
              }
            }
          }
        } else {
          // Fallback to defaults if not in database
          const fallback = DEFAULT_SERVICES.find((s) => s.slug === slug);
          if (fallback) {
            setService(fallback);
            setRelatedServices(
              DEFAULT_SERVICES
                .filter((s) => s.slug !== slug)
                .slice(0, 3)
                .map(({ id, title, slug: s, icon, description }) => ({ id, title, slug: s, icon, description }))
            );
          }
        }
      } catch {
        // Fallback to defaults on error
        const fallback = DEFAULT_SERVICES.find((s) => s.slug === slug);
        if (fallback) {
          setService(fallback);
          setRelatedServices(
            DEFAULT_SERVICES
              .filter((s) => s.slug !== slug)
              .slice(0, 3)
              .map(({ id, title, slug: s, icon, description }) => ({ id, title, slug: s, icon, description }))
          );
        }
      }
      setLoading(false);
    }
    if (slug) fetchServiceData();
  }, [slug, category]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-ink-base">
        <SEOHead title={slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : undefined} />
        <div className="bg-ink-base pt-[120px] pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="shimmer h-4 w-32 rounded mb-8" />
            <div className="shimmer h-10 w-2/3 rounded mb-4" />
            <div className="shimmer h-5 w-1/2 rounded" />
          </div>
        </div>
        <div className="py-16 bg-ink-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-4">
                <div className="shimmer h-6 w-48 rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-3/4 rounded" />
              </div>
              <div className="shimmer h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-ink-base">
        <SEOHead title="Service Not Found" />
        <div className="w-16 h-16 bg-ink-raised rounded-2xl flex items-center justify-center mb-4 border border-white/10">
          <span className="text-3xl">🔍</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-white/75 text-sm mb-6">This service may have been updated or moved. Browse our current offerings below.</p>
        <Link to="/services" className="text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors">
          Browse all services
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title={service.title}
        description={service.description || ''}
        canonical={`https://adviserve.in/services/${service.slug || slug}`}
        structuredData={[
          generateServiceSchema({ title: service.title, description: service.description || '', slug: service.slug || slug || '' }, 'https://adviserve.in'),
          generateBreadcrumbSchema([
            { name: 'Home', url: 'https://adviserve.in' },
            { name: 'Services', url: 'https://adviserve.in/services' },
            { name: service.title, url: `https://adviserve.in/services/${service.slug || slug}` },
          ]),
        ]}
      />
      <EngineeringHero
        eyebrow={parentService?.title || 'Service'}
        title={service.title}
        subtitle={service.description}
        sheet="SVC"
        total="07"
        label={`SERVICE · ${(service.slug || '').toUpperCase()}`}
        mark="SVC"
      />

      {/* Content */}
      <section className="section-padding bg-ink-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2">
              <div className="bg-ink-raised rounded-3xl border border-white/10 p-8 md:p-12">
                <h2 className="text-2xl font-extrabold text-white mb-6 tracking-tight">Overview</h2>
                <div
                  className="service-prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.content || '') }}
                />
              </div>
            </div>

            <div>
              <div className="bg-ink-raised rounded-2xl p-8 text-white lg:sticky lg:top-24 overflow-hidden relative border border-white/10">
                <div className="absolute top-0 right-0 w-28 h-28 bg-accent-blue/[0.05] rounded-full -mr-14 -mt-14" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">Ready to Take the Next Step?</h3>
                  <p className="mb-6 text-white/75 text-sm leading-relaxed">
                    Book a free consultation to discuss how our {service.title.toLowerCase()} services can solve your specific challenges.
                  </p>
                  <Link
                    to={`/book?service=${encodeURIComponent(service.title)}`}
                    className="group flex items-center justify-center w-full bg-accent-blue text-black px-6 py-3.5 rounded-full font-semibold hover:bg-accent-blueHover/90 transition-all duration-300 text-sm mb-3 focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2"
                  >
                    <Calendar className="mr-2" size={16} />
                    Book a Consultation
                  </Link>
                  <Link
                    to="/contact"
                    className="group flex items-center justify-center w-full border border-white/10 text-white px-6 py-3.5 rounded-full font-semibold hover:border-accent-blueHover/30 hover:text-accent-blueHover transition-all duration-300 text-sm mb-6 focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-white/75 hover:text-accent-blueHover transition-colors text-sm focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2 rounded">
                      <Mail size={14} className="text-accent-blue/60" />
                      {contactEmail}
                    </a>
                    <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-white/75 hover:text-accent-blueHover transition-colors text-sm focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2 rounded">
                      <Phone size={14} className="text-accent-blue/60" />
                      {contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 lg:py-20 bg-ink-base border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Related Services</h2>
              <Link to="/services" className="text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors inline-flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rs) => (
                <Link
                  key={rs.id}
                  to={category ? `/services/${category}/${rs.slug}` : `/services/${rs.slug}`}
                  className="group bg-[#f3f2ee] hover:bg-ink-glass rounded-2xl p-7 border border-white/10 hover:border-accent-blueHover/30 transition-all duration-500"
                >
                  <div className="w-12 h-12 bg-accent-blue/[0.06] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">{rs.icon || '📋'}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-accent-blueHover transition-colors">{rs.title}</h3>
                  <p className="text-white/75 text-sm line-clamp-2 leading-relaxed">{rs.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inline Service Inquiry Form */}
      <ServiceInquiryForm serviceName={service.title} />
    </div>
  );
}

function ServiceInquiryForm({ serviceName }: { serviceName: string }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Name, email, and message are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await formApi.submitContact({
        ...formData,
        service_interest: serviceName,
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-ink-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ink-raised rounded-2xl border border-white/10 p-8 md:p-10 border-l-4 border-l-accent-blue">
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
            Interested in {serviceName}?
          </h2>
          <p className="text-white/75 text-sm leading-relaxed mb-8">
            Send us a quick inquiry and we will get back to you within one business day.
          </p>

          {success ? (
            <div className="flex items-center gap-3 bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-6">
              <CheckCircle className="w-6 h-6 text-white/75 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Inquiry sent successfully</p>
                <p className="text-sm text-white/75">We will reach out to you shortly about {serviceName}.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-name" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Name *</label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-[#c0c0c0] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors bg-ink-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="inq-email" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Email *</label>
                  <input
                    id="inq-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-[#c0c0c0] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors bg-ink-base"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-phone" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Phone</label>
                  <input
                    id="inq-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-[#c0c0c0] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors bg-ink-base"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="inq-company" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Company</label>
                  <input
                    id="inq-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-[#c0c0c0] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors bg-ink-base"
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="inq-message" className="block text-[11px] font-mono uppercase tracking-widest text-white/55 mb-1.5">Message *</label>
                <textarea
                  id="inq-message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-sm text-white placeholder:text-[#c0c0c0] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors bg-ink-base resize-none"
                  placeholder={`Tell us about your ${serviceName.toLowerCase()} needs...`}
                />
              </div>

              {/* Pre-filled service badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/55">Service:</span>
                <span className="text-xs font-medium text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full">{serviceName}</span>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] bg-text-primary text-black px-8 py-4 hover:bg-accent-blueHover transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
