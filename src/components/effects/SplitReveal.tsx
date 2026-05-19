/**
 * SplitReveal — splits children text into spans (word or char) and reveals
 * each on scroll using a stagger mask animation. ScrollTrigger one-shot.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplitRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  by?: 'word' | 'char';
  stagger?: number;
  delay?: number;
}

export default function SplitReveal({
  text,
  as: Tag = 'h2',
  className = '',
  by = 'word',
  stagger = 0.045,
  delay = 0,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.querySelectorAll<HTMLElement>('.sr-tok').forEach((t) => { t.style.transform = 'none'; t.style.opacity = '1'; });
      return;
    }
    const toks = el.querySelectorAll('.sr-tok');
    const tw = gsap.fromTo(
      toks,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, [stagger, delay]);

  const tokens = by === 'char'
    ? text.split('')
    : text.split(/(\s+)/);

  return (
    <Tag ref={ref as never} className={className}>
      {tokens.map((t, i) => {
        if (by === 'word' && /^\s+$/.test(t)) return <span key={i}>{t}</span>;
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline">
            <span className="sr-tok inline-block will-change-transform" style={{ transform: 'translateY(110%)', opacity: 0 }}>
              {t === ' ' ? ' ' : t}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
