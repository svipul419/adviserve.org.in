/* ShiftIllustration — six nodes unified around a central hexagon (operator pod).
   All six connected with solid spokes. Sequential pulse dot travels from center
   outward to each node. Matches existing illustration style exactly. */

interface Props { className?: string }

export default function ShiftIllustration({ className = '' }: Props) {
  const cx = 190;
  const cy = 125;

  // Six satellite nodes distributed evenly around center
  const nodeRadius = 85;
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
    return {
      x: cx + Math.round(Math.cos(angle) * nodeRadius),
      y: cy + Math.round(Math.sin(angle) * nodeRadius),
    };
  });

  // Hexagon center polygon points
  const hexR = 26;
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
    return `${cx + Math.cos(angle) * hexR},${cy + Math.sin(angle) * hexR}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true">
      <defs>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .shift-center { animation: shift-breathe 4s ease-in-out infinite; }
            .shift-pulse-0 { animation: shift-spoke 5s ease-in-out infinite 0s; }
            .shift-pulse-1 { animation: shift-spoke 5s ease-in-out infinite 0.83s; }
            .shift-pulse-2 { animation: shift-spoke 5s ease-in-out infinite 1.66s; }
            .shift-pulse-3 { animation: shift-spoke 5s ease-in-out infinite 2.49s; }
            .shift-pulse-4 { animation: shift-spoke 5s ease-in-out infinite 3.32s; }
            .shift-pulse-5 { animation: shift-spoke 5s ease-in-out infinite 4.15s; }

            @keyframes shift-breathe {
              0%,100% { transform: scale(1); }
              50%      { transform: scale(1.03); }
            }
            @keyframes shift-spoke {
              0%,100% { opacity: 0; offset-distance: 0%; }
              5%       { opacity: 1; }
              45%      { opacity: 1; offset-distance: 100%; }
              50%,99%  { opacity: 0; offset-distance: 100%; }
            }
          }
        `}</style>
      </defs>

      {/* Background */}
      <rect width="400" height="260" fill="#F2F5FA" />

      {/* Spokes from center to each node */}
      {nodes.map((n, i) => (
        <line
          key={i}
          x1={cx} y1={cy} x2={n.x} y2={n.y}
          stroke="#0A0E1A"
          strokeOpacity=".2"
          strokeWidth="1"
        />
      ))}

      {/* Pulse dots traveling along each spoke */}
      {nodes.map((n, i) => {
        // Dot animates from center toward node using motion path approximation via transform
        const dx = n.x - cx;
        const dy = n.y - cy;
        return (
          <circle
            key={i}
            className={`shift-pulse-${i}`}
            cx={cx} cy={cy} r="4"
            fill="#7F1D1D"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              // Static fallback position: center
              animationName: undefined,
            } as React.CSSProperties}
          >
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              begin={`${i * 0.833}s`}
              calcMode="linear"
              path={`M0,0 L${dx},${dy}`}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0;0"
              keyTimes="0;0.05;0.45;0.5;1"
              dur="5s"
              begin={`${i * 0.833}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}

      {/* Six satellite nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="11" fill="#fff" stroke="#0A0E1A" strokeOpacity=".12" strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r="4"  fill="#7F1D1D" fillOpacity=".6" />
        </g>
      ))}

      {/* Central hexagon — operator pod */}
      <g className="shift-center" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <polygon points={hexPoints} fill="#7F1D1D" fillOpacity=".15" stroke="#7F1D1D" strokeWidth="1.5" strokeOpacity=".6" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#7F1D1D">POD</text>
      </g>

      {/* Caption */}
      <text x="200" y="248" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#47526B">
        ONE TEAM · SIX DISCIPLINES · ZERO GAPS
      </text>
    </svg>
  );
}
