/**
 * SVGFollowerCursor — site-wide brush-stroke cursor trail.
 *
 * Multiple Follower instances render colored SVG paths along the pointer
 * path with random circle/square/triangle particle bursts. Mounted as a
 * full-viewport fixed overlay with `pointer-events: none` so it never
 * intercepts clicks. Guarded against touch devices and reduced-motion.
 *
 * Adapted from the original container-bound SVGFollower into a global
 * cursor effect using window-level mousemove and viewport-sized SVG.
 */
import { useEffect, useRef, useState } from 'react';

interface Position { x: number; y: number }
interface Point {
  position: Position;
  time: number;
  drift: Position;
  age: number;
  direction: Position;
}

interface SVGFollowerCursorProps {
  /** Stroke colors layered together. Order is back-to-front. */
  colors?: string[];
  /** Milliseconds before a trailing point is dropped. */
  removeDelay?: number;
  /** Z-index for the overlay. */
  zIndex?: number;
}

class Follower {
  private points: Point[] = [];
  private line: SVGPathElement;
  private color: string;
  private stage: SVGSVGElement;
  private removeDelay: number;

  constructor(stage: SVGSVGElement, color: string, removeDelay: number) {
    this.stage = stage;
    this.color = color;
    this.removeDelay = removeDelay;
    this.line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.line.style.fill = color;
    this.line.style.stroke = color;
    this.line.style.strokeWidth = '1.6';
    this.line.style.strokeLinecap = 'round';
    this.line.style.strokeLinejoin = 'round';
    // Subtle drop-shadow so trails read on both white and dark surfaces.
    this.line.style.filter = `drop-shadow(0 0 4px ${color}aa)`;
    this.stage.appendChild(this.line);
  }

  destroy() {
    if (this.line.parentNode) this.line.parentNode.removeChild(this.line);
  }

  private getDrift(): number {
    return (Math.random() - 0.5) * 3;
  }

  add(position: Position) {
    const direction = { x: 0, y: 0 };
    if (this.points[0]) {
      direction.x = (position.x - this.points[0].position.x) * 0.25;
      direction.y = (position.y - this.points[0].position.y) * 0.25;
    }

    const point: Point = {
      position,
      time: Date.now(),
      drift: {
        x: this.getDrift() + direction.x / 2,
        y: this.getDrift() + direction.y / 2,
      },
      age: 0,
      direction,
    };

    const r = Math.random();
    const chance = 0.1;
    if (r < chance) this.makeCircle(point);
    else if (r < chance * 2) this.makeSquare(point);
    else if (r < chance * 3) this.makeTriangle(point);

    this.points.unshift(point);
  }

  private createLine(points: Point[]): string {
    const path: string[] = [points.length ? 'M' : ''];
    if (points.length === 0) return '';

    let forward = true;
    let i = 0;
    while (i >= 0) {
      const point = points[i];
      const offsetX = point.direction.x * ((i - points.length) / points.length) * 0.6;
      const offsetY = point.direction.y * ((i - points.length) / points.length) * 0.6;
      const x = point.position.x + (forward ? offsetY : -offsetY);
      const y = point.position.y + (forward ? offsetX : -offsetX);
      point.age += 0.2;
      path.push(String(x + point.drift.x * point.age));
      path.push(String(y + point.drift.y * point.age));
      i += forward ? 1 : -1;
      if (i === points.length) {
        i--;
        forward = false;
      }
    }
    return path.join(' ');
  }

  trim() {
    if (this.points.length > 0) {
      const last = this.points[this.points.length - 1];
      if (last.time < Date.now() - this.removeDelay) this.points.pop();
    }
    this.line.setAttribute('d', this.createLine(this.points));
  }

  private makeCircle(point: Point) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const radius = (Math.abs(point.direction.x) + Math.abs(point.direction.y)) * 1;
    circle.setAttribute('r', String(radius));
    circle.style.fill = this.color;
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    this.moveShape(circle, point);
  }

  private makeSquare(point: Point) {
    const size = (Math.abs(point.direction.x) + Math.abs(point.direction.y)) * 1.5;
    const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    square.setAttribute('width', String(size));
    square.setAttribute('height', String(size));
    square.style.fill = this.color;
    this.moveShape(square, point);
  }

  private makeTriangle(point: Point) {
    const size = (Math.abs(point.direction.x) + Math.abs(point.direction.y)) * 1.5;
    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    triangle.setAttribute('points', `0,0 ${size},${size / 2} 0,${size}`);
    triangle.style.fill = this.color;
    this.moveShape(triangle, point);
  }

  private moveShape(shape: SVGElement, point: Point) {
    this.stage.appendChild(shape);
    const driftX = point.position.x + point.direction.x * (Math.random() * 20) + point.drift.x * (Math.random() * 10);
    const driftY = point.position.y + point.direction.y * (Math.random() * 20) + point.drift.y * (Math.random() * 10);
    shape.style.transform = `translate(${point.position.x}px, ${point.position.y}px)`;
    shape.style.transition = 'all 0.5s ease-out';
    requestAnimationFrame(() => {
      shape.style.transform = `translate(${driftX}px, ${driftY}px) scale(0) rotate(${Math.random() * 360}deg)`;
      window.setTimeout(() => {
        if (this.stage.contains(shape)) this.stage.removeChild(shape);
      }, 520);
    });
  }
}

export default function SVGFollowerCursor({
  // All-blue brand palette — three shades from deep brand-blue through
  // electric-cyan, no off-brand magenta/coral. Matches the engineering
  // theme used by the hero + FlowSection chrome.
  colors = ['#0F5594', '#1e9df1', '#00D4FF'],
  removeDelay = 380,
  zIndex = 9995,
}: SVGFollowerCursorProps = {}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const followersRef = useRef<Follower[]>([]);
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Guard: only enable on pointer-fine devices with motion allowed.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const svg = svgRef.current;
    if (!svg) return;

    // Spawn one follower per color.
    followersRef.current = colors.map((c) => new Follower(svg, c, removeDelay));

    let paused = document.hidden;

    const onMove = (e: MouseEvent) => {
      const pos: Position = { x: e.clientX, y: e.clientY };
      followersRef.current.forEach((f) => f.add(pos));
    };

    const tick = () => {
      if (paused) return;
      followersRef.current.forEach((f) => f.trim());
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      paused = document.hidden;
      if (!paused) rafRef.current = requestAnimationFrame(tick);
      else if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      followersRef.current.forEach((f) => f.destroy());
      followersRef.current = [];
    };
  }, [enabled, colors, removeDelay]);

  if (!enabled) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="fixed inset-0 pointer-events-none"
      style={{
        width: '100vw',
        height: '100vh',
        zIndex,
        // No blend mode — strokes render as their literal blue shades so the
        // cursor is equally visible on cool-white (Home blueprint paper) and
        // on dark video plates. `plus-lighter` made strokes near-invisible
        // on the cool-white surface.
      }}
    />
  );
}
