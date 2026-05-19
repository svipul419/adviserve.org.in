import { Link } from 'react-router-dom';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'white' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface BtnProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
  href?: string;
  className?: string;
  children: ReactNode;
}

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[15px]',
  lg: 'px-7 py-3.5 text-base',
};

function variantClasses(variant: Variant, onDark: boolean): string {
  switch (variant) {
    case 'primary':     return 'bg-[#3A64B0] text-white hover:bg-[#0A0E1A]';
    case 'secondary':   return onDark
      ? 'border border-white/30 text-white hover:bg-white/10'
      : 'border border-white/12 text-white hover:bg-ink-base';
    case 'ghost':       return onDark ? 'text-white hover:bg-white/10' : 'text-white hover:bg-ink-base';
    case 'white':       return 'bg-white text-[#0A0E1A] hover:bg-ink-base';
    case 'destructive': return 'bg-[#D64545] text-white hover:bg-[#B83838]';
  }
}

export default function Btn({
  variant = 'primary',
  size = 'md',
  onDark = false,
  href,
  className = '',
  children,
  ...rest
}: BtnProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors select-none ${SIZES[size]} ${variantClasses(variant, onDark)} ${className}`;

  if (href) {
    // Internal links use react-router Link
    if (href.startsWith('/')) {
      return <Link to={href} className={cls}>{children}</Link>;
    }
    return <a href={href} className={cls}>{children}</a>;
  }

  return <button className={cls} {...rest}>{children}</button>;
}
