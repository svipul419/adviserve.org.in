# Dark Premium Redesign — Design Specification

**Date:** 2026-04-03
**Status:** Approved
**Inspired by:** astralab.framer.website

---

## 1. Overview

Full visual redesign of the Adviserve public website from warm-white editorial to dark cosmic premium aesthetic. All CMS, admin panel, API layer, and functionality remain untouched. Only visual presentation changes.

### Decisions

| Decision | Choice |
|----------|--------|
| Background | Dark primary + lighter dark sections for depth |
| Accents | Teal `#6dd4c4` primary + cosmic purple `#6B4CE6` secondary (decorative) |
| Typography | Keep Bebas Neue (display) + Space Mono (labels) + DM Sans (body) |
| Animations | Enhanced depth — floating orbs, glow borders, shimmer, star field |
| Framework | Stay on Vite + React SPA (no Next.js migration) |
| Three.js | Yes — 3 locations: hero particles, CTA nebula, About 3D shapes |

---

## 2. Color System

### Backgrounds (3-tier dark)

| Token | Hex | Usage |
|-------|-----|-------|
| `dark-deep` | `#06080F` | Hero, CTA sections, header, footer |
| `dark-base` | `#0C1018` | Main page background |
| `dark-surface` | `#141820` | Cards, elevated surfaces |
| `dark-elevated` | `#1A1F2A` | Hover states, active cards, inputs |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#F0F0F5` | Headings |
| `text-secondary` | `#A0A0B8` | Body copy |
| `text-muted` | `#5A5A72` | Labels, captions, placeholders |

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-teal` | `#6dd4c4` | CTAs, links, active states, icons |
| `cosmic-purple` | `#6B4CE6` | Background glows, gradients, decorative orbs |
| `glow-teal` | `rgba(109,212,196,0.15)` | Card border hover, input focus rings |
| `glow-purple` | `rgba(107,76,230,0.10)` | Background gradient orbs |

### Borders

| Token | Hex | Usage |
|-------|-----|-------|
| `border-subtle` | `rgba(255,255,255,0.06)` | Card borders, dividers, section lines |
| `border-hover` | `rgba(109,212,196,0.25)` | Hover states on cards/buttons |

---

## 3. Component Specifications

### 3.1 Header

- Background: `dark-deep` + `backdrop-blur-xl`
- Border-bottom: `border-subtle`
- Logo + brand text: `text-primary`
- Nav links: `text-muted` default, `brand-teal` on hover/active
- CTA button: `bg-brand-teal text-dark-deep` (filled teal, dark text)
- Mobile menu: `dark-surface` panel with same link treatment
- Search icon: `text-muted`, hover `brand-teal`

### 3.2 Cards

**Service/Process cards (editorial):**
- Background: `dark-surface`
- Border: 1px `border-subtle`
- Border-radius: `0` (sharp editorial corners)
- Hover: border → `border-hover`, faint `box-shadow: 0 0 30px rgba(109,212,196,0.06)`
- Hover gradient overlay: `from-brand-teal/[0.03] to-transparent`

**Blog/Booking/FAQ cards (functional):**
- Background: `dark-surface`
- Border: 1px `border-subtle`
- Border-radius: `12px` (rounded-xl)
- Hover: border → `border-hover`, `translateY(-4px)`, glow shadow

### 3.3 Buttons

| Variant | Default | Hover |
|---------|---------|-------|
| Primary | `bg-brand-teal text-dark-deep font-mono uppercase` | `bg-brand-teal/90 shadow-glow-teal` |
| Secondary | `border border-subtle text-text-secondary` | `border-border-hover text-brand-teal` |
| Ghost | `text-text-muted` | `text-brand-teal` |

- Padding: `px-8 py-[15px]` (primary), `px-7 py-[15px]` (secondary)
- Font: `font-mono text-[13px] uppercase tracking-[0.12em]`
- Min height: `min-h-[52px]`

### 3.4 Inputs/Forms

- Background: `dark-elevated`
- Border: 1px `border-subtle`
- Text: `text-primary`
- Placeholder: `text-muted`
- Focus: `ring-2 ring-brand-teal/30 border-brand-teal/40`
- Border-radius: `8px`

### 3.5 Footer

- Background: `dark-deep`
- ISO seals: update SVG fills for dark palette (teal accents on deep background)
- Newsletter bar: `dark-surface` background
- Links: `text-muted` → hover `text-primary`
- Social icons: `text-muted` → hover `brand-teal`
- Copyright: `text-muted`

### 3.6 SearchModal

- Backdrop: `dark-deep/80 backdrop-blur-xl`
- Modal: `dark-surface` with `border-subtle`
- Input: `dark-elevated` background
- Results: hover `dark-elevated` with left teal border accent

### 3.7 CookieConsent

- Background: `dark-surface` with `border-subtle`
- Decline: secondary button style
- Accept: primary button style (teal filled)

### 3.8 WhatsApp Widget

- Keep green `#25D366`
- Pulse ring: `#25D366/30`
- No changes needed (green on dark looks great)

### 3.9 BackToTop

- Background: `dark-surface`
- Icon: `brand-teal`
- Hover: `bg-brand-teal text-dark-deep`
- Border: `border-subtle`

---

## 4. Decorative Layer

### 4.1 Floating Gradient Orbs

Reusable component `<FloatingOrbs />` placed on key pages.

- 2-3 blurred circles per page
- Colors: `cosmic-purple/8%` and `brand-teal/5%`
- Size: 400-700px diameter with `blur-[150px]`
- Animation: GSAP — slow drift (x/y movement over 20-40s loops), slight scale oscillation
- z-index: behind content, `pointer-events-none`

### 4.2 Star Field

CSS-only dot pattern applied as background:

```css
background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
background-size: 40px 40px;
```

- Applied to `dark-base` sections
- Subtle scroll parallax via GSAP (0.1-0.2x scroll speed)

### 4.3 Section Divider Glows

Horizontal gradient lines between major sections:

```css
background: linear-gradient(to right, transparent, rgba(109,212,196,0.15), transparent);
height: 1px;
```

### 4.4 Card Border Glow (hover)

On hover, cards get a subtle teal glow:

```css
box-shadow: 0 0 20px rgba(109,212,196,0.08), 0 4px 30px rgba(0,0,0,0.3);
border-color: rgba(109,212,196,0.25);
```

---

## 5. Three.js Elements

### 5.1 Homepage Hero — Particle Star Field

**Package:** `@react-three/fiber` + `@react-three/drei`

**Implementation:**
- Canvas covers full hero section (behind text, `z-index: 0`)
- 2000-3000 particles (small white dots, varying opacity 0.1-0.8)
- Particles distributed in a 3D volume (x: -50 to 50, y: -30 to 30, z: -50 to 50)
- Slow constant drift (z-axis movement creates depth illusion)
- Mouse tracking: particles shift slightly based on cursor position (parallax)
- Depth-of-field: particles farther from camera are dimmer and smaller
- Performance: `PointsMaterial` (GPU instanced, very efficient)
- Mobile: disable Three.js, fall back to CSS star field dot pattern

**Lazy loading:**
```tsx
const HeroParticles = React.lazy(() => import('./HeroParticles'));
// Only render on desktop
{!isMobile && <Suspense fallback={null}><HeroParticles /></Suspense>}
```

### 5.2 Homepage CTA — Nebula Shader

**Implementation:**
- Small Three.js canvas behind the CTA text
- Noise-based fragment shader creating a slowly morphing gradient
- Colors: `cosmic-purple` → `brand-teal` blend
- Speed: very slow morph (8-12s per cycle)
- Opacity: 15-20% (subtle, not overpowering text)
- Mobile: fall back to CSS `radial-gradient` animation

### 5.3 About Page Hero — 3D Wireframe Shapes

**Implementation:**
- 2-3 floating wireframe geometries (icosahedron, torus, octahedron)
- Material: `MeshBasicMaterial` wireframe, `brand-teal` color at 15-20% opacity
- Animation: slow rotation (different axes per shape), gentle float
- Positioned as decorative elements around the hero text
- Mouse parallax: shapes shift position based on cursor
- Mobile: hide entirely, use CSS geometric shapes instead

### Performance Safeguards

- Dynamic import: Three.js bundle only loads on pages that use it
- Device detection: skip Three.js on mobile (`window.innerWidth < 768` or `navigator.hardwareConcurrency < 4`)
- `frameloop="demand"` on R3F Canvas when not animating
- Disposal: proper cleanup on unmount via R3F's automatic disposal

---

## 6. Page-by-Page Changes

### 6.1 Homepage

| Section | Background | Key Changes |
|---------|-----------|-------------|
| Hero | `dark-deep` + Three.js particles | Orbs behind text, particle field, larger CTAs |
| Marquee | `dark-surface` | Teal dots, muted text on dark |
| Stats | `dark-base` + star field | Cards on `dark-surface`, number bounce |
| Services | `dark-base` | Row hover: teal gradient sweep on dark |
| Process | `dark-surface` | Cards on `dark-elevated`, teal top border |
| Industries | `dark-base` | Floating cards with glow hover |
| Testimonials | `dark-deep` (white bg section → dark) | Quote in `text-primary`, stars in `brand-teal` |
| Why Choose | `dark-base` | Pinned heading, cards on `dark-surface` |
| CTA | `dark-deep` + Three.js nebula | Cosmic glow behind text |

### 6.2 Services Pages

- Hero: `dark-deep` with orbs
- Service list: `dark-base`, row hover with teal sweep
- Service detail: `dark-base`, content card on `dark-surface`
- Sidebar CTA: `dark-surface` with teal button

### 6.3 Blog

- Hero: `dark-deep`
- Search/filter bar: `dark-surface`
- Blog cards: `dark-surface`, `rounded-xl`, hover glow + lift
- Blog post: content area on `dark-surface` card, prose colors updated for dark

### 6.4 Contact

- Hero: `dark-deep`
- Form: `dark-surface` card, dark inputs
- Sidebar: `dark-surface` cards
- Booking card: `brand-teal/5%` background on dark

### 6.5 About

- Hero: `dark-deep` + Three.js wireframe shapes
- Story: `dark-base`, split layout
- Approach: `dark-surface` (elevated)
- Mission/Values: `dark-base` / `dark-surface` alternating
- CTA: `dark-deep` with glow

### 6.6 Book Consultation

- Background: `dark-base`
- Calendar: `dark-surface` card
- Time slots: `dark-elevated` buttons, selected = `brand-teal`
- Form: `dark-surface` card with dark inputs
- Progress stepper: teal filled steps on dark

### 6.7 FAQ, Team, Careers, Case Studies, Newsletter Archive

- Same pattern: `dark-deep` hero, `dark-base` body, `dark-surface` cards
- All text/border colors follow the token system
- Accordion borders: `border-subtle`, active: `border-hover`

---

## 7. Files to Modify

### Config/Tokens (modify)
- `tailwind.config.js` — add dark color tokens
- `src/index.css` — update body background, scrollbar, prose, selection colors

### Shared Components (modify)
- `src/components/Header.tsx`
- `src/components/Footer.tsx` (including ISO seals)
- `src/components/SearchModal.tsx`
- `src/components/CookieConsent.tsx`
- `src/components/BackToTop.tsx`
- `src/components/WhatsAppWidget.tsx`
- `src/components/CustomCursor.tsx`
- `src/components/animations.tsx`

### New Components (create)
- `src/components/FloatingOrbs.tsx` — reusable gradient orb decorations
- `src/components/GlowDivider.tsx` — horizontal gradient section divider
- `src/components/HeroParticles.tsx` — Three.js particle star field
- `src/components/NebulaBackground.tsx` — Three.js CTA nebula shader
- `src/components/WireframeShapes.tsx` — Three.js About page 3D shapes

### Pages (modify all public pages)
- `src/pages/Home.tsx` + all `src/pages/home/*.tsx`
- `src/pages/Services.tsx`
- `src/pages/ServiceCategory.tsx`
- `src/pages/ServiceDetail.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/Contact.tsx`
- `src/pages/About.tsx`
- `src/pages/BookConsultation.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/Team.tsx`
- `src/pages/Careers.tsx`
- `src/pages/CaseStudies.tsx`
- `src/pages/NewsletterArchive.tsx`
- `src/pages/LegalDocument.tsx`
- `src/pages/NotFound.tsx`
- `src/pages/Unsubscribe.tsx`

### Lib (modify)
- `src/lib/themeClasses.ts` — update dark theme tokens
- `src/lib/defaults.ts` — no change (content, not visual)

### New Dependencies
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Helpers (Points, shaders, etc.)
- `three` — Three.js core

---

## 8. What Does NOT Change

- All API endpoints (`api/*.ts`)
- Admin panel (all `src/pages/admin/*.tsx`)
- Auth system (`AuthContext`, `_auth.ts`)
- Database schema
- `adminDb.ts`, `api.ts`, `supabase.ts`
- CMS content/settings (content comes from DB, styling is separate)
- `vercel.json` (deployment config)
- `package.json` scripts
- All hooks except visual ones
