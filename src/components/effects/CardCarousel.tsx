/**
 * CardCarousel — stagger-card highlight rotator.
 *
 * Drop-in replacement for the previous Swiper coverflow implementation. The
 * Swiper v12 coverflow + loop combo broke right-direction navigation, so the
 * carousel was rebuilt around a stagger-clip pattern instead: 5 cards fan out
 * around a center card with alternating tilt and a clipped octagonal silhouette.
 *
 * Public API (kept compatible with prior callers):
 *   items          — list of slides
 *   autoplayDelay  — auto-advance interval (ms); 0 disables
 *   renderSlide    — render function for each slide's content
 *   slideClassName — extra class for the inner clip frame
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const ACCENT = '#1e9df1';

export interface CardCarouselItem {
  src: string;
  alt: string;
  title?: string;
  body?: string;
  href?: string;
}

export interface CardCarouselProps {
  items: CardCarouselItem[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  className?: string;
  slideClassName?: string;
  renderSlide?: (item: CardCarouselItem, index: number) => React.ReactNode;
}

interface StaggerEntry {
  tempId: number;
  origIndex: number;
  item: CardCarouselItem;
}

interface StaggerCardProps {
  entry: StaggerEntry;
  position: number;
  cardSize: number;
  onJump: (steps: number) => void;
  renderSlide?: (item: CardCarouselItem, index: number) => React.ReactNode;
  slideClassName?: string;
}

function StaggerCard({
  entry,
  position,
  cardSize,
  onJump,
  renderSlide,
  slideClassName,
}: StaggerCardProps) {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => onJump(position)}
      role={isCenter ? undefined : 'button'}
      tabIndex={isCenter ? -1 : 0}
      onKeyDown={(e) => {
        if (!isCenter && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onJump(position);
        }
      }}
      className={cn(
        'absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out',
        isCenter ? 'z-10 cursor-default' : 'z-0 cursor-pointer',
        slideClassName,
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(36px 0%, calc(100% - 36px) 0%, 100% 36px, 100% 100%, calc(100% - 36px) 100%, 36px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.55) * position}px)
          translateY(${isCenter ? -28 : position % 2 ? 18 : -18}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
          scale(${isCenter ? 1 : 0.92})
        `,
        opacity: Math.abs(position) > 2 ? 0 : isCenter ? 1 : 0.78,
        pointerEvents: Math.abs(position) > 2 ? 'none' : 'auto',
        filter: isCenter ? 'none' : 'grayscale(0.25)',
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          border: `2px solid ${isCenter ? ACCENT : `${ACCENT}33`}`,
          background: '#FBFDFF',
          boxShadow: isCenter
            ? `0 26px 60px -28px rgba(11,20,38,0.45), 0 0 0 1px ${ACCENT}33`
            : '0 12px 28px -16px rgba(11,20,38,0.18)',
        }}
      >
        {renderSlide?.(entry.item, entry.origIndex)}
      </div>
    </div>
  );
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  items,
  autoplayDelay = 3000,
  showPagination = true,
  showNavigation = true,
  className = '',
  slideClassName = '',
  renderSlide,
}) => {
  const initial: StaggerEntry[] = items.map((item, i) => ({
    tempId: i,
    origIndex: i,
    item,
  }));
  const [list, setList] = useState<StaggerEntry[]>(initial);
  const [cardSize, setCardSize] = useState(440);
  const [isPaused, setIsPaused] = useState(false);
  const tempIdCounter = useRef(items.length);

  // Re-seed when items prop changes length.
  useEffect(() => {
    setList(
      items.map((item, i) => ({
        tempId: i,
        origIndex: i,
        item,
      })),
    );
    tempIdCounter.current = items.length;
  }, [items]);

  const handleMove = useCallback((steps: number) => {
    setList((prev) => {
      const next = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const first = next.shift();
          if (!first) return prev;
          next.push({ ...first, tempId: tempIdCounter.current++ });
        }
      } else if (steps < 0) {
        for (let i = steps; i < 0; i++) {
          const last = next.pop();
          if (!last) return prev;
          next.unshift({ ...last, tempId: tempIdCounter.current++ });
        }
      }
      return next;
    });
  }, []);

  // Responsive card size.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCardSize(440);
      else if (w >= 1024) setCardSize(400);
      else if (w >= 640) setCardSize(340);
      else setCardSize(280);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Autoplay.
  useEffect(() => {
    if (!autoplayDelay || isPaused) return;
    const id = window.setInterval(() => handleMove(1), autoplayDelay);
    return () => window.clearInterval(id);
  }, [autoplayDelay, isPaused, handleMove]);

  const centerIndex = list.length % 2
    ? (list.length - 1) / 2
    : list.length / 2 - 1;
  const centerOrigIndex = list[centerIndex]?.origIndex ?? 0;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: cardSize + 200 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {list.map((entry, index) => {
        const position = list.length % 2
          ? index - (list.length + 1) / 2
          : index - list.length / 2;
        return (
          <StaggerCard
            key={entry.tempId}
            entry={entry}
            position={position}
            cardSize={cardSize}
            onJump={handleMove}
            renderSlide={renderSlide}
            slideClassName={slideClassName}
          />
        );
      })}

      {/* Navigation */}
      {showNavigation && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button
            type="button"
            onClick={() => handleMove(-1)}
            aria-label="Previous"
            className="flex items-center justify-center w-12 h-12 transition-all duration-200 hover:scale-105"
            style={{
              background: '#FBFDFF',
              border: `1px solid ${ACCENT}88`,
              color: ACCENT,
              boxShadow: '0 6px 18px -10px rgba(11,20,38,0.30)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.color = '#FBFDFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FBFDFF';
              e.currentTarget.style.color = ACCENT;
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {showPagination && (
            <div className="flex items-center gap-1.5 px-3">
              {items.map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="block h-1 transition-all duration-300"
                  style={{
                    width: i === centerOrigIndex ? 22 : 6,
                    background: i === centerOrigIndex ? ACCENT : `${ACCENT}55`,
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleMove(1)}
            aria-label="Next"
            className="flex items-center justify-center w-12 h-12 transition-all duration-200 hover:scale-105"
            style={{
              background: '#FBFDFF',
              border: `1px solid ${ACCENT}88`,
              color: ACCENT,
              boxShadow: '0 6px 18px -10px rgba(11,20,38,0.30)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.color = '#FBFDFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FBFDFF';
              e.currentTarget.style.color = ACCENT;
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CardCarousel;
