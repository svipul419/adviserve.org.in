import useMeasure from 'react-use-measure';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LogoItem {
  url: string;
  alt: string;
  link?: string;
}

interface LogoCloudProps {
  heading: string;
  logos: LogoItem[];
  fieldVis?: (key: string) => boolean;
}

// ─── Single logo slide ────────────────────────────────────────────────────────

function Slide({ logo }: { logo: LogoItem }) {
  const img = (
    <img
      src={logo.url}
      alt={logo.alt}
      className="h-14 md:h-18 w-auto max-w-[180px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      loading="lazy"
    />
  );
  if (logo.link) {
    return (
      <a
        href={logo.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center justify-center"
      >
        {img}
      </a>
    );
  }
  return <div className="flex-shrink-0 flex items-center justify-center">{img}</div>;
}

// ─── Logo cloud (BlurredInfiniteSlider) ───────────────────────────────────────

export function LogoCloud({ heading, logos, fieldVis = () => true }: LogoCloudProps) {
  // Measure one copy of the track to derive animation duration proportional to content width
  const [trackRef, { width: trackWidth }] = useMeasure();

  // Skip logos with no URL (e.g. upload failed silently before this fix)
  const validLogos = logos.filter(l => l.url);
  if (!validLogos.length) return null;

  const measured = trackWidth > 0;
  // Speed: ~80 px/s, minimum 10 s regardless of logo count
  const duration = measured ? Math.max(trackWidth / 80, 10) : 20;

  return (
    <section className="py-14 bg-ink-raised border-t border-white/10">
      {fieldVis('heading') && heading && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500 text-center mb-10">
          {heading}
        </p>
      )}

      <div className="relative overflow-hidden group">
        {/* Left blur edge */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-36 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        {/* Right blur edge */}
        <div className="absolute inset-y-0 right-0 w-20 md:w-36 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling track — duplicated for seamless loop */}
        <div
          className={
            measured
              ? 'flex items-center w-max animate-marquee group-hover:[animation-play-state:paused]'
              : 'flex items-center w-max'
          }
          style={measured ? { animationDuration: `${duration}s` } : undefined}
        >
          {/* First copy — measured to calculate speed */}
          <div ref={trackRef} className="flex items-center gap-16 px-8">
            {validLogos.map((logo, i) => (
              <Slide key={i} logo={logo} />
            ))}
          </div>

          {/* Second copy — identical, creates seamless loop */}
          <div className="flex items-center gap-16 px-8" aria-hidden>
            {validLogos.map((logo, i) => (
              <Slide key={`b${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
