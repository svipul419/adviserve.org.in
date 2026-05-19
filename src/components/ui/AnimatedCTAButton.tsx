/**
 * AnimatedCTAButton — FlowButton implementation
 *
 * Replaces the previous static button with a flow-effect button:
 * - Left arrow slides in, right arrow exits on hover
 * - Text shifts left on hover
 * - Circle expands from center (fills button) on hover
 * - Border-radius morphs pill → soft-square on hover
 *
 * Three color variants:
 *   primary  — bg-accent-blue  (most CTAs)
 *   secondary — outlined      (secondary CTAs)
 *   on-dark  — bg-ink-base (CTAs on dark backgrounds)
 *
 * Props are backwards-compatible with the original AnimatedCTAButton.
 * Accepts `label` (original) or `text` (alias) for the button copy.
 */

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'on-dark';
type Size = 'sm' | 'md' | 'lg';

interface AnimatedCTAButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  label?: ReactNode;
  text?: ReactNode;       // alias for label
  href?: string;
  variant?: Variant;
  size?: Size;
  target?: string;
  rel?: string;
  className?: string;
  showArrow?: boolean;
  disabled?: boolean;
}

/* ── Variant tokens ─────────────────────────────────────────────────────── */

interface VariantTokens {
  wrapper: string;
  circleBg: string;
  circleStyle?: React.CSSProperties;
  hoverText: string;
  arrowDefault: string;
  arrowHover: string;
}

// White + blue theme palette — buttons resolve to brand blue on white surfaces
// and a contrasting cyan ripple on hover. `on-dark` keeps a white wrapper but
// the expanding circle stays inside the blue family.
const BLUE_RIPPLE = 'linear-gradient(110deg, #1e9df1 0%, #00D4FF 50%, #1e9df1 100%)';

const VARIANT_TOKENS: Record<Variant, VariantTokens> = {
  primary: {
    wrapper:      'bg-[#1e9df1] text-white border-[#1e9df1]',
    circleBg:     '',
    circleStyle:  { background: BLUE_RIPPLE, backgroundSize: '200% 200%' },
    hoverText:    'text-white',
    arrowDefault: 'text-white',
    arrowHover:   'text-white',
  },
  secondary: {
    wrapper:      'bg-transparent text-[#1e9df1] border-[#1e9df1]',
    circleBg:     '',
    circleStyle:  { background: BLUE_RIPPLE, backgroundSize: '200% 200%' },
    hoverText:    'text-white',
    arrowDefault: 'text-[#1e9df1]',
    arrowHover:   'text-white',
  },
  'on-dark': {
    wrapper:      'bg-white text-[#1e9df1] border-white',
    circleBg:     'bg-[#1a82d4]',
    hoverText:    'text-white',
    arrowDefault: 'text-[#1e9df1]',
    arrowHover:   'text-white',
  },
};

const SIZE_PADDING: Record<Size, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-[15px]',
  lg: 'px-9 py-4 text-base',
};

/* ── Core visual component ──────────────────────────────────────────────── */

interface FlowInnerProps {
  label: ReactNode;
  variant: Variant;
  size: Size;
  showArrow: boolean;
  disabled?: boolean;
  className?: string;
}

function FlowInner({ label, variant, size, showArrow, disabled, className = '' }: FlowInnerProps) {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const tokens = VARIANT_TOKENS[variant];

  // Magnetic cursor-follow on hover. Respects prefers-reduced-motion.
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || disabled) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.26}px)`;
  }
  function handleLeave() {
    const el = btnRef.current;
    if (el) el.style.transform = 'translate(0, 0)';
    setHovered(false);
  }

  const wrapperCls = [
    'relative inline-flex items-center justify-center overflow-hidden border select-none',
    'min-h-[44px] font-medium cursor-pointer will-change-transform',
    'transition-[border-radius,background-color,color,box-shadow,transform] duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
    SIZE_PADDING[size],
    tokens.wrapper,
    hovered ? 'rounded-[12px] border-transparent' : 'rounded-[100px]',
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={btnRef}
      className={wrapperCls}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Expanding multicolor gradient circle */}
      <span
        aria-hidden
        className={[
          'absolute inset-0 m-auto rounded-full pointer-events-none',
          'transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
          tokens.circleBg,
        ].join(' ')}
        style={{
          width:  hovered ? '300px' : '16px',
          height: hovered ? '300px' : '16px',
          opacity: hovered ? 1 : 0,
          backgroundPosition: hovered ? '100% 50%' : '0% 50%',
          transition: 'width 800ms cubic-bezier(0.23,1,0.32,1), height 800ms cubic-bezier(0.23,1,0.32,1), opacity 400ms, background-position 1200ms ease-in-out',
          ...(tokens.circleStyle ?? {}),
        }}
      />

      {/* Left arrow — slides in from left on hover */}
      {showArrow && (
        <span
          aria-hidden
          className={[
            'absolute flex items-center justify-center',
            'transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
            hovered ? tokens.arrowHover : tokens.arrowDefault,
          ].join(' ')}
          style={{
            left:    hovered ? '12px' : '-25%',
            opacity: hovered ? 1 : 0,
          }}
        >
          <ArrowRight size={16} />
        </span>
      )}

      {/* Label text */}
      <span
        className={[
          'relative z-10 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
          hovered ? `${tokens.hoverText} translate-x-3` : '-translate-x-0',
        ].join(' ')}
      >
        {label}
      </span>

      {/* Right arrow — exits to right on hover */}
      {showArrow && (
        <span
          aria-hidden
          className={[
            'absolute flex items-center justify-center',
            'transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
            hovered ? tokens.arrowHover : tokens.arrowDefault,
          ].join(' ')}
          style={{
            right:   hovered ? '-25%' : '12px',
            opacity: hovered ? 0 : 1,
          }}
        >
          <ArrowRight size={16} />
        </span>
      )}
    </div>
  );
}

/* ── Public export ──────────────────────────────────────────────────────── */

export default function AnimatedCTAButton({
  label,
  text,
  href,
  variant = 'primary',
  size = 'md',
  target,
  rel,
  className = '',
  showArrow = true,
  disabled,
  ...rest
}: AnimatedCTAButtonProps) {
  // Accept both `label` and `text` prop names for compatibility
  const copy = label ?? text ?? '';

  const inner = (
    <FlowInner
      label={copy}
      variant={variant}
      size={size}
      showArrow={showArrow}
      disabled={disabled}
      className={className}
    />
  );

  if (href) {
    if (href.startsWith('/')) {
      return <Link to={href}>{inner}</Link>;
    }
    const isWeb = href.startsWith('http');
    return (
      <a
        href={href}
        target={target ?? (isWeb ? '_blank' : undefined)}
        rel={rel ?? (isWeb ? 'noopener noreferrer' : undefined)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button disabled={disabled} {...rest}>
      {inner}
    </button>
  );
}
