interface Props { className?: string }

export default function PipelineIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pl-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7F1D1D" /><stop offset=".6" stopColor="#3A64B0" /><stop offset="1" stopColor="#0A0E1A" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="#F2F5FA" />
      {['SOURCE', 'NORMALIZE', 'SCORE', 'SHIP'].map((label, i) => (
        <g key={i} transform={`translate(${20 + i * 95} 100)`}>
          <rect width="80" height="60" rx="12" fill="#fff" stroke="#0A0E1A" strokeOpacity=".1" />
          <text x="40" y="28" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#47526B">{`0${i + 1}°`}</text>
          <text x="40" y="44" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="11" fill="#0A0E1A">{label}</text>
          {i < 3 && <path d="M80 30 L95 30" stroke="url(#pl-g)" strokeWidth="2" markerEnd="url(#pl-arr)" />}
        </g>
      ))}
      <defs>
        <marker id="pl-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#3A64B0" />
        </marker>
      </defs>
      <text x="200" y="210" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#47526B">
        Data pipeline · ownership of every row
      </text>
    </svg>
  );
}
