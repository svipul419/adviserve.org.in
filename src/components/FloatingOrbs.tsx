import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface FloatingOrbsProps {
  variant?: 'hero' | 'section' | 'cta';
}

const configs = {
  hero: [
    { color: 'rgba(107,76,230,0.08)', size: 700, x: '70%', y: '-10%' },
    { color: 'rgba(109,212,196,0.05)', size: 500, x: '-5%', y: '60%' },
    { color: 'rgba(107,76,230,0.05)', size: 400, x: '40%', y: '80%' },
  ],
  section: [
    { color: 'rgba(107,76,230,0.06)', size: 500, x: '80%', y: '-15%' },
    { color: 'rgba(109,212,196,0.04)', size: 400, x: '-10%', y: '70%' },
  ],
  cta: [
    { color: 'rgba(107,76,230,0.10)', size: 600, x: '50%', y: '50%' },
    { color: 'rgba(109,212,196,0.06)', size: 500, x: '20%', y: '30%' },
  ],
};

export default function FloatingOrbs({ variant = 'section' }: FloatingOrbsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const orbs = configs[variant];

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ref.current.querySelectorAll('.floating-orb').forEach((orb, i) => {
      gsap.to(orb, {
        x: `+=${30 + i * 15}`,
        y: `+=${20 + i * 10}`,
        scale: 1.05 + i * 0.02,
        repeat: -1,
        yoyo: true,
        duration: 20 + i * 8,
        ease: 'sine.inOut',
      });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="floating-orb absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
