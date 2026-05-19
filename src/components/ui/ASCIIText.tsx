/**
 * ASCIIText — character-scramble decryption animation for headlines.
 *
 * Reveals text by progressively settling each character. Initial state shows
 * random ASCII glyphs; after a stagger delay per character, the final letter
 * settles. Respects `prefers-reduced-motion: reduce` (renders final text
 * immediately).
 *
 * Multi-line support: pass `\n` in the text to split into stacked spans.
 */
import { useEffect, useRef, useState } from 'react';

interface ASCIITextProps {
  text: string;
  className?: string;
  durationMs?: number;
  /** Delay before scramble starts (ms). */
  startDelayMs?: number;
  /** Charset used while scrambling. */
  glyphs?: string;
}

const DEFAULT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*+=/?<>';
const FRAME_MS = 60;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function ScrambleLine({ line, durationMs, glyphs, startDelayMs }: { line: string; durationMs: number; glyphs: string; startDelayMs: number }) {
  const [chars, setChars] = useState<string[]>(() => line.split(''));
  const reduced = useReducedMotion();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      setChars(line.split(''));
      return;
    }
    // Initial scrambled state — preserve whitespace, replace letters with random glyphs.
    setChars(line.split('').map((c) => (c === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)])));

    const startTimer = window.setTimeout(() => {
      const totalFrames = Math.max(6, Math.ceil(durationMs / FRAME_MS));
      const settleFrame = new Array(line.length).fill(0).map((_, i) => Math.floor((i / Math.max(1, line.length - 1)) * (totalFrames - 1)));
      let frame = 0;
      tickRef.current = setInterval(() => {
        frame += 1;
        setChars((prev) =>
          prev.map((_, i) => {
            const final = line[i];
            if (final === ' ') return ' ';
            return frame >= settleFrame[i] ? final : glyphs[Math.floor(Math.random() * glyphs.length)];
          }),
        );
        if (frame >= totalFrames) {
          if (tickRef.current) clearInterval(tickRef.current);
          setChars(line.split(''));
        }
      }, FRAME_MS);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimer);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [line, durationMs, glyphs, reduced, startDelayMs]);

  return <span className="block">{chars.join('')}</span>;
}

export default function ASCIIText({
  text,
  className = '',
  durationMs = 900,
  startDelayMs = 120,
  glyphs = DEFAULT_GLYPHS,
}: ASCIITextProps) {
  const lines = text.split('\n');
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <ScrambleLine
          key={`${line}-${i}`}
          line={line}
          durationMs={durationMs}
          glyphs={glyphs}
          startDelayMs={startDelayMs + i * 180}
        />
      ))}
    </span>
  );
}
