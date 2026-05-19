/**
 * ScrollEngine — Lenis smooth scroll + GSAP ScrollTrigger integration
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollEngineContext = createContext<Lenis | null>(null);

export function ScrollEngineProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const instance = new Lenis({
      duration: prefersReduced ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    setLenis(instance);

    // Sync Lenis with GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // Named callback so we can remove it properly on cleanup
    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({
      fastScrollEnd: true,
      preventOverlaps: true,
    });

    return () => {
      instance.destroy();
      setLenis(null);
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return (
    <ScrollEngineContext.Provider value={lenis}>
      {children}
    </ScrollEngineContext.Provider>
  );
}

export function useScrollEngine() {
  return useContext(ScrollEngineContext);
}
