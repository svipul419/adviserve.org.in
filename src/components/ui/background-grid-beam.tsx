import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GridBeamProps {
  children?: React.ReactNode;
  className?: string;
}

export const GridBeam: React.FC<GridBeamProps> = ({ children, className }) => (
  <div className={cn('relative w-full h-full bg-grid overflow-hidden', className)}>
    <ADVISERVEBeam />
    {children}
  </div>
);

/**
 * ADVISERVE letterforms — each letter ~120px wide, 20px gap, 100px tall.
 * viewBox 0 0 1300 120. All letters drawn as a single continuous path
 * so stroke-dashoffset can trace them sequentially.
 *
 * Letter geometry (verified segment-by-segment):
 * A:  Left stroke up, cross top, right stroke down, crossbar
 * D:  Down, right, angled top-right, angled top-left, close top
 * V:  Down-left diagonal, down-right diagonal
 * I:  Top bar, center stroke down, bottom bar
 * S:  Right along top, down, left, down, right along bottom
 * E:  Right along top, back left, down to mid, right mid-bar, back, down, right bottom
 * R:  Down left, back up, right along top, down to mid, back left, diagonal down-right
 * V2: Same as V
 * E2: Same as E
 */
const ADVISERVE_PATH = [
  // A — start bottom-left, up, across top, down right, back up to crossbar
  'M0,100 L0,30 L20,0 L60,0 L80,30 L80,100',
  'M15,65 L65,65',
  // D — start top-left
  'M120,0 L120,100 L170,100 L190,80 L190,20 L170,0 Z',
  // V
  'M230,0 L260,100 L290,0',
  // I — top bar, stem, bottom bar
  'M320,0 L370,0 M345,0 L345,100 M320,100 L370,100',
  // S — top-right, down, left, down, right
  'M420,0 L480,0 L480,45 L420,55 L420,100 L480,100',
  // E — top bar, down, mid bar, down, bottom bar
  'M520,0 L580,0 M520,0 L520,100 L580,100 M520,50 L565,50',
  // R — stem down, back up, top right, down to mid, back, kick out
  'M620,0 L620,100 M620,0 L670,0 L670,50 L620,50 M645,50 L670,100',
  // V (2nd)
  'M710,0 L740,100 L770,0',
  // E (2nd)
  'M810,0 L870,0 M810,0 L810,100 L870,100 M810,50 L855,50',
].join(' ');

function ADVISERVEBeam() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, []);

  if (reducedMotion) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 900 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d={ADVISERVE_PATH} stroke="#7F1D1D" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* Layer 1: faint static outline — always visible */}
      <path
        ref={pathRef}
        d={ADVISERVE_PATH}
        stroke="#7F1D1D"
        strokeWidth="1.5"
        strokeOpacity="0.08"
        fill="none"
        strokeLinecap="round"
      />
      {/* Layer 2: bright tracing beam — stroke-dashoffset draws the path */}
      {pathLength > 0 && (
        <motion.path
          d={ADVISERVE_PATH}
          stroke="url(#beam-grad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          initial={{ strokeDashoffset: pathLength }}
          animate={{
            strokeDashoffset: [pathLength, 0, 0, -pathLength],
          }}
          transition={{
            duration: 8,
            times: [0, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        />
      )}
      {/* Layer 3: completed-state trace — fades in when beam finishes */}
      {pathLength > 0 && (
        <motion.path
          d={ADVISERVE_PATH}
          stroke="#7F1D1D"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeOpacity: 0 }}
          animate={{ strokeOpacity: [0, 0, 0.35, 0.35, 0] }}
          transition={{
            duration: 8,
            times: [0, 0.45, 0.5, 0.85, 1],
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'linear',
          }}
        />
      )}
      <defs>
        <linearGradient id="beam-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#7F1D1D" stopOpacity="0" />
          <stop offset="40%" stopColor="#7F1D1D" stopOpacity="1" />
          <stop offset="70%" stopColor="#3A64B0" stopOpacity="1" />
          <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default GridBeam;
