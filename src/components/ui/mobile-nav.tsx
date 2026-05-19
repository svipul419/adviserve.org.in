import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavItems } from "./3d-adaptive-navigation-pill";
import { useSiteAssets } from "../../hooks/useSiteAssets";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const navItems  = useNavItems();
  const assets    = useSiteAssets();
  const { pathname } = useLocation();
  const navigate  = useNavigate();

  // Close drawer on route change
  React.useEffect(() => { setOpen(false); }, [pathname]);

  // Scroll-aware text/icon color (light over dark hero, dark elsewhere)
  const isHomepage = pathname === '/';
  const [isOverDark, setIsOverDark] = React.useState(isHomepage);

  React.useEffect(() => {
    if (!isHomepage) {
      setIsOverDark(false);
      return;
    }
    const onScroll = () => {
      const next = window.scrollY < window.innerHeight * 0.8;
      setIsOverDark(prev => prev === next ? prev : next);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomepage]);

  // Lock body scroll when open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Fixed top bar (mobile only) — engineering hairline */}
      <div
        className="lg:hidden fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-5 h-16 backdrop-blur-xl transition-colors duration-300"
        style={{
          background: isOverDark ? 'rgba(11,20,38,0.45)' : 'rgba(251,253,255,0.85)',
          borderBottom: isOverDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(30,157,241,0.25)',
        }}
      >
        <Link to="/" aria-label="Adviserve — home" className="flex-shrink-0">
          <img
            src={assets?.logo_url || "/adviserve-logo.svg"}
            alt="Adviserve"
            className="h-10 w-auto object-contain transition-all duration-300"
            style={{ filter: isOverDark ? "brightness(0) invert(1)" : "none" }}
          />
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-11 h-11 transition-all duration-300 hover:bg-[#1e9df1] hover:text-white group"
          aria-label="Open navigation menu"
          style={{
            border: isOverDark ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(30,157,241,0.45)',
            background: isOverDark ? 'rgba(255,255,255,0.10)' : 'rgba(251,253,255,0.92)',
            color: isOverDark ? '#FFFFFF' : '#0B1426',
          }}
        >
          <Menu className="w-5 h-5 transition-colors duration-300" />
        </button>
      </div>

      {/* ── Spacer so page content starts below the fixed bar ── */}
      <div className="lg:hidden h-16" aria-hidden="true" />

      {/* ── Drawer overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel — engineering blueprint sheet */}
            <motion.div
              key="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-[201] w-full max-w-[340px] shadow-2xl flex flex-col"
              style={{
                background: `
                  linear-gradient(rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
                  linear-gradient(90deg, rgba(30,157,241,0.10) 1px, transparent 1px) 0 0 / 36px 36px,
                  linear-gradient(rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
                  linear-gradient(90deg, rgba(30,157,241,0.18) 1px, transparent 1px) 0 0 / 180px 180px,
                  #FBFDFF
                `,
                borderLeft: '1px solid rgba(30,157,241,0.30)',
              }}
            >
              {/* Corner registration crosshairs */}
              {([
                { key: 'tl', top: 12, left: 12 },
                { key: 'tr', top: 12, right: 12 },
                { key: 'bl', bottom: 12, left: 12 },
                { key: 'br', bottom: 12, right: 12 },
              ] as ReadonlyArray<{ key: string; top?: number; right?: number; bottom?: number; left?: number }>).map((m) => (
                <span
                  key={m.key}
                  aria-hidden="true"
                  className="absolute pointer-events-none"
                  style={{ width: 12, height: 12, top: m.top, left: m.left, right: m.right, bottom: m.bottom, zIndex: 5 }}
                >
                  <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(30,157,241,0.70)' }} />
                  <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(30,157,241,0.70)' }} />
                  <span style={{ position: 'absolute', inset: 2.5, borderRadius: '50%', border: '1px solid rgba(30,157,241,0.70)' }} />
                </span>
              ))}

              {/* Top dimension callout */}
              <div className="px-6 pt-7 pb-2 flex items-center flex-shrink-0">
                <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>◀</span>
                <span className="flex-1 mx-2 h-px" style={{ background: 'rgba(30,157,241,0.40)' }} />
                <span className="px-2 font-mono text-[9px] tracking-[0.26em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>
                  INDEX · NAV
                </span>
                <span className="flex-1 mx-2 h-px" style={{ background: 'rgba(30,157,241,0.40)' }} />
                <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: 'rgba(30,157,241,0.85)' }}>▶</span>
              </div>

              {/* Drawer header — logo + close */}
              <div
                className="flex items-center justify-between px-6 pt-4 pb-5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(30,157,241,0.22)' }}
              >
                <Link to="/" onClick={() => setOpen(false)} aria-label="Adviserve — home">
                  <img
                    src={assets?.logo_url || "/adviserve-logo.svg"}
                    alt="Adviserve"
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-10 h-10 transition-all hover:bg-[#1e9df1] hover:text-white"
                  style={{
                    border: '1px solid rgba(30,157,241,0.45)',
                    background: 'rgba(251,253,255,0.92)',
                    color: '#0B1426',
                  }}
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav items list — drafted item rows with dashed dividers */}
              <nav data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4">
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase mb-3 px-2 flex items-center gap-2" style={{ color: 'rgba(30,157,241,0.85)' }}>
                  <span className="font-bold tabular-nums" style={{ color: '#1e9df1' }}>01</span>
                  <span className="w-3 h-px" style={{ background: 'rgba(30,157,241,0.55)' }} />
                  <span>Primary</span>
                </p>
                <ul className="flex flex-col">
                  {navItems.map((item, i) => {
                    const isActive =
                      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 + i * 0.04,
                          type: "spring",
                          damping: 22,
                          stiffness: 300,
                        }}
                        style={i > 0 ? { borderTop: '1px dashed rgba(30,157,241,0.25)' } : undefined}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className="w-full flex items-center gap-3 px-3 py-3.5 text-left min-h-[52px] transition-colors group"
                          style={{
                            color: isActive ? "#1e9df1" : "#0B1426",
                            background: isActive ? "rgba(30,157,241,0.08)" : "transparent",
                          }}
                        >
                          <span
                            className="font-mono text-[9px] tracking-[0.20em] uppercase flex-shrink-0"
                            style={{ color: isActive ? "#1e9df1" : "rgba(30,157,241,0.55)" }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className="w-3 h-px flex-shrink-0"
                            style={{ background: isActive ? "#1e9df1" : "rgba(30,157,241,0.40)" }}
                          />
                          <span className="font-display text-[16px] tracking-[-0.01em] flex-1" style={{ fontWeight: 400 }}>
                            {item.label}
                          </span>
                          <span
                            className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            style={{ color: '#1e9df1' }}
                          >
                            →
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* CTA footer */}
              <div
                className="flex-shrink-0 px-6 pt-5"
                style={{
                  paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
                  borderTop: '1px solid rgba(30,157,241,0.22)',
                }}
              >
                <button
                  onClick={() => { navigate("/consultation"); setOpen(false); }}
                  className="w-full py-4 font-mono text-[11px] uppercase tracking-[0.22em] font-bold text-white bg-[#1e9df1] hover:bg-[#1a82d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e9df1] transition-colors duration-150 min-h-[52px] flex items-center justify-center gap-2"
                >
                  Book a Consultation <span>→</span>
                </button>
                <p className="mt-3 font-mono text-[9px] tracking-[0.24em] uppercase text-center" style={{ color: 'rgba(30,157,241,0.65)' }}>
                  Free · 30 min · Response in 24h
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
