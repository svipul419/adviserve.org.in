interface Props { className?: string }

export default function MatchingIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true">
      <rect width="400" height="260" fill="#F2F5FA" />
      <g>
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(30 ${30 + i * 34})`}>
            <rect width="130" height="24" rx="12" fill="#fff" stroke="#0A0E1A" strokeOpacity=".1" />
            <circle cx="14" cy="12" r="6" fill={i === 2 ? '#3A64B0' : '#7F1D1D'} fillOpacity={i === 2 ? 1 : 0.3} />
            <rect x="26" y="8" width="80" height="4" rx="2" fill="#47526B" fillOpacity=".4" />
            <rect x="26" y="14" width="60" height="3" rx="1.5" fill="#47526B" fillOpacity=".2" />
          </g>
        ))}
      </g>
      <g transform="translate(240 30)">
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(0 ${i * 34})`}>
            <rect width="130" height="24" rx="12" fill="#fff" stroke="#0A0E1A" strokeOpacity=".1" />
            <circle cx="116" cy="12" r="6" fill={i === 2 ? '#0A0E1A' : '#7F1D1D'} fillOpacity={i === 2 ? 1 : 0.3} />
            <rect x="24" y="8" width="80" height="4" rx="2" fill="#47526B" fillOpacity=".4" />
            <rect x="40" y="14" width="60" height="3" rx="1.5" fill="#47526B" fillOpacity=".2" />
          </g>
        ))}
      </g>
      {Array.from({ length: 6 }).map((_, i) => {
        const y1 = 42 + i * 34;
        const y2 = 42 + ((i + 3) % 6) * 34;
        const emph = i === 2;
        return (
          <path
            key={i}
            d={`M160 ${y1} C200 ${y1} 200 ${y2} 240 ${y2}`}
            stroke={emph ? '#3A64B0' : 'rgba(11,18,32,.15)'}
            strokeWidth={emph ? 2 : 1}
            fill="none"
          />
        );
      })}
      <text x="200" y="250" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#47526B">
        ROLE · SKILLS · CULTURE · CADENCE
      </text>
    </svg>
  );
}
