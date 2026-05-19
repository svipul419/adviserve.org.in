# Site Map — Design (UI/UX + Components + Animations + Sizing)

Companion to `sitemap.md`. This file documents every visual + motion decision per section, with the exact component, Tailwind classes, dimensions, and animation parameters used.

Generated: 2026-05-13.

---

## 0. Tech stack (motion + UI libraries)

| Library                | Used for                                               |
|------------------------|--------------------------------------------------------|
| **Tailwind CSS**       | All layout, typography, color, spacing                 |
| **GSAP** + **ScrollTrigger** | Reveal animations, parallax, scroll-driven effects |
| **anime.js**           | Hero text staggered intro (Home)                       |
| **framer-motion**      | RotatingText, MagneticButton, HoverScale, AnimatePresence |
| **Lucide React**       | All icons (`size={14}` to `size={28}`)                 |
| **Lenis** (smooth scroll) | Page scroll smoothing (`html.lenis` class set globally) |
| **React Router v6**    | Routing                                                |
| **TanStack Query**     | API caching for CMS content                            |

---

## 1. Design tokens

### 1.1 Color palette (`tailwind.config.js`)

| Token              | Hex        | Use                                              |
|--------------------|------------|--------------------------------------------------|
| `brand.teal`       | `#6dd4c4`  | Primary accent, CTAs, hover states               |
| `brand.lightTeal`  | `#8fe8db`  | Soft accent                                      |
| `brand.ink`        | `#0B1220`  | Primary dark text/bg                             |
| `brand.cream`      | `#EFEEE7`  | On-dark button bg, neutral surface               |
| `brand.paper`      | `#FAFBFD`  | Page-light surface                               |
| `brand.deep`       | `#0A4AAD`  | Blue accent                                      |
| `brand.slate`      | `#47526B`  | Muted text                                       |
| `brand.line`       | `#E5E9F0`  | Hairline borders                                 |
| `surface.DEFAULT`  | `#F9F9F6`  | Page background                                  |
| `surface.muted`    | `#f3f2ee`  | Section alt bg                                   |
| `surface.card`     | `#ffffff`  | Card bg                                          |
| `text-primary`     | `#1a1a2e`  | Body heading                                     |
| `text-secondary`   | `#5a5a6e`  | Body copy                                        |
| `text-muted`       | `#9a9aae`  | Meta, captions                                   |
| `border-default`   | `#e5e5dd`  | Card borders                                     |
| `oc.dark`          | `#111111`  | Hero / dark section bg (set via `data-section-color="dark"`) |
| `oc.gray`          | `#222222`  | Dark surface variant                             |
| `oc.border`        | `#333333`  | Dark borders                                     |

### 1.2 Typography (all Inter)

| Class           | Family / size                                | Use                                  |
|-----------------|----------------------------------------------|--------------------------------------|
| `font-display`  | Inter, `clamp(40px,6vw,76px)` on heroes      | H1 hero                              |
| `font-heading`  | Inter, `clamp(32px,4vw,56px)` on H2          | Section headings                     |
| `font-sans`     | Inter, 13–18px body                          | Default copy                         |
| `font-mono`     | Space Mono, 10–12px tracking 0.14–0.2em      | Eyebrows, section numbers, badges    |
| `font-serif`    | Georgia                                      | Rare emphasis                        |

Hero H1: `text-[clamp(40px,6vw,76px)] leading-[1.05]`.
Hero subtitle: `text-base md:text-lg`, `text-white/70`.
Section H2: `text-[clamp(32px,4vw,56px)] leading-[1.05]`.
Card title: `text-[22px] tracking-[0.04em] uppercase`.
Card body: `text-[13px] leading-relaxed`.
Eyebrow: `font-mono text-[10px] uppercase tracking-[0.2em]`.

### 1.3 Spacing rhythm

| Section vertical padding | Class                  |
|--------------------------|------------------------|
| Compact section          | `py-16 lg:py-20`       |
| Standard section         | `py-24 lg:py-32`       |
| Hero (top-pad for nav)   | `pt-[120px] pb-20 md:pb-28` |
| Card padding             | `p-6` (compact) / `p-8` (medium) |
| Grid gaps                | `gap-6` (cards) / `gap-12` (sections) |

Page width container: `max-w-[1280px]` or `max-w-7xl` (1280px) mx-auto, `px-6 sm:px-12`.

### 1.4 Border radius convention

| Element                | Class             |
|------------------------|-------------------|
| Buttons (pill default) | `rounded-[100px]` (morphs to `rounded-[12px]` on hover) |
| Card                   | `rounded-xl` (12px) or `rounded-2xl` (16px) |
| Modal / hero card      | `rounded-2xl`     |
| Avatar / icon chip     | `rounded-full`    |

### 1.5 Shadow system

| Token              | Shadow                                                                |
|--------------------|-----------------------------------------------------------------------|
| `shadow-card`      | `0 1px 3px rgba(0,0,0,.08)` — resting card                            |
| `shadow-cardHover` | `0 10px 30px rgba(0,0,0,.12)` — card hover                            |
| `shadow-premium`   | `0 4px 16px -4px rgba(0,0,0,.5), 0 8px 32px -8px rgba(0,0,0,.3)`      |
| `shadow-glow-teal` | `0 0 20px rgba(109,212,196,.3), 0 0 40px rgba(109,212,196,.1)`        |

### 1.6 Tailwind keyframe library (registered, opt-in)

`fade-up`, `fade-in`, `slide-right`, `scale-in`, `float`, `float-slow`, `pulse-soft`, `shimmer`, `marquee`, `marquee-reverse`, `scroll-cue`, `spin-slow`, `gradient`, `slide-up`, `slide-down`, `slide-in-left`, `slide-in-right`, `bounce-soft`, `glow-pulse`, `glow-teal`, `text-shimmer`, `count-up`, `rotate-in`.

Default ease: `cubic-bezier(0.16, 1, 0.3, 1)` (premium overshoot) for slide-* variants, `power2.out` / `power3.out` for GSAP, `[0.23,1,0.32,1]` for CTA button.

---

## 2. Reusable animation primitives (`src/components/animations.tsx`)

| Component         | Engine | Trigger     | Defaults                                | Effect                          |
|-------------------|--------|-------------|-----------------------------------------|---------------------------------|
| `FadeUp`          | GSAP   | ScrollTrigger top 88% | `y:50, rotateX:-3, duration:0.7, ease:power2.out` | Element fades + slides up + slight perspective tilt |
| `FadeIn`          | GSAP   | ScrollTrigger top 88% | `duration:0.5, ease:power2.out`         | Opacity 0→1                     |
| `StaggerContainer`+ `StaggerItem` | GSAP | ScrollTrigger top 85% | `stagger:0.08, y:30, rotateX:-2`        | Children fade up sequentially   |
| `TextReveal`      | GSAP   | ScrollTrigger top 88% | per-word: `y:110%→0, stagger:0.04`      | Word-by-word reveal             |
| `SlideIn`         | GSAP   | ScrollTrigger top 88% | `x:±60, duration:0.6`                   | Slides in from left or right    |
| `ScaleIn`         | GSAP   | ScrollTrigger top 88% | `scale:0.9→1, duration:0.5`             | Scale-up reveal                 |
| `Parallax`        | GSAP   | scrub (continuous)    | `y:speed*80`                             | Continuous parallax tied to scroll position |
| `AnimatedCounter` | GSAP   | ScrollTrigger top 85% | `duration:1.2, ease:power2.out`         | Number counts up to target      |
| `HoverScale`      | framer-motion | hover/tap     | `scale:1.03, tap:0.98`                   | Spring scale                    |
| `MagneticButton`  | vanilla (transform) | mousemove | `translate × 0.15`                       | Cursor-magnetic offset          |

All primitives respect `prefers-reduced-motion: reduce` and short-circuit to a visible/no-motion state.

`useReveal` (hook in `src/components/designer/useReveal.ts`) attaches IntersectionObserver to `.reveal` class elements and toggles a visible state for CSS-only reveal sections.

---

## 3. Global / chrome components

### 3.1 Adaptive Navigation Pill — `src/components/ui/3d-adaptive-navigation-pill.tsx`

- Fixed centered pill at top, `top-6`.
- Pill height: `~52px`; width: auto, fits 7-nav-item layout.
- Logo: `<img className="h-9 w-auto">` absolutely positioned `left-8`, vertically centered.
- Logo color filter: `brightness(0) invert(1)` when over `[data-section-color="dark"]`.
- Active section detector: scans for `[data-section-color]` elements at `y=36px` (pill's vertical center) via `IntersectionObserver` + `MutationObserver` re-scan on DOM mutation.
- Hover: each pill item has subtle background highlight; active item has teal-tinted bg.
- Mobile: collapses to hamburger via `src/components/ui/mobile-nav.tsx`.

### 3.2 Footer — `src/components/Footer.tsx`

- Pre-footer CTA banner: GSAP fade-from-y at `top 75%`; magnetic primary button (`gsap.to … translate ×0.25`).
- Brand band, 4-column link grid, newsletter form, address strip, copyright.
- All copy CMS-driven with `||` fallbacks.

### 3.3 Cookie Consent — `src/components/CookieConsent.tsx`

- Bottom-left toast, **non-blocking** (was full-width before fix), `sm:max-w-sm`.
- Class: `fixed bottom-4 left-4 right-4 sm:right-auto z-40 animate-in slide-in-from-bottom`.
- Inner: `bg-white/95 backdrop-blur border rounded-xl p-4 shadow-2xl`.
- Two buttons: Decline (ghost) + Accept (`bg-brand-teal text-black`).

### 3.4 WhatsApp widget — `src/components/WhatsAppWidget.tsx`

- Bottom-right floating button (`fixed bottom-6 right-6`), green CTA, hover-pulse.

### 3.5 BackToTop — `src/components/BackToTop.tsx`

- Bottom-right above WhatsApp; fades in after `window.scrollY > 600`.

### 3.6 AnimatedCTAButton — `src/components/ui/AnimatedCTAButton.tsx` (FlowButton)

Three variants × three sizes.

| Variant     | Default bg / text          | Hover (circle fills, text translates +12px) |
|-------------|-----------------------------|----------------------------------------------|
| `primary`   | `bg-brand-teal text-brand-ink` | Circle `#0B1220` fills → text `brand-cream` |
| `secondary` | `bg-transparent border-brand-ink` | Same circle, same text shift                 |
| `on-dark`   | `bg-brand-cream text-brand-ink` | Same circle, same text shift                 |

Sizes:
- `sm`: `px-5 py-2 text-sm` (~32px tall)
- `md`: `px-7 py-3 text-[15px]` (~44px tall)
- `lg`: `px-9 py-4 text-base` (~52px tall)

Motion:
- Circle: `220×220px` expanding from `16×16px`, `duration 800ms`, `cubic-bezier(0.23,1,0.32,1)`.
- Border-radius morph: `100px → 12px` on hover, `600ms`.
- Right arrow exits to `right:-25%`, left arrow enters from `left:-25% → 12px`, `600ms`.
- `min-h-[44px]` for touch-safe tapping.

### 3.7 RotatingText — `src/components/ui/RotatingText.tsx`

Used in Home hero for rotating phrases.
- framer-motion `AnimatePresence` swap.
- Per-word transition: `y:-20→0, opacity:0→1, filter:blur(8px)→blur(0px)`, duration `0.4s`, ease `[0,0,0.58,1]`.
- Container width spring: `stiffness:150, damping:15, mass:1.2`.
- Default `interval={2400ms}`.

### 3.8 SEOHead — `src/components/SEOHead.tsx`

Wraps `react-helmet-async`. Each page passes `title`, `description`, `canonical`, `ogImage`, `structuredData[]`.

---

## 4. Page-by-page section breakdown

### 4.1 Home (`src/pages/Home.tsx`)

#### Hero (`00.01°`) — `<section data-section-color="dark">`
- Container: `min-h-screen` flex column centered, `max-w-[1280px] mx-auto px-6`, `pt-24 pb-16`.
- Background:
  - **CrossfadeVideoLoop** — two `<video>` tags swapped via `requestAnimationFrame` near end-of-clip; opacity tween `1.2s ease-in-out`. Source: `/Hero-BG.mp4`.
  - 3 stacked dark gradient overlays (radial + linear) for legibility.
- Content stack (centered, GSAP-staggered via anime.timeline; class `.hero-line`):
  1. Eyebrow badge: green pulse dot (`bg-brand-teal` + `animate-ping`) + small text ~12px tracking 0.14em.
  2. H1: two lines, `clamp(40px,6vw,76px)`, `leading-[1.05]`, `text-white`. Second line uses `<RotatingText>` for the closing word.
  3. Credibility line: `text-base md:text-lg text-white/60` with mid-dots between phrases.
  4. CTAs: primary (`bg-brand-teal`) + secondary (`on-dark`), size `lg`, gap-3.
  5. DPDP pill nudge: rounded-full, `text-brand-teal/70`, hover-border emphasis.
  6. Trust strip: 4 items separated by tiny dots, `text-[13px] text-white/50`.
- Intro animation: `anime.timeline … translateY:[24,0], opacity:[0,1], filter:blur(8px→0), duration 520ms, stagger 120ms`.

#### Practices (`00.03°`) — `<TextParallaxContent>`
- Section bg: full-bleed dark image `/practices-bg.png`, `bg-attachment: fixed`.
- Header (with eyebrow + heading) lives in a `max-w-[1280px]` container above the parallax cards.
- Each practice is a parallax row with image + heading + description + outcome stats + CTA link.
- Cards alternate `reverse: true/false` for left/right image layout.

#### Framing (`00.02°`)
- White bg, hairline top border.
- Eyebrow + section number badge.
- H2 split on `\n`: first line dark, second line `text-gradient` (linear teal/blue).
- Two body paragraphs, max-w-3xl, `text-lg leading-relaxed text-brand-ink/75`.
- CTA inline link in mono small.

#### Products (`00.04°`) — `ProductsSection`
- 4-card grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`.
- Card class: `flex flex-col gap-4 p-6 rounded-xl border bg-white/60 hover:bg-white hover:shadow-md`.
- Icon box: `w-14 h-14 rounded-xl bg-brand-teal/8`, icon `size={28}`.
- Badge: `FREE TIER` or `PAID`, mono 10px, rounded-full pill.
- "See all products and pricing" inline link below grid.

#### Testimonials (`00.05°`) — `home/TestimonialsSection.tsx`
- Bg: `bg-gray-50`, padding `py-24 lg:py-32`, `perspective: 1200px`.
- Single quote card, large pull-quote, 5-star row, auto-advancing every ~6s.
- Hover pauses rotation.
- 3D card swap: tilt + opacity via GSAP timeline.

#### FAQ (`00.06°`)
- White bg.
- Top 3 questions only (`items.slice(0,3)`).
- Each row: `py-5 border-b divide-y divide-brand-line`; toggle reveals answer.
- "See all 8 questions →" link to `/faq`.

#### Final CTA (`00.07°`) — `<FinalCTA>`
- Full-bleed brand gradient bg with two radial overlay highlights.
- H2: `clamp(36px,5vw,72px) leading-[1.02] text-balance`.
- 2 primary CTAs + reassurance line "Response in under 24 business hours."

#### LogoCloud (default hidden)
- Marquee row of partner logos when enabled.

---

### 4.2 About (`src/pages/About.tsx`)

| Section | Component / pattern | Sizing |
|---------|---------------------|--------|
| Hero (`00.03°`) | Dark section, `<ASCIIText>` decryption animation for H1, FadeUp for subtitle | `pt-[120px] pb-24` |
| Our Story | Two-column intro, paragraph stack | `py-24 max-w-3xl` |
| Approach (4 steps) | Numbered grid, 2×2 on desktop, stacked mobile | `gap-12` between steps |
| Mission | Single highlight card + image | `rounded-2xl p-10` |
| Framework section (CMS) | 4-card grid (process steps) | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` |
| Kickoff timeline (CMS) | Horizontal node timeline | GSAP staggered fade |
| Core Values | 4-card grid with colored icons | `p-8 rounded-xl border` |
| Final CTA | FinalCTA pattern (gradient + 2 buttons) | `py-24` |

Animations: every block wrapped in `<FadeUp>` with delay 0–300ms.

---

### 4.3 Services (`src/pages/Services.tsx`)

| Section | Layout | Sizing |
|---------|--------|--------|
| Hero (`00.02°`) | Dark, large headline + subtitle | `pt-[120px] pb-24` |
| Search bar | Floating white card, `-mt-7 z-20`, `rounded-2xl p-4` | `max-w-4xl` |
| Service rows (6) | Alternating image-left / image-right rows | `gap-12` per row |
| Row card | Image `w-full aspect-[4/3]` + text column | `p-8` |
| Service-detail link button | Arrow CTA, mono label | `size={20}` arrow icon |
| Final CTA | FinalCTA | `py-24` |

Reveal: each row uses `FadeUp` with stagger delay `i*0.1`.

---

### 4.4 Products (`src/pages/Products.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Dark hero, eyebrow + H1 + subtitle |
| Product grid | `grid-cols-1 md:grid-cols-3 gap-6` |
| Product card | `card-magnetic card-glow-border p-8`, hover gradient sweep |
| Card icon | `w-12 h-12 border border-default` square |
| Card title | `text-[22px] uppercase tracking-[0.04em]` |
| Card body | `text-[13px] leading-relaxed` |
| Card CTA | "Learn more →" mono link |

Hover: `card-magnetic` adds GSAP cursor-tracked tilt; `card-glow-border` lights up teal border on hover.

---

### 4.5 ProductDetail (`src/pages/ProductDetail.tsx`)

Hero block, feature grid (3-col), pricing card (`pricing-card.tsx`), screenshots gallery, CTA banner.
Pricing card: `rounded-2xl p-8 shadow-premium`, accent border on featured tier.

---

### 4.6 Blog (`src/pages/Blog.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Dark hero with breadcrumb |
| Search + Category filter bar | `rounded-2xl p-4`, `grid` of filter pills |
| Featured post | Full-width card, `rounded-2xl`, image left + text right |
| Post grid | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Post card | `bg-white rounded-xl border p-6`, image top, meta row (category + date + read time), title, excerpt |
| Pagination | Compact arrow buttons centered |

Reveal: each card `FadeUp delay={i*0.05}`.

---

### 4.7 BlogPost (`src/pages/BlogPost.tsx`)

Article shell: max-w-3xl reading column, prose styling, hero image `aspect-[16/9] rounded-2xl`, share row, related posts grid.

---

### 4.8 Case Studies (`src/pages/CaseStudies.tsx`)

| Section | Layout |
|---------|--------|
| Hero (`00.05°`) | Subtle light hero, eyebrow + H1 + subtitle | 
| Case grid | `grid-cols-1 md:grid-cols-2 gap-6` |
| Case card | `p-8 rounded-xl border`, industry badge top, title, body, practices chip row |
| Final CTA | Dark CTA banner |

---

### 4.9 CaseStudyDetail

Two-column hero (text + metrics chips), body section with H2-H3 prose, metric block (3 cards), client quote pull-out, related cases.

---

### 4.10 Team (`src/pages/Team.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Dark hero, breadcrumb + H1 + subtitle |
| Founder spotlight | 2-column: photo (300×380 → 340×420), text right. GSAP `x:-60 ↔ x:+60` slide-in. |
| Team grid | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| Member card | `team-card p-6 rounded-xl border`, avatar/initials box `aspect-square`, name + role + 2-line bio |
| Final CTA | Standard FinalCTA |

Card stagger: GSAP `y:60, scale:0.92, opacity:0 → 0, 1, 1`, stagger 0.1s.

---

### 4.11 Careers (`src/pages/Careers.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Dark hero, uppercase display H1, breadcrumb |
| Why Adviserve | Eyebrow + H2 "MORE THAN JUST A JOB", subtitle |
| Benefits grid | 4-card grid, icon + title + body |
| Culture grid | 3-card grid |
| Open positions | List of position cards, each opens modal |
| Apply modal | Centered modal, `rounded-2xl`, file upload + fields |
| Final CTA | "Don't see your role?" with secondary speculative-apply link |

---

### 4.12 Contact (`src/pages/Contact.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Dark hero, H1 + subtitle |
| Form + Sidebar | 2-column grid `grid-cols-1 lg:grid-cols-3`, form spans 2 cols |
| Form fields | Name, email, phone, company, service select, message; `rounded-lg border-default p-3` |
| Submit | Primary CTA full-width on mobile |
| Sidebar card | `bg-white rounded-2xl p-8`, contact info, business hours, schedule CTA |
| FAQ accordion | Below form, top-6 questions |

Form submit: optimistic state → success card replaces form (`rounded-2xl bg-brand-teal/10`).

---

### 4.13 Book (`src/pages/BookConsultation.tsx`)

Step indicator (3 steps: Date → Time → Details), calendar grid (7×5), time-slot pill row, form panel right.

Calendar cell: `w-10 h-10 rounded-lg`, selected `bg-brand-teal text-brand-ink`, today ring.

---

### 4.14 FAQ (`src/pages/FAQ.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Dark hero, H1 + subtitle |
| Search + category filter | Floating white card `-mt-7 z-20 rounded-2xl p-4` |
| Category sections | Each: small left bar + uppercase label + accordion list |
| Accordion row | `py-5 border-b`, click toggles answer with smooth height |
| Final CTA | Standard |

Hero GSAP: H1 `scale:0.5, y:80, opacity:0 → 1, 0, 1`, duration 1.2s, delay 0.2s.

---

### 4.15 Testimonials (`src/pages/Testimonials.tsx`)

Title + 3-column grid of quote cards, `p-6 rounded-xl border-default bg-white`. Quote in italic-style block, name + company below.

---

### 4.16 Newsletter Archive (`src/pages/NewsletterArchive.tsx`)

| Section | Layout |
|---------|--------|
| Hero | Light hero, uppercase H1 "NEWSLETTER ARCHIVE" |
| Subscribe inline | Optional |
| Issue grid | When empty → centered `<Mail>` icon card "No newsletters published yet" |
| Issue card (when populated) | `p-6 rounded-xl border`, date + title + excerpt + read CTA |

---

### 4.17 DPDP Assessment (`src/pages/DPDPAssessment.tsx`)

Multi-step quiz UI: progress bar top, question card `rounded-2xl p-8`, radio options `flex flex-col gap-3` each option `border rounded-lg p-4 hover:border-brand-teal`. Result page: score chart + remediation list.

---

### 4.18 Legal Documents (`/privacy`, `/terms`, `/legal/:slug`)

Single reading column `max-w-3xl prose`, breadcrumb top, last-updated stamp, H2/H3 sections, callout blocks.

---

## 5. Card sizing matrix

| Card type           | Width                                 | Padding | Border / radius              | Shadow                  |
|---------------------|---------------------------------------|---------|------------------------------|-------------------------|
| Hero CTA pill       | auto, `min-w-[180px]`                 | `px-9 py-4` (lg) | `rounded-[100px]` morphs `→12px` | none → glow on hover |
| Product (Home grid) | 1/4 of `max-w-[1280px]` ≈ 292px       | `p-6`   | `rounded-xl` border `border-default` | `hover:shadow-md`   |
| Product (Products grid) | 1/3 of container ≈ 408px           | `p-8`   | `rounded` (none-explicit, magnetic) | none, hover glow border |
| Blog post card      | 1/3 of container ≈ 408px              | `p-6`   | `rounded-xl border`          | resting `shadow-card`   |
| Team member card    | 1/3 of container                      | `p-6`   | `rounded-xl border`          | hover `shadow-cardHover`|
| Case study card     | 1/2 of container                      | `p-8`   | `rounded-xl border`          | hover gradient sweep    |
| Testimonial card    | 1/3 of container                      | `p-6`   | `rounded-xl border`          | resting `shadow-card`   |
| Service row image   | half of row, `aspect-[4/3]`           | n/a     | `rounded-2xl`                | none                    |
| Pricing card        | `max-w-md`                            | `p-8`   | `rounded-2xl`                | `shadow-premium`        |
| FAQ accordion row   | full width up to `max-w-3xl`          | `py-5`  | bottom border only           | none                    |
| Founder photo       | `w-[300px] h-[380px]` → `sm:w-[340px] h-[420px]` | n/a | `rounded-2xl`                | none                    |
| Calendar day cell   | `w-10 h-10`                           | n/a     | `rounded-lg`                 | none                    |
| Form input          | full width                            | `p-3`   | `rounded-lg border-default`  | focus ring teal         |
| Cookie banner       | `sm:max-w-sm` (~360px)                | `p-4`   | `rounded-xl border`          | `shadow-2xl`            |

---

## 6. Animation registry per section

### Page-load (no scroll required)

| Page  | What animates                | Library    | Params                                              |
|-------|------------------------------|------------|-----------------------------------------------------|
| Home  | Hero lines (.hero-line)      | anime.js   | `translateY:[24,0], opacity:[0,1], filter:blur(8→0), duration:520, stagger:120` |
| Home  | RotatingText word swap       | framer-motion | `y:-20→0, blur(8→0), 400ms`                       |
| FAQ   | Hero H1 + subtitle           | GSAP       | H1 `scale:0.5, y:80, opacity:0 → 1, 0, 1, dur:1.2, delay:0.2` |
| Team  | Hero H1 + subtitle           | GSAP       | Same as FAQ                                          |
| About | Hero H1 (ASCIIText)          | custom canvas | per-char decryption scramble                       |

### Scroll-driven

| Element / class           | Library | Trigger                       | Effect                                  |
|---------------------------|---------|-------------------------------|-----------------------------------------|
| `<FadeUp>` wrapper        | GSAP    | ScrollTrigger `top 88%`       | y:50→0, rotateX:-3→0, opacity:0→1       |
| `<StaggerContainer>`      | GSAP    | ScrollTrigger `top 85%`       | children stagger 0.08s                  |
| `<TextReveal>`            | GSAP    | ScrollTrigger `top 88%`       | per-word y:110%→0                       |
| `<Parallax>`              | GSAP    | scrub (continuous)             | y translation tied to scroll progress   |
| `<AnimatedCounter>`       | GSAP    | ScrollTrigger `top 85%` once  | obj.val 0→target                        |
| Home timeline bars        | GSAP    | ScrollTrigger `top 75%` once  | scaleX:0→1, stagger 0.15s               |
| Home SVG `.illustration-path` | GSAP | ScrollTrigger `top 80%` once  | strokeDashoffset draw-on, dur 1.2s     |
| CTA gradient drift        | GSAP    | infinite yoyo                  | backgroundPosition 0→30% 0%, dur 18s    |
| Testimonials swap (Home)  | GSAP    | timed (paused on hover)        | 3D card flip + opacity tween            |
| Team grid stagger         | GSAP    | ScrollTrigger `top 85%`       | cards y:60, scale:0.92, stagger 0.1     |
| Founder photo/text        | GSAP    | ScrollTrigger `top 80%`       | photo x:-60→0, text x:60→0, delay 0.15  |
| Services rows             | `<FadeUp>` | ScrollTrigger top 88%        | per-row y:50→0, delay i*0.1            |
| Blog cards                | `<FadeUp>` | ScrollTrigger top 88%        | per-card delay i*0.05                   |
| TextParallaxContent       | GSAP    | scrub                          | translateY image while heading slides   |

### Hover micro-interactions

| Element                  | Effect                                                       |
|--------------------------|--------------------------------------------------------------|
| `AnimatedCTAButton`      | Circle fill, label translate, border-radius morph, arrow swap |
| Product card             | Border teal, gradient sweep, magnetic cursor tilt            |
| Service row CTA          | Arrow translate `x:+4px`                                     |
| Blog card                | `bg-white → bg-[#f5f4f0]`, slight scale, shadow rise         |
| Nav pill items           | Subtle bg highlight, active item teal                        |
| Magnetic button (Footer) | Cursor-tracked offset (transform ×0.25), elastic return      |

### Background / decorative

| Element                   | Effect                                                         |
|---------------------------|----------------------------------------------------------------|
| `CrossfadeVideoLoop`      | Two `<video>` swap with 1.2s opacity crossfade near end-of-clip |
| Hero radial gradients     | Static stacked overlays for legibility                          |
| `bg-attachment: fixed`    | Practices section bg image stays static while content scrolls   |
| Floating particles / orbs | `FloatingOrbs`, `HeroParticles`, `NebulaBackground` (decorative) |
| Marquee rows              | Tailwind keyframes `marquee` / `marquee-reverse`                |
| Pulse-dot eyebrow         | Tailwind `animate-ping` on overlay span                         |
| Glow pulse                | Tailwind `glow-pulse` / `glow-teal` boxShadow oscillation       |

---

## 7. UI/UX patterns

### 7.1 Section eyebrow + number

```
<div className="reveal flex items-center gap-3">
  <SectionNum n="00.04" />
  <span className="h-px w-10 bg-brand-line" />
  <span className="font-mono text-[11px] tracking-[0.14em] text-brand-slate">SOFTWARE</span>
</div>
```
- `SectionNum` is a small monospaced label.
- Used in 00.01–00.07 across Home and the same numbering carried into About/Services/FAQ where applicable.

### 7.2 CMS field-visibility gates

Every CMS-driven block has a `fieldVis(key)` function. Default: visible. When `<page>_field_visibility` JSON sets `key: false`, the element is omitted from render. This is how admin VisibilityManager toggles individual fields.

### 7.3 CMS-empty fallback (deployment-ready pattern)

Every fetch uses one of:
- `parseJsonContent<T>(content.key, DEFAULT_X)` — array/object JSON fields.
- `content.foo || 'fallback string'` — scalar text fields.
- Top-level page falls back to `DEFAULT_*` exports from `src/lib/defaults.ts`.
- Home does **bulk-merge** `DEFAULT_HOME_CMS` underneath remote keys, so every CMS field has a usable default copy.

### 7.4 Dark-section contrast contract

Any section that should stay dark (hero, CTAs, footer pre-CTA) declares:
```
<section data-section-color="dark" className="bg-oc-dark text-white">
```
The light-mode CSS overrides exclude these sections, and the adaptive nav pill flips logo + items to white when scrolled over them.

### 7.5 Accessibility commitments

- Every interactive element has `aria-label` or visible label.
- All animations respect `prefers-reduced-motion: reduce` (each primitive short-circuits to a visible no-motion state).
- Min touch target `44px` (CTA buttons).
- Color contrast: text-white on `oc.dark` = 17.95:1 (AAA). text-brand-ink on `brand-cream` = 14.6:1 (AAA).
- Focus rings: teal `--tw-ring-offset-color` plus default focus-visible outline.

### 7.6 Loading states

- TanStack Query suspense → skeleton blocks (`HeroSkeleton`, `PracticesSkeleton` in `src/components/Skeletons.tsx`).
- Skeleton classes: `bg-gray-200 animate-pulse rounded`.
- Error state silently falls back to defaults; never blocks the page.

### 7.7 Empty states

| Page              | Empty state                                                       |
|-------------------|-------------------------------------------------------------------|
| Newsletters       | Centered `<Mail>` icon + "No newsletters published yet" message   |
| Blog              | Defaults (6 posts) — never shown empty                            |
| Products          | Defaults (3 products)                                             |
| Team              | Defaults (6 members)                                              |
| Services          | Defaults (6 services)                                              |
| Career positions  | "No open roles right now — send a speculative application" CTA    |

---

## 8. Responsive breakpoints

Tailwind defaults:
- `sm` `640px`
- `md` `768px`
- `lg` `1024px`
- `xl` `1280px` (container `max-w-7xl` matches)
- `2xl` `1536px`

Patterns:
- Hero H1 type: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`.
- Grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (or `lg:grid-cols-4`).
- Padding: `px-6 sm:px-12`, `py-16 lg:py-24` to `py-24 lg:py-32`.
- Mobile nav: `<MobileNav>` overlays, drawer slides from right.

---

## 9. Performance budget (designed-for)

| Metric                      | Target               |
|-----------------------------|----------------------|
| LCP (hero image / video)    | ≤ 2.5s on 4G         |
| Hero video                  | Lazy-loaded; preload `metadata` only; falls back to poster if blocked |
| GSAP bundle                 | Tree-shaken to ScrollTrigger only |
| anime.js                    | Used only on Home hero (one place) |
| framer-motion               | Used selectively (rotating text, hover scale) |
| Lenis smooth scroll         | Disabled if `prefers-reduced-motion` |
| Image optimisation          | `<img loading="lazy">` plus `srcSet` where served from CMS |
| Fonts                       | Single family (Inter) self-hosted; Space Mono only for `.font-mono` |

---

## 10. Section-number / numbering convention

| Number  | Section                |
|---------|------------------------|
| `00.01°` | Hero                  |
| `00.02°` | Framing / Advantage   |
| `00.03°` | Practices             |
| `00.04°` | Products              |
| `00.05°` | Testimonials / Case Studies |
| `00.06°` | FAQ                   |
| `00.07°` | Final CTA / Contact   |
| `00.08°` | Footer-pre-CTA        |

Numbers are decorative (mono 10–11px) and reinforce the "operating-system" tone — each page reads like a documented system rather than a marketing site.
