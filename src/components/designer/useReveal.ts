import { useEffect } from 'react';

/** Adds '.in' to all '.reveal' elements when they enter the viewport. */
export default function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'));
      return;
    }

    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
