"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../../lib/api";
import { useSiteAssets } from "../../hooks/useSiteAssets";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  id: string;
  href: string;
}

// ─── Defaults (fallback if CMS is empty or unreachable) ──────────────────────

// Slim nav per user feedback. Industries, Partnerships, Careers, FAQ, Trust
// live in the footer. Primary nav surfaces top-of-funnel routes only.
const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home",     id: "home",     href: "/"         },
  { label: "Services", id: "services", href: "/services" },
  { label: "Products", id: "products", href: "/products" },
  { label: "Insights", id: "insights", href: "/insights" },
  { label: "About",    id: "about",    href: "/about"    },
];

// ─── Shared hook (used by pill AND mobile nav) ────────────────────────────────

export function useNavItems(): NavItem[] {
  const { data } = useQuery({
    queryKey: ["navMenu"],
    queryFn: async (): Promise<NavItem[]> => {
      try {
        const menuItems = await publicApi.getMenu();
        if (!menuItems || menuItems.length === 0) return DEFAULT_NAV_ITEMS;
        const topLevel: NavItem[] = menuItems
          .filter((m: any) => !m.parent_id)
          .map((m: any) => ({
            label: m.label,
            id: String(m.id),
            href: m.url,
          }));
        return topLevel.length > 0 ? topLevel : DEFAULT_NAV_ITEMS;
      } catch {
        return DEFAULT_NAV_ITEMS;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
  return data ?? DEFAULT_NAV_ITEMS;
}

// ─── Active item detection ────────────────────────────────────────────────────

function useActiveItem(items: NavItem[]): NavItem | undefined {
  const { pathname } = useLocation();
  return items.find((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  });
}

// ─── 3D Adaptive Navigation Pill ─────────────────────────────────────────────

export function AdaptiveNavPill() {
  const navItems  = useNavItems();
  const assets    = useSiteAssets();
  const navigate  = useNavigate();
  const activeItem = useActiveItem(navItems);

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isHovered,  setIsHovered]  = React.useState(false);

  // ── Scroll-aware text color ───────────────────────────────────────────────
  // Sections opt in by setting `data-section-color="dark"|"light"`. The pill
  // tracks which tagged section currently sits behind it (at y=PILL_Y), via
  // a scroll-driven scan plus a MutationObserver that re-scans whenever the
  // page mounts new sections (lazy-loaded routes). If no tagged section is
  // found we fall back to the body background-color luminance.
  const { pathname } = useLocation();
  const [isOverDark, setIsOverDark] = React.useState(pathname === '/');

  React.useEffect(() => {
    const PILL_Y = 36; // top:24px + half pill height ≈ 36
    let raf = 0;
    let sections: HTMLElement[] = [];

    const luminanceIsDark = (rgb: string): boolean | null => {
      const m = rgb.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
      if (parts.length < 3) return null;
      const [r, g, b, a = 1] = parts;
      if (a === 0) return null;
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return lum < 0.5;
    };

    const refreshSections = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-section-color]'),
      );
    };

    const sample = () => {
      raf = 0;
      let resolved: boolean | null = null;

      // 1) Prefer the tagged section whose rect contains the pill anchor.
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= PILL_Y && r.bottom >= PILL_Y) {
          resolved = sec.getAttribute('data-section-color') === 'dark';
          break;
        }
      }

      // 2) Fall back to the topmost element at the pill anchor (excluding
      //    the pill wrapper itself) and walk to the first opaque bg.
      if (resolved === null) {
        const stack = document.elementsFromPoint(window.innerWidth / 2, PILL_Y);
        for (const el of stack) {
          if ((el as HTMLElement).closest('[data-nav-pill]')) continue;
          let cur: HTMLElement | null = el as HTMLElement;
          while (cur) {
            const bg = getComputedStyle(cur).backgroundColor;
            const dark = luminanceIsDark(bg);
            if (dark !== null) { resolved = dark; break; }
            cur = cur.parentElement;
          }
          if (resolved !== null) break;
        }
      }

      // 3) Last resort: body luminance.
      if (resolved === null) {
        const dark = luminanceIsDark(getComputedStyle(document.body).backgroundColor);
        resolved = dark === true;
      }

      setIsOverDark((prev) => (prev === resolved ? prev : (resolved as boolean)));
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(sample);
    };

    refreshSections();
    // Initial sample on next frame so lazy-suspense sections have a chance
    // to mount before we read positions.
    schedule();

    // Re-scan whenever the DOM tree changes — Suspense fallback → real page
    // swap is the common case where the initial sample missed the hero.
    const mo = new MutationObserver(() => {
      refreshSections();
      schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      mo.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const textActive   = isOverDark ? "#ffffff"                  : "#0f2333";
  const textInactive = isOverDark ? "rgba(255,255,255,0.70)"  : "rgba(15,35,51,0.48)";
  const pillBorder   = isOverDark ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(0,0,0,0.10)";

  const { scrollY }        = useScroll();
  const lastScrollY        = React.useRef(0);
  const scrollOnCollapse   = React.useRef(0);
  const SCROLL_THRESHOLD   = 80;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollY.current;
    if (!isHovered) {
      if (isExpanded && latest > prev && latest > 120) {
        setIsExpanded(false);
        scrollOnCollapse.current = latest;
      } else if (!isExpanded && latest < prev && scrollOnCollapse.current - latest > SCROLL_THRESHOLD) {
        setIsExpanded(true);
      }
    }
    lastScrollY.current = latest;
  });

  // Width: items × 96px (slim per Infosys-style nav), capped at viewport − 96px
  const expandedWidth = React.useMemo(() => {
    const cap = typeof window !== "undefined" ? window.innerWidth - 96 : 1344;
    return Math.min(navItems.length * 96, cap);
  }, [navItems.length]);

  return (
    // Full-width fixed wrapper — logo absolute-left, pill flex-centered
    <div data-nav-pill className="hidden lg:flex fixed top-5 inset-x-0 z-[100] items-center justify-center px-8 pointer-events-none" style={{ height: 44 }}>

      {/* ── Logo ── */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[101] pointer-events-auto flex items-center">
        <Link to="/" aria-label="Adviserve — home" className="flex items-center">
          <img
            src={assets?.logo_url || "/adviserve-logo.svg"}
            alt="Adviserve"
            className="h-7 w-auto object-contain transition-[filter] duration-300"
            style={{ filter: isOverDark ? "brightness(0) invert(1)" : "none" }}
          />
        </Link>
      </div>

      {/* ── Right-anchored "Talk to us" CTA ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[101] pointer-events-auto flex items-center">
        <Link
          to="/consultation"
          className="inline-flex items-center gap-2 h-9 px-5 rounded-full text-[12px] font-medium tracking-[0.02em] bg-accent-blue text-white hover:bg-accent-blueHover/90 transition-colors"
        >
          Talk to us
        </Link>
      </div>

      {/* ── Pill ── */}
      <div
        className="pointer-events-auto relative"
        style={{ perspective: 1000, perspectiveOrigin: "50% 0" }}
        onMouseEnter={() => { setIsHovered(true);  setIsExpanded(true); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D depth shadow — blurred ellipse below the pill */}
        <motion.div
          className="absolute -z-10 left-1/2 -translate-x-1/2 rounded-full blur-xl"
          animate={{
            width:   isExpanded ? expandedWidth * 0.82 : 110,
            opacity: isExpanded ? 0.18 : 0.12,
          }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          style={{ bottom: -10, height: 18, background: "rgba(0,0,0,0.38)" }}
        />

        {/* Main pill surface */}
        <motion.nav
          animate={{
            width:   isExpanded ? expandedWidth : 166,
            rotateX: isExpanded ? 0 : -7,
          }}
          transition={{ type: "spring", damping: 24, stiffness: 300 }}
          style={{
            height: 44,
            borderRadius: 999,
            transformOrigin: "top center",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: pillBorder,
            transition: "border 0.3s ease",
            boxShadow: [
              "0 1px 0 rgba(255,255,255,0.72) inset",
              "0 -1px 0 rgba(0,0,0,0.06) inset",
              "0 2px 6px rgba(0,0,0,0.06)",
              "0 8px 24px rgba(0,0,0,0.09)",
              "0 24px 48px rgba(0,0,0,0.05)",
            ].join(", "),
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Top shine gradient */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-full"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, transparent 100%)" }}
          />

          <AnimatePresence mode="wait">
            {/* ── Collapsed: show active page name ── */}
            {!isExpanded && (
              <motion.button
                key="collapsed"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsExpanded(true)}
                className="relative z-10 flex items-center gap-2 px-7 whitespace-nowrap"
              >
                <span
                  className="text-[13px] font-semibold tracking-[0.01em]"
                  style={{ color: textActive, transition: "color 0.3s ease" }}
                >
                  {activeItem?.label ?? "Menu"}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-40 flex-shrink-0">
                  <path d="M1 1L5 5L9 1" stroke={isOverDark ? "rgba(255,255,255,0.8)" : "#1a1a2e"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            )}

            {/* ── Expanded: all nav items ── */}
            {isExpanded && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="relative z-10 flex items-center gap-0.5 px-3 h-full justify-center"
              >
                {navItems.map((item) => {
                  const isActive = item.id === activeItem?.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.href)}
                      className="relative flex items-center justify-center px-3 rounded-full text-[12px] font-medium tracking-[0.01em] whitespace-nowrap h-8 transition-colors duration-150"
                      style={{
                        color: isActive ? textActive : textInactive,
                        minWidth: 60,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {/* Active indicator with layout animation */}
                      {isActive && (
                        <motion.span
                          layoutId="pill-active-bg"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "rgba(0,184,148,0.09)",
                            boxShadow: "0 1px 3px rgba(0,184,148,0.10), inset 0 1px 0 rgba(255,255,255,0.55)",
                            border: "1px solid rgba(0,184,148,0.14)",
                          }}
                          transition={{ type: "spring", damping: 22, stiffness: 300 }}
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-300 ${isOverDark ? 'hover:text-white' : 'hover:text-[#0f2333]'}`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </div>
  );
}
