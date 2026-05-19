/**
 * CircularTestimonials — 3D-stack carousel.
 *
 * Adapted from a Next.js component into a Vite/React file:
 *   • dropped the `'use client'` directive (no-op outside Next)
 *   • replaced styled-jsx with a plain <style> block scoped via `ct-` classes
 *     to avoid leaking selectors into the rest of the app
 *
 * Each item shows a photo card with two side-stack siblings at -15deg/+15deg,
 * autoplay every 5s, ArrowLeft/ArrowRight keyboard navigation, and arrow
 * buttons that pause autoplay when clicked.
 *
 * Used on Home > Top Stories — items are shaped {quote: title, name: tag,
 * designation: cta, src: image}.
 */
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  CSSProperties,
} from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  /** Optional click-through. When set, the active card image becomes a link. */
  href?: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export default function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) {
  const colorName = colors.name ?? '#0B1426';
  const colorDesignation = colors.designation ?? 'rgba(11,20,38,0.55)';
  const colorTestimony = colors.testimony ?? 'rgba(11,20,38,0.78)';
  const colorArrowBg = colors.arrowBackground ?? '#0B1426';
  const colorArrowFg = colors.arrowForeground ?? '#ffffff';
  const colorArrowHoverBg = colors.arrowHoverBackground ?? '#1e9df1';
  const fontSizeName = fontSizes.name ?? '1.5rem';
  const fontSizeDesignation = fontSizes.designation ?? '0.925rem';
  const fontSizeQuote = fontSizes.quote ?? '1.125rem';

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    }, 5000);
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  function getImageStyle(index: number): CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
        transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="ct-container">
      <div className="ct-grid">
        <div className="ct-image-container" ref={imageContainerRef}>
          {testimonials.map((t, index) => {
            const imgEl = (
              <img
                key={t.src}
                src={t.src}
                alt={t.name}
                className="ct-image"
                data-index={index}
                style={getImageStyle(index)}
              />
            );
            // Wrap active card in anchor if href provided.
            if (t.href && index === activeIndex) {
              return (
                <a
                  key={t.src}
                  href={t.href}
                  className="ct-image-link"
                  style={getImageStyle(index)}
                  aria-label={t.quote}
                >
                  <img src={t.src} alt={t.name} className="ct-image ct-image-static" />
                </a>
              );
            }
            return imgEl;
          })}
        </div>

        <div className="ct-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className="ct-name" style={{ color: colorName, fontSize: fontSizeName }}>
                {activeTestimonial.name}
              </h3>
              <p className="ct-designation" style={{ color: colorDesignation, fontSize: fontSizeDesignation }}>
                {activeTestimonial.designation}
              </p>
              <motion.p className="ct-quote" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                {activeTestimonial.quote.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut', delay: 0.025 * i }}
                    style={{ display: 'inline-block' }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="ct-arrow-buttons">
            <button
              className="ct-arrow-button"
              onClick={handlePrev}
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={22} color={colorArrowFg} />
            </button>
            <button
              className="ct-arrow-button"
              onClick={handleNext}
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <FaArrowRight size={22} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .ct-container { width: 100%; max-width: 64rem; padding: 1.5rem; margin: 0 auto; }
        .ct-grid { display: grid; gap: 3rem; }
        .ct-image-container {
          position: relative; width: 100%; height: 22rem; perspective: 1000px;
        }
        .ct-image, .ct-image-link {
          position: absolute; inset: 0; width: 100%; height: 100%;
          border-radius: 1.25rem; overflow: hidden;
          box-shadow: 0 18px 40px -20px rgba(11,20,38,0.35);
        }
        .ct-image-link { cursor: pointer; }
        .ct-image-static, .ct-image-link img { width: 100%; height: 100%; object-fit: cover; }
        .ct-image[src] { object-fit: cover; }
        .ct-content { display: flex; flex-direction: column; justify-content: space-between; }
        .ct-name { font-weight: 700; margin-bottom: 0.25rem; }
        .ct-designation { margin-bottom: 1.5rem; }
        .ct-quote { line-height: 1.6; }
        .ct-arrow-buttons { display: flex; gap: 1rem; padding-top: 2rem; }
        .ct-arrow-button {
          width: 2.7rem; height: 2.7rem; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background-color 0.25s; border: none;
        }
        @media (min-width: 768px) {
          .ct-grid { grid-template-columns: 1.05fr 1fr; gap: 4rem; }
          .ct-arrow-buttons { padding-top: 0; }
        }
      `}</style>
    </div>
  );
}
