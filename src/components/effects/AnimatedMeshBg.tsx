/**
 * AnimatedMeshBg — full-bleed CSS-only animated gradient mesh.
 * Three radial blobs drift via CSS keyframes (already in tailwind).
 * Pure decoration, pointer-events-none. Auto-disables on reduced-motion.
 */
export default function AnimatedMeshBg({ className = '' }: { className?: string }) {
  // Hidden on small/touch + reduced-motion to save paint.
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none hidden lg:block motion-reduce:hidden ${className}`}>
      <div
        className="absolute -top-1/3 -left-1/3 w-[60vw] h-[60vw] rounded-full opacity-28 animate-orb-drift-slow"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(33,150,243,0.40), transparent 65%)', filter: 'blur(50px)', willChange: 'transform' }}
      />
      <div
        className="absolute top-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full opacity-22 animate-orb-drift"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(217,70,166,0.34), transparent 65%)', filter: 'blur(55px)', willChange: 'transform' }}
      />
    </div>
  );
}
