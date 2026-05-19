import { useState } from 'react';

export interface IndustryItem {
  name: string;
  image: string;
}

interface ExpandCardsProps {
  industries: IndustryItem[];
}

const ExpandCards = ({ industries }: ExpandCardsProps) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!industries.length) return null;

  const getCardWidth = (index: number) => {
    return index === expandedIndex ? '24rem' : '5rem';
  };

  return (
    <div className="w-full">
      <div className="flex h-full w-full items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-7xl px-5">
          <div className="flex w-full items-center justify-center gap-2">
            {industries.map((industry, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out"
                style={{
                  width: getCardWidth(idx),
                  height: '24rem',
                  flexShrink: 0,
                }}
                onMouseEnter={() => setExpandedIndex(idx)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={industry.image}
                  alt={industry.name}
                />
                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(11, 18, 32, 0.85) 0%, rgba(11, 18, 32, 0.2) 60%, transparent 100%)',
                    opacity: idx === expandedIndex ? 1 : 0.55,
                  }}
                />
                {/* Industry name — visible when expanded */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500"
                  style={{
                    opacity: idx === expandedIndex ? 1 : 0,
                    transform:
                      idx === expandedIndex ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-blue mb-2">
                    Industry
                  </p>
                  <h3 className="text-2xl font-medium text-white leading-tight">
                    {industry.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandCards;
