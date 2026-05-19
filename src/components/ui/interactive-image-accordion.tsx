import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface AccordionItemData {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
  imageUrl: string;
}

interface AccordionItemProps {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => {
  return (
    <div
      className={`
 relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden cursor-pointer
 transition-all duration-700 ease-in-out shrink-0
 ${isActive ? 'w-[250px] sm:w-[400px]' : 'w-[50px] sm:w-[70px]'}
 `}
      onMouseEnter={onMouseEnter}
      onClick={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        style={{ filter: isActive ? 'grayscale(30%)' : 'grayscale(100%)', opacity: isActive ? 1 : 0.8 }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'https://placehold.co/400x450/111111/ffffff?text=Adviserve';
        }}
      />
      {/* Dark overlay — uses inline style to prevent CSS theme overrides from interfering */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ backgroundColor: isActive ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.65)' }}
      />
      {/* Bottom gradient for text readability */}
      <div
        className={`absolute inset-x-0 bottom-0 h-3/4 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)' }}
      />

      {/* Active state: title + description + View Details link */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 z-10 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <span className="text-white font-mono uppercase tracking-[0.1em] font-semibold text-sm sm:text-base block mb-2">
          {item.title}
        </span>
        {item.description && (
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3">
            {item.description}
          </p>
        )}
        {item.href && (
          <Link to={item.href} className="inline-flex items-center gap-1 text-accent-blue text-xs font-mono uppercase tracking-wider hover:text-accent-blue transition-colors">
            View Details <ArrowRight size={12} />
          </Link>
        )}
      </div>

      {/* Inactive state: rotated vertical title */}
      {!isActive && (
        <span
          className="absolute z-10 text-white font-mono uppercase tracking-[0.12em] font-semibold opacity-80 transition-all duration-500"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(180deg)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            lineHeight: 1.4,
            maxHeight: '80%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
          }}
        >
          {item.title}
        </span>
      )}
    </div>
  );
};

export function InteractiveImageAccordion({ 
  items = [], 
  className = "" 
}: { 
  items: AccordionItemData[],
  className?: string 
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div data-always-white className={`w-full flex-row items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto p-1 sm:p-4 [scrollbar-width:none] [-ms-overflow-style:none] flex ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
