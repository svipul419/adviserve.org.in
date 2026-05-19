/* ResultIllustration — Option B: flowing path visiting 5 milestones,
   continuing off-canvas suggesting growth continues. A teal accent travels
   along the path. Matches existing illustration style exactly. */

interface Props { className?: string }

export default function ResultIllustration({ className = '' }: Props) {
  // 5 milestone dots along a gently ascending path
  const milestones = [
    { x: 40,  y: 200 },
    { x: 120, y: 175 },
    { x: 200, y: 148 },
    { x: 280, y: 118 },
    { x: 360, y: 85  },
  ];

  // Smooth cubic bezier path through all milestones, exits off-canvas right
  const pathD = [
    `M ${milestones[0].x} ${milestones[0].y}`,
    `C 80 200, 100 175, ${milestones[1].x} ${milestones[1].y}`,
    `C 160 175, 180 148, ${milestones[2].x} ${milestones[2].y}`,
    `C 240 148, 260 118, ${milestones[3].x} ${milestones[3].y}`,
    `C 320 118, 340 85, ${milestones[4].x} ${milestones[4].y}`,
    `C 390 60, 420 45, 450 30`,
  ].join(' ');

  // Subtle grid lines in background suggesting a chart / architecture
  const gridYs = [80, 110, 140, 170, 200];

  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="res-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7F1D1D" />
          <stop offset=".6" stopColor="#3A64B0" />
          <stop offset="1" stopColor="#0A0E1A" />
        </linearGradient>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .res-accent { animation: res-travel 6s ease-in-out infinite; }
            .res-glow   { animation: res-glow-pulse 6s ease-in-out infinite; }

            @keyframes res-travel {
              0%   { offset-distance: 0%; opacity: 0; }
              5%   { opacity: 1; }
              85%  { opacity: 1; offset-distance: 100%; }
              100% { offset-distance: 100%; opacity: 0; }
            }
            @keyframes res-glow-pulse {
              0%,100% { opacity: 0; }
              5%,80%  { opacity: 0.5; }
              40%     { opacity: 1; }
            }
          }
        `}</style>
      </defs>

      {/* Background */}
      <rect width="400" height="260" fill="#F2F5FA" />

      {/* Subtle horizontal grid lines */}
      {gridYs.map((y) => (
        <line
          key={y}
          x1="20" y1={y} x2="420" y2={y}
          stroke="#0A0E1A" strokeOpacity=".05" strokeWidth="1"
        />
      ))}

      {/* Main path — gradient stroke */}
      <path d={pathD} fill="none" stroke="url(#res-g)" strokeWidth="2" strokeLinecap="round" />

      {/* Light shadow path beneath for depth */}
      <path d={pathD} fill="none" stroke="#0A0E1A" strokeWidth="3" strokeOpacity=".06" strokeLinecap="round" />

      {/* Milestone dots */}
      {milestones.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="7" fill="#fff" stroke="#0A0E1A" strokeOpacity=".12" strokeWidth="1" />
          <circle cx={m.x} cy={m.y} r="3" fill="#7F1D1D" fillOpacity=".8" />
        </g>
      ))}

      {/* Milestone labels */}
      {['HIRE', 'OPS', 'COMPLY', 'BUILD', 'SCALE'].map((label, i) => (
        <text
          key={label}
          x={milestones[i].x}
          y={milestones[i].y + 18}
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          fontSize="7"
          fill="#47526B"
        >
          {label}
        </text>
      ))}

      {/* Traveling teal accent dot — uses SMIL animateMotion */}
      <circle className="res-accent" r="5" fill="#7F1D1D" opacity="0">
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          keyTimes="0;0.5;1"
          path={pathD}
        />
        <animate
          attributeName="opacity"
          values="0;0;1;1;0"
          keyTimes="0;0.05;0.1;0.85;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>

      {/* "Continues" arrow indicator off-canvas right */}
      <path d="M 370 85 L 385 78" stroke="#7F1D1D" strokeWidth="1.5" strokeOpacity=".5" strokeLinecap="round" />
      <path d="M 378 72 L 385 78 L 379 85" fill="none" stroke="#7F1D1D" strokeWidth="1.5" strokeOpacity=".5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Caption */}
      <text x="200" y="248" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#47526B">
        HIRE · COMPLY · BUILD · SCALE · CONTINUE
      </text>
    </svg>
  );
}
