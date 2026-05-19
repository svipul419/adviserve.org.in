/**
 * InfosysHeaderBar — Infosys-style floating composition.
 *
 * Layout:
 *   [hamburger circle] [wordmark]   [floating glass pill w/ menu items]   [dark "Talk to us" pill]
 *
 * Adaptive contrast:
 *   - Over dark hero: white wordmark, glass-translucent center pill
 *   - After scroll past 24px OR over light: opaque white center pill, brand-ink wordmark
 *   - Right CTA stays dark always
 *
 * Wordmark = TEXT (not SVG) to guarantee contrast — the multi-gradient logo
 * SVG cannot be reliably color-inverted with CSS filters.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import MagneticPill from './MagneticPill';

interface NavItem { label: string; href: string; mega?: 'services' | 'products' | null; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',       href: '/',           mega: null },
  { label: 'Services',   href: '/services',   mega: null },
  { label: 'Products',   href: '/products',   mega: null },
  { label: 'Industries', href: '/industries', mega: null },
  { label: 'Insights',   href: '/insights',   mega: null },
  { label: 'About',      href: '/about',      mega: null },
];

const SERVICES_MEGA = [
  { col: 'Risk & Compliance', items: [
    { label: 'Cybersecurity',         href: '/services/cybersecurity',       desc: 'Vulnerability, threat intelligence, governance.' },
    { label: 'Compliance & RegTech',  href: '/services/compliance-regtech',  desc: 'DPDP Act 2023, operationalised.' },
    { label: 'Legal Consulting',      href: '/services/legal-consulting',    desc: 'Counsel that reads the system.' },
  ] },
  { col: 'Talent & Capability', items: [
    { label: 'HR Services & Staffing', href: '/services/hr-services',        desc: 'Hiring that closes the capability gap.' },
    { label: 'Corporate Training',     href: '/services/corporate-training', desc: 'Training measured against work.' },
  ] },
  { col: 'Technology & Platforms', items: [
    { label: 'IT Consulting',  href: '/services/it-services',   desc: 'IT delivered as a service.' },
    { label: 'SaaS Products',  href: '/services/saas-products', desc: 'Software built to the operating standard.' },
  ] },
];

const PRODUCTS_MEGA = [
  { col: 'Platforms', items: [
    { label: 'Adviserve Comply', href: '/products/dpdp-compliance', desc: 'DPDP compliance, operationalised. PILOT.' },
    { label: 'Adviserve Hire',   href: '/products/ats-system',      desc: 'Explainable candidate screening.' },
    { label: 'Adviserve People', href: '/products/hris-portal',     desc: 'Modular workforce management.' },
  ] },
  { col: 'For Anchor Partners', items: [
    { label: 'Pilot programme', href: '/contact?type=pilot',     desc: 'Guided onboarding + priority features.' },
    { label: 'Custom builds',   href: '/services/saas-products', desc: 'Bespoke modules to the operating standard.' },
  ] },
];

function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

function useOverDark(): boolean {
  const [over, setOver] = useState(true);
  useEffect(() => {
    const sample = () => {
      const SAMPLE_Y = 36;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-color]'));
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= SAMPLE_Y && r.bottom >= SAMPLE_Y) {
          setOver(sec.getAttribute('data-section-color') === 'dark');
          return;
        }
      }
      setOver(false);
    };
    sample();
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sample); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const mo = new MutationObserver(sample);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener('scroll', onScroll); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return over;
}

export default function InfosysHeaderBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scrolled = useScrolled(60);
  const overDark = useOverDark();
  const [megaOpen, setMegaOpen] = useState<'services' | 'products' | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock background page scroll while the drawer is open so wheel/touch
  // events route to the drawer's own scrollable nav.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [drawerOpen]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  // Two-mode chrome:
  //   Glass mode  → currently sitting over a dark section (auto-adapts to bg lightness)
  //   Solid mode  → over a light section or mega panel is open
  const glassMode = overDark && megaOpen === null;
  const onLightChrome = !glassMode;

  function openMega(name: 'services' | 'products') {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(name);
  }
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(null), 160);
  }

  // Center pill chrome
  //   Glass mode  → own translucent surface over dark hero
  //   Scrolled    → transparent (curved white-glass bar sits behind, no double-surface)
  //   Light page  → solid white pill
  const pillBg = scrolled
    ? 'transparent'
    : glassMode
      ? 'rgba(255,255,255,0.18)'
      : 'rgba(255,255,255,0.96)';
  const pillBorder = scrolled
    ? '1px solid transparent'
    : glassMode
      ? '1px solid rgba(255,255,255,0.25)'
      : '1px solid rgba(11,18,32,0.08)';
  const activeText = glassMode ? 'text-white' : 'text-[#0B1426]';

  return (
    <>
      {/* Curved white-glass scroll backdrop — appears ONLY on scroll.
          One rounded-full pill wraps the entire nav row edge-to-edge.
          Spans from the hamburger circle (left edge ~24px) to the Talk-to-us pill
          (right edge ~24px) in one continuous glass surface. */}
      <div
        aria-hidden="true"
        className="hidden lg:block fixed top-5 z-[99] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          left: 16,
          right: 16,
          height: 56,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(14,26,46,0.08)',
          backdropFilter: 'saturate(180%) blur(18px)',
          WebkitBackdropFilter: 'saturate(180%) blur(18px)',
          boxShadow: '0 6px 18px rgba(14,26,46,0.06), 0 18px 40px rgba(14,26,46,0.08)',
          opacity: scrolled ? 1 : 0,
          transform: `scale(${scrolled ? 1 : 0.96})`,
          transformOrigin: 'center',
        }}
      />
      <header
        className="hidden lg:flex fixed top-5 inset-x-0 z-[100] items-center justify-between pointer-events-none"
        style={{ height: 56 }}
      >
        {/* ── Left bookend: engineering hamburger + logo ── */}
        <div className="pointer-events-auto flex items-center gap-4 pl-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:bg-[#1e9df1] hover:text-white relative"
            style={{
              background: glassMode ? 'rgba(255,255,255,0.10)' : 'rgba(251,253,255,0.95)',
              border: glassMode ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(30,157,241,0.45)',
              backdropFilter: 'saturate(150%) blur(12px)',
              WebkitBackdropFilter: 'saturate(150%) blur(12px)',
              boxShadow: glassMode ? '0 6px 18px rgba(0,0,0,0.18)' : '0 6px 16px rgba(30,157,241,0.18)',
              color: glassMode ? '#FFFFFF' : '#0B1426',
            }}
          >
            {/* Tiny corner ticks — register the button into the engineering language */}
            <span aria-hidden="true" className="absolute top-0.5 left-0.5 w-1.5 h-1.5" style={{ borderTop: `1px solid ${glassMode ? 'rgba(255,255,255,0.55)' : 'rgba(30,157,241,0.70)'}`, borderLeft: `1px solid ${glassMode ? 'rgba(255,255,255,0.55)' : 'rgba(30,157,241,0.70)'}` }} />
            <span aria-hidden="true" className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5" style={{ borderBottom: `1px solid ${glassMode ? 'rgba(255,255,255,0.55)' : 'rgba(30,157,241,0.70)'}`, borderRight: `1px solid ${glassMode ? 'rgba(255,255,255,0.55)' : 'rgba(30,157,241,0.70)'}` }} />
            <Menu size={18} strokeWidth={2} />
          </button>
          <Link to="/" aria-label="Adviserve — home" className="flex items-center">
            <img
              src="/adviserve-logo.svg"
              alt="Adviserve"
              className="h-12 w-auto object-contain select-none"
              draggable={false}
            />
          </Link>
        </div>

        {/* ── Center: floating glass pill — always visible ── */}
        <div
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center"
          onMouseLeave={scheduleClose}
        >
          <nav
            role="navigation"
            aria-label="Primary"
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-colors duration-300"
            style={{
              background: pillBg,
              border: pillBorder,
              backdropFilter: onLightChrome ? 'saturate(180%) blur(14px)' : 'saturate(150%) blur(10px)',
              WebkitBackdropFilter: onLightChrome ? 'saturate(180%) blur(14px)' : 'saturate(150%) blur(10px)',
              boxShadow: onLightChrome ? '0 8px 24px rgba(11,18,32,0.08)' : '0 6px 18px rgba(0,0,0,0.18)',
            }}
          >
            {NAV_ITEMS.map((it) => {
              const active = isActive(it.href);
              const hasMega = !!it.mega;
              const open = megaOpen === it.mega;
              return (
                <div
                  key={it.href}
                  className="relative"
                  onMouseEnter={() => hasMega && openMega(it.mega!)}
                >
                  <button
                    onClick={() => navigate(it.href)}
                    className={`inline-flex items-center gap-1 h-9 px-4 rounded-full text-[13.5px] tracking-[0.01em] transition-colors ${
                      active
                        ? `${activeText} font-medium`
                        : glassMode
                          ? 'text-white/85 hover:text-white'
                          : 'text-[#0B1426]/75 hover:text-[#0B1426]'
                    }`}
                    aria-expanded={hasMega ? open : undefined}
                    aria-haspopup={hasMega || undefined}
                  >
                    <span>{it.label}</span>
                    {hasMega && <ChevronDown size={11} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} opacity-60`} />}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── Right bookend: multicolor gradient "Talk to us" pill (magnetic) ── */}
        <div className="pointer-events-auto pr-6">
          <MagneticPill strength={0.26}>
            <Link
              to="/consultation"
              className="pill-multicolor-fill group relative inline-flex items-center gap-3 h-12 pl-5 pr-1.5 rounded-full text-[13px] font-medium tracking-[0.02em] text-white"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.7)]" aria-hidden="true" />
              <span className="whitespace-nowrap relative z-10">Talk to us</span>
              <span aria-hidden="true" className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink-base/85 backdrop-blur text-white transition-transform duration-300 group-hover:rotate-[-45deg]">
                <ArrowRight size={14} strokeWidth={2.25} />
              </span>
            </Link>
          </MagneticPill>
        </div>
      </header>

      {/* ── Mega-menu panel ── */}
      {megaOpen && (
        <div
          className="hidden lg:block fixed top-[80px] inset-x-0 z-[99]"
          onMouseEnter={() => openMega(megaOpen)}
          onMouseLeave={scheduleClose}
        >
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="rounded-2xl bg-ink-raised shadow-[0_24px_60px_rgba(11,18,32,0.18)] border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10 p-10">
                {(megaOpen === 'services' ? SERVICES_MEGA : PRODUCTS_MEGA).map((g) => (
                  <div key={g.col}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 mb-4">{g.col}</p>
                    <ul className="space-y-4">
                      {g.items.map((m) => (
                        <li key={m.href}>
                          <Link to={m.href} onClick={() => setMegaOpen(null)} className="group block">
                            <p className="font-display text-[15px] uppercase tracking-[0.02em] text-white group-hover:text-accent-blueHover transition-colors">{m.label}</p>
                            <p className="mt-1 text-[12.5px] leading-[1.55] text-white/60">{m.desc}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {/* Featured callout */}
                <div className="rounded-xl bg-ink-base text-white p-7 flex flex-col justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-blue mb-3">FEATURED</p>
                    <p className="font-display text-[20px] leading-[1.25] tracking-[-0.01em]">
                      {megaOpen === 'services' ? 'How we engage' : 'Apply for the Comply pilot'}
                    </p>
                    <p className="mt-3 text-[13px] leading-[1.65] text-white/70">
                      {megaOpen === 'services'
                        ? 'Five stages, one signed-off plan. Same structure whether the work is a DPDP audit or a CISO search.'
                        : 'Pilot deployments open to anchor partners through Q3 2026.'}
                    </p>
                  </div>
                  <Link
                    to={megaOpen === 'services' ? '/services#engagement' : '/contact?product=comply'}
                    onClick={() => setMegaOpen(null)}
                    className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-accent-blue hover:text-white transition-colors"
                  >
                    Read more <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Drawer (engineering blueprint sheet) ── */}
      {drawerOpen && (
        <div className="hidden lg:block fixed inset-0 z-[110]">
          <div
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(11,20,38,0.42)' }}
          />
          <aside
            role="dialog"
            aria-label="Site menu"
            data-lenis-prevent
            className="absolute top-0 left-0 bottom-0 w-[520px] max-w-[92vw] shadow-2xl flex flex-col"
            style={{
              background: `
                linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
                linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
                linear-gradient(rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
                linear-gradient(90deg, rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
                #FBFDFF
              `,
              borderRight: '1px solid rgba(30,157,241,0.30)',
            }}
          >
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
                style={{ width: 14, height: 14, top: m.top, left: m.left, right: m.right, bottom: m.bottom, zIndex: 5 }}
              >
                <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(30,157,241,0.70)' }} />
                <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(30,157,241,0.70)' }} />
                <span style={{ position: 'absolute', inset: 3, borderRadius: '50%', border: '1px solid rgba(30,157,241,0.70)' }} />
              </span>
            ))}

            {/* Top dimension callout */}
            <div className="px-8 pt-7 pb-3 flex items-center flex-shrink-0" style={{ borderBottom: '1px solid rgba(30,157,241,0.22)' }}>
              <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>◀</span>
              <span className="flex-1 mx-2 h-px" style={{ background: 'rgba(30,157,241,0.40)' }} />
              <span className="px-2 font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>
                INDEX · NAVIGATION
              </span>
              <span className="flex-1 mx-2 h-px" style={{ background: 'rgba(30,157,241,0.40)' }} />
              <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>▶</span>
            </div>

            <div className="flex items-end justify-between px-8 pt-6 pb-4 flex-shrink-0">
              <div>
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase mb-2 flex items-center gap-2" style={{ color: 'rgba(30,157,241,0.85)' }}>
                  <span className="w-4 h-px" style={{ background: '#1e9df1' }} />
                  Site Map · 00 / 07
                </p>
                <h2 className="font-display text-[clamp(28px,3vw,40px)] leading-[1.05] tracking-[-0.02em]" style={{ color: '#0B1426', fontWeight: 400 }}>
                  The full{' '}
                  <span style={{
                    background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}>dossier.</span>
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#1e9df1] hover:text-white group"
                style={{ border: '1px solid rgba(30,157,241,0.45)', background: 'rgba(251,253,255,0.92)', color: '#0B1426' }}
              >
                <X size={16} />
              </button>
            </div>

            <nav
              data-lenis-prevent
              className="px-8 pb-8 space-y-8 flex-1 min-h-0"
              style={{
                overflowY: 'scroll',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <DrawerGroup index="00" heading="Home" links={[
                { label: 'Home', href: '/', desc: 'Cover sheet · the front door of the dossier.' },
              ]} onClose={() => setDrawerOpen(false)} />
              <DrawerGroup index="01" heading="Services" links={SERVICES_MEGA.flatMap((g) => g.items)} onClose={() => setDrawerOpen(false)} />
              <DrawerGroup index="02" heading="Products" links={PRODUCTS_MEGA.flatMap((g) => g.items)} onClose={() => setDrawerOpen(false)} />
              <DrawerGroup index="03" heading="Company" links={[
                { label: 'About', href: '/about', desc: 'Why this firm exists.' },
                { label: 'Team', href: '/team', desc: 'The practitioners behind the practice.' },
                { label: 'Industries', href: '/industries', desc: 'Sector contexts we engage.' },
                { label: 'Partnerships', href: '/partnerships', desc: 'Where we work with others.' },
                { label: 'Careers', href: '/careers', desc: 'Hiring across all seven practices.' },
                { label: 'Contact', href: '/contact', desc: 'Talk to the team.' },
              ]} onClose={() => setDrawerOpen(false)} />
              <DrawerGroup index="04" heading="Resources" links={[
                { label: 'Insights', href: '/insights', desc: 'Working notes from the practice.' },
                { label: 'DPDP Self-Assessment', href: '/dpdp-assessment', desc: 'Fifteen questions, fifteen minutes.' },
                { label: 'Case Studies', href: '/case-studies', desc: 'Real engagements.' },
                { label: 'FAQ', href: '/faq', desc: 'Eight questions, three categories.' },
                { label: 'Trust & Security', href: '/trust', desc: 'Three audited certifications.' },
              ]} onClose={() => setDrawerOpen(false)} />
            </nav>

            {/* Drafting title-block — pinned footer (not absolute), so the
                nav above scrolls independently and the title-block stays
                visible without overlapping content. */}
            <div
              className="mx-3 mb-3 grid grid-cols-3 text-[9.5px] font-mono tracking-[0.18em] uppercase leading-[1.55] pointer-events-none flex-shrink-0"
              style={{
                color: 'rgba(30,157,241,0.85)',
                background: 'rgba(251,253,255,0.95)',
                border: '1px solid rgba(30,157,241,0.40)',
                zIndex: 5,
              }}
            >
              <div className="px-3 py-1.5 border-r" style={{ borderColor: 'rgba(30,157,241,0.30)' }}>
                <div style={{ color: 'rgba(30,157,241,0.60)', fontSize: 8 }}>SHEET</div>
                <div className="font-bold">00 / 07</div>
              </div>
              <div className="px-3 py-1.5 border-r" style={{ borderColor: 'rgba(30,157,241,0.30)' }}>
                <div style={{ color: 'rgba(30,157,241,0.60)', fontSize: 8 }}>SCALE</div>
                <div className="font-bold">1 : 1</div>
              </div>
              <div className="px-3 py-1.5">
                <div style={{ color: 'rgba(30,157,241,0.60)', fontSize: 8 }}>SECTION</div>
                <div className="font-bold" style={{ color: '#1e9df1', letterSpacing: '0.14em' }}>SITE INDEX</div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function DrawerGroup({
  index,
  heading,
  links,
  onClose,
}: {
  index?: string;
  heading: string;
  links: Array<{ label: string; href: string; desc?: string }>;
  onClose: () => void;
}) {
  return (
    <div>
      {/* Indexed eyebrow with hairline rule — matches FlowSection column heads */}
      <div className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.32em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>
        {index && <span className="font-bold tabular-nums" style={{ color: '#1e9df1' }}>{index}</span>}
        <span className="w-4 h-px" style={{ background: 'rgba(30,157,241,0.55)' }} />
        <span>{heading}</span>
        <span className="flex-1 h-px" style={{ background: 'rgba(30,157,241,0.30)' }} />
      </div>
      <ul className="space-y-0">
        {links.map((l, i) => (
          <li key={l.href} style={i > 0 ? { borderTop: '1px dashed rgba(30,157,241,0.25)' } : undefined}>
            <Link
              to={l.href}
              onClick={onClose}
              className="group flex items-start gap-3 py-3 transition-colors hover:bg-[rgba(30,157,241,0.06)] -mx-2 px-2"
            >
              <span className="font-mono text-[9px] tracking-[0.20em] uppercase mt-1.5 flex-shrink-0" style={{ color: 'rgba(30,157,241,0.65)' }}>
                ▸
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[16px] leading-[1.2] tracking-[-0.01em] transition-colors" style={{ color: '#0B1426', fontWeight: 400 }}>
                  <span className="group-hover:underline underline-offset-4 decoration-[#1e9df1] decoration-[1.5px]">{l.label}</span>
                </p>
                {l.desc && (
                  <p className="mt-1 text-[12.5px] leading-[1.55]" style={{ color: 'rgba(11,20,38,0.60)' }}>{l.desc}</p>
                )}
              </div>
              <span className="font-mono text-[9px] tracking-[0.20em] uppercase mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: '#1e9df1' }}>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
