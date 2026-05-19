"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ExpandableCardProps {
  title: string;
  src: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
  statValueRender?: React.ReactNode; // allow rich formatting of stat numbers
}

export function ExpandableCard({
  title,
  src,
  description,
  children,
  className,
  classNameExpanded,
  statValueRender,
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-md h-full w-full z-[150]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div
            className={cn(
              "fixed inset-0 grid place-items-center z-[200] sm:mt-16 before:pointer-events-none p-4",
            )}
          >
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              className={cn(
                "w-full max-w-[850px] max-h-[80vh] flex flex-col overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] rounded-3xl bg-white border border-black/10 shadow-2xl relative",
                classNameExpanded,
              )}
            >
              <div className="relative h-full flex flex-col">
                <div className="flex justify-between items-start p-8 h-auto relative z-20 shrink-0">
                  <div>
                    <motion.p
                      layoutId={`description-${description}-${id}`}
                      className="text-accent-blue uppercase tracking-[0.2em] font-mono text-sm"
                    >
                      {description}
                    </motion.p>
                    <motion.h3
                      layoutId={`title-${title}-${id}`}
                      className="font-display font-semibold text-black text-4xl sm:text-6xl mt-2"
                    >
                      {title}
                    </motion.h3>
                  </div>
                  <motion.button
                    aria-label="Close card"
                    layoutId={`button-${title}-${id}`}
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/10 text-black hover:bg-accent-blueHover transition-colors duration-300 focus:outline-none"
                    onClick={() => setActive(false)}
                  >
                    <motion.div
                      animate={{ rotate: active ? 45 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </motion.div>
                  </motion.button>
                </div>
                
                {/* Image takes center stage in expanded view */}
                <motion.div layoutId={`image-${title}-${id}`} className="px-8 shrink-0">
                  <img
                    src={src}
                    alt={title}
                    className="w-full h-48 sm:h-64 rounded-xl object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  />
                </motion.div>
                
                <div className="relative px-6 sm:px-8 py-8 flex-1">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-black text-base flex flex-col items-start gap-4"
                  >
                    {children}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        role="dialog"
        aria-labelledby={`card-title-${id}`}
        aria-modal="true"
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        onMouseEnter={() => setActive(true)}
        className={cn(
          "stat-card group relative bg-gray-100 border border-black/5 p-6 lg:p-7 hover:border-accent-blueHover/30 cursor-pointer overflow-hidden flex flex-col justify-between items-start transition-all duration-500",
          className,
        )}
      >
        <div className="absolute inset-0 bg-accent-blue/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Invisible image in collapsed view to map layoutId morph */}
        <motion.div layoutId={`image-${title}-${id}`} className="hidden">
           <img src={src} className="w-full h-full" />
        </motion.div>
        
        <div className="relative z-10 w-full">
          <motion.div 
            layoutId={`title-${title}-${id}`}
            className="stat-number font-display text-[clamp(40px,4vw,56px)] leading-none text-black pointer-events-none"
          >
            {statValueRender || title}
          </motion.div>
          <motion.p
            layoutId={`description-${description}-${id}`}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-3 pointer-events-none"
          >
            {description}
          </motion.p>
          <div className="w-6 h-[1px] bg-accent-blue/30 mt-3" />
        </div>
        
        <div className="absolute opacity-0 group-hover:opacity-100 bottom-6 right-6 transition-opacity duration-300 pointer-events-none text-accent-blue/50">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 3 6 6-6 6"/><path d="M21 9H9a6 6 0 0 0-6 6v3"/></svg>
        </div>
        
        <motion.button
           aria-label="Open card"
           layoutId={`button-${title}-${id}`}
           className="hidden"
        >
          {/* Button morphes from hidden safely */}
        </motion.button>
      </motion.div>
    </>
  );
}
