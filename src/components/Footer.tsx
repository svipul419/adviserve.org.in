import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Globe, Linkedin, Twitter, Youtube, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { publicApi, formApi } from '../lib/api';
import type { ContactInfo } from '../lib/types';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';

/**
 * Footer — engineering "end sheet" of the dossier.
 *
 * Bone paper + cyan hairline grid, four-column nav, drafting title-block at
 * the bottom-right with sheet metadata, oversized Adviserve logo wordmark as
 * a watermark behind the legal strip, corner registration crosshairs and
 * vertical label rail — same vocabulary as Home hero + FlowSection sheets.
 */
const ACCENT = '#1e9df1';
const INK    = '#0B1426';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { content: siteContent } = useSiteContent('home');
  const { content: footerContent } = useSiteContent('footer');
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const copyrightName = footerContent.footer_copyright_name || siteContent.copyright_name || 'Adviserve';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const servicesCol = [
    { label: 'Cybersecurity', url: '/services/cybersecurity' },
    { label: 'Compliance & RegTech', url: '/services/compliance-regtech' },
    { label: 'HR Services', url: '/services/hr-services' },
    { label: 'IT Consulting', url: '/services/it-services' },
    { label: 'Legal Consulting', url: '/services/legal-consulting' },
    { label: 'SaaS Products', url: '/services/saas-products' },
    { label: 'Corporate Training', url: '/services/corporate-training' },
  ];
  const productsCol = [
    { label: 'Adviserve Comply', url: '/products/dpdp-compliance' },
    { label: 'Adviserve Hire', url: '/products/ats-system' },
    { label: 'Adviserve People', url: '/products/hris-portal' },
  ];
  const adviserveCol = [
    { label: 'About', url: '/about' },
    { label: 'Team', url: '/team' },
    { label: 'Careers', url: '/careers' },
    { label: 'Contact', url: '/contact' },
  ];
  const resourcesCol = [
    { label: 'Industries', url: '/industries' },
    { label: 'Partnerships', url: '/partnerships' },
    { label: 'Case Studies', url: '/case-studies' },
  ];
  const trustCol = [
    { label: 'Trust & Security', url: '/trust' },
    { label: 'Privacy', url: '/privacy' },
    { label: 'Terms', url: '/terms' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await publicApi.getSettings();
      if (data) {
        const contact: ContactInfo = {};
        data.forEach((item: { key: string; value: string }) => {
          if (['company_email', 'company_phone', 'company_address'].includes(item.key)) {
            contact[item.key as keyof ContactInfo] = item.value;
          }
          if (item.key === 'linkedin_url') contact.social_linkedin = item.value;
          if (item.key === 'twitter_url') contact.social_twitter = item.value;
          if (item.key === 'facebook_url') contact.social_facebook = item.value;
          if (item.key === 'instagram_url') contact.social_instagram = item.value;
          if (item.key === 'youtube_url') contact.social_youtube = item.value;
        });
        setContactInfo(contact);
      }
    } catch (err) {
      console.error('Failed to fetch footer settings:', err);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeError('');
    try {
      await formApi.subscribe({ email, source: 'footer_newsletter' });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Subscribe failed. Try again.';
      setSubscribeError(msg);
      setTimeout(() => setSubscribeError(''), 5000);
    }
  };

  const displayEmail = contactInfo.company_email || 'info@adviserve.com';
  const displayPhone = contactInfo.company_phone || '';
  const footerHeaderSubscribe = footerContent.footer_header_subscribe || 'Newsletter';

  type LegalLink = { label: string; href: string };
  const defaultLegalLinks: LegalLink[] = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];
  const parsedLinks: LegalLink[] = parseJsonContent<LegalLink[]>(
    footerContent.footer_legal_links,
    defaultLegalLinks,
  );
  const legalLinks: LegalLink[] = Array.isArray(parsedLinks) ? parsedLinks : defaultLegalLinks;
  const parsedFv: Record<string, boolean> = parseJsonContent<Record<string, boolean>>(
    footerContent.footer_field_visibility,
    {},
  );
  const footerFv: Record<string, boolean> = (parsedFv && typeof parsedFv === 'object') ? parsedFv : {};

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  })();

  const colHeading = (label: string, index: string) => (
    <div className="mb-5">
      <p
        className="font-mono text-[10px] tracking-[0.32em] uppercase flex items-center gap-2"
        style={{ color: `${ACCENT}DD` }}
      >
        <span className="font-bold tabular-nums" style={{ color: ACCENT }}>{index}</span>
        <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
        <span>{label}</span>
      </p>
    </div>
  );

  const linkCls = 'group inline-flex items-center gap-2 font-sans text-[14px] leading-[1.6] transition-colors';

  return (
    <footer
      className="relative mt-auto overflow-hidden"
      style={{
        // Bone paper + cyan hairline grid + cyan border at top
        background: `
          linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
          linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
          linear-gradient(rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
          linear-gradient(90deg, rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
          #FBFDFF
        `,
        borderTop: `1px solid ${ACCENT}33`,
      }}
    >
      {/* Center vignette */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(110% 80% at 50% 50%, rgba(251,253,255,0.85) 0%, rgba(251,253,255,0.40) 60%, transparent 90%)',
        }}
      />

      {/* Corner registration crosshairs */}
      {([
        { key: 'tl', top: 14, left: 14 },
        { key: 'tr', top: 14, right: 14 },
        { key: 'bl', bottom: 14, left: 14 },
        { key: 'br', bottom: 14, right: 14 },
      ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number }>).map((m) => (
        <span
          key={m.key}
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{ width: 16, height: 16, top: m.top, left: m.left, right: m.right, bottom: m.bottom, zIndex: 4 }}
        >
          <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `${ACCENT}AA` }} />
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `${ACCENT}AA` }} />
          <span style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px solid ${ACCENT}AA` }} />
        </span>
      ))}

      {/* Vertical rotated rail on the right edge */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 origin-center -rotate-90 items-center gap-3 pointer-events-none"
        style={{ zIndex: 4 }}
      >
        <span className="block w-8 h-px" style={{ background: `${ACCENT}55` }} />
        <span className="font-mono text-[10px] tracking-[0.32em] uppercase whitespace-nowrap" style={{ color: `${ACCENT}DD` }}>
          End Sheet · Adviserve · 2026
        </span>
        <span className="block w-8 h-px" style={{ background: `${ACCENT}55` }} />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-12" style={{ zIndex: 5 }}>
        {/* Top dimension callout — sheet identifier */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-[clamp(2rem,4vw,4rem)] right-[clamp(2rem,4vw,4rem)] flex items-center pt-6 pointer-events-none"
        >
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>◀</span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="px-2 font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: `${ACCENT}DD` }}>
            END SHEET · 07 / 07 · DOSSIER CLOSE
          </span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${ACCENT}55` }} />
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${ACCENT}DD` }}>▶</span>
        </div>

        {/* 4-column nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 pt-20 pb-12">
          <div>
            {colHeading('Practices', '01')}
            <ul className="space-y-2.5">
              {servicesCol.map((l) => (
                <li key={l.url}>
                  <Link to={l.url} className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                    <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {colHeading('Products', '02')}
            <ul className="space-y-2.5">
              {productsCol.map((l) => (
                <li key={l.url}>
                  <Link to={l.url} className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                    <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {colHeading('Company', '03')}
            <ul className="space-y-2.5">
              {adviserveCol.concat(resourcesCol).map((l) => (
                <li key={l.url}>
                  <Link to={l.url} className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                    <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">{l.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/trust" className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                  <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                  <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">Certifications</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            {colHeading('Support', '04')}
            <ul className="space-y-2.5">
              <li>
                <Link to="/insights" className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                  <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                  <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">Insights</span>
                </Link>
              </li>
              <li>
                <Link to="/dpdp-assessment" className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                  <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                  <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">DPDP Self-Assessment</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                  <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                  <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">FAQ</span>
                </Link>
              </li>
              {trustCol.map((l) => (
                <li key={l.url}>
                  <Link to={l.url} className={linkCls} style={{ color: 'rgba(11,20,38,0.75)' }}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: ACCENT }} />
                    <span className="group-hover:translate-x-0.5 transition-transform group-hover:text-[#0B1426]">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact + Newsletter band */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 py-10 border-t" style={{ borderColor: `${ACCENT}33` }}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-3 flex items-center gap-2" style={{ color: `${ACCENT}DD` }}>
              <span className="relative inline-flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#1e9df1] opacity-75 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-[#1e9df1]" />
              </span>
              Get in touch
              <span className="flex-1 h-px ml-2" style={{ background: `${ACCENT}55` }} />
            </p>
            {displayPhone && (
              <p className="font-display text-[clamp(18px,2vw,24px)] leading-tight mb-1" style={{ color: INK, fontWeight: 400 }}>
                {displayPhone}
              </p>
            )}
            <a
              href={`mailto:${displayEmail}`}
              className="font-display text-[clamp(20px,2.4vw,30px)] leading-tight tracking-[-0.01em] transition-colors"
              style={{ color: INK, fontWeight: 400 }}
            >
              <span className="border-b border-transparent hover:border-[#1e9df1] hover:text-[#1e9df1] transition-colors">
                {displayEmail}
              </span>
            </a>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mb-3 flex items-center gap-2" style={{ color: `${ACCENT}DD` }}>
              <span className="relative inline-flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#1e9df1] opacity-75 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-[#1e9df1]" />
              </span>
              {footerHeaderSubscribe}
              <span className="flex-1 h-px ml-2" style={{ background: `${ACCENT}55` }} />
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-none"
              style={{ border: `1px solid ${ACCENT}66`, background: 'rgba(251,253,255,0.85)' }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                required
                aria-label="Email address"
                className="flex-1 bg-transparent px-4 py-3 text-[14px] focus:outline-none placeholder:text-[rgba(11,20,38,0.40)]"
                style={{ color: INK }}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] font-mono font-bold tracking-[0.22em] uppercase transition-colors group"
                style={{ background: ACCENT, color: '#FFFFFF' }}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
            {subscribeError && (
              <p role="alert" className="text-xs mt-2" style={{ color: '#B83A8C' }}>{subscribeError}</p>
            )}
          </div>
        </div>

        {/* Bottom band — social + location + back-to-top */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 border-t"
          style={{ borderColor: `${ACCENT}33` }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 h-9 px-4 transition-colors font-mono text-[11px] tracking-[0.22em] uppercase"
            style={{ background: 'rgba(251,253,255,0.85)', border: `1px solid ${ACCENT}55`, color: INK }}
            aria-label="Choose location"
          >
            <Globe size={13} style={{ color: ACCENT }} />
            <span>India</span>
          </button>

          <div className="flex items-center gap-2">
            {[
              { url: contactInfo.social_linkedin, icon: Linkedin, label: 'LinkedIn' },
              { url: contactInfo.social_twitter, icon: Twitter, label: 'Twitter' },
              { url: contactInfo.social_youtube, icon: Youtube, label: 'YouTube' },
              { url: contactInfo.social_facebook, icon: Facebook, label: 'Facebook' },
              { url: contactInfo.social_instagram, icon: Instagram, label: 'Instagram' },
            ]
              .filter((s) => !!s.url)
              .map(({ url, icon: Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center transition-all hover:bg-[#1e9df1] hover:text-white"
                  style={{ background: 'rgba(251,253,255,0.85)', border: `1px solid ${ACCENT}55`, color: INK }}
                >
                  <Icon size={14} />
                </a>
              ))}
          </div>

          <div className="flex items-center gap-4 font-mono text-[10.5px] tracking-[0.22em] uppercase" style={{ color: `${ACCENT}BB` }}>
            {footerFv['copyright_name'] !== false && (
              <span style={{ color: 'rgba(11,20,38,0.55)' }}>© {currentYear} {copyrightName}</span>
            )}
            {footerFv['legal_links'] !== false && legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="hover:underline underline-offset-4 transition-colors"
                style={{ color: 'rgba(11,20,38,0.55)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="w-10 h-10 flex items-center justify-center transition-all hover:scale-105"
            style={{ background: ACCENT, color: '#FFFFFF', boxShadow: `0 10px 24px -8px ${ACCENT}88` }}
          >
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Drafting title-block — bottom-right end-sheet stamp */}
        <div
          className="absolute bottom-3 right-3 pointer-events-none hidden md:grid grid-cols-2 font-mono text-[9.5px] tracking-[0.18em] uppercase leading-[1.55]"
          style={{
            color: `${ACCENT}DD`,
            background: 'rgba(251,253,255,0.92)',
            border: `1px solid ${ACCENT}55`,
            minWidth: 240,
            zIndex: 5,
          }}
        >
          <div className="px-3 py-1.5 border-r border-b" style={{ borderColor: `${ACCENT}55` }}>
            <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>SHEET</div>
            <div className="font-bold">07 / 07</div>
          </div>
          <div className="px-3 py-1.5 border-b" style={{ borderColor: `${ACCENT}55` }}>
            <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>DATE</div>
            <div className="font-bold">{today}</div>
          </div>
          <div className="px-3 py-1.5 col-span-2">
            <div style={{ color: `${ACCENT}99`, fontSize: 8 }}>SECTION · END</div>
            <div className="font-bold text-[10.5px]" style={{ color: ACCENT, letterSpacing: '0.14em' }}>
              ADVISERVE · DOSSIER CLOSE
            </div>
          </div>
        </div>
      </div>

      {/* End-of-dossier sign-off — Top Stories typographic spec with extra
          engineering chrome: top hairline + revision strip, sheet metadata
          line, hairline-flanked logo, gradient highlight, subhead. */}
      <div className="relative pt-12 pb-14 px-6 sm:px-12 overflow-hidden" style={{ zIndex: 5 }}>
        {/* Hairline rule + revision strip at the top */}
        <div className="max-w-[1440px] mx-auto mb-10 flex items-center gap-3 font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: `${ACCENT}AA` }}>
          <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
          <span style={{ color: ACCENT }}>● {currentYear}</span>
          <span className="w-3 h-px" style={{ background: `${ACCENT}66` }} />
          <span>Rev A</span>
          <span className="w-3 h-px" style={{ background: `${ACCENT}66` }} />
          <span>Issue {today}</span>
          <span className="w-3 h-px" style={{ background: `${ACCENT}66` }} />
          <span style={{ color: ACCENT }}>Approved ✓</span>
          <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
        </div>

        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">
          {/* Hairline-flanked logo — reads as the imprint signature */}
          <div className="flex items-center gap-4 sm:gap-6 w-full max-w-[520px]">
            <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
            <Link to="/" aria-label="Adviserve home" className="inline-block flex-shrink-0">
              <img
                src="/adviserve-logo.svg"
                alt="Adviserve"
                className="select-none transition-opacity hover:opacity-80"
                style={{
                  height: 'clamp(56px, 7vw, 96px)',
                  width: 'auto',
                }}
              />
            </Link>
            <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
          </div>

          <h2
            className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] text-[#0B1426] max-w-[20ch]"
            style={{ fontWeight: 400 }}
          >
            End of{' '}
            <span style={{
              background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>dossier.</span>
          </h2>

          <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto text-[rgba(11,20,38,0.66)]">
            Seven practices. One operating standard. One team behind every sheet.
          </p>

          {/* Bottom dimension callout — closes the dossier */}
          <div
            aria-hidden="true"
            className="mt-6 w-full max-w-[480px] flex items-center gap-3 font-mono text-[9.5px] tracking-[0.32em] uppercase"
            style={{ color: `${ACCENT}AA` }}
          >
            <span style={{ color: `${ACCENT}DD` }}>◀</span>
            <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
            <span>Folio Closes Here</span>
            <span className="flex-1 h-px" style={{ background: `${ACCENT}55` }} />
            <span style={{ color: `${ACCENT}DD` }}>▶</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
