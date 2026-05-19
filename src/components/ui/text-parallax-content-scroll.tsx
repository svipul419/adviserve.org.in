import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import AnimatedCTAButton from './AnimatedCTAButton';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PracticeItem = {
  imgUrl: string;
  subheading: string;
  heading: string;
  bodyParagraph: string;
  outcomes: [string, string][];
  ctaLabel: string;
  ctaHref: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const IMG_PADDING = 12;

// ─── Main export ─────────────────────────────────────────────────────────────

export const TextParallaxContent: React.FC<{ practices: PracticeItem[] }> = ({ practices }) => (
  <div className="bg-transparent">
    {practices.map((p, i) => (
      <TextParallaxSection key={i} practice={p} />
    ))}
  </div>
);

// ─── One section per practice ─────────────────────────────────────────────────

function TextParallaxSection({ practice }: { practice: PracticeItem }) {
  const figRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: figRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div>
      <div ref={figRef} className="relative h-[150vh]">
        <StickyImage
          imgUrl={practice.imgUrl}
          subheading={practice.subheading}
          heading={practice.heading}
          scrollYProgress={scrollYProgress}
        />
      </div>
      <ContentBlock
        bodyParagraph={practice.bodyParagraph}
        outcomes={practice.outcomes}
        ctaLabel={practice.ctaLabel}
        ctaHref={practice.ctaHref}
      />
    </div>
  );
}

// ─── Sticky full-viewport image with scale parallax ───────────────────────────

function StickyImage({
  imgUrl,
  subheading,
  heading,
  scrollYProgress,
}: {
  imgUrl: string;
  subheading: string;
  heading: string;
  scrollYProgress: MotionValue<number>;
}) {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <motion.div
      className="sticky overflow-hidden rounded-3xl"
      style={{
        top: IMG_PADDING,
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        scale,
      }}
    >
      <img
        src={imgUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-base/80 via-ink-primary/40 to-transparent" />
      <OverlayCopy
        subheading={subheading}
        heading={heading}
        scrollYProgress={scrollYProgress}
      />
    </motion.div>
  );
}

// ─── Animated overlay copy ────────────────────────────────────────────────────

function OverlayCopy({
  subheading,
  heading,
  scrollYProgress,
}: {
  subheading: string;
  heading: string;
  scrollYProgress: MotionValue<number>;
}) {
  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-white text-center px-6"
    >
      <p className="mb-2 font-mono text-sm uppercase tracking-[0.16em] text-white/70">
        {subheading}
      </p>
      <p className="font-display text-[clamp(28px,4vw,64px)] leading-[1.1] font-bold max-w-3xl">
        {heading}
      </p>
    </motion.div>
  );
}

// ─── Content block below each sticky image ────────────────────────────────────

interface ContentBlockProps {
  bodyParagraph: string;
  outcomes: [string, string][];
  ctaLabel: string;
  ctaHref: string;
}

function ContentBlock({ bodyParagraph, outcomes, ctaLabel, ctaHref }: ContentBlockProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '20px',
        }}
        className="p-8 md:p-10"
      >
        {outcomes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {outcomes.map(([label, value]) => (
              <div key={label} className="border-l-2 border-accent-blue pl-4">
                <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-white/60 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        )}
        <p className="mb-8 text-base leading-relaxed text-white/85 md:text-lg max-w-prose">
          {bodyParagraph}
        </p>
        <AnimatedCTAButton href={ctaHref} label={ctaLabel} />
      </div>
    </div>
  );
}
