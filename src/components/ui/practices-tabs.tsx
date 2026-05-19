import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRACTICES = [
  {
    id: '01',
    title: 'Recruitment',
    description: 'Tech, GTM, leadership hires across India. Series A→C scaling teams, mid-market manufacturing. Retainer · per-hire · embedded RPO.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200',
    outcomes: [['Avg time-to-offer', '22 days'], ['Offer→join rate', '86%'], ['Cost per hire vs market', '−34%']],
    href: '/services/recruitment',
  },
  {
    id: '02',
    title: 'HR Operations',
    description: 'Payroll, lifecycle, POSH, EDLI, statutory. 50–500 employee orgs without a HR head. Retainer · per-employee · outcome-based.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200',
    outcomes: [['Payroll cycle', '< 2 business days'], ['Statutory compliance', '100%'], ['Employee NPS lift', '+18']],
    href: '/services/hr-services',
  },
  {
    id: '03',
    title: 'Training',
    description: 'Corporate, leadership, induction, behavioural. Teams rolling out new managers or restructuring. Cohort · keynote · 12-week program.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200',
    outcomes: [['Manager confidence', '+42%'], ['Regrettable attrition', '−27%'], ['Train-the-trainer certified', 'yes']],
    href: '/services/corporate-training',
  },
  {
    id: '04',
    title: 'Business Consulting',
    description: 'Org design, GTM, operating cadence. Founders past Series A, family businesses in handover. Project · fractional · outcome-based.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200',
    outcomes: [['Strategy→execution gap', 'closed, documented'], ['Operating reviews', 'weekly']],
    href: '/services/business-consulting',
  },
  {
    id: '05',
    title: 'Legal & Compliance',
    description: 'DPDP, labour, commercial, IP, disputes. Any business processing personal data in India. Project · retainer · fractional GC.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200',
    outcomes: [['DPDP readiness', 'audit-ready'], ['Contract turnaround', '48 hrs']],
    href: '/services/legal-consulting',
  },
  {
    id: '06',
    title: 'Custom Development',
    description: 'Internal tools, integrations, dashboards. Teams with a painful spreadsheet ops. Fixed-scope project · engagement from ₹8L.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200',
    outcomes: [['Spreadsheet → app', 'typical 6 weeks'], ['Integrations shipped', 'Zoho, Tally, ERP']],
    /* Custom development row CTA intentionally points to IT services — Adviserve's build practice is delivered through the IT services team, not a separate product SKU */
    href: '/services/it-services',
  },
];

const AUTO_PLAY_DURATION = 5000;

export function PracticesTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % PRACTICES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + PRACTICES.length) % PRACTICES.length);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, AUTO_PLAY_DURATION);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext]);

  const variants = {
    enter: (dir: number) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
    center: { zIndex: 1, y: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Tabs */}
        <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
          <div className="flex flex-col space-y-0">
            {PRACTICES.map((practice, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={practice.id}
                  onClick={() => handleTabClick(index)}
                  className={cn(
                    'group relative flex items-start gap-4 py-6 md:py-8 text-left transition-all duration-500 border-t border-white/10 first:border-0',
                    isActive
                      ? 'text-white'
                      : 'text-white/55 hover:text-white'
                  )}
                >
                  <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-white/10">
                    {isActive && (
                      <motion.div
                        key={`progress-${index}-${isPaused}`}
                        className="absolute top-0 left-0 w-full bg-accent-blue origin-top"
                        initial={{ height: '0%' }}
                        animate={isPaused ? { height: '0%' } : { height: '100%' }}
                        transition={{ duration: AUTO_PLAY_DURATION / 1000, ease: 'linear' }}
                      />
                    )}
                  </div>

                  <span className="font-mono text-[9px] md:text-[10px] font-medium mt-1 tabular-nums text-accent-blue/60">
                    /{practice.id}
                  </span>

                  <div className="flex flex-col gap-2 flex-1">
                    <span className={cn(
                      'text-2xl md:text-3xl lg:text-4xl font-display tracking-tight transition-colors duration-500',
                      isActive ? 'text-white' : ''
                    )}>
                      {practice.title}
                    </span>

                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-white/75 text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                            {practice.description}
                          </p>
                          {/* Outcomes */}
                          <div className="flex flex-wrap gap-2 mt-2 mb-2">
                            {practice.outcomes.map(([label, value]) => (
                              <span key={label} className="inline-flex items-center gap-1.5 bg-ink-base text-white/75 rounded-full px-3 py-1 text-xs font-medium border hairline">
                                <span className="font-display text-white">{value}</span> {label}
                              </span>
                            ))}
                          </div>
                          <Link to={practice.href} className="text-sm font-medium text-white hover:underline">
                            Explore {practice.title.toLowerCase()} →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Image gallery */}
        <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
          <div
            className="relative group/gallery"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
          >
            <div className="relative aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11] rounded-2xl md:rounded-3xl overflow-hidden bg-ink-base border hairline">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: 'spring', stiffness: 260, damping: 32 },
                    opacity: { duration: 0.4 },
                  }}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  onClick={handleNext}
                >
                  <img
                    src={PRACTICES[activeIndex].image}
                    alt={PRACTICES[activeIndex].title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                </motion.div>
              </AnimatePresence>

              {/* Nav buttons */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border hairline flex items-center justify-center text-white hover:bg-ink-glass transition-all active:scale-90"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border hairline flex items-center justify-center text-white hover:bg-ink-glass transition-all active:scale-90"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticesTabs;
