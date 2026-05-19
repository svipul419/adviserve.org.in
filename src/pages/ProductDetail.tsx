/**
 * ProductDetail — slug-driven product page (Task 6 rebuild).
 * Lighter treatment than service detail per spec. Honest staging.
 * Content sourced from §PROD-COMPLY / §PROD-HIRE / §PROD-PEOPLE.
 */
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, UserCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import EngineeringHero from '../components/sections/EngineeringHero';
import { publicApi } from '../lib/api';

interface ProductDetailContent {
  slug: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  status: string;
  primaryCta: { label: string; href: string };
  features: string[];
  about: string;
  stage: string;
  finalCta: { label: string; href: string };
  icon: LucideIcon;
  seoTitle: string;
  seoDescription: string;
}

const PRODUCTS: Record<string, ProductDetailContent> = {
  'dpdp-compliance': {
    slug: 'dpdp-compliance',
    eyebrow: 'PRODUCT · COMPLIANCE',
    h1: 'Adviserve Comply.',
    subtitle: 'DPDP compliance, operationalised — for organisations that need the discipline embedded in tooling, not in retainers alone.',
    status: 'PILOT · ANCHOR PARTNERS OPEN',
    primaryCta: { label: 'Apply for the pilot', href: '/contact?product=comply' },
    features: [
      'Data inventory and processing-activity register, mapped to DPDP articles',
      'Consent management with granular and revocable signals',
      'Evidence packs auto-generated for regulator inspection',
    ],
    about: 'Adviserve Comply is engineered against the same standard we apply to our consulting engagements. Encrypted by default, role-based, audit-logged. It is not a generic privacy platform with an India veneer — it is built specifically to the DPDP Act, with statutory mapping baked into every workflow.',
    stage: 'Pilot deployments are open to anchor partners through Q3 2026. Pilot includes guided onboarding, configuration, and priority feature input into the production release.',
    finalCta: { label: 'Apply for the pilot', href: '/contact?product=comply' },
    icon: ShieldCheck,
    seoTitle: 'Adviserve Comply · DPDP compliance, operationalised',
    seoDescription: 'DPDP compliance, operationalised. Encrypted by default, role-based, audit-logged. Pilot open to anchor partners through Q3 2026.',
  },
  'ats-system': {
    slug: 'ats-system',
    eyebrow: 'PRODUCT · TALENT',
    h1: 'Adviserve Hire.',
    subtitle: "Candidate screening that produces structured, explainable signals — built for hiring teams that don't trust black-box scoring.",
    status: 'IN DEVELOPMENT',
    primaryCta: { label: 'Request early access', href: '/contact?product=hire' },
    features: [
      'Structured CV parsing with consistent ranking signals',
      'Role-fit scoring with traceable evidence per criterion',
      'Bias-mitigation review layer with structured checkpoints',
    ],
    about: 'Most candidate-screening tools produce a score and an opacity. The hiring manager sees a number and trusts it or distrusts it. Adviserve Hire produces a score and the evidence behind it — readable, defensible, auditable in a hiring committee.',
    stage: 'Currently in development. Early access conversations open with anchor partners.',
    finalCta: { label: 'Request early access', href: '/contact?product=hire' },
    icon: UserCheck,
    seoTitle: 'Adviserve Hire · Candidate screening with explainable scoring',
    seoDescription: 'Structured, explainable candidate screening with bias-mitigation review. In development. Early access conversations open.',
  },
  'hris-portal': {
    slug: 'hris-portal',
    eyebrow: 'PRODUCT · WORKFORCE',
    h1: 'Adviserve People.',
    subtitle: 'Modular workforce management for organisations whose existing HRMS no longer fits — without ripping it out.',
    status: 'IN DEVELOPMENT',
    primaryCta: { label: 'Request early access', href: '/contact?product=people' },
    features: [
      'Modular lifecycle, payroll, and approval workflows',
      'Role-based access with audit trails',
      'API-first integration with existing ERPs and HRIS',
    ],
    about: 'The most expensive HRMS migration is the one that replaces a working system. Adviserve People is built to sit next to your existing stack, not on top of it. Modules are deployable independently — start where the gap is.',
    stage: 'Currently in development. Anchor partner conversations welcome for early-access pilot.',
    finalCta: { label: 'Request early access', href: '/contact?product=people' },
    icon: Users,
    seoTitle: 'Adviserve People · Modular workforce management',
    seoDescription: 'Modular HRMS for organisations whose existing system no longer fits — without ripping it out. In development.',
  },
};

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  useQuery({ queryKey: ['product', slug], queryFn: () => publicApi.getProduct(slug!), enabled: !!slug });
  const detail = slug ? PRODUCTS[slug] : undefined;

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-ink-base">
        <SEOHead title="Product Not Found" />
        <h2 className="text-2xl font-bold text-white mb-2">Product not found.</h2>
        <Link to="/products" className="text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors">Browse all products</Link>
      </div>
    );
  }
  const Icon = detail.icon;

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title={detail.seoTitle} description={detail.seoDescription} canonical={`https://adviserve.in/products/${slug}`} />

      <EngineeringHero
        eyebrow={detail.eyebrow}
        title={detail.h1}
        subtitle={detail.subtitle}
        sheet="PRD"
        total="07"
        label={`PRODUCT · ${(slug || '').toUpperCase()}`}
        mark="PRD"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ border: `1px solid #1e9df155`, background: 'rgba(30,157,241,0.10)' }}>
            <Icon size={22} className="text-[#1e9df1]" />
          </div>
          <span className="inline-block font-mono text-[10px] tracking-[0.14em] px-3 py-1 rounded-full text-[#1e9df1]" style={{ border: `1px solid #1e9df155`, background: 'rgba(30,157,241,0.08)' }}>
            {detail.status}
          </span>
        </div>
        <AnimatedCTAButton href={detail.primaryCta.href} label={detail.primaryCta.label} size="lg" />
      </EngineeringHero>

      {/* Features */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7">// FEATURES</p>
          </FadeUp>
          <ul className="space-y-4">
            {detail.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[16px] leading-[1.75] text-white/85">
                <CheckCircle2 size={18} className="text-white/75 flex-shrink-0 mt-1" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About */}
      <section className="py-20 lg:py-24 bg-ink-base border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7">// ABOUT</p>
            <p className="text-[17px] leading-[1.8] text-white/85">{detail.about}</p>
          </FadeUp>
        </div>
      </section>

      {/* Stage */}
      <section className="py-20 lg:py-24 bg-ink-raised border-t hairline">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <FadeUp>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65 mb-7">// STAGE</p>
            <p className="text-[17px] leading-[1.8] text-white/85">{detail.stage}</p>
          </FadeUp>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden" data-section-color="dark">
        <div className="absolute inset-0 bg-brand-gradient" style={{ backgroundSize: '200% 200%' }} />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-24 text-white">
          <FadeUp>
            <h2 className="font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em] max-w-3xl mb-6">{detail.finalCta.label}.</h2>
            <p className="text-white/75 text-[17px] leading-[1.65] max-w-2xl mb-8">Pilot conversations include guided onboarding, configuration, and priority feature input into the production release.</p>
            <div className="flex flex-wrap gap-3">
              <AnimatedCTAButton href={detail.finalCta.href} label={detail.finalCta.label} size="lg" />
              <AnimatedCTAButton href="/products" label="See all products" size="lg" variant="on-dark" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
