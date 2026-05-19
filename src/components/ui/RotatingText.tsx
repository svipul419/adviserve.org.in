import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function RotatingText({ words, interval = 2400, className = '' }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [width, setWidth] = React.useState<string>('auto');
  // Span (not div) so this component is valid as a descendant of <p> — see
  // React's validateDOMNesting check; <div> inside <p> auto-closes the <p>.
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  React.useEffect(() => {
    if (measureRef.current) {
      const el = measureRef.current.children[currentIndex];
      if (el) setWidth(`${el.getBoundingClientRect().width}px`);
    }
  }, [currentIndex]);

  React.useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length, reducedMotion]);

  // Filter:blur breaks background-clip:text gradients on parent. Use translateY + opacity only.
  const variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0, 0, 0.58, 1] as const } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3, ease: [0.42, 0, 1, 1] as const } },
  };

  if (reducedMotion) {
    return <span className={cn('inline-block', className)}>{words[0]}</span>;
  }

  return (
    <>
      <span ref={measureRef} aria-hidden="true" className="absolute opacity-0 pointer-events-none" style={{ visibility: 'hidden' }}>
        {words.map((word, i) => <span key={i} className={className}>{word}</span>)}
      </span>
      <motion.span
        className="relative inline-block align-baseline"
        animate={{ width, transition: { type: 'spring', stiffness: 150, damping: 15, mass: 1.2 } }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={cn('inline-block', className)}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: 'nowrap' }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
