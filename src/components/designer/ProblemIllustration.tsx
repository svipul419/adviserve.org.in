import { useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const WORDS = [
  'Multiple Vendors',
  'Compliance',
  'Audit',
  'Hiring',
  'Approvals',
  'HR',
  'Timelines',
  'Technology',
];

const TRAVEL_DURATION = 5500;  // ms — full right-to-left journey
const SPAWN_INTERVAL  = 2400;  // ms between new words (raised to prevent bunching at slow zones)
const X_ENTER = 440;
const X_EXIT  = -80;

// Speed bumps: X in viewBox coords, peakHeight = vertical lift at center,
// radius = zone of influence — DOUBLED so rise/fall is gradual (60px each side)
const BUMPS = [
  { x: 261, peakHeight: 10, radius: 60 },
  { x: 142, peakHeight: 10, radius: 60 },
];

const BASELINE_Y = 155;

// Smooth cosine lift: bell-curve centered on each bump
function getYPosition(x: number): number {
  let lift = 0;
  for (const bump of BUMPS) {
    const dist = Math.abs(x - bump.x);
    if (dist < bump.radius) {
      // cos gives 1 at center (dist=0) and 0 at radius edge
      const localLift = bump.peakHeight * Math.cos((dist / bump.radius) * (Math.PI / 2));
      if (localLift > lift) lift = localLift;
    }
  }
  return BASELINE_Y - lift;
}

// Time-warped X: decelerates approaching each bump, accelerates after (real car physics)
function getXPosition(elapsedMs: number): number {
  const totalRange = X_ENTER - X_EXIT; // 520
  const RAW_SPEED_PX_PER_MS = totalRange / TRAVEL_DURATION;

  let warpedMs = elapsedMs;
  for (const bump of BUMPS) {
    // When the word would linearly reach this bump's center
    const linearArrivalMs = (X_ENTER - bump.x) / RAW_SPEED_PX_PER_MS;
    const distMs = elapsedMs - linearArrivalMs;
    const slowZoneMs = 350; // ±350ms slow zone around each bump
    if (Math.abs(distMs) < slowZoneMs) {
      // t goes 0→1 across the slow zone; sin(t*π) peaks at 0.5 (bump center)
      const t = (distMs + slowZoneMs) / (2 * slowZoneMs);
      const slowFactor = 0.45; // 0 = stop, 1 = no slow
      // Subtract a lag that peaks at the bump center and tapers off either side
      const lag = slowZoneMs * (1 - slowFactor) * Math.sin(t * Math.PI);
      warpedMs -= lag;
    }
  }

  const tProgress = Math.max(0, warpedMs / TRAVEL_DURATION);
  if (tProgress >= 1) return X_EXIT;
  return X_ENTER - totalRange * tProgress;
}

// Tilt rotation: nose-up approaching bump, level at top, nose-down descending
function getRotation(x: number): number {
  let totalSlope = 0;
  for (const bump of BUMPS) {
    const distance = x - bump.x; // signed: positive = right of bump (approaching)
    if (Math.abs(distance) < bump.radius) {
      const t = (distance / bump.radius) * (Math.PI / 2);
      // Derivative of cosine lift at this signed position
      // Negative = heading upward (Y decreasing), positive = heading downward
      const slope = -bump.peakHeight * Math.sin(t) / bump.radius;
      totalSlope += slope;
    }
  }
  // Normalize to max possible slope and scale to ±4 degrees
  // Max slope occurs at the edge of the bump where sin(t) = 1
  const maxSlope = BUMPS[0].peakHeight / BUMPS[0].radius;
  const normalized = maxSlope > 0 ? totalSlope / maxSlope : 0;
  return normalized * 4; // degrees
}

// ─── Per-word animated element ───────────────────────────────────────────────

interface WordEntry {
  id: number;
  word: string;
  startMs: number;
}

function WordOnRoad({ word, startMs }: { word: string; startMs: number }) {
  const [pos, setPos] = useState({ x: X_ENTER, y: BASELINE_Y, rot: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const elapsed = performance.now() - startMs;
      const x = getXPosition(elapsed);
      const y = getYPosition(x);
      const rot = getRotation(x);
      setPos({ x, y, rot });
      if (elapsed < TRAVEL_DURATION + 200) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [startMs]);

  return (
    <text
      x={pos.x}
      y={pos.y}
      transform={`rotate(${pos.rot}, ${pos.x}, ${pos.y})`}
      fontFamily="ui-monospace, 'JetBrains Mono', monospace"
      fontSize="13"
      fontWeight="600"
      fill="currentColor"
      textAnchor="middle"
    >
      {word}
    </text>
  );
}

// ─── Static fallback for reduced motion ──────────────────────────────────────

function StaticWordList({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      {WORDS.map(w => (
        <span key={w} style={{ fontSize: 11, fontFamily: 'monospace', opacity: 0.55 }}>
          {w}
        </span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProblemIllustration({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [activeWords, setActiveWords] = useState<WordEntry[]>([]);
  const wordIdxRef = useRef(0);
  const nextIdRef  = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    // Seed: spawn first word immediately so road isn't empty on mount
    const seed: WordEntry = {
      id: nextIdRef.current++,
      word: WORDS[wordIdxRef.current++ % WORDS.length],
      startMs: performance.now(),
    };
    setActiveWords([seed]);

    const interval = setInterval(() => {
      const newWord: WordEntry = {
        id: nextIdRef.current++,
        word: WORDS[wordIdxRef.current++ % WORDS.length],
        startMs: performance.now(),
      };
      setActiveWords(prev => {
        // Evict words that have fully exited
        const live = prev.filter(w => performance.now() - w.startMs < TRAVEL_DURATION + 300);
        return [...live, newWord];
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  if (reducedMotion) {
    return <StaticWordList className={className} />;
  }

  return (
    <div className={className} aria-hidden="true" style={{ position: 'relative' }}>
      <svg viewBox="0 0 400 240" width="100%" height="100%">

        {/* Dashed baseline road */}
        <line
          x1="20" y1="160" x2="380" y2="160"
          stroke="currentColor" strokeWidth="1"
          strokeDasharray="2 4" opacity="0.2"
        />

        {/* Speed bumps: teal arc + faint ground shadow */}
        {BUMPS.map((bump, i) => (
          <g key={i}>
            <path
              d={`M ${bump.x - 15} 160 Q ${bump.x} ${160 - bump.peakHeight * 0.9}, ${bump.x + 15} 160`}
              fill="none"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <ellipse
              cx={bump.x} cy="162" rx="16" ry="3"
              fill="#7F1D1D" opacity="0.18"
            />
          </g>
        ))}

        {/* Concurrently animated words */}
        {activeWords.map(w => (
          <WordOnRoad key={w.id} word={w.word} startMs={w.startMs} />
        ))}

      </svg>
    </div>
  );
}

export default ProblemIllustration;
