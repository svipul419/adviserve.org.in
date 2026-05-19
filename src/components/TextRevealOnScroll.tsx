import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealOnScrollProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  start?: string;
}

/**
 * Outcrowd-style character-by-character text reveal on scroll.
 * Splits text into words and characters, then fades each character
 * up from below as the element enters the viewport.
 */
export default function TextRevealOnScroll({
  text,
  className = '',
  tag: Tag = 'h2',
  stagger = 0.035,
  start = 'top 85%',
}: TextRevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const chars = ref.current.querySelectorAll('.tr-char');

    if (prefersReduced) {
      gsap.set(chars, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(chars,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [text, stagger, start]);

  const words = text.split(' ');

  return (
    <Tag ref={ref as any} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]" style={{ overflow: 'hidden' }}>
          {word.split('').map((char, ci) => (
            <span
              key={`${wi}-${ci}`}
              className="tr-char inline-block"
              style={{ opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
