import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Shield, ShieldCheck, UserCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import { publicApi } from '../lib/api';
import { useSiteContent } from '../hooks/useSiteContent';
import { DEFAULT_HOME_PRODUCTS } from '../lib/defaults';
import EngineeringHero from '../components/sections/EngineeringHero';

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  shield: Shield,
  'shield-check': ShieldCheck,
  'user-check': UserCheck,
  sparkles: Sparkles,
};

export default function Products() {
  const { data: apiProducts, isLoading } = useQuery({ queryKey: ['products'], queryFn: publicApi.getProducts });
  // Fall back to bundled defaults whenever the CMS returns an empty list so
  // the page never shows "0 products" in dev or after a partial deploy.
  const apiList = Array.isArray(apiProducts) ? apiProducts : [];
  const fallback = DEFAULT_HOME_PRODUCTS.filter((p) => p.slug !== 'saas-products');
  const products: any[] = apiList.length > 0
    ? apiList
    : (isLoading ? [] : fallback);
  const { content } = useSiteContent('products');

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#FBFDFF' }}>
      <SEOHead
        title="Products | Adviserve People, Adviserve Hire, Adviserve Comply"
        description="A modular SaaS layer for enterprise workflows. HRMS, candidate screening, and DPDP compliance — built on one architecture. ISO 27001-aligned."
        canonical="https://adviserve.org.in/products"
      />

      <EngineeringHero
        eyebrow="Software you will actually use"
        title={`${content.products_hero_title || 'Stop renting your compliance, hiring and HR stack.'}`}
        gradientPhrase="hiring and HR stack."
        subtitle={content.products_hero_subtitle || 'Three products on one architecture — encrypted, role-based, audit-logged by default. So you can move on from spreadsheets without paying a consultant every time you want to pull a report.'}
        sheet="PRD"
        total="07"
        label="PRODUCTS · MODULAR SAAS"
        mark="PRD"
      />

      {/* Reference architecture — 4-layer vertical stack */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 sm:px-12">
          <FadeUp>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 mb-3 flex items-center gap-3">
              <span className="w-7 h-[1px] bg-white/20" /> // WHAT YOU ARE BUYING UNDER THE HOOD
            </p>
            <h2 className="font-heading text-[clamp(28px,3.4vw,40px)] leading-[1.1] text-white mb-10">Same architecture across all three. Your security team can audit it once, not three times.</h2>
          </FadeUp>

          <div className="flex flex-col gap-3">
            {[
              { name: 'Experience Layer', body: 'Web and mobile interfaces · Stakeholder-friendly views' },
              { name: 'Service & AI Layer', body: 'Modular APIs · AI-assisted reasoning · Workflows' },
              { name: 'Data & Integration Layer', body: 'Contextual data · Connectors to ERPs/HRIS/registries' },
              { name: 'Trust & Infra Layer', body: 'ISO 27001 controls · Encryption · Audit logs · SLAs', highlight: true },
            ].map((layer, i, arr) => (
              <FadeUp key={layer.name} delay={0.05 * i}>
                <div className={`rounded-xl border p-5 lg:p-6 ${layer.highlight ? 'bg-accent-blue/10 border-accent-blue/40' : 'bg-ink-base border-white/10'}`}>
                  <p className="font-display text-[18px] tracking-[0.04em] uppercase text-white">{layer.name}</p>
                  <p className="mt-2 text-[13px] leading-[1.7] text-white/75">{layer.body}</p>
                </div>
                {i < arr.length - 1 && (
                  <div aria-hidden className="flex justify-center py-1">
                    <span className="text-white/55 text-[14px]">↓</span>
                  </div>
                )}
              </FadeUp>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="chip-iso">ISO 9001:2015</span>
            <span className="chip-iso">ISO/IEC 20000-1</span>
            <span className="chip-iso">ISO/IEC 27001</span>
          </div>
        </div>
      </section>

      {/* Product Cards */}
      <section className="flex-1 py-16 lg:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <FadeUp delay={0.1}>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/75 mb-10">
              {products.length} products
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product: any, index: number) => {
              const Icon = ICON_MAP[product.icon] || Users;
              return (
                <FadeUp key={product.slug} delay={0.15 + index * 0.1}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="card-magnetic card-glow-border group bg-ink-raised hover:bg-ink-glass border border-white/10 hover:border-accent-blueHover/30 p-8 flex flex-col h-full transition-all duration-500 relative overflow-hidden rounded-xl"
                  >
                    <div className="absolute inset-0 bg-accent-blue scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-accent-blueHover/30 group-hover:bg-accent-blueHover/[0.06] transition-all duration-300 rounded-lg">
                          <Icon size={20} className="text-accent-blue" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                          {product.subtitle}
                        </span>
                      </div>

                      {product.label && (
                        <span className="inline-block self-start font-mono text-[10px] tracking-[0.12em] px-2.5 py-0.5 rounded-full border text-accent-blue border-accent-blue/30 bg-accent-blue/10 mb-4">
                          {product.label}
                        </span>
                      )}

                      <h2 className="font-display text-[22px] uppercase tracking-[0.04em] text-white group-hover:text-accent-blueHover transition-colors duration-200 mb-3">
                        {product.title}
                      </h2>

                      <p className="text-[13px] text-white/75 leading-relaxed mb-6 flex-1">
                        {product.description}
                      </p>

                      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 group-hover:text-accent-blueHover/80 transition-colors">
                        Learn more
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>

          {/* Trust paragraph */}
          <FadeUp delay={0.3}>
            <div className="mt-16 max-w-3xl border-l-2 border-accent-blue/30 pl-6">
              <p className="text-[15px] leading-[1.75] text-white/75">
                When your procurement team asks about encryption, access logs and sub-processors, send them this — not a chase email. All Adviserve products run inside an ISO/IEC 27001-aligned ISMS. Encryption at rest, role-based access, audit logs, structured output by default.
              </p>
              <Link to="/trust" className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-white hover:text-accent-blue transition-colors">
                Send this to your security team
                <ArrowRight size={12} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, #1e9df1 0%, #1a82d4 50%, #0F2F66 100%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-[1.05] max-w-3xl mb-6">See it on your own data. Not a generic demo.</h2>
            <p className="text-white/75 text-[17px] max-w-2xl mb-8">
              30 minutes. Bring a sample of your DPDP register, your candidate pipeline or your HR data. We will walk you through the product on your problem — with the team that builds it.
            </p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href="/consultation" label="Walk through it on my data" size="lg" />
              <AnimatedCTAButton href="/contact" label="Send a question instead" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
