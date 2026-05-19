import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── FADE UP (GSAP-powered, scroll-driven) ───
interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  y?: number;
}

export function FadeUp({ children, delay = 0, duration = 0.7, className = '', once = true, y = 50 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    // Above-the-fold elements are already in the viewport on mount.
    // ScrollTrigger sometimes fails to fire `onEnter` for them — e.g. after
    // Suspense-resolved lazy chunks shift layout — leaving the element stuck
    // at opacity:0. Detect that case and play the animation directly.
    const rect = ref.current.getBoundingClientRect();
    const inViewOnMount = rect.top < window.innerHeight && rect.bottom > 0;

    const ctx = gsap.context(() => {
      const fromVars = { opacity: 0, y, rotateX: -3, transformPerspective: 1000 };
      const toVars = { opacity: 1, y: 0, rotateX: 0, duration, delay, ease: 'power2.out' as const };
      if (inViewOnMount) {
        gsap.fromTo(ref.current!, fromVars, toVars);
        return;
      }
      gsap.fromTo(ref.current!, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 88%',
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [delay, duration, once, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

// ─── FADE IN (GSAP-powered) ───
export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: {
  children: ReactNode; delay?: number; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { gsap.set(ref.current, { opacity: 1 }); return; }

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, { opacity: 0 }, {
        opacity: 1, duration, delay, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current!, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, [delay, duration]);

  return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}

// ─── STAGGER CHILDREN (GSAP-powered) ───
export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(ref.current.children, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!.children,
        { opacity: 0, y: 30, rotateX: -2, transformPerspective: 800 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: ref.current!, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className} style={{ opacity: 0 }}>{children}</div>;
}

// ─── TEXT REVEAL (word by word, GSAP-powered) ───
export function TextReveal({ text, className = '', delay = 0 }: {
  text: string; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const words = ref.current.querySelectorAll('.tr-word');
    const ctx = gsap.context(() => {
      gsap.fromTo(words,
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: 0.6, stagger: 0.04, delay, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current!, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, text]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
          <span className="tr-word" style={{ display: 'inline-block', opacity: 0 }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ─── SLIDE IN (GSAP-powered) ───
export function SlideIn({ children, direction = 'left', delay = 0, className = '' }: {
  children: ReactNode; direction?: 'left' | 'right'; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = direction === 'left' ? -60 : 60;

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { gsap.set(ref.current, { opacity: 1, x: 0 }); return; }

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, { opacity: 0, x }, {
        opacity: 1, x: 0, duration: 0.6, delay, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current!, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, [delay, x]);

  return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}

// ─── SCALE IN (GSAP-powered) ───
export function ScaleIn({ children, delay = 0, className = '' }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { gsap.set(ref.current, { opacity: 1, scale: 1 }); return; }

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, { opacity: 0, scale: 0.9 }, {
        opacity: 1, scale: 1, duration: 0.5, delay, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current!, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, [delay]);

  return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}

// ─── PARALLAX WRAPPER (GSAP scroll-driven, continuous) ───
export function Parallax({ children, speed = 0.5, className = '' }: {
  children: ReactNode; speed?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        y: () => speed * 80,
        ease: 'none',
        scrollTrigger: { trigger: ref.current!, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, [speed]);

  return <div ref={ref} className={className}>{children}</div>;
}

// ─── COUNTER ANIMATION ───
export function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1.2, className = '' }: {
  target: number; suffix?: string; prefix?: string; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: 'top 85%',
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              if (ref.current) ref.current.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
            },
          });
        },
      });
    });
    return () => ctx.revert();
  }, [target, suffix, prefix, duration]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}

// ─── HOVER SCALE ───
export function HoverScale({ children, scale = 1.03, className = '' }: {
  children: ReactNode; scale?: number; className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── MAGNETIC BUTTON ───
export function MagneticButton({ children, className = '' }: {
  children: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      }}
      onMouseLeave={() => {
        const el = ref.current;
        if (el) el.style.transform = 'translate(0, 0)';
      }}
      style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </motion.div>
  );
}
