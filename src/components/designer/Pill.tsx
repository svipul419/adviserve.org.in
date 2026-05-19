import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Pill({ children, className = '', dot }: PillProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 bg-ink-base text-white/75 rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
      {children}
    </span>
  );
}
