import type { ReactNode } from 'react';

const RUPEE_PATTERN = /(₹250\s+crore)/g;

export function formatRupeeEmphasis(text: string): ReactNode {
  if (!text || !text.includes('₹250')) return text;
  const parts = text.split(RUPEE_PATTERN);
  return parts.map((part, i) =>
    RUPEE_PATTERN.test(part)
      ? <span key={i} className="text-accent-blue font-medium">{part}</span>
      : part
  );
}
