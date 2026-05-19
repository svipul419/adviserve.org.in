import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef } from 'react';

interface HeroScrollWrapperProps {
  topSection: React.ReactNode;
  bottomSection: React.ReactNode;
}

interface InnerProps {
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
  position: 'top' | 'bottom';
}

function ScrollSection({ scrollYProgress, children, position }: InnerProps) {
  const scaleRange = position === 'top' ? [1, 0.95] : [0.95, 1];
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.35, 1],
    [scaleRange[0], scaleRange[1], scaleRange[1]]
  );

  const baseClass = position === 'top'
    ? 'sticky top-0 h-screen overflow-hidden z-0'
    : 'relative min-h-screen z-10';

  return (
    <motion.section
      style={{ scaleY, transformOrigin: 'bottom', willChange: 'transform' }}
      className={baseClass}
    >
      {children}
    </motion.section>
  );
}

export function HeroScrollWrapper({ topSection, bottomSection }: HeroScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative">
      <ScrollSection scrollYProgress={scrollYProgress} position="top">
        {topSection}
      </ScrollSection>
      <ScrollSection scrollYProgress={scrollYProgress} position="bottom">
        {bottomSection}
      </ScrollSection>
    </div>
  );
}
