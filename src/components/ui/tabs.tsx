import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: React.ReactNode;
};

export function Tabs({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);
  const [hovering, setHovering] = useState(false);
  const tablistRef = useRef<HTMLDivElement>(null);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIdx = propTabs.findIndex(t => t.value === active.value);
    let nextIdx: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIdx = (currentIdx + 1) % propTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (currentIdx - 1 + propTabs.length) % propTabs.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = propTabs.length - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      moveSelectedTabToTop(nextIdx);
      // Focus the activated tab button
      const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIdx]?.focus();
    }
  }, [active.value, propTabs]);

  return (
    <>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Content tabs"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={active.value === tab.value}
            aria-controls={`panel-${tab.value}`}
            tabIndex={active.value === tab.value ? 0 : -1}
            onClick={() => moveSelectedTabToTop(idx)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onTouchStart={() => setHovering(true)}
            className={cn(
              "relative px-4 py-3 min-h-[44px] rounded-full text-sm font-medium transition-colors",
              tabClassName
            )}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-accent-blue/10 rounded-full border border-accent-blue/30",
                  activeTabClassName
                )}
              />
            )}
            <span
              className={cn(
                "relative block",
                active.value === tab.value
                  ? "text-accent-blue"
                  : "text-gray-600 hover:text-black"
              )}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        hovering={hovering}
        className={cn("mt-8", contentClassName)}
      />
    </>
  );
}

function FadeInDiv({
  className,
  tabs,
  active,
  hovering,
}: {
  className?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) {
  const isActive = (tab: Tab) => tab.value === active.value;
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          role="tabpanel"
          id={`panel-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          hidden={!isActive(tab)}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
}
