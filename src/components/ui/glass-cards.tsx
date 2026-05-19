/* StackedCards — reference architecture.
   CSS sticky handles pin (browser-native, releases at section boundary).
   GSAP handles scale animation only (scrub on scroll progress).

   KNOWN ISSUES APPLIED UPFRONT:
   1. Last-card bleed: each Card has independent sticky container inside
      a section with overflow:clip — sticky releases at section edge.
   2. getAll().kill() bug: each Card stores its own trigger and only
      kills THAT trigger in cleanup. Never calls getAll().
   3. GSAP+Lenis pin drift: no gsap pin:true used — CSS sticky only.  */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CardData {
  id: string;
  title: string;
  description: string;
  tagline?: string;
  color: string;
  href?: string;
}

interface StackedCardsProps {
  cards: CardData[];
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
}

interface CardProps {
  card: CardData;
  index: number;
  totalCards: number;
}

const Card: React.FC<CardProps> = ({ card, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    const container = containerRef.current;
    if (!cardEl || !container) return;

    const targetScale = 1 - (totalCards - index) * 0.05;

    gsap.set(cardEl, {
      scale: 1,
      transformOrigin: 'center top',
    });

    // CRITICAL: store this trigger instance, only kill THIS one in cleanup.
    // Never call ScrollTrigger.getAll().kill() — nukes triggers from
    // other components (Hero, parallax sections, etc.)
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = gsap.utils.interpolate(1, targetScale, progress);
        gsap.set(cardEl, {
          scale: Math.max(scale, targetScale),
          transformOrigin: 'center top',
        });
      },
    });

    return () => {
      trigger.kill(); // only kill THIS trigger
    };
  }, [index, totalCards]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          width: '70%',
          maxWidth: '900px',
          height: '450px',
          borderRadius: '24px',
          isolation: 'isolate',
          top: `calc(-5vh + ${index * 25}px)`,
          transformOrigin: 'top',
        }}
      >
        {/* Conic-gradient electric border */}
        <div
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '27px',
            padding: '3px',
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              ${card.color} 60deg,
              ${card.color.replace(/[\d.]+\)$/, '0.6)')} 120deg,
              transparent 180deg,
              ${card.color.replace(/[\d.]+\)$/, '0.4)')} 240deg,
              transparent 360deg
            )`,
            zIndex: -1,
          }}
        />

        {/* Main glass card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 48px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 2px 8px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1)
            `,
            overflow: 'hidden',
          }}
        >
          {/* Glass reflection (top half) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              pointerEvents: 'none',
              borderRadius: '24px 24px 0 0',
            }}
          />
          {/* Glass shine line */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
              borderRadius: '1px',
              pointerEvents: 'none',
            }}
          />
          {/* Side reflection */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '2px',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              borderRadius: '24px 0 0 24px',
              pointerEvents: 'none',
            }}
          />
          {/* Frosted dot texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 2px),
                radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 2px),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 1px, transparent 2px)
              `,
              backgroundSize: '30px 30px, 25px 25px, 35px 35px',
              pointerEvents: 'none',
              borderRadius: '24px',
              opacity: 0.7,
            }}
          />

          {/* Card content */}
          <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
            {card.tagline && (
              <p
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  color: card.color,
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                }}
              >
                {card.tagline}
              </p>
            )}
            <h3
              style={{
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 500,
                marginBottom: '16px',
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '20px',
              }}
            >
              {card.description}
            </p>
            {card.href && (
              <a
                href={card.href}
                style={{
                  color: card.color,
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Learn more →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StackedCards: React.FC<StackedCardsProps> = ({
  cards,
  eyebrow,
  heading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    gsap.fromTo(
      container,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out' }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      style={{ background: '#F4F1EA', position: 'relative', overflow: 'clip' }}
    >
      {/* Eyebrow + heading at top of section */}
      {(eyebrow || heading) && (
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '80px 32px 0 32px',
            color: '#0A0E1A',
          }}
        >
          {eyebrow}
          {heading}
        </div>
      )}

      {/* Stacked cards — each Card has its own independent sticky container */}
      <div style={{ width: '100%' }}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={cards.length}
          />
        ))}
      </div>
    </section>
  );
};
