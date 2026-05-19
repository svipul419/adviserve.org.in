import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import ParticlesComponent from "./particles-bg"

/* ─── Hero Props ─── */
interface HeroProps {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  ctaText?: string
  ctaLink?: string
  secondaryText?: string
  secondaryLink?: string
  badgeText?: string
}

/* ─── Hero with Adviserve content + Particles background ─── */
const Hero: React.FC<HeroProps> = ({ heroTitle, heroSubtitle, heroDescription, ctaText, ctaLink, secondaryText, secondaryLink, badgeText }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center pt-24 pb-20 px-6">
      <ParticlesComponent />

      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center">
        <p
          className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-accent-blue mb-8 flex items-center gap-3 transition-all duration-700 ${
 mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
 }`}
          style={{ transitionDelay: "120ms" }}
        >
          <span className="w-10 h-[1px] bg-accent-blue" />
          {badgeText || '// 00.01° — Integrated Advisory'}
          <span className="w-10 h-[1px] bg-accent-blue" />
        </p>

        <h1
          className={`font-heading text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-[-0.02em] text-black mb-8 max-w-5xl transition-all duration-700 ${
 mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
 }`}
          style={{ transitionDelay: "200ms" }}
        >
          {heroTitle || "India's integrated advisory. Under one roof."}
        </h1>

        {heroSubtitle && (
          <p
            className={`text-[16px] md:text-[18px] leading-[1.6] text-gray-500 max-w-2xl mb-6 transition-all duration-900 ${
 mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
 }`}
            style={{ transitionDelay: "300ms" }}
          >
            {heroSubtitle}
          </p>
        )}

        <p
          className={`text-[15px] md:text-[17px] leading-[1.75] text-gray-600 max-w-2xl mb-12 transition-all duration-900 ${
 mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
 }`}
          style={{ transitionDelay: "360ms" }}
        >
          {heroDescription || 'Recruitment, HR, legal, strategy, training, and IT — delivered by one team that shares files, clients, and context. Stop being the switchboard.'}
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 items-center transition-all duration-900 ${
 mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
 }`}
          style={{ transitionDelay: "480ms" }}
        >
          <Link
            to={ctaLink || "/book"}
            className="group relative inline-flex items-center gap-3 bg-accent-blue text-white text-[14px] font-medium rounded-full px-8 py-4 overflow-hidden hover:bg-accent-blue/10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.3)_50%,transparent_70%)] pointer-events-none" />
            <span className="relative z-10">{ctaText || "Book a free consultation"}</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to={secondaryLink || "/services"}
            className="group inline-flex items-center gap-2 text-[14px] font-medium text-black/70 hover:text-accent-blueHover transition-colors duration-300 px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 rounded-sm"
          >
            {secondaryText || 'See the six practices'}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
