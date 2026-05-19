/**
 * Parallax — scroll-Y translate wrapper. GSAP ScrollTrigger scrub.
 * Speed > 0 moves down slower than scroll (depth). speed < 0 = reverse.
 * Respects prefers-reduced-motion.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;       // 0..1, fraction of trigger height to shift
  className?: string;
}

export default function Parallax({ children, speed = 0.2, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) return;

    const tween = gsap.fromTo(
      el,
      { y: `${speed * -50}%` },
      {
        y: `${speed * 50}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        force3D: true,
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
