import { useEffect } from 'react';

/**
 * Tracks mouse position on elements with the `.oc-card` or `.oc-btn` class
 * and sets CSS custom properties `--mouse-x` and `--mouse-y` for radial gradient effects.
 */
export function useMouseTracking(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.querySelectorAll('.oc-card, .oc-btn');
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [containerRef]);
}
