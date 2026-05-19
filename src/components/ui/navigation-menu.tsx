"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./sheet";
import { publicApi } from "../../lib/api";
import { useSiteAssets } from "../../hooks/useSiteAssets";

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Products",
    href: "/products",
    children: [
      { name: "Adviserve People", href: "/products/hris-portal" },
      { name: "Adviserve Hire", href: "/products/ats-system" },
      { name: "Adviserve Comply", href: "/products/dpdp-compliance" },
    ]
  },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Recruitment & Talent Acquisition", href: "/services/recruitment" },
      { name: "HR Services & Consulting", href: "/services/hr-services" },
      { name: "Business Consulting & Strategy", href: "/services/business-consulting" },
      { name: "Corporate Training & L&D", href: "/services/corporate-training" },
      { name: "Legal Consulting & Compliance", href: "/services/legal-consulting" },
      { name: "IT Consulting & Development", href: "/services/it-services" },
    ]
  },
  { name: "About", href: "/about" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

/** Merge admin API menu with hardcoded defaults so dropdowns always render. */
function mergeNavMenus(defaults: NavItem[], apiItems: NavItem[]): NavItem[] {
  const merged: NavItem[] = [];
  const usedApiNames = new Set<string>();

  for (const def of defaults) {
    const match = apiItems.find((a) => a.name.toLowerCase() === def.name.toLowerCase());
    if (match) {
      usedApiNames.add(match.name.toLowerCase());
      // Use API entry but backfill default's children if API has none
      merged.push({
        ...match,
        children: (match.children && match.children.length > 0) ? match.children : def.children,
      });
    } else {
      merged.push(def);
    }
  }

  // Append any API-only entries not in defaults
  for (const api of apiItems) {
    if (!usedApiNames.has(api.name.toLowerCase()) && !defaults.some((d) => d.name.toLowerCase() === api.name.toLowerCase())) {
      merged.push(api);
    }
  }

  return merged;
}

function useNavItems(): NavItem[] {
  const [items, setItems] = React.useState<NavItem[]>(DEFAULT_NAV_ITEMS);

  React.useEffect(() => {
    publicApi.getMenu().then((menuItems) => {
      if (menuItems && menuItems.length > 0) {
        const mapped: NavItem[] = menuItems
          .filter((m: any) => !m.parent_id)
          .map((m: any) => {
            const children = menuItems
              .filter((c: any) => c.parent_id === m.id)
              .map((c: any) => ({ name: c.label, href: c.url }));
            return {
              name: m.label,
              href: m.url,
              ...(children.length > 0 ? { children } : {}),
            };
          });
        setItems(mergeNavMenus(DEFAULT_NAV_ITEMS, mapped));
      }
    }).catch(() => { /* keep defaults */ });
  }, []);

  return items;
}

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring" as const, damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    }
  },
};

const NavItemElement = ({ item, isExpanded }: { item: any, isExpanded: boolean }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="relative flex items-center h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div variants={itemVariants}>
        <Link
          to={item.href}
          onClick={(e) => {
             if (!isExpanded) {
               e.preventDefault();
             } else if (item.children) {
               e.preventDefault();
             }
          }}
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1 flex items-center gap-1 rounded-full cursor-pointer h-full whitespace-nowrap",
            isHovered ? "text-white" : "text-white/60"
          )}
        >
          {item.name}
          {item.children && <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isHovered && "rotate-180")} />}
        </Link>
      </motion.div>

      <AnimatePresence>
        {item.children && isExpanded && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-12 left-0 w-56 bg-gray-50 border border-black/5 shadow-2xl rounded-xl z-[60] overflow-hidden flex flex-col py-2"
          >
            {item.children.map((child: any) => (
              <Link
                key={child.name}
                to={child.href}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-white/5 transition-all w-full flex items-center whitespace-nowrap"
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function DesktopNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const navItems = useNavItems();
  const assets = useSiteAssets();
  
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    setScrolled(latest > 50);

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    }
    else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-6 inset-x-0 z-[100] hidden lg:flex items-start justify-center px-8">
      {/* Logo — left of page, vertically aligned with nav pill */}
      <motion.div
        className="absolute left-0 top-0 z-[101] flex items-center h-16"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
      >
        <Link to="/" aria-label="Adviserve — home">
          <img src={assets?.logo_url || '/adviserve-logo.svg'} alt="Adviserve" className="h-16 w-auto object-contain" />
        </Link>
      </motion.div>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex items-center rounded-full border shadow-2xl h-14 overflow-visible transition-all duration-300 backdrop-blur-xl backdrop-saturate-150",
          scrolled
            ? "bg-white/80 border-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            : "bg-white/70 border-black/10",
          !isExpanded ? "cursor-pointer justify-center overflow-hidden" : ""
        )}
      >
        <motion.div
          className={cn(
            "flex items-center gap-1 xl:gap-2 px-5 h-full relative",
            !isExpanded && "pointer-events-none"
          )}
        >
          {navItems.map((item) => (
            <NavItemElement key={item.name} item={item} isExpanded={isExpanded} />
          ))}
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
            className="text-black"
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const navItems = useNavItems();
  const assets = useSiteAssets();

  return (
    <div className="lg:hidden fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-[9999] pointer-events-none transition-all duration-300">
      <div className="flex items-center justify-between pointer-events-auto bg-gray-200 backdrop-blur-xl px-4 py-3 rounded-full border border-black/20 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        
        <Link to="/" aria-label="Adviserve — home" className="flex items-center">
          <img src={assets?.logo_url || '/adviserve-logo.svg'} alt="Adviserve" className="h-12 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-black hover:bg-white/20 transition-colors focus:ring-2 focus:ring-accent-blue focus:outline-none pointer-events-auto">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-ink-raised border-l border-black/10 p-0 w-full max-w-sm">
            <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
              <div className="p-6 border-b border-black/10 shrink-0">
                <SheetTitle className="flex items-center">
                  <Link to="/" aria-label="Adviserve — home" onClick={() => setOpen(false)}>
                    <img src={assets?.logo_url || '/adviserve-logo.svg'} alt="Adviserve" className="h-10 w-auto" />
                  </Link>
                </SheetTitle>
              </div>
              
              <div className="flex-1 flex flex-col px-6 py-8 gap-6">
                {navItems.map((item) => (
                  <div key={item.name} className="flex flex-col gap-3">
                    <Link
                      to={item.href}
                      onClick={() => { if(!item.children) setOpen(false) }}
                      className="text-black text-xl font-medium tracking-tight hover:text-accent-blueHover transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="flex flex-col gap-3 pl-4 border-l-2 border-black/5 ml-2 mt-1">
                        {item.children.map(child => (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={() => setOpen(false)}
                            className="text-gray-600 text-base font-medium hover:text-black transition-colors py-1 cursor-pointer"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </div>
  );
}

export function AnimatedNavFramer() {
  return (
    <>
      <DesktopNavFramer />
      <MobileNav />
    </>
  );
}
