interface SectionNumProps {
  n: string;
  gradient?: boolean;
}

export default function SectionNum({ n, gradient = false }: SectionNumProps) {
  return (
    <span
      data-sec-num={n}
      className={`font-mono text-[12px] tracking-[0.14em] ${gradient ? 'text-gradient' : 'text-white/75'}`}
    >
      {n}°
    </span>
  );
}
