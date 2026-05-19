import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export interface VerticalTabItem {
  code: string;
  name: string;
  desc: string;
}

interface VerticalTabsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  steps: VerticalTabItem[];
  autoPlayMs?: number;
  className?: string;
}

export function VerticalTabs({
  eyebrow = "// 00.04° — How We Work",
  title = "Four steps. No surprises.",
  description = "Every engagement follows the same disciplined process — whether you need one practice or all six.",
  steps,
  autoPlayMs = 5000,
  className,
}: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  }, [steps.length]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(handleNext, autoPlayMs);
    return () => clearInterval(id);
  }, [activeIndex, isPaused, handleNext, autoPlayMs]);

  return (
    <section
      className={cn(
        "w-full py-20 lg:py-28 px-6 sm:px-12 bg-gray-50 relative overflow-hidden",
        className,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      <div className="w-full relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 lg:mb-20">
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-blue mb-6 flex items-center gap-3">
              <span className="w-10 h-[1px] bg-accent-blue" /> {eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-[1.1] tracking-tight text-black">
              {title}
            </h2>
          </div>
          <p className="lg:col-span-5 text-[15px] md:text-[16px] leading-[1.8] text-gray-600 max-w-xl">
            {description}
          </p>
        </div>

        {/* Full-width tab rows */}
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                type="button"
                key={step.code}
                onClick={() => handleTabClick(index)}
                aria-expanded={isActive}
                className={cn(
                  "group relative w-full text-left py-8 md:py-10 border-t border-black/10 last:border-b transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50",
                  isActive
                    ? "text-black"
                    : "text-gray-500/80 hover:text-black",
                )}
              >
                {/* Progress rail — top edge */}
                {isActive && (
                  <motion.div
                    key={`rail-${index}-${isPaused}`}
                    className="absolute top-0 left-0 h-[2px] bg-accent-blue origin-left"
                    initial={{ width: "0%" }}
                    animate={isPaused ? { width: "0%" } : { width: "100%" }}
                    transition={{ duration: autoPlayMs / 1000, ease: "linear" }}
                  />
                )}

                <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
                  {/* Code */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[11px] md:text-[12px] text-accent-blue tabular-nums tracking-[0.14em]">
                      //{step.code}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="col-span-10 md:col-span-5">
                    <span className="font-display text-[28px] md:text-[40px] lg:text-[52px] uppercase whitespace-pre-line leading-[1.05] tracking-[0.02em] block">
                      {step.name}
                    </span>
                  </div>

                  {/* Description — always visible, highlights on active */}
                  <div className="col-span-12 md:col-span-6">
                    <p className={`text-[14px] md:text-[16px] leading-[1.75] max-w-2xl pt-1 transition-colors duration-300 ${
 isActive ? 'text-gray-600' : 'text-gray-400'
 }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
