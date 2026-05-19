/**
 * TiltCard — pointer-driven 3D tilt + optional spotlight.
 * `effect="gravitate"` follows the cursor; `effect="evade"` tilts away.
 * Accepts legacy `max` prop as an alias for `tiltLimit` for backward compatibility.
 */
import { useRef, useState, useCallback } from 'react';
import type { CSSProperties, ReactNode, PointerEvent } from 'react';

export interface TiltCardProps {
  tiltLimit?: number;
  /** @deprecated use tiltLimit */
  max?: number;
  scale?: number;
  perspective?: number;
  effect?: 'gravitate' | 'evade';
  spotlight?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function TiltCard({
  tiltLimit,
  max,
  scale = 1.015,
  perspective = 1000,
  effect = 'evade',
  spotlight = true,
  className = '',
  style,
  children,
}: TiltCardProps) {
  const limit = tiltLimit ?? max ?? 6;
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
  );
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const dir = effect === 'evade' ? -1 : 1;

  const disabled = typeof window !== 'undefined' && (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const xRot = (py - 0.5) * (limit * 2) * dir;
      const yRot = (px - 0.5) * -(limit * 2) * dir;
      setTransform(
        `perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale}, ${scale}, ${scale})`,
      );
      if (spotlight) setSpotlightPos({ x: px * 100, y: py * 100 });
    },
    [limit, scale, perspective, dir, spotlight, disabled],
  );

  const handlePointerEnter = useCallback(() => {
    if (disabled) return;
    setIsHovered(true);
  }, [disabled]);

  const handlePointerLeave = useCallback(() => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setIsHovered(false);
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`tilt-card relative will-change-transform overflow-hidden ${className}`}
      style={{
        transform,
        transition: 'transform 0.2s ease-out',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}
        >
          <div
            className="absolute w-[200%] h-[200%] rounded-full"
            style={{
              left: `${spotlightPos.x}%`,
              top: `${spotlightPos.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 40%)',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TiltCard;
