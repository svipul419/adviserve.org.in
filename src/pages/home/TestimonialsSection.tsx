import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Testimonial } from '../../lib/defaults';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  // Keep ref in sync with state so interval reads latest index without resetting timer
  useEffect(() => {
    activeRef.current = activeTestimonial;
  }, [activeTestimonial]);

  // Entrance animation
  useGSAP(() => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(containerRef.current,
      { y: 60, opacity: 0, rotateX: -4, transformPerspective: 1000 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%', toggleActions: 'play none none none' },
      }
    );
  }, { scope: sectionRef });

  // Animate quote text change
  const changeTestimonial = useCallback((newIndex: number) => {
    if (!quoteRef.current || newIndex === activeRef.current) return;

    gsap.to(quoteRef.current, {
      opacity: 0, y: -15, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setActiveTestimonial(newIndex);
        gsap.fromTo(quoteRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      },
    });
  }, []);

  const [paused, setPaused] = useState(false);

  // Auto-advance every 6 seconds — interval re-registers only when paused/length changes
  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      const next = activeRef.current === testimonials.length - 1 ? 0 : activeRef.current + 1;
      changeTestimonial(next);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, testimonials.length, changeTestimonial]);

  if (testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 px-6 sm:px-12 bg-gray-50"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-blue mb-5 flex items-center gap-3">
          <span className="w-7 h-[1px] bg-accent-blue" /> // 00.05&deg; &mdash; Testimonials
        </p>
        <div ref={containerRef} className="max-w-4xl mt-10" style={{ transformStyle: 'preserve-3d' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="text-accent-blue text-[13px] tracking-[4px] mb-7">{'*'.repeat(5)}</div>
          <div ref={quoteRef}>
            <p className="text-[clamp(18px,2.2vw,26px)] font-heading font-light italic leading-[1.45] text-black mb-8">
              <span className="text-accent-blue text-[40px] leading-[0] align-[-0.3em] mr-1 not-italic">&ldquo;</span>
              {testimonials[activeTestimonial]?.quote}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-7 h-[1px] bg-accent-blue" />
              <div>
                <p className="text-[14px] font-normal text-black">{testimonials[activeTestimonial]?.name}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600 mt-1">
                  {testimonials[activeTestimonial]?.role} &mdash; {testimonials[activeTestimonial]?.company}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <button onClick={() => changeTestimonial(activeTestimonial === 0 ? testimonials.length - 1 : activeTestimonial - 1)} className="w-11 h-11 border border-[#1a1a2e]/15 rounded-full flex items-center justify-center text-gray-600 hover:border-accent-blueHover hover:text-accent-blueHover transition-all" aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => changeTestimonial(activeTestimonial === testimonials.length - 1 ? 0 : activeTestimonial + 1)} className="w-11 h-11 border border-[#1a1a2e]/15 rounded-full flex items-center justify-center text-gray-600 hover:border-accent-blueHover hover:text-accent-blueHover transition-all" aria-label="Next">
              <ChevronRight size={16} />
            </button>
            <div className="flex gap-2 ml-4">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => changeTestimonial(i)} className={`h-[2px] min-w-[44px] min-h-[44px] py-3 bg-clip-content transition-all duration-300 ${i === activeTestimonial ? 'w-8 bg-accent-blue' : 'w-3 bg-[#1a1a2e]/20'}`} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
