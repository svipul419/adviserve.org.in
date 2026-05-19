/**
 * Scroll-driven animation hooks powered by GSAP ScrollTrigger.
 * These replace the old binary "in-view" triggers with continuous scroll-linked animations.
 */
import { useRef, useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ─── PARALLAX ───
// Move an element at a different speed than scroll
export function useParallax(speed: number = 0.5): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.to(ref.current, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { dependencies: [speed] });

  return ref;
}

// ─── SCROLL REVEAL 3D ───
// Elements enter with perspective rotation that resolves on scroll
export function useScrollReveal3D(config?: {
  rotateX?: number;
  rotateY?: number;
  translateZ?: number;
  duration?: number;
  start?: string;
}): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const { rotateX = -6, rotateY = 0, translateZ = -60, duration = 1, start = 'top 85%' } = config || {};

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(ref.current,
      { rotateX, rotateY, z: translateZ, opacity: 0, transformPerspective: 1200 },
      {
        rotateX: 0, rotateY: 0, z: 0, opacity: 1,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { dependencies: [] });

  return ref;
}

// ─── SCRUB ANIMATION ───
// Ties a GSAP animation to scroll progress (0 to 1)
export function useScrub(
  callback: (tl: gsap.core.Timeline, trigger: HTMLElement) => void,
  config?: { start?: string; end?: string; pin?: boolean }
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const { start = 'top top', end = 'bottom top', pin = false } = config || {};

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start,
        end,
        scrub: 0.8,
        pin,
        anticipatePin: pin ? 1 : 0,
      },
    });

    callback(tl, ref.current);
  }, { dependencies: [] });

  return ref;
}

// ─── STAGGER ON SCROLL ───
// Stagger children elements into view as the section scrolls in
export function useStaggerScroll(
  selector: string,
  config?: { y?: number; rotateX?: number; duration?: number; stagger?: number }
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const { y = 60, rotateX = -4, duration = 0.8, stagger = 0.1 } = config || {};

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    gsap.fromTo(elements,
      { y, rotateX, opacity: 0, transformPerspective: 1000 },
      {
        y: 0, rotateX: 0, opacity: 1,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { dependencies: [] });

  return ref;
}

// ─── PIN SECTION ───
// Pin a section while scrolling through content
export function usePinSection(config?: {
  endTrigger?: string;
  end?: string;
}): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // Disable pinning on mobile

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: config?.end || '+=100%',
      endTrigger: config?.endTrigger,
      pin: true,
      pinSpacing: false,
    });
  }, { dependencies: [] });

  return ref;
}

// ─── DEPTH HOVER ───
// Add 3D depth effect on hover (translateZ)
export function useDepthHover(depth: number = 20) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    const onEnter = () => {
      el.style.transform = `translateZ(${depth}px) scale(1.02)`;
    };
    const onLeave = () => {
      el.style.transform = 'translateZ(0) scale(1)';
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [depth]);

  return ref;
}
