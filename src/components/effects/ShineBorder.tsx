/**
 * ShineBorder — animated conic gradient border wrapper.
 * Drop-in: wrap any element to get a spinning multicolor ring.
 *
 *   <ShineBorder><MyCard /></ShineBorder>
 *
 * Props:
 *   borderWidth — ring thickness in px (default 2)
 *   duration    — full spin seconds (default 3)
 *   gradient    — CSS color stops (default: blue → magenta → cyan)
 *   radius      — corner radius px or any CSS length (default '18px')
 *   className   — passthrough on outer wrapper
 *
 * Implementation: conic-gradient on padding-box of inner wrapper using
 * @property --shine-angle so we can animate the gradient angle smoothly
 * (vs spinning a child div which causes layout / clip issues).
 */
import type { CSSProperties, ReactNode } from 'react';

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
  gradient?: string;
  radius?: string;
  innerBg?: string;
}

export default function ShineBorder({
  children,
  className = '',
  borderWidth = 2,
  duration = 3,
  gradient = '#2196F3, #00D4FF, #D946A6, #2196F3',
  radius = '18px',
  innerBg = '#FFFFFF',
}: ShineBorderProps) {
  const wrapStyle: CSSProperties = {
    padding: borderWidth,
    borderRadius: radius,
    background: `conic-gradient(from var(--shine-angle, 0deg), ${gradient})`,
    animation: `shineSpin ${duration}s linear infinite`,
  };
  const innerStyle: CSSProperties = {
    borderRadius: `calc(${radius} - 1px)`,
    background: innerBg,
  };
  return (
    <div className={`shine-border-root relative ${className}`} style={wrapStyle}>
      <div className="relative h-full w-full overflow-hidden" style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
