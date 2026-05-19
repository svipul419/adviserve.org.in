export default function GlowDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`glow-divider w-full ${className}`}
      role="separator"
      aria-hidden="true"
    />
  );
}
