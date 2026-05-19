interface Props { className?: string }

export default function ComplianceIllustration({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cil-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7F1D1D" /><stop offset=".55" stopColor="#3A64B0" /><stop offset="1" stopColor="#0A0E1A" />
        </linearGradient>
        <pattern id="cil-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#0A0E1A" fillOpacity=".08" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill="#F2F5FA" />
      <rect width="400" height="260" fill="url(#cil-dots)" />
      <rect x="60" y="50" width="180" height="160" rx="12" fill="#fff" stroke="#0A0E1A" strokeOpacity=".1" />
      <rect x="70" y="40" width="180" height="160" rx="12" fill="#fff" stroke="#0A0E1A" strokeOpacity=".1" />
      <rect x="80" y="30" width="180" height="160" rx="12" fill="#fff" stroke="#0A0E1A" strokeOpacity=".12" />
      <g transform="translate(100 55)" fontFamily="JetBrains Mono" fontSize="9" fill="#47526B">
        <text y="0">DPDP § 8(5) / CONSENT</text>
        <rect y="10" width="140" height="6" rx="3" fill="#F2F5FA" />
        <rect y="10" width="100" height="6" rx="3" fill="url(#cil-g)" />
        <text y="34">NOTICE TEMPLATE</text>
        <rect y="44" width="140" height="6" rx="3" fill="#F2F5FA" />
        <rect y="44" width="132" height="6" rx="3" fill="#3A64B0" />
        <text y="68">GRIEVANCE FLOW</text>
        <rect y="78" width="140" height="6" rx="3" fill="#F2F5FA" />
        <rect y="78" width="86" height="6" rx="3" fill="#7F1D1D" />
      </g>
      <g transform="translate(280 70)">
        <path d="M40 0 L80 16 L80 56 Q80 90 40 110 Q0 90 0 56 L0 16 Z" fill="url(#cil-g)" />
        <path d="M22 55 L36 70 L62 40" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g fontFamily="JetBrains Mono" fontSize="9" fill="#47526B">
        <text x="80" y="230">DPDP ACT 2023 · READY</text>
      </g>
    </svg>
  );
}
