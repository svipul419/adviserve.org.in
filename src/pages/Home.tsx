/**
 * Home — Adviserve (Infosys-style rebuild)
 *
 * Section hierarchy:
 *   00.01° Hero (full-bleed video, bottom-left aligned copy, big H1)
 *   00.02° Spotlight tile row (3 cards overlapping hero bottom)
 *   00.03° Who we are (split image + text)
 *   00.04° Services (alternating image-text rows)
 *   00.05° Products (3-card dark band)
 *   00.06° Approach (5-stage horizontal strip)
 *   00.07° Insights / Industries / Trust marquee anchors
 *   00.08° Connect with us (dark CTA band)
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Shield, ShieldCheck, Scale, Users, GraduationCap, Server, Cpu, Sparkles, UserSearch, ServerCog } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { RotatingText } from '../components/ui/RotatingText';
import { generateOrganizationSchema, generateWebSiteSchema, generateBreadcrumbSchema } from '../lib/structuredData';
import AnimatedCTAButton from '../components/ui/AnimatedCTAButton';
import MagneticPill from '../components/ui/MagneticPill';
import { FadeUp } from '../components/animations';
import useReveal from '../components/designer/useReveal';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import { HeroSkeleton } from '../components/Skeletons';
import { DEFAULT_HOME_CMS } from '../lib/defaults';
import SplitReveal from '../components/effects/SplitReveal';
import Parallax from '../components/effects/Parallax';
import TiltCard from '../components/effects/TiltCard';
import Spotlight from '../components/effects/Spotlight';
import AnimatedCounter from '../components/effects/AnimatedCounter';
import AnimatedMeshBg from '../components/effects/AnimatedMeshBg';
import ShineBorder from '../components/effects/ShineBorder';
import FeatureCarousel from '../components/effects/FeatureCarousel';
import CircularTestimonials from '../components/effects/CircularTestimonials';
import TrustedBySection from '../components/sections/TrustedBySection';
import FlowArt, { FlowSection } from '../components/effects/FlowArt';
import InsightCarousel from '../components/effects/InsightCarousel';
import GlassBlogCard from '../components/effects/GlassBlogCard';

gsap.registerPlugin(ScrollTrigger);
const motionOff = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══ Crossfade dual-video loop ═══ */
function CrossfadeVideoLoop({ src, fadeDuration = 1.2, className = '' }: { src: string; fadeDuration?: number; className?: string }) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeIsA, setActiveIsA] = useState(true);

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;
    let rafId: number;
    let swapped = false;
    const tick = () => {
      const active = activeIsA ? a : b;
      const inactive = activeIsA ? b : a;
      if (active.duration && active.currentTime > 0) {
        const remaining = active.duration - active.currentTime;
        if (remaining <= fadeDuration && !swapped) {
          swapped = true;
          inactive.currentTime = 0;
          inactive.play().catch(() => {});
          requestAnimationFrame(() => setActiveIsA((prev) => !prev));
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeIsA, fadeDuration]);

  useEffect(() => {
    const inactive = activeIsA ? videoBRef.current : videoARef.current;
    if (!inactive) return;
    const id = setTimeout(() => { inactive.currentTime = 0; }, fadeDuration * 1000 + 100);
    return () => clearTimeout(id);
  }, [activeIsA, fadeDuration]);

  const fadeStyle = (visible: boolean): React.CSSProperties => ({ transition: `opacity ${fadeDuration}s ease-in-out`, opacity: visible ? 1 : 0 });
  const baseProps = { autoPlay: true, muted: true, playsInline: true, loop: false, preload: 'metadata' as const, 'aria-hidden': true as const };

  return (
    <>
      <video {...baseProps} ref={videoARef} className={`absolute inset-0 w-full h-full object-cover ${className}`} style={fadeStyle(activeIsA)}>
        <source src={src} type="video/mp4" />
      </video>
      <video {...baseProps} ref={videoBRef} className={`absolute inset-0 w-full h-full object-cover ${className}`} style={fadeStyle(!activeIsA)}>
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}

/* ═══ 00.01° HERO — Infosys-style centered, ask-anything input, suggestion chips, feature cards ═══ */
const SUGGESTION_CHIPS = [
  'Run a DPDP gap analysis',
  'Reply to a vendor questionnaire',
  'Hire a CISO',
  'Modernise our IT estate',
];

const HERO_FEATURE_CARDS: Array<{
  icon: LucideIcon;
  title: string;
  sub: string;
  cta: string;
  ctaPrefix?: string;
  href: string;
}> = [
  { icon: ShieldCheck, title: 'DPDP Self-Assessment', sub: 'Free · 15 min', cta: 'Know More', href: '/dpdp-assessment' },
  { icon: Shield,      title: 'Vendor Security Pack', sub: 'Send to procurement', cta: 'Cybersecurity', ctaPrefix: 'Latest from ', href: '/services/cybersecurity' },
  { icon: UserSearch,  title: 'Calibrated Hiring',    sub: 'Defensible scoring', cta: 'HR & Staffing', ctaPrefix: 'Latest from ', href: '/services/hr-services' },
  { icon: ServerCog,   title: 'Managed IT Service',   sub: 'No drift after handoff', cta: 'IT Consulting', ctaPrefix: 'Latest from ', href: '/services/it-services' },
];

function Hero({ h1Line1, rotatingWords, ctaLink, videoUrl }: {
  badgeText: string; h1Line1: string; rotatingWords: string[]; subtitle: string;
  ctaText: string; ctaLink: string; secondaryText: string; secondaryLink: string;
  trustItems: string[]; videoUrl: string;
}) {
  const [askValue, setAskValue] = useState('');
  const [introDone, setIntroDone] = useState(() => !!(window as any).__adviserveIntroDone);

  useEffect(() => {
    if (introDone) return;
    const listener = () => setIntroDone(true);
    window.addEventListener('adviserve:intro-done', listener);
    const fallback = setTimeout(listener, 3500);
    return () => {
      window.removeEventListener('adviserve:intro-done', listener);
      clearTimeout(fallback);
    };
  }, [introDone]);

  // Cover sheet — sheet 00 / 07 of the dossier. Engineering blueprint chrome
  // identical to the FlowSection cards below, so the whole page reads as one
  // continuous engineering set. Video kept as a low-opacity multiply plate.
  const HERO_ACCENT = '#1e9df1';
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  })();

  return (
    <section
      className="relative bg-background overflow-hidden"
      style={{ padding: 'clamp(4px, 0.55vw, 8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.985, y: 14 }}
        animate={introDone ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.985, y: 14 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 px-6 sm:px-10 lg:px-14"
        style={{
          minHeight: 'min(94vh, 900px)',
          borderRadius: 'clamp(20px, 2.2vw, 36px)',
          background: '#FBFDFF',
          border: `1px solid ${HERO_ACCENT}22`,
          boxShadow: '0 24px 60px -36px rgba(11,20,38,0.22)',
        }}
      >
        {/* Hairline blueprint grid — fine 36px + coarse 180px */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${HERO_ACCENT}1F 1px, transparent 1px),
              linear-gradient(90deg, ${HERO_ACCENT}1F 1px, transparent 1px),
              linear-gradient(${HERO_ACCENT}33 1px, transparent 1px),
              linear-gradient(90deg, ${HERO_ACCENT}33 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px, 36px 36px, 180px 180px, 180px 180px',
          }}
        />

        {/* Video plate — full visibility outside the inner panel. */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <CrossfadeVideoLoop src={videoUrl} fadeDuration={1.2} className="opacity-100" />
        </div>

        {/* Corner-only wash — chrome (callouts, ticks, title-block) sits on
            soft white at the rim; the center 60% of the plate stays at full
            video brightness. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              'radial-gradient(140% 95% at 50% 50%, transparent 0%, transparent 45%, rgba(251,253,255,0.55) 95%)',
          }}
        />

        {/* Vertical scan line — sweeps left→right every 9s. */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 z-[3] pointer-events-none"
          style={{
            width: 2,
            background: `linear-gradient(180deg, transparent, ${HERO_ACCENT}DD 30%, ${HERO_ACCENT}DD 70%, transparent)`,
            boxShadow: `0 0 16px ${HERO_ACCENT}AA`,
            animation: 'hero-plate-scan 9s linear infinite',
          }}
        />

        {/* LIVE PLATE callout — pulses to read as instrumentation. */}
        <div
          aria-hidden="true"
          className="absolute bottom-7 left-[clamp(2rem,4vw,4rem)] z-[3] pointer-events-none flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: `${HERO_ACCENT}EE` }}
        >
          <span className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-[#1e9df1] opacity-75 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[#1e9df1]" />
          </span>
          <span>Live Plate · 24 fps</span>
          <span className="opacity-60">· {today}</span>
        </div>

        {/* Registration crosshairs at four corners */}
        {([
          { key: 'tl', top: 14, left: 14 },
          { key: 'tr', top: 14, right: 14 },
          { key: 'bl', bottom: 14, left: 14 },
          { key: 'br', bottom: 14, right: 14 },
        ] as const).map((m) => (
          <span
            key={m.key}
            aria-hidden="true"
            className="absolute z-[3] pointer-events-none"
            style={{ width: 18, height: 18, ...m }}
          >
            <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `${HERO_ACCENT}AA` }} />
            <span style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: `${HERO_ACCENT}AA` }} />
            <span style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `1px solid ${HERO_ACCENT}AA` }} />
          </span>
        ))}

        {/* Top-edge dimension callout */}
        <div
          aria-hidden="true"
          className="absolute top-7 left-[clamp(3rem,7vw,7rem)] right-[clamp(3rem,7vw,7rem)] z-[3] pointer-events-none flex items-center"
        >
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${HERO_ACCENT}DD` }}>◀</span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${HERO_ACCENT}55` }} />
          <span className="px-2 font-mono text-[9.5px] tracking-[0.24em] uppercase" style={{ color: `${HERO_ACCENT}DD` }}>
            COVER SHEET · 00 / 07
          </span>
          <span className="flex-1 mx-2 h-px" style={{ background: `${HERO_ACCENT}55` }} />
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: `${HERO_ACCENT}DD` }}>▶</span>
        </div>

        {/* Wireframe "00" numeral — bottom-right, oversized */}
        <span
          aria-hidden="true"
          className="absolute right-[clamp(1rem,3vw,3rem)] bottom-[clamp(-2rem,-1vw,0rem)] z-[3] font-display leading-none pointer-events-none select-none"
          style={{
            fontSize: 'clamp(10rem, 22vw, 24rem)',
            color: 'transparent',
            WebkitTextStroke: `1.5px ${HERO_ACCENT}44`,
            letterSpacing: '-0.05em',
          }}
        >
          00
        </span>

        {/* Drafting title-block bottom-right */}
        <div
          className="absolute bottom-[clamp(1rem,2.5vw,2rem)] right-[clamp(1rem,2.5vw,2rem)] z-[3] pointer-events-none hidden sm:grid grid-cols-2 text-[9.5px] font-mono tracking-[0.18em] uppercase leading-[1.6]"
          style={{ color: `${HERO_ACCENT}DD`, background: 'rgba(251,253,255,0.92)', border: `1px solid ${HERO_ACCENT}55`, minWidth: 220 }}
        >
          <div className="px-3 py-1.5 border-r border-b" style={{ borderColor: `${HERO_ACCENT}55` }}>
            <div style={{ color: `${HERO_ACCENT}99`, fontSize: 8 }}>SCALE</div>
            <div className="font-bold">1 : 1</div>
          </div>
          <div className="px-3 py-1.5 border-b" style={{ borderColor: `${HERO_ACCENT}55` }}>
            <div style={{ color: `${HERO_ACCENT}99`, fontSize: 8 }}>DATE</div>
            <div className="font-bold">{today}</div>
          </div>
          <div className="px-3 py-1.5 col-span-2">
            <div style={{ color: `${HERO_ACCENT}99`, fontSize: 8 }}>SECTION · 00 / 07</div>
            <div className="font-bold text-[10.5px]" style={{ color: HERO_ACCENT, letterSpacing: '0.14em' }}>COVER SHEET</div>
          </div>
        </div>

        {/* Vertical rotated label rail on the right edge */}
        <div
          aria-hidden="true"
          className="hidden md:flex absolute right-[clamp(1rem,2vw,2rem)] top-1/2 z-[3] -translate-y-1/2 origin-center -rotate-90 items-center gap-3 pointer-events-none"
        >
          <span className="block w-8 h-px" style={{ background: `${HERO_ACCENT}55` }} />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase whitespace-nowrap" style={{ color: `${HERO_ACCENT}DD` }}>
            Adviserve · 2026
          </span>
          <span className="block w-8 h-px" style={{ background: `${HERO_ACCENT}55` }} />
        </div>

        {introDone && (
          <motion.div
            // Inner "sub-sheet" — solid blueprint paper + cyan grid + the
            // same chrome vocabulary the Top Stories sheet uses (corner
            // ticks, top dimension callout, mini title-block) — but at a
            // tighter, sub-sheet scale.
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show:   { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
            }}
            className="relative z-20 w-full flex flex-col items-center text-center gap-4 sm:gap-5 max-w-7xl px-6 sm:px-10"
          >

            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(30,157,241,0.08)', border: `1px solid ${HERO_ACCENT}55` }}
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#1e9df1] opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[#1e9df1]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: `${HERO_ACCENT}DD` }}>Front Door · Q2 2026</span>
            </motion.div>

            {/* H1 — adopts Top Stories card text style: font-display,
               weight 400, tighter leading, ink color, gradient highlight
               on the last word. */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="font-display text-center text-[clamp(36px,5.4vw,76px)] leading-[1.06] tracking-[-0.02em] max-w-[18ch] mx-auto"
              style={{ fontWeight: 400, color: '#FBFDFF' }}
            >
              {(() => {
                const words = h1Line1.split(/\s+/);
                const cut = Math.max(words.length - 1, 1);
                const head = words.slice(0, cut).join(' ');
                const tail = words.slice(cut).join(' ');
                return (
                  <>
                    {head}{' '}
                    <span style={{
                      background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}>{tail}</span>
                  </>
                );
              })()}
            </motion.h1>

            {/* Rotating tagline — matches Top Stories subhead body style. */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="font-display text-center text-[clamp(22px,3vw,40px)] leading-[1.12] tracking-[-0.018em] flex items-center justify-center"
              style={{ fontWeight: 400 }}
            >
              <RotatingText
                words={rotatingWords}
                interval={3000}
                className="hero-rotating-gradient"
              />
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              className="w-full max-w-[650px] mx-auto mt-3 sm:mt-5"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = askValue.trim();
                  const target = trimmed ? `${ctaLink}?q=${encodeURIComponent(trimmed)}` : ctaLink;
                  window.location.href = target;
                }}
                className="relative flex items-center bg-white rounded-full p-2 transition-shadow"
                style={{ border: `1px solid ${HERO_ACCENT}55`, boxShadow: '0 10px 28px -16px rgba(30,157,241,0.25)' }}
              >
                <Sparkles size={20} className="ml-4 text-[#1e9df1]" />
                <input
                  type="text"
                  value={askValue}
                  onChange={(e) => setAskValue(e.target.value)}
                  placeholder="Enter query ▶  e.g. DPDP audit, CISO hire…"
                  className="flex-1 bg-transparent px-4 py-3 text-base text-[#0B1426] focus:outline-none placeholder:text-[rgba(11,20,38,0.40)] w-full"
                />
                <button
                  type="submit"
                  aria-label="Submit"
                  className="bg-[#1e9df1] hover:bg-[#1a82d4] text-white rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-transform hover:scale-105 shadow-md flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e9df1]"
                >
                  <ArrowRight size={20} strokeWidth={2.5} />
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-5 sm:mt-6">
                {SUGGESTION_CHIPS.map((chip, i) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAskValue(chip)}
                    className="group/sug inline-flex items-center gap-2 text-[12.5px] font-medium px-3.5 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e9df1] hover:border-[#1e9df1] hover:text-[#0B1426]"
                    style={{
                      color: '#FBFDFF',
                      background: 'rgba(11,20,38,0.55)',
                      border: `1px solid ${HERO_ACCENT}88`,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <span
                      className="font-mono text-[9px] tracking-[0.22em] uppercase tabular-nums opacity-90 group-hover/sug:opacity-100"
                      style={{ color: HERO_ACCENT }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-px transition-colors"
                      style={{ background: `${HERO_ACCENT}99` }}
                    />
                    {chip}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Feature cards as engineering DETAIL DRAWING panels.
               Each card has its own hairline grid, top dimension callout
               (`DET. A · 1 : 4`), corner registration tick, hairline-boxed
               icon, drafting-stamp scale at bottom-right, and a hairline
               arrow CTA — same vocabulary as the parent cover sheet. */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="w-full mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left"
            >
              {HERO_FEATURE_CARDS.map((c, idx) => {
                const Icon = c.icon;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <Link
                    key={c.href}
                    to={c.href}
                    className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-26px_rgba(30,157,241,0.45)]"
                    style={{
                      background: '#FBFDFF',
                      border: `1px solid ${HERO_ACCENT}40`,
                    }}
                  >
                    {/* Per-card hairline grid backdrop */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none opacity-80"
                      style={{
                        backgroundImage: `
                          linear-gradient(${HERO_ACCENT}14 1px, transparent 1px),
                          linear-gradient(90deg, ${HERO_ACCENT}14 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                      }}
                    />

                    {/* Top dimension callout ruler */}
                    <div
                      aria-hidden="true"
                      className="relative flex items-center gap-1.5 px-3 pt-3 font-mono text-[9px] tracking-[0.22em] uppercase"
                      style={{ color: `${HERO_ACCENT}CC` }}
                    >
                      <span>◀</span>
                      <span className="flex-1 h-px" style={{ background: `${HERO_ACCENT}55` }} />
                      <span className="font-bold tracking-[0.28em]">DET. {letter}</span>
                      <span className="flex-1 h-px" style={{ background: `${HERO_ACCENT}55` }} />
                      <span>▶</span>
                    </div>

                    {/* Corner registration tick top-left */}
                    <span
                      aria-hidden="true"
                      className="absolute pointer-events-none"
                      style={{
                        top: 10, left: 10, width: 12, height: 12,
                        borderTop: `1px solid ${HERO_ACCENT}AA`,
                        borderLeft: `1px solid ${HERO_ACCENT}AA`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute pointer-events-none"
                      style={{
                        bottom: 10, right: 10, width: 12, height: 12,
                        borderBottom: `1px solid ${HERO_ACCENT}AA`,
                        borderRight: `1px solid ${HERO_ACCENT}AA`,
                      }}
                    />

                    {/* Body */}
                    <div className="relative flex flex-col flex-1 px-5 pt-4 pb-5">
                      {/* Hairline-boxed icon — not a soft tinted square */}
                      <div
                        className="w-11 h-11 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#1e9df1] group-hover:shadow-[0_8px_18px_-8px_rgba(30,157,241,0.65)]"
                        style={{
                          border: `1px solid ${HERO_ACCENT}66`,
                          background: '#FFFFFF',
                        }}
                      >
                        <Icon size={20} className="text-[#1e9df1] group-hover:text-white transition-colors duration-300" />
                      </div>

                      <h3
                        className="font-display text-[clamp(17px,1.5vw,22px)] leading-[1.15] text-[#0B1426] mb-1.5 tracking-[-0.015em]"
                        style={{ fontWeight: 400 }}
                      >
                        {c.title}
                      </h3>
                      <p className="font-sans text-[13px] leading-[1.55] text-[rgba(11,20,38,0.62)] mb-5">
                        {c.sub}
                      </p>

                      {/* Hairline arrow CTA — refined typographic register */}
                      <div className="mt-auto pt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#1e9df1] group-hover:text-[#0B1426] transition-colors border-t" style={{ borderColor: `${HERO_ACCENT}33` }}>
                        <span className="pt-3">{c.cta}</span>
                        <span className="flex-1 mt-3 h-px transition-colors" style={{ background: `${HERO_ACCENT}66` }} />
                        <ArrowUpRight size={14} className="pt-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Drafting scale stamp — bottom-left like the parent sheet */}
                    <div
                      className="absolute bottom-2 left-3 pointer-events-none font-mono text-[8.5px] tracking-[0.20em] uppercase"
                      style={{ color: `${HERO_ACCENT}88` }}
                    >
                      Scale 1 : 4
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ═══ Spotlight tiles — 3 audience-routed entry cards. Sits below hero. ═══ */
interface Tile { eyebrow: string; title: string; body: string; href: string; image: string; }
const SPOTLIGHT_TILES: Tile[] = [
  {
    eyebrow: 'FOR LEGAL & COMPLIANCE LEADS',
    title: 'Find out where your DPDP gaps live — in 15 minutes.',
    body: 'Anonymous self-assessment. Structured report on your exposure across data inventory, consent, breach response, and grievance handling.',
    href: '/dpdp-assessment',
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=900&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'FOR CISOs & SECURITY OWNERS',
    title: 'Answer the next vendor questionnaire without scrambling.',
    body: 'Evidence pack — ISMS, controls, logs, sub-processor list — built so your team has the answers ready before procurement asks.',
    href: '/services/cybersecurity',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=900&q=85&auto=format&fit=crop',
  },
  {
    eyebrow: 'FOR PROCUREMENT & RISK',
    title: 'Vet a partner audited against three ISO standards.',
    body: 'ISO 9001, ISO/IEC 20000-1, ISO/IEC 27001. One due-diligence pack covers every engagement we run.',
    href: '/trust',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85&auto=format&fit=crop',
  },
];

function SpotlightTiles() {
  return (
    <section className="relative bg-white pt-0 pb-20 lg:pb-24">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12">
        <FadeUp>
          <p className="eyebrow-warm mb-4">// PICK YOUR PATH IN</p>
          <h2 className="font-display text-[clamp(28px,3.6vw,44px)] leading-[1.15] tracking-[-0.02em] text-[#0B1426] max-w-[24ch] mb-3">
            Three doors. Same team behind each one.
          </h2>
          <p className="text-[15px] leading-[1.65] text-[rgba(11,20,38,0.65)] max-w-[60ch]">
            Most engagements start in one practice and pull in the others. Pick the door that fits — we wire the rest in.
          </p>
        </FadeUp>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {SPOTLIGHT_TILES.map((t, i) => (
            <FadeUp key={t.href} delay={0.06 * i}>
              <Link to={t.href} className="glass-card group block overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span
                    className="absolute top-4 left-4 inline-block px-2.5 py-1 rounded-full text-[10px] tracking-[0.16em] uppercase font-mono"
                    style={{
                      color: '#2196F3',
                      background: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(33,150,243,0.20)',
                    }}
                  >
                    {t.eyebrow}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <h3 className="font-display text-[18px] lg:text-[20px] leading-[1.25] tracking-[-0.01em] text-[#0B1426]" style={{ fontWeight: 700 }}>
                    {t.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.6] text-[rgba(11,20,38,0.65)]">{t.body}</p>
                  <span className="inline-flex items-center gap-1.5 mt-1 text-[13px] font-semibold text-[#0B1426] border-b-2 border-[#0B1426] pb-0.5 self-start group-hover:text-[#2196F3] group-hover:border-[#D946A6] transition-colors">
                    Read more
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ 00.03° WHO WE ARE — split image + text ═══ */
function WhoWeAre() {
  return (
    <section className="relative py-24 lg:py-32 section-tinted overflow-hidden">
      {/* Ambient orbs */}
      <div aria-hidden="true" className="ambient-orb ambient-orb-blue w-[480px] h-[480px] -top-32 -left-32 animate-orb-drift-slow" />
      <div aria-hidden="true" className="ambient-orb ambient-orb-amber w-[360px] h-[360px] bottom-0 right-0 animate-orb-drift opacity-30" />
      {/* Section number watermark */}
      <span aria-hidden="true" className="section-num-bg top-12 right-8">02</span>
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        {/* Image / visual block w/ parallax + corner accent */}
        <TiltCard className="relative aspect-[5/6] rounded-2xl overflow-hidden bg-ink-base" max={4}>
          <Parallax speed={0.18} className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85&auto=format&fit=crop"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover"
            />
          </Parallax>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-[#0B1426]/85 via-[#0B1426]/35 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(33,150,243,0.28), transparent 55%)' }} />
          <div aria-hidden="true" className="absolute -top-px -left-px w-24 h-24 border-l-2 border-t-2 border-accent-amber/60" />
          <div aria-hidden="true" className="absolute -bottom-px -right-px w-24 h-24 border-r-2 border-b-2 border-accent-azure/60" />
          {/* Stacked label tiles */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 lg:p-10 gap-2.5" data-section-color="dark">
            {['Cybersecurity', 'Compliance & RegTech', 'HR Services', 'IT Consulting', 'Legal Consulting', 'SaaS Products', 'Corporate Training'].map((d, i) => (
              <span
                key={d}
                className="group/chip inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md text-[13.5px] tracking-[0.005em] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1e9df1] hover:border-[#1e9df1] hover:text-[#0B1426] cursor-default"
                style={{
                  marginLeft: `${i * 12}px`,
                  color: '#FFFFFF',
                  background: 'rgba(11,20,38,0.55)',
                  border: '1px solid rgba(30,157,241,0.70)',
                  boxShadow: '0 4px 14px -8px rgba(30,157,241,0.45)',
                }}
              >
                <span
                  className="font-mono text-[9.5px] tracking-[0.22em] uppercase tabular-nums opacity-80 group-hover/chip:opacity-100"
                  style={{ color: '#1e9df1' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="w-2 h-px bg-[#1e9df1]/60 group-hover/chip:bg-[#0B1426]/60 transition-colors" />
                {d}
              </span>
            ))}
          </div>
        </TiltCard>

        {/* Text */}
        <div>
          <FadeUp>
            <p className="eyebrow-warm mb-5">// 00.03° — WHO WE ARE</p>
            <h2 className="font-display text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] mb-8 max-w-[14ch]">
              <SplitReveal as="span" text="One firm." className="block text-white" />
              <SplitReveal as="span" text="Seven disciplines." className="block text-white" stagger={0.05} delay={0.1} />
              <SplitReveal as="span" text="One standard." className="block text-gradient-warm" stagger={0.06} delay={0.2} />
            </h2>
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="text-[17px] leading-[1.7] text-white/85 mb-6">
              Four vendors. Four reports. Four evidence trails. You become the switchboard.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[16px] leading-[1.75] text-white/70 mb-8">
              Hire us once. One team, one standard, one evidence pack across compliance, security, hiring, IT, legal, SaaS and training. When the regulator or the board asks, the answer is already documented.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link to="/about" className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] uppercase text-accent-amber hover:text-white transition-colors">
              See how the model works <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ═══ Bento capabilities — visual grid w/ image tiles, framer-motion stagger ═══ */
const BENTO_TILES = [
  {
    span: 'lg:col-span-2 lg:row-span-2',
    eyebrow: 'COMPLIANCE',
    title: 'DPDP, operationalised',
    body: 'Data inventory, consent log, breach response — built under counsel.',
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&q=85&auto=format&fit=crop',
    href: '/services/compliance-regtech',
    accent: 'from-accent-blue/40 to-transparent',
  },
  {
    span: '',
    eyebrow: 'SECURITY',
    title: 'Vendor-questionnaire ready',
    body: 'Evidence pack your procurement team can send.',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=900&q=85&auto=format&fit=crop',
    href: '/services/cybersecurity',
    accent: 'from-accent-magenta/35 to-transparent',
  },
  {
    span: '',
    eyebrow: 'HIRING',
    title: 'Defensible shortlists',
    body: 'Calibrated to role outcomes, not keywords.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85&auto=format&fit=crop',
    href: '/services/hr-services',
    accent: 'from-accent-azure/40 to-transparent',
  },
  {
    span: 'lg:col-span-2',
    eyebrow: 'IT + LEGAL + TRAINING',
    title: 'And four more practices',
    body: 'IT managed service · Counsel inside the work · Training measured by Kirkpatrick · SaaS products built to the standard.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop',
    href: '/services',
    accent: 'from-accent-blue/30 to-transparent',
  },
];

function BentoCapabilities() {
  return (
    <section className="relative py-20 lg:py-28 section-tinted overflow-hidden">
      <div aria-hidden="true" className="ambient-orb ambient-orb-blue w-[520px] h-[520px] -top-32 -right-32 animate-orb-drift-slow" />
      <div aria-hidden="true" className="ambient-orb ambient-orb-amber w-[440px] h-[440px] bottom-[-12%] left-[-8%] animate-orb-drift opacity-30" />
      <span aria-hidden="true" className="section-num-bg top-10 left-6">03</span>
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
        <FadeUp>
          <p className="eyebrow-warm mb-5">// CAPABILITIES, AT A GLANCE</p>
          <h2 className="font-display text-[clamp(34px,5vw,68px)] leading-[1.05] tracking-[-0.02em] text-white mb-3 max-w-[22ch]">
            <span className="text-white">Hire the practice that fits.</span><br />
            <span className="text-gradient-dual">The others move in beside it.</span>
          </h2>
        </FadeUp>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-[200px] lg:auto-rows-[220px]">
          {BENTO_TILES.map((t, i) => (
            <FadeUp key={t.title} delay={0.05 * i}>
              <TiltCard className={`h-full ${t.span}`} max={4}>
                <Spotlight className="h-full rounded-2xl">
                  <Link
                    to={t.href}
                    className="group relative flex flex-col justify-end h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-base"
                  >
                    <img
                      src={t.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-[1.04] transition-all duration-700"
                    />
                    <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-t ${t.accent}`} />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/85 to-[#0B1426]/55" />
                    <div className="relative p-5 lg:p-6 flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: '#F47FC9' }}>{t.eyebrow}</span>
                      <h3 className="font-display text-[clamp(18px,1.8vw,26px)] leading-[1.15] tracking-[-0.01em]" style={{ color: '#FFFFFF' }}>{t.title}</h3>
                      <p className="text-[13px] leading-[1.55]" style={{ color: 'rgba(255,255,255,0.78)' }}>{t.body}</p>
                    </div>
                    <ArrowUpRight size={18} className="absolute top-4 right-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" style={{ color: 'rgba(255,255,255,0.65)' }} />
                  </Link>
                </Spotlight>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Stats strip — animated counters tying to customer-led claims ═══ */
function StatsStrip() {
  const stats = [
    { value: 7,  suffix: '',     label: 'practices you can hire in one engagement' },
    { value: 3,  suffix: '',     label: 'audited ISO certifications behind every deliverable' },
    { value: 5,  suffix: '',     label: 'engagement stages — signed off before invoiced' },
    { value: 24, suffix: 'h',    label: 'response window for inbound consultations' },
  ];
  return (
    <section className="relative py-16 lg:py-20 section-elevated overflow-hidden">
      <AnimatedMeshBg />
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={0.05 * i}>
            <Spotlight className="glass-card p-7 h-full rounded-2xl">
              <div className="flex items-baseline gap-1 mb-3">
                <AnimatedCounter
                  to={s.value}
                  className="font-display text-[clamp(48px,6vw,84px)] leading-none tracking-[-0.02em] text-gradient-blue"
                />
                <span className="font-display text-[clamp(36px,4vw,60px)] text-gradient-warm">{s.suffix}</span>
              </div>
              <p className="text-[13.5px] leading-[1.55] text-white/70">{s.label}</p>
            </Spotlight>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ═══ 00.04° SERVICES — alternating image-text rows ═══ */
interface ServiceRow { num: string; title: string; body: string; bullets: string[]; cta: string; href: string; icon: LucideIcon; image: string; }
const SERVICES: ServiceRow[] = [
  {
    num: '01',
    title: 'Cybersecurity',
    body: "Board-ready security reports. Vendor questionnaires answered in hours.",
    bullets: ['Pass the next board review', 'Reply to questionnaires same-day', 'Evidence the regulator can verify'],
    cta: 'See the security work',
    href: '/services/cybersecurity',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&q=85&auto=format&fit=crop',
  },
  {
    num: '02',
    title: 'Compliance & RegTech',
    body: 'DPDP gaps mapped, fixed under counsel, evidence-packed for audit.',
    bullets: ['Find exactly where data lives', 'Audit-ready inside a quarter', 'Counsel-signed evidence pack'],
    cta: 'Find your DPDP gaps',
    href: '/services/compliance-regtech',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=85&auto=format&fit=crop',
  },
  {
    num: '03',
    title: 'HR Services & Staffing',
    body: "Calibrated shortlists. Hires who perform in 90 days, not 9 months.",
    bullets: ['Defensible scoring', 'Outcome-calibrated', 'Training closes screening gaps'],
    cta: 'Hire someone who delivers',
    href: '/services/hr-services',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85&auto=format&fit=crop',
  },
  {
    num: '04',
    title: 'IT Consulting',
    body: 'IT as managed service — runbooks, SLAs and audit trails from day one.',
    bullets: ['SLAs you can hold us to', 'Audit trails by default', 'No drift after handoff'],
    cta: 'Make IT hold together',
    href: '/services/it-services',
    icon: Server,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85&auto=format&fit=crop',
  },
  {
    num: '05',
    title: 'Legal Consulting',
    body: 'Counsel who reads the architecture, not just the contract.',
    bullets: ['Inside the tech work', 'Same evidence as engineering', 'Project · Retainer · Embedded'],
    cta: 'Talk to counsel who gets it',
    href: '/services/legal-consulting',
    icon: Scale,
    image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=900&q=85&auto=format&fit=crop',
  },
  {
    num: '06',
    title: 'SaaS Products',
    body: 'DPDP · Hiring · Workforce — built around your reality, not a vendor demo.',
    bullets: ['Encrypted, audit-logged default', 'Bespoke modules built in', 'Same team writes the code'],
    cta: 'See what we are building',
    href: '/services/saas-products',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=85&auto=format&fit=crop',
  },
  {
    num: '07',
    title: 'Corporate Training',
    body: 'Designed against role outcomes. Measured against the job.',
    bullets: ['Outcome-calibrated', 'Kirkpatrick L3 + L4', 'LMS-ready'],
    cta: 'Train for outcomes',
    href: '/services/corporate-training',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=85&auto=format&fit=crop',
  },
];

function ServicesAlt() {
  return (
    <section className="relative py-20 lg:py-28 section-warm overflow-hidden grain-overlay">
      <div aria-hidden="true" className="ambient-orb ambient-orb-blue w-[600px] h-[600px] -top-40 right-[-15%] animate-orb-drift-slow" />
      <div aria-hidden="true" className="ambient-orb ambient-orb-amber w-[420px] h-[420px] bottom-[-10%] left-[-10%] animate-orb-drift opacity-25" />
      <span aria-hidden="true" className="section-num-bg top-8 left-4">04</span>
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
        <FadeUp>
          <p className="eyebrow-warm mb-5">// 00.04° — WHAT YOU CAN HIRE US FOR</p>
          <h2 className="font-display text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] text-white mb-4 max-w-[20ch]">
            <SplitReveal as="span" text="Seven outcomes." className="block" />
            <SplitReveal as="span" text="One team that owns them." className="block text-gradient-dual" stagger={0.06} delay={0.15} />
          </h2>
          <p className="text-[17px] leading-[1.65] text-white/70 max-w-[64ch]">
            Your problems do not live in one discipline. A breach is a legal problem, a security problem and a board problem on the same morning. You should not have to chase three vendors to answer it. Pick the engagement that fits — we wire the rest in.
          </p>
        </FadeUp>

        <div className="mt-14 space-y-14 lg:space-y-20">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const imageLeft = i % 2 === 0;
            return (
              <FadeUp key={s.href}>
                <article className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  {/* Image slot — parallax + tilt */}
                  <div className={`${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <Link to={s.href} className="group block">
                      <TiltCard className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink-base" max={5}>
                        <Parallax speed={0.15} className="absolute inset-0">
                          <img
                            src={s.image}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Parallax>
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#0B1426]/85 via-[#0B1426]/45 to-[#0B1426]/15" />
                        <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(circle at ${imageLeft ? '20%' : '80%'} 30%, rgba(33,150,243,0.32), transparent 55%)` }} />
                        <div aria-hidden="true" className="absolute -top-px -left-px w-20 h-20 border-l-2 border-t-2 border-accent-amber/55 group-hover:border-accent-amber transition-colors" />
                        <div aria-hidden="true" className="absolute -bottom-px -right-px w-20 h-20 border-r-2 border-b-2 border-accent-azure/55 group-hover:border-accent-azure transition-colors" />
                        <div className="absolute inset-0 flex flex-col items-start justify-between p-8 lg:p-10" data-section-color="dark">
                          <span className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: '#F47FC9' }}>/{s.num}</span>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                              <Icon size={28} strokeWidth={1.5} style={{ color: '#FFFFFF' }} />
                            </div>
                            <span className="font-display text-[clamp(24px,3vw,40px)] tracking-[-0.01em]" style={{ color: '#FFFFFF' }}>{s.title}</span>
                          </div>
                        </div>
                      </TiltCard>
                    </Link>
                  </div>

                  {/* Text slot */}
                  <div className={`${imageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                    <p className="font-mono text-[11px] tracking-[0.18em] text-accent-amber uppercase mb-4">{s.num} · {s.title}</p>
                    <h3 className="font-display text-[clamp(28px,3.4vw,48px)] leading-[1.05] tracking-[-0.01em] text-white mb-5">{s.title}.</h3>
                    <p className="text-[16px] leading-[1.7] text-white/75 mb-6">{s.body}</p>
                    <ul className="space-y-2.5 mb-7">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-[14.5px] leading-[1.55] text-white/85">
                          <span aria-hidden="true" className="w-5 h-5 mt-0.5 flex-shrink-0 rounded-full bg-accent-amber/15 border border-accent-amber/35 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link to={s.href} className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] uppercase text-accent-amber hover:text-white transition-colors">
                      {s.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ 00.05° PRODUCTS — Infosys-style centered intro + image-first cards ═══ */
const PRODUCTS = [
  {
    title: 'Adviserve Comply',
    body: 'Adviserve Comply maps your DPDP exposure, scores gaps under counsel, and hands your legal team an audit-ready evidence pack — every quarter, on schedule.',
    href: '/products/dpdp-compliance',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=85&auto=format&fit=crop',
  },
  {
    title: 'Adviserve Hire',
    body: 'Adviserve Hire screens candidates with explainable scoring and calibrates against role outcomes — so your shortlist holds up to a hiring-committee review.',
    href: '/products/ats-system',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&auto=format&fit=crop',
  },
  {
    title: 'Adviserve People',
    body: 'Adviserve People is a modular, API-first workforce platform for organisations whose HRMS has stopped fitting — encrypted, role-based, evidence-logged.',
    href: '/products/hris-portal',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85&auto=format&fit=crop',
  },
];

function ProductsBand() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-12">
        {/* Centered intro */}
        <FadeUp>
          <h2 className="font-display text-[clamp(34px,5vw,64px)] leading-[1.1] tracking-[-0.02em] text-center text-[#0B1426] max-w-[20ch] mx-auto mb-5">
            Crafting{' '}
            <span style={{
              background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>Audit-Ready</span>{' '}
            Software
          </h2>
          <p className="text-[15px] md:text-[17px] leading-[1.65] text-center text-[rgba(11,20,38,0.65)] max-w-[68ch] mx-auto mb-8">
            Whether you're closing a DPDP gap, defending a hiring decision, or replacing a legacy HRMS — your evidence trail stays tight and your reports stay board-ready.
          </p>
          <div className="flex justify-center">
            <MagneticPill strength={0.3}>
              <Link
                to="/products"
                className="pill-multicolor-fill group inline-flex items-center gap-2 h-12 px-6 rounded-full text-white text-[14px] font-medium tracking-[0.01em]"
              >
                <span>I'm Curious</span>
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </MagneticPill>
          </div>
        </FadeUp>

        {/* Static 3-col grid — GlassBlogCard inside gravitate TiltCard */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PRODUCTS.map((p, i) => (
            <FadeUp key={p.href} delay={0.05 * i}>
              <TiltCard
                effect="gravitate"
                tiltLimit={8}
                scale={1.03}
                perspective={1200}
                spotlight
                className="rounded-2xl h-full"
              >
                <GlassBlogCard
                  title={p.title}
                  excerpt={p.body}
                  image={p.image}
                  href={p.href}
                  author={{ name: 'Adviserve Practice', avatar: '/adviserve-logo.png' }}
                  date="In production"
                  readTime="3 min overview"
                  tags={['Product', p.title.replace(/^Adviserve\s+/, '')]}
                  className="max-w-none"
                />
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ 00.06° APPROACH — horizontal 5-stage strip ═══ */
const STAGES = [
  { num: '01', title: 'Diagnose', body: 'Map your systems, vendors and data flows. You sign before we build.' },
  { num: '02', title: 'Design',   body: 'Architecture, RACI, milestones, SLA — documented and approved.' },
  { num: '03', title: 'Build',    body: 'Phased rollout. Audit-ready evidence at every gate.' },
  { num: '04', title: 'Run',      body: 'Managed service from day one. SLAs, change control, runbooks.' },
  { num: '05', title: 'Transfer', body: 'Your team owns the work and the evidence trail.' },
];

function Approach() {
  return (
    <section id="how-we-work" className="relative py-24 lg:py-32 section-tinted overflow-hidden">
      <div aria-hidden="true" className="ambient-orb ambient-orb-cyan w-[460px] h-[460px] top-[8%] right-[-10%] animate-orb-drift opacity-30" />
      <div aria-hidden="true" className="ambient-orb ambient-orb-amber w-[340px] h-[340px] bottom-[-8%] left-[-6%] animate-orb-drift-slow opacity-20" />
      <span aria-hidden="true" className="section-num-bg top-10 left-6">06</span>
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
        <FadeUp>
          <p className="eyebrow-warm mb-5">// 00.06° — HOW YOU WILL WORK WITH US</p>
          <h2 className="font-display text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-[-0.02em] text-white mb-4 max-w-[20ch]">
            <span className="text-white">Five stages.</span><br /><span className="text-gradient-warm">No surprises in the invoice.</span>
          </h2>
          <p className="text-[17px] leading-[1.65] text-white/70 max-w-[58ch]">
            You sign off every gate. You keep the evidence. The work moves at your speed.
          </p>
        </FadeUp>

        <div className="mt-14 relative">
          {/* Connecting line */}
          <div aria-hidden="true" className="hidden lg:block absolute top-[42px] left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-accent-amber/40 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {STAGES.map((s, i) => (
              <FadeUp key={s.num} delay={Math.min(0.05 * i, 0.2)}>
                <div className="relative">
                  {/* Step circle */}
                  <div className="relative z-10 w-[84px] h-[84px] rounded-full surface-card border-2 border-accent-amber/35 flex items-center justify-center mx-auto lg:mx-0 mb-5 shadow-[0_8px_24px_-8px_rgba(212,170,104,0.35)]">
                    <span className="font-display text-[28px] tracking-[-0.02em] text-white">{s.num}</span>
                  </div>
                  <h3 className="font-display text-[20px] uppercase tracking-[0.02em] text-white mb-2 text-center lg:text-left">{s.title}</h3>
                  <p className="text-[13.5px] leading-[1.65] text-white/65 text-center lg:text-left">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ 00.07° INSIGHTS / ANCHORS — quick links band ═══ */
const ANCHORS = [
  { eyebrow: 'IF YOU PREFER TO READ FIRST', title: 'Three-paragraph answers to executive questions', body: 'Briefings on DPDP, hiring, IT and security — short enough to read between two meetings, long enough to act on.', href: '/insights' },
  { eyebrow: 'IF YOU OPERATE IN A REGULATED SECTOR', title: 'See how we engage in your industry', body: 'Banking, healthcare, manufacturing, SaaS, public sector. Same discipline, sector context already loaded.', href: '/industries' },
  { eyebrow: 'IF YOUR PROCUREMENT TEAM ASKS', title: 'Send them straight to our trust posture', body: 'ISO 9001, ISO/IEC 20000-1, ISO/IEC 27001. Sub-processor list, encryption posture, audit logs — all on one page.', href: '/trust' },
];

function AnchorsBand() {
  return (
    <section className="relative py-20 lg:py-24 section-elevated overflow-hidden">
      <div aria-hidden="true" className="ambient-orb ambient-orb-blue w-[420px] h-[420px] top-[-10%] left-[40%] animate-orb-drift opacity-20" />
      <span aria-hidden="true" className="section-num-bg bottom-4 right-6">07</span>
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ANCHORS.map((a, i) => (
            <FadeUp key={a.href} delay={0.05 * i}>
              <TiltCard className="h-full" max={4}>
                <Spotlight className="h-full rounded-[16px]">
                  <Link to={a.href} className="glass-card group flex flex-col p-7 h-full">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-accent-amber uppercase mb-4">{a.eyebrow}</p>
                    <h3 className="font-display text-[clamp(20px,2vw,26px)] leading-[1.15] tracking-[-0.01em] text-white group-hover:text-accent-azure transition-colors mb-3">{a.title}</h3>
                    <p className="text-[14px] leading-[1.65] text-white/70 mb-5 flex-1">{a.body}</p>
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-amber">
                      Read more <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </span>
                  </Link>
                </Spotlight>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ 00.08° CONNECT — dark CTA band ═══ */
function Connect({ title, description, ctaText, ctaLink, secondaryText, secondaryLink, reassurance }: { title: string; description: string; ctaText: string; ctaLink: string; secondaryText: string; secondaryLink: string; reassurance: string }) {
  return (
    // Background + watermark numeral + internal "// 00.08° — CONNECT" eyebrow
    // were intentionally removed so the parent FlowSection's studio-sheet
    // chrome (sheet 07/07) is the only count visible. No more bg conflict.
    <section className="relative">
      <div className="relative max-w-[1280px] mx-auto py-8 lg:py-12 text-[#0B1426]">
        <h2 className="font-display text-[clamp(44px,6vw,96px)] leading-[1.0] tracking-[-0.025em] text-balance max-w-[16ch] mb-6">
          {(() => {
            // Apply the brand gradient to the last 2 words of the (dynamic)
            // CMS title so the highlight pattern stays consistent across
            // cards without hardcoding a phrase here.
            const words = title.split(/\s+/);
            const cut = Math.max(words.length - 2, 1);
            const head = words.slice(0, cut).join(' ');
            const tail = words.slice(cut).join(' ');
            return (
              <>
                {head}{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>{tail}</span>
              </>
            );
          })()}
        </h2>
        <p className="text-[19px] leading-[1.55] text-[rgba(11,20,38,0.78)] max-w-[60ch] mb-10">{description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <AnimatedCTAButton href={ctaLink} label={ctaText} size="lg" />
          <AnimatedCTAButton href={secondaryLink} label={secondaryText} size="lg" variant="on-dark" />
        </div>
        <p className="mt-8 font-mono text-[11px] tracking-[0.16em] uppercase text-[rgba(11,20,38,0.65)]">{reassurance}</p>
      </div>
    </section>
  );
}

/* ═══ TOP STORIES — 2-up carousel w/ pagination dots ═══ */
interface Story { tag: string; title: string; href: string; image: string; }
const TOP_STORIES: Story[][] = [
  [
    { tag: 'CASE NOTE', title: 'How a six-week DPDP audit gave a fintech board its first clean evidence pack', href: '/insights/dpdp-evidence-pack',          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop' },
    { tag: 'BRIEFING',  title: 'From two weeks to two days: rewiring the vendor-questionnaire response loop', href: '/insights/vendor-questionnaire-response', image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1400&q=85&auto=format&fit=crop' },
  ],
  [
    { tag: 'CASE NOTE', title: 'CISO search + 90-day onboarding for a 400-person SaaS scale-up',                  href: '/case-studies/saas-ciso', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85&auto=format&fit=crop' },
    { tag: 'INSIGHT',   title: 'Why your IT estate has drifted — and what a 60-day rebuild actually looks like', href: '/insights/it-estate-rebuild', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=85&auto=format&fit=crop' },
  ],
];

function TopStories() {
  // Flatten the previously-paginated 2D story array and reshape each item
  // into the {quote, name, designation, src, href} schema CircularTestimonials
  // expects. `quote` carries the headline; `name` is the tag; `designation`
  // is a constant CTA hint; `href` makes the active card clickable.
  const items = TOP_STORIES.flat().map((s) => ({
    quote: s.title,
    name: s.tag,
    designation: 'Read more →',
    src: s.image,
    href: s.href,
  }));

  return (
    <section className="relative pt-0 pb-12 lg:pb-16">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="mb-10 lg:mb-12">
          <h2 className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] mb-3 text-[#0B1426]" style={{ fontWeight: 400 }}>
            Top{' '}
            <span style={{
              background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>Stories</span>
          </h2>
          <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto text-[rgba(11,20,38,0.66)]">
            Case notes and briefings from the practice. Trigger, scope, outcome — written by the people who shipped the work.
          </p>
        </div>
        <CircularTestimonials
          testimonials={items}
          autoplay
          colors={{
            name: '#1e9df1',
            designation: 'rgba(11,20,38,0.65)',
            testimony: '#0B1426',
            arrowBackground: '#0B1426',
            arrowForeground: '#FFFFFF',
            arrowHoverBackground: '#1e9df1',
          }}
          fontSizes={{
            name: '0.78rem',
            designation: '0.875rem',
            quote: '1.5rem',
          }}
        />
      </div>
    </section>
  );
}

/* ═══ PRACTITIONERS IN ACTION — dark band, 3 case-study tiles ═══ */
interface CaseTile { tag: string; title: string; image: string; href: string; }
const CASES: CaseTile[] = [
  { tag: 'CASE STUDY', title: 'DPDP audit + fix-list for a 1,200-person fintech',  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop', href: '/case-studies/fintech-dpdp' },
  { tag: 'CASE STUDY', title: 'CISO search + 90-day onboarding for a SaaS scale-up',  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop', href: '/case-studies/saas-ciso' },
  { tag: 'CASE STUDY', title: 'IT estate rebuild + managed service for a manufacturer', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&auto=format&fit=crop', href: '/case-studies/manufacturer-it-rebuild' },
];
function PractitionersInAction() {
  const [page, setPage] = useState(0);
  const total = 2;
  return (
    <section className="relative py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <FadeUp>
          <h2 className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.025em] mb-4 text-[#0B1426]" style={{ fontWeight: 400 }}>
            Practitioners{' '}
            <span style={{
              background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>in action</span>
          </h2>
          <p className="text-center text-[15px] leading-[1.7] max-w-[62ch] mx-auto mb-14 text-[rgba(11,20,38,0.66)]">
            Engagement notes from real client work. Trigger, scope, outcome — written by the practitioners who shipped the work.
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CASES.map((c, i) => (
            <FadeUp key={c.href} delay={0.06 * i}>
              <ShineBorder borderWidth={1.5} duration={6 + i * 0.4} radius="18px" innerBg="#11203A">
              <article className="group relative flex flex-col h-full overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-[900ms]" />
                  <span className="absolute top-4 left-4 inline-block px-2.5 py-1 rounded-full text-[10px] tracking-[0.20em] uppercase font-mono backdrop-blur-sm" style={{ background: 'rgba(11,20,38,0.55)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.35)' }}>
                    {c.tag}
                  </span>
                </div>
                <div className="flex flex-col gap-4 p-6 lg:p-7 flex-1">
                  <h3 className="font-display text-[17px] lg:text-[19px] leading-[1.3] tracking-[-0.005em]" style={{ color: '#FFFFFF', fontWeight: 400 }}>{c.title}</h3>
                  <Link
                    to={c.href}
                    className="inline-flex items-center gap-2 mt-auto h-10 px-5 rounded-full text-[12.5px] font-medium self-start transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    I'm Curious <ArrowUpRight size={13} />
                  </Link>
                </div>
              </article>
              </ShineBorder>
            </FadeUp>
          ))}
        </div>
        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-12">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setPage(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: page === i ? 28 : 8,
                backgroundColor: page === i ? '#00D4FF' : 'rgba(255,255,255,0.20)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ INDUSTRIES + SERVICES — light section, 4-col link grid ═══ */
const SERVICES_LINKS = [
  { label: 'Cybersecurity',          href: '/services/cybersecurity' },
  { label: 'Compliance & RegTech',   href: '/services/compliance-regtech' },
  { label: 'HR & Staffing',          href: '/services/hr-services' },
  { label: 'IT Consulting',          href: '/services/it-services' },
  { label: 'Legal Consulting',       href: '/services/legal-consulting' },
  { label: 'SaaS Products',          href: '/services/saas-products' },
  { label: 'Corporate Training',     href: '/services/corporate-training' },
];
const INDUSTRY_LINKS = [
  { label: 'Financial Services',     href: '/industries#bfsi' },
  { label: 'Manufacturing',          href: '/industries#manufacturing' },
  { label: 'IT, SaaS & Tech',        href: '/industries#it-saas' },
  { label: 'Real Estate',            href: '/industries#real-estate' },
  { label: 'Pharma & Life Sciences', href: '/industries#pharma' },
];
function IndustriesAndServices() {
  // Merge into flat 4-col grid — editorial link list, no labels
  const ALL_LINKS = [...SERVICES_LINKS, ...INDUSTRY_LINKS];
  return (
    <section className="relative bg-[#F4F6FB] py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <FadeUp>
          <h2 className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] mb-3" style={{ color: '#0B1426', fontWeight: 400 }}>
            Industries and Services
          </h2>
          <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto mb-14" style={{ color: 'rgba(11,20,38,0.65)' }}>
            One operating standard. Many operating contexts. Pick the practice or sector closest to your trigger.
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 lg:gap-x-12 gap-y-1 max-w-[1100px] mx-auto">
          {ALL_LINKS.map((s) => (
            <Link
              key={s.href}
              to={s.href}
              className="block py-3 text-[15px] border-b transition-colors"
              style={{ color: '#0B1426', borderColor: 'rgba(11,20,38,0.10)' }}
            >
              <span className="hover:underline underline-offset-4">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ RESEARCH & INSIGHTS — editorial bento, varied tile sizes ═══ */
interface ResearchCard {
  tag: string; title: string; date?: string; href: string;
  image?: string;
  variant: 'hero' | 'wide' | 'tall' | 'compact';
}
const RESEARCH: ResearchCard[] = [
  { tag: 'EVENT',    title: 'Adviserve at the DPDP Practitioners Summit 2026',                  date: '14 May 2026', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&q=85&auto=format&fit=crop', href: '/insights/dpdp-summit-2026', variant: 'hero' },
  { tag: 'INSIGHTS', title: 'How auditors actually read your DPDP evidence pack',               image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=85&auto=format&fit=crop', href: '/insights/auditors-evidence-pack', variant: 'wide' },
  { tag: 'REPORT',   title: 'IT Estate Drift Index — Q2 2026 readout',                          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop', href: '/insights/it-estate-drift-q2', variant: 'compact' },
  { tag: 'NEWS',     title: 'Adviserve incorporated to remove the vendor coordination tax',    date: '2 February 2026', href: '/about', variant: 'compact' },
  { tag: 'CASE NOTE', title: 'Quarterly DPDP evidence cycle — what passed audit',               date: '8 April 2026', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85&auto=format&fit=crop', href: '/insights/dpdp-evidence-cycle', variant: 'wide' },
  { tag: 'INDEX',     title: 'View all briefings, reports & announcements',                     href: '/insights', variant: 'compact' },
];
function ResearchInsights() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <FadeUp>
          <h2 className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.025em] mb-4" style={{ color: '#0B1426', fontWeight: 400 }}>
            Research, announcements &amp;{' '}
            <span style={{
              background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>thought leadership</span>
          </h2>
          <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto mb-14" style={{ color: 'rgba(11,20,38,0.65)' }}>
            Practitioner-written briefings, case notes, and announcements. Short enough to read between two meetings, sharp enough to act on.
          </p>
        </FadeUp>
        {/* InsightCarousel — single-card highlight pattern, replaces broken
            Swiper coverflow. Image-less entries fall back to the Adviserve
            logo on a drafting bone-paper plate. */}
        <InsightCarousel items={RESEARCH} />
      </div>
    </section>
  );
}

/* ═══ CAREERS BAND — dark, full-bleed image right, generous copy left ═══ */
function CareersBand() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Left — copy */}
        <div className="px-6 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-center">
          <h2 className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] mb-3 text-[#0B1426]" style={{ fontWeight: 400 }}>
            Build your{' '}
            <span style={{
              background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>future</span>{' '}
            at Adviserve.
          </h2>
          <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto mb-8 text-[rgba(11,20,38,0.66)]">
            Senior practitioners across cybersecurity, compliance, IT, hiring, legal, SaaS and training. You own the work, your name signs it, the board reads it. No bait-and-switch staffing.
          </p>
          <div className="flex justify-center">
            <Link to="/careers" className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-[14px] font-medium transition-colors text-white" style={{ background: '#1e9df1' }}>
              Explore Careers <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        {/* Right — image, full-bleed */}
        <div className="relative min-h-[320px] md:min-h-[480px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=85&auto=format&fit=crop"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: 'linear-gradient(90deg, #0B1426, transparent)' }} />
        </div>
      </div>
    </section>
  );
}

/* ═══ HOME ═══ */
export default function Home() {
  useReveal();
  const { content: cmsRemote, loading } = useSiteContent('home');
  const cmsClean = Object.fromEntries(
    Object.entries((cmsRemote as Record<string, string>) ?? {}).filter(([, v]) => v !== '' && v != null),
  );
  const cms: Record<string, string> = { ...DEFAULT_HOME_CMS, ...cmsClean };

  useEffect(() => {
    if (loading || motionOff()) return;
    const grad = document.querySelector('.cta-gradient');
    if (grad) gsap.to(grad, { backgroundPosition: '30% 0%', duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, [loading]);

  const rotatingWords = parseJsonContent<string[]>(cms.hero_scramble_phrases, []);
  const trustItems   = parseJsonContent<string[]>(cms.hero_trust_items, []);

  return (
    <main id="main">
      <SEOHead
        title={cms.meta_title}
        description={cms.meta_description}
        canonical={cms.canonical_url}
        ogImage={cms.og_image}
        structuredData={[
          generateOrganizationSchema({ business_name: 'Adviserve', website: 'https://adviserve.org.in', default_og_image: '/adviserve-logo.png' }),
          generateWebSiteSchema({ business_name: 'Adviserve', website: 'https://adviserve.org.in' }),
          generateBreadcrumbSchema([{ name: 'Home', url: 'https://adviserve.org.in/' }]),
        ]}
      />

      {loading ? (
        <HeroSkeleton />
      ) : (
        <Hero
          badgeText={cms.hero_badge_text}
          h1Line1={cms.hero_title}
          rotatingWords={rotatingWords}
          subtitle={cms.hero_subtitle}
          ctaText={cms.hero_cta_text}
          ctaLink={cms.hero_cta_link}
          secondaryText={cms.hero_secondary_text}
          secondaryLink={cms.hero_secondary_link}
          trustItems={trustItems}
          videoUrl={cms.hero_video_url || '/Hero-BG.mp4'}
        />
      )}

      {/*
        FlowArt scroll-pinning + rotate-on-enter restored per spec. Each
        FlowSection retains its unique blue tint so the page reads as a
        coherent blue family while the inner card visibly rotates into place
        as the reader scrolls.
      */}
      <FlowArt aria-label="Adviserve story stack">
        <FlowSection
          aria-label="Top stories"
          sheet={1}
          total={7}
          label="Top Stories"
          accent="#1e9df1"
          paper="#FBFDFF"
        >
          <TopStories />
        </FlowSection>
        <FlowSection
          aria-label="Products"
          sheet={2}
          total={7}
          label="Products"
          accent="#1a82d4"
          paper="#F4F9FF"
        >
          <ProductsBand />
        </FlowSection>
        <FlowSection
          aria-label="Practitioners in action"
          sheet={3}
          total={7}
          label="Practitioners"
          accent="#0F6BB3"
          paper="#F7F2E8"
        >
          <PractitionersInAction />
        </FlowSection>
        <FlowSection
          aria-label="Industries and services"
          sheet={4}
          total={7}
          label="Industries & Services"
          accent="#0F5594"
          paper="#EDF5FE"
        >
          <div className="w-full">
            <div className="max-w-[1280px] mx-auto mb-10">
              <h2 className="font-display text-center text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.02em] mb-3 text-[#0B1426]" style={{ fontWeight: 400 }}>
                Industries and{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #2196F3 0%, #D946A6 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>Services</span>
              </h2>
              <p className="text-center text-[15px] leading-[1.7] max-w-[64ch] mx-auto text-[rgba(11,20,38,0.66)]">
                One operating standard. Many operating contexts. Pick the practice or sector closest to your trigger.
              </p>
            </div>
            <FeatureCarousel />
          </div>
        </FlowSection>
        <FlowSection
          aria-label="Research and insights"
          sheet={5}
          total={7}
          label="Research & Insights"
          accent="#0E437A"
          paper="#F0EFFA"
        >
          <ResearchInsights />
        </FlowSection>
        <FlowSection
          aria-label="Careers"
          sheet={6}
          total={7}
          label="Careers"
          accent="#0C336B"
          paper="#E9F6F2"
        >
          <CareersBand />
        </FlowSection>
        <FlowSection
          aria-label="Connect"
          sheet={7}
          total={7}
          label="Connect"
          accent="#0B1426"
          paper="#FFFCF0"
        >
          <Connect
            title={cms.cta_title || 'Bring us the question you cannot answer yet.'}
            description={cms.cta_description || "Thirty minutes. We tell you which practice fits, what it costs and how soon we can start. No pitch deck."}
            ctaText={cms.cta_button_text || 'Talk to us'}
            ctaLink={cms.cta_button_link || '/consultation'}
            secondaryText={cms.cta_secondary_text || 'Take the DPDP self-assessment'}
            secondaryLink={cms.cta_secondary_link || '/dpdp-assessment'}
            reassurance={cms.cta_reassurance || 'Response in under one business day.'}
          />
        </FlowSection>
      </FlowArt>

      {/* Trusted-by attestation band — sits above the footer, native sparkle
          overlay on engineering blueprint paper. */}
      <TrustedBySection />
    </main>
  );
}

/* Keep-alive: legacy section components retained for CMS A/B + future restoration. */
export const _LegacySections = { SpotlightTiles, WhoWeAre, BentoCapabilities, StatsStrip, ServicesAlt, Approach, AnchorsBand, IndustriesAndServices };
