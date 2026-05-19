/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Border radius convention:
      // - Buttons/badges: rounded-lg
      // - Cards/inputs: rounded-xl or rounded-2xl
      // - Modals/hero cards: rounded-2xl
      // - Avatars/icons: rounded-full

      // Gray semantic mapping:
      // - Text: text-primary (#1a1a2e), text-secondary (#5a5a6e), text-muted (#9a9aae)
      // - Borders: border-default (#e5e5dd)
      // - Surfaces: surface (#F9F9F6), surface-muted (#f3f2ee)
      // - Dark bg: oc.dark (#111111), oc.gray (#222222)
      colors: {
        // ── Unified hero-video palette ──
        // Deep navy base + Infosys electric-blue + warm amber-gold + coral pop.
        // ONE dark theme site-wide. Cards = elevated navy. Pills = blue/amber.
        ink: {
          // White-default surfaces. Hero/dark sections use bg-ink-dark explicitly.
          base:    '#FFFFFF',
          raised:  '#FFFFFF',
          peak:    '#FFFFFF',
          glass:   '#F4F6FB',
          dark:    '#0B1426',  // explicit dark for hero/CTA bands
          darker:  '#070B17',
          primary: '#0B1426',
          soft:    '#16243C',
        },
        accent: {
          blue:        '#1e9df1',  // new theme primary
          blueHover:   '#1da1f2',
          azure:       '#1c9cf0',
          cyan:        '#1e9df1',
          cyanHover:   '#1da1f2',
          magenta:     '#1e9df1',
          magentaHover:'#1da1f2',
          amber:       '#1e9df1',
          amberHover:  '#1da1f2',
          coral:       '#1e9df1',
          DEFAULT:     'var(--accent)',
          foreground:  'var(--accent-foreground)',
        },
        primary:    { DEFAULT: 'var(--primary)',    foreground: 'var(--primary-foreground)' },
        secondary:  { DEFAULT: 'var(--secondary)',  foreground: 'var(--secondary-foreground)' },
        muted:      { DEFAULT: 'var(--muted)',      foreground: 'var(--muted-foreground)' },
        destructive:{ DEFAULT: 'var(--destructive)',foreground: 'var(--destructive-foreground)' },
        popover:    { DEFAULT: 'var(--popover)',    foreground: 'var(--popover-foreground)' },
        card:       { DEFAULT: 'var(--card)',       foreground: 'var(--card-foreground)' },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border:     'var(--border)',
        input:      'var(--input)',
        ring:       'var(--ring)',
        oxblood: { primary: '#1e9df1', hover: '#1da1f2' },
        bone:    { surface: 'var(--background)', muted: 'var(--card)' },
        slate:   { body: 'rgba(15,20,25,0.78)', muted: 'rgba(15,20,25,0.55)' },
        gold:    { muted: '#1e9df1' },
        hairline: 'var(--border)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        heading: ['"DM Serif Display"', 'Georgia', 'serif'],
        serif: ['Georgia', '"DM Serif Display"', 'Cambria', 'serif'],
        mono: ['Menlo', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marqueeReverse 38s linear infinite',
        'scroll-cue': 'scrollCue 1.8s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'count-up': 'countUp 0.4s ease-out forwards',
        'rotate-in': 'rotateIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'orb-drift': 'orbDrift 22s ease-in-out infinite',
        'orb-drift-slow': 'orbDrift 34s ease-in-out infinite',
        'border-shimmer': 'borderShimmer 6s linear infinite',
      },
      keyframes: {
        orbDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(40px, -30px) scale(1.05)' },
          '66%':      { transform: 'translate(-30px, 40px) scale(0.97)' },
        },
        borderShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        scrollCue: {
          '0%': { transform: 'translate(-50%, 0)', opacity: '0.9' },
          '50%': { transform: 'translate(-50%, 10px)', opacity: '0.4' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '0.9' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.8)' },
          '60%': { opacity: '1', transform: 'translateY(-4px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-12deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
      },
      backgroundImage: {
        'grid': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' fill='none' stroke='rgba(255,255,255,0.04)'><path d='M0 0H30M0 0V30'/></svg>\")",
      },
      backgroundSize: {
        '300%': '300%',
      },
      perspective: {
        '800': '800px',
        '1000': '1000px',
        '1200': '1200px',
        '1600': '1600px',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'card':         '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.55)',
        'card-hover':   '0 1px 0 rgba(255,255,255,0.08) inset, 0 24px 48px -16px rgba(0,0,0,0.65), 0 0 0 1px rgba(79,163,224,0.18)',
        'glow-blue':    '0 0 0 1px rgba(79,163,224,0.30), 0 12px 32px -8px rgba(25,118,210,0.35)',
        'glow-amber':   '0 0 0 1px rgba(217,70,166,0.30), 0 12px 32px -8px rgba(217,70,166,0.30)',
        'glow-magenta': '0 0 0 1px rgba(217,70,166,0.30), 0 12px 32px -8px rgba(217,70,166,0.30)',
      },
    },
  },
  plugins: [],
}
