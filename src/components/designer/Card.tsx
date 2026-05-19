import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`bg-white border hairline rounded-2xl p-6 transition-shadow hover: ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
