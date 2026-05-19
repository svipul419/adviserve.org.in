# Dark Premium Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the entire Adviserve public website from warm-white editorial to dark cosmic premium aesthetic (inspired by astralab.framer.website), while preserving all CMS, admin panel, and API functionality.

**Architecture:** The redesign is purely visual — no routing, data fetching, or API changes. We update the Tailwind config with new dark tokens, update `index.css` for dark body defaults, update `themeClasses.ts` dark branch with new cosmic colors, then sweep all public pages/components to use the new palette. Three.js elements are added as lazy-loaded components in 3 specific locations.

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS 3 + GSAP + Three.js (@react-three/fiber + @react-three/drei)

---

## Phase Overview

| Phase | Description | Files | Deployable After? |
|-------|-------------|-------|-------------------|
| 1 | Foundation — tokens, CSS, dependencies | 3 config files | Yes (dark body, existing pages look rough but work) |
| 2 | Shared components — Header, Footer, SearchModal, etc. | 8 components | Yes (navigation and chrome are dark, pages still light-ish) |
| 3 | New decorative components — Orbs, Divider | 2 new files | Yes (decorative layer ready) |
| 4 | Homepage — all sections | 5 files | Yes (homepage is fully dark) |
| 5 | Content pages — Services, Blog, BlogPost | 4 files | Yes |
| 6 | Conversion pages — Contact, Book, About | 3 files | Yes |
| 7 | Secondary pages — FAQ, Team, Careers, CaseStudies, etc. | 6 files | Yes |
| 8 | Three.js — particles, nebula, wireframes | 3 new files + 2 page mods | Yes (full redesign complete) |

---

## Phase 1: Foundation (Tokens + CSS + Dependencies)

### Task 1.1: Install Three.js dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Verify install**

```bash
node -e "require('three'); console.log('three OK')"
node -e "require('@react-three/fiber'); console.log('r3f OK')"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three.js, @react-three/fiber, @react-three/drei"
```

---

### Task 1.2: Update Tailwind config with dark tokens

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add dark color tokens to the `colors` section**

Add inside `theme.extend.colors`:

```js
// Dark cosmic theme
dark: {
  deep: '#06080F',
  base: '#0C1018',
  surface: '#141820',
  elevated: '#1A1F2A',
},
cosmic: {
  purple: '#6B4CE6',
},
dt: {  // dark-text shorthand
  primary: '#F0F0F5',
  secondary: '#A0A0B8',
  muted: '#5A5A72',
},
```

- [ ] **Step 2: Add glow box-shadows to the `boxShadow` section**

Add inside `theme.extend.boxShadow`:

```js
'glow-teal-sm': '0 0 15px rgba(109,212,196,0.08)',
'glow-teal-md': '0 0 30px rgba(109,212,196,0.12), 0 4px 20px rgba(0,0,0,0.3)',
'glow-purple': '0 0 40px rgba(107,76,230,0.10)',
'card-dark': '0 4px 30px rgba(0,0,0,0.4)',
```

- [ ] **Step 3: Run build to verify**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add dark cosmic color tokens to Tailwind config"
```

---

### Task 1.3: Update index.css for dark body defaults

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Update body background and text colors**

Change the body rule from:
```css
body {
  @apply font-sans antialiased;
  background-color: #faf9f6;
  color: #1a1a2e;
}
```

To:
```css
body {
  @apply font-sans antialiased;
  background-color: #0C1018;
  color: #F0F0F5;
}
```

- [ ] **Step 2: Update selection colors**

```css
::selection {
  background: rgba(109, 212, 196, 0.25);
  color: #F0F0F5;
}
```

- [ ] **Step 3: Update scrollbar for dark**

```css
::-webkit-scrollbar-track {
  background: #0C1018;
}
::-webkit-scrollbar-thumb {
  background: #2A2F3A;
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3A3F4A;
}
```

- [ ] **Step 4: Update dot-grid utility**

```css
.dot-grid {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.04) 1px, transparent 0);
  background-size: 40px 40px;
}
```

- [ ] **Step 5: Update shimmer for dark**

```css
.shimmer {
  background: linear-gradient(90deg, #141820 25%, #1A1F2A 50%, #141820 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

- [ ] **Step 6: Update card-hover and hover-lift for dark**

```css
.card-hover {
  @apply transition-all duration-500 hover:-translate-y-2;
  @apply hover:shadow-[0_0_30px_rgba(109,212,196,0.08),0_4px_30px_rgba(0,0,0,0.3)];
}

.hover-lift:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 20px rgba(109,212,196,0.08), 0 8px 30px rgba(0,0,0,0.4);
}
```

- [ ] **Step 7: Update service-prose for dark**

```css
.service-prose h2 {
  color: #F0F0F5;
}
.service-prose h3 {
  color: #6dd4c4;
}
.service-prose p {
  color: #A0A0B8;
}
.service-prose ul li {
  color: #A0A0B8;
}
.service-prose ul li strong {
  color: #F0F0F5;
}
.service-prose strong {
  color: #F0F0F5;
}
```

- [ ] **Step 8: Update prose-brand for dark**

```css
.prose-brand h1, .prose-brand h2, .prose-brand h3, .prose-brand h4 { color: #F0F0F5; }
.prose-brand a { color: #6dd4c4; }
.prose-brand a:hover { color: #8ae4d6; }
.prose-brand blockquote { border-left-color: #6dd4c4; color: #A0A0B8; }
.prose-brand strong { color: #F0F0F5; }
```

- [ ] **Step 9: Add new glow-divider utility class**

```css
.glow-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(109,212,196,0.15), transparent);
}
```

- [ ] **Step 10: Verify build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 11: Commit**

```bash
git add src/index.css
git commit -m "feat: update CSS to dark cosmic theme — body, scrollbar, prose, utilities"
```

---

### Task 1.4: Update themeClasses.ts dark branch

**Files:**
- Modify: `src/lib/themeClasses.ts`

- [ ] **Step 1: Update all dark-branch values**

Replace every dark-branch (`isLight ? ... : ...`) class string with the new cosmic dark tokens. Key changes:

**Backgrounds:**
- `'bg-[#0f2333]'` → `'bg-dark-base'`
- `'bg-[#132a3d]'` → `'bg-dark-surface'`

**Borders:**
- `'border-[#e8d5c4]/[0.08]'` → `'border-white/[0.06]'`

**Text:**
- `'text-[#e8d5c4]'` → `'text-dt-primary'`
- `'text-[#e8d5c4]/60'` → `'text-dt-secondary'`
- `'text-[#e8d5c4]/55'` → `'text-dt-muted'`

**Buttons (dark branch):**
- Primary: `'font-mono text-[13px] uppercase tracking-[0.12em] bg-brand-teal text-dark-deep px-8 py-[15px] min-h-[52px] hover:bg-brand-teal/90 hover:shadow-glow-teal-sm transition-all duration-300'`
- Outline: `'font-mono text-[13px] uppercase tracking-[0.12em] text-dt-secondary border border-white/[0.06] px-7 py-[15px] min-h-[52px] hover:border-brand-teal/25 hover:text-brand-teal transition-all duration-300'`

**Inputs (dark branch):**
- `'w-full px-4 py-3.5 bg-dark-elevated border border-white/[0.06] text-dt-primary text-[14px] rounded-lg placeholder:text-dt-muted focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal/40 transition-colors'`

**Cards (dark branch):**
- `'bg-dark-surface border border-white/[0.06]'`
- Hover: `'hover:border-brand-teal/25 hover:shadow-glow-teal-sm transition-all duration-300'`

**Header (dark branch):**
- `headerBg`: `'bg-dark-deep/92 backdrop-blur-xl border-b border-white/[0.06]'`
- `headerNavLink`: keep mono style, update colors to `text-dt-muted`
- `headerNavLinkActive`: `'text-brand-teal'`
- `headerNavLinkInactive`: `'text-dt-muted hover:text-dt-primary'`
- `headerCta`: `'font-mono text-[13px] uppercase tracking-[0.12em] bg-brand-teal text-dark-deep px-6 py-3 min-h-[44px] inline-flex items-center hover:bg-brand-teal/90 transition-all'`

**Footer (dark branch):**
- `footerBg`: `'bg-dark-deep'`
- `footerHeading`: `'text-dt-primary'`
- `footerText`: `'text-dt-secondary'`
- `footerMuted`: `'text-dt-muted'`
- `footerLink`: `'text-dt-muted hover:text-dt-primary'`
- `footerInput`: `'bg-dark-surface border-white/[0.06] text-dt-primary placeholder:text-dt-muted focus:border-brand-teal/40'`
- `footerBtn`: `'bg-brand-teal text-dark-deep hover:bg-brand-teal/90'`
- `footerNlBar`: `'bg-dark-surface border-b border-white/[0.06]'`

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/themeClasses.ts
git commit -m "feat: update themeClasses dark branch to cosmic palette"
```

---

## Phase 2: Shared Components

### Task 2.1: Update Header.tsx

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Update all hardcoded dark-theme colors**

Replace across the file:
- `bg-[#0f2333]` → `bg-dark-deep`
- `border-[#e8d5c4]` references → `border-white/[0.06]`
- `text-[#e8d5c4]` → `text-dt-primary`
- `text-[#e8d5c4]/60` → `text-dt-muted`
- `text-[#e8d5c4]/50` → `text-dt-muted`
- `bg-[#132a3d]` → `bg-dark-surface`
- `hover:text-[#e8d5c4]` → `hover:text-dt-primary`
- `bg-[#e8d5c4] text-[#0f2333]` (CTA) → `bg-brand-teal text-dark-deep`
- `hover:bg-brand-teal hover:text-[#e8d5c4]` → `hover:bg-brand-teal/90`

Mobile menu panels: change background from white to `bg-dark-surface`.

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: update Header to dark cosmic theme"
```

---

### Task 2.2: Update Footer.tsx (including ISO seals)

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Update ISO seal colors**

In the `ISOCertifications` component:
- `bg` variable: `isLight ? '#faf9f6' : '#06080F'` (was `'#0d1b2a'`)
- `fg` variable: `isLight ? '#1a1a2e' : '#F0F0F5'` (was `'#ffffff'`)
- `sub` variable: `isLight ? '#6b6b7e' : '#5A5A72'`
- `ringThin`: dark branch `'rgba(255,255,255,0.06)'`
- `ringMed`: dark branch `'rgba(109,212,196,0.18)'`
- `bandFill`: dark branch `'rgba(109,212,196,0.25)'`

- [ ] **Step 2: Update all hardcoded footer colors in the Footer component**

Replace across the file:
- `bg-[#0f2333]` → `bg-dark-deep`
- `border-[#e8d5e0]` references → `border-white/[0.06]`
- `text-[#e8d5c4]` → `text-dt-primary`
- `bg-[#132a3d]` → `bg-dark-surface`

Most footer colors come from `themeClasses.ts` (already updated in Task 1.4), so only hardcoded values need changing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: update Footer + ISO seals to dark cosmic theme"
```

---

### Task 2.3: Update SearchModal.tsx

**Files:**
- Modify: `src/components/SearchModal.tsx`

- [ ] **Step 1: Update colors**

- Backdrop: `bg-[#1a1a2e]/60` → `bg-dark-deep/80 backdrop-blur-xl`
- Modal bg: `bg-white` → `bg-dark-surface`
- Borders: `border-[#e5e5dd]` → `border-white/[0.06]`
- Input bg: `bg-transparent` → keep, but update placeholder/text colors
- Text: `text-[#1a1a2e]` → `text-dt-primary`
- Muted text: `text-[#9a9aae]` → `text-dt-muted`
- Result hover: `hover:bg-[#faf9f6]` → `hover:bg-dark-elevated`
- Active result: `bg-brand-teal/5` → `bg-brand-teal/10`

- [ ] **Step 2: Commit**

```bash
git add src/components/SearchModal.tsx
git commit -m "feat: update SearchModal to dark cosmic theme"
```

---

### Task 2.4: Update CookieConsent, BackToTop, CustomCursor

**Files:**
- Modify: `src/components/CookieConsent.tsx`
- Modify: `src/components/BackToTop.tsx`
- Modify: `src/components/CustomCursor.tsx`

- [ ] **Step 1: CookieConsent**

- Background: `bg-white` → `bg-dark-surface`
- Border: `border-[#d8d8d0]` → `border-white/[0.06]`
- Text: `text-[#5a5a6e]` → `text-dt-secondary`
- Decline button: update border/text colors
- Accept button: `bg-brand-teal text-white` → `bg-brand-teal text-dark-deep`

- [ ] **Step 2: BackToTop**

- Background: `bg-[#1a1a2e]` → `bg-dark-surface border border-white/[0.06]`
- Hover: `hover:bg-brand-teal` → `hover:bg-brand-teal hover:text-dark-deep`
- Icon: keep white → `text-brand-teal`, hover `text-dark-deep`

- [ ] **Step 3: CustomCursor**

- Dot color: already `bg-brand-teal` — works on dark
- Ring: `border-cream/25` → `border-white/15`
- Hover ring: `rgba(13, 148, 136, 0.3)` — keep (teal works on dark)

- [ ] **Step 4: Commit**

```bash
git add src/components/CookieConsent.tsx src/components/BackToTop.tsx src/components/CustomCursor.tsx
git commit -m "feat: update CookieConsent, BackToTop, CustomCursor to dark theme"
```

---

## Phase 3: New Decorative Components

### Task 3.1: Create FloatingOrbs component

**Files:**
- Create: `src/components/FloatingOrbs.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface FloatingOrbsProps {
  variant?: 'hero' | 'section' | 'cta';
}

export default function FloatingOrbs({ variant = 'section' }: FloatingOrbsProps) {
  const ref = useRef<HTMLDivElement>(null);

  const configs = {
    hero: [
      { color: 'rgba(107,76,230,0.08)', size: 700, x: '70%', y: '-10%' },
      { color: 'rgba(109,212,196,0.05)', size: 500, x: '-5%', y: '60%' },
      { color: 'rgba(107,76,230,0.05)', size: 400, x: '40%', y: '80%' },
    ],
    section: [
      { color: 'rgba(107,76,230,0.06)', size: 500, x: '80%', y: '-15%' },
      { color: 'rgba(109,212,196,0.04)', size: 400, x: '-10%', y: '70%' },
    ],
    cta: [
      { color: 'rgba(107,76,230,0.10)', size: 600, x: '50%', y: '50%' },
      { color: 'rgba(109,212,196,0.06)', size: 500, x: '20%', y: '30%' },
    ],
  };

  const orbs = configs[variant];

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ref.current.querySelectorAll('.floating-orb').forEach((orb, i) => {
      gsap.to(orb, {
        x: `+=${30 + i * 15}`,
        y: `+=${20 + i * 10}`,
        scale: 1.05 + i * 0.02,
        repeat: -1,
        yoyo: true,
        duration: 20 + i * 8,
        ease: 'sine.inOut',
      });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="floating-orb absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloatingOrbs.tsx
git commit -m "feat: add FloatingOrbs decorative component"
```

---

### Task 3.2: Create GlowDivider component

**Files:**
- Create: `src/components/GlowDivider.tsx`

- [ ] **Step 1: Write the component**

```tsx
export default function GlowDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`glow-divider w-full ${className}`}
      role="separator"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GlowDivider.tsx
git commit -m "feat: add GlowDivider section separator component"
```

---

## Phase 4: Homepage

### Task 4.1: Update HeroSection.tsx

**Files:**
- Modify: `src/pages/home/HeroSection.tsx`

- [ ] **Step 1: Update background and colors**

- Section bg: `bg-[#faf9f6]` → `bg-dark-deep`
- Geometric shape colors: `border-brand-teal/20` → `border-brand-teal/10`, `bg-brand-teal/10` → `bg-brand-teal/5`
- Gradient blob: `bg-brand-teal/[0.05]` → `bg-cosmic-purple/[0.08]`
- Amber blob: `bg-amber-500/[0.04]` → `bg-brand-teal/[0.04]`
- Dot grid: keep existing pattern (already uses rgba white which works on dark)
- Dark overlay ref: `bg-white` → `bg-dark-deep` (scroll exit overlay)
- Badge text: `text-brand-teal` — keep
- Headline: `text-[#1a1a2e]` → `text-dt-primary`
- Outline text: `rgba(26,26,46,0.35)` stroke → `rgba(240,240,245,0.15)` stroke
- Cycling text: `text-[#9a9aae]` → `text-dt-muted`
- Value proposition: `text-[#1a1a2e]/80` → `text-dt-primary/80`
- Subtitle: `text-[#6b6b7e]` → `text-dt-secondary`
- Primary CTA: `bg-[#1a1a2e] text-white` → `bg-brand-teal text-dark-deep`
- Secondary CTA: `text-[#5a5a6e] border-[#e5e5dd]` → `text-dt-secondary border-white/[0.06]`
- Trust strip: `text-[#b0b0be]` → `text-dt-muted`, `text-[#9a9aae]` → `text-dt-muted`
- Scroll indicator: `text-[#b0b0be]` → `text-dt-muted`

- [ ] **Step 2: Add FloatingOrbs import and render behind content**

```tsx
import FloatingOrbs from '../../components/FloatingOrbs';
// Inside the section, before the content div:
<FloatingOrbs variant="hero" />
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/home/HeroSection.tsx
git commit -m "feat: update HeroSection to dark cosmic theme with floating orbs"
```

---

### Task 4.2: Update Home.tsx (Stats, Services, Process, Industries)

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Update all section backgrounds and text colors**

**Container:** `bg-[#faf9f6]` → `bg-dark-base`

**Marquee:**
- `bg-[#f5f4f0]` → `bg-dark-surface`
- Border: `border-[#e5e5dd]` → `border-white/[0.06]`
- Edge fades: `from-[#faf9f6]` → `from-dark-base`
- Text: `text-[#9a9aae]` → `text-dt-muted`

**Stats:**
- Cards: `bg-white/80 border-[#e8e8e0]` → `bg-dark-surface border-white/[0.06]`
- Hover: `hover:border-brand-teal/30 hover:bg-white` → `hover:border-brand-teal/20 hover:bg-dark-elevated`
- Heading: `text-[#1a1a2e]` → `text-dt-primary`
- Outline text stroke: → `rgba(240,240,245,0.12)`
- Stat numbers: `text-[#1a1a2e]` → `text-dt-primary`
- Stat labels: `text-[#8a8a9e]` → `text-dt-muted`
- Description text: `text-[#6b6b7e]` → `text-dt-secondary`

**Services:**
- Row borders: `border-[#e8e8e0]` → `border-white/[0.06]`
- Row hover: `hover:bg-brand-teal/[0.015]` → `hover:bg-brand-teal/[0.03]`
- Gradient sweep: keep, works on dark
- Title: `text-[#1a1a2e]` → `text-dt-primary`
- Tags: `text-[#9a9aae] border-[#e8e8e0]` → `text-dt-muted border-white/[0.06]`
- Arrow button: `border-[#e5e5dd] text-[#9a9aae]` → `border-white/[0.06] text-dt-muted`
- Description: `text-[#8a8a9e]` → `text-dt-muted`, hover `text-dt-secondary`

**Process:**
- Section bg: `bg-[#f0efeb]` → `bg-dark-surface`
- Background number: `text-[#1a1a2e]/[0.015]` → `text-white/[0.02]`
- Cards: `bg-[#faf9f6]/80 border-[#e8e8e0]` → `bg-dark-elevated border-white/[0.06]`
- Title: `text-[#1a1a2e]` → `text-dt-primary`
- Description: `text-[#8a8a9e]` → `text-dt-muted`
- Heading: `text-[#1a1a2e]` → `text-dt-primary`
- Subtitle: `text-[#7a7a8e]` → `text-dt-secondary`
- Outline text stroke: → `rgba(240,240,245,0.12)`

**Industries:**
- Border: `border-[#e8e8e0]` → `border-white/[0.06]`
- Cards: `bg-white/60 border-[#e8e8e0]` → `bg-dark-surface border-white/[0.06]`
- Hover: → `hover:border-brand-teal/20 hover:bg-dark-elevated`
- Labels: `text-[#8a8a9e]` → `text-dt-muted`

- [ ] **Step 2: Add GlowDivider between sections**

```tsx
import GlowDivider from '../components/GlowDivider';
// Between Stats and Services:
<GlowDivider />
// Between Services and Process:
<GlowDivider />
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: update Homepage sections to dark cosmic theme"
```

---

### Task 4.3: Update TestimonialsSection, WhyChooseSection, CTASection

**Files:**
- Modify: `src/pages/home/TestimonialsSection.tsx`
- Modify: `src/pages/home/WhyChooseSection.tsx`
- Modify: `src/pages/home/CTASection.tsx`

- [ ] **Step 1: TestimonialsSection**

- Section bg: `bg-white` → `bg-dark-deep`
- Quote text: `text-[#1a1a2e]` → `text-dt-primary`
- Author: `text-[#1a1a2e]` → `text-dt-primary`
- Role: `text-[#6b6b7e]` → `text-dt-muted`
- Buttons: `border-[#e5e5dd] text-[#6b6b7e]` → `border-white/[0.06] text-dt-muted`
- Dot indicators: `bg-[#1a1a2e]/10` → `bg-white/10`

- [ ] **Step 2: WhyChooseSection**

- Cards: `bg-white border-[#e5e5dd]` → `bg-dark-surface border-white/[0.06]`
- Hover: `hover:bg-[#f5f4f0]` → `hover:bg-dark-elevated`
- Numbers: `text-[#1a1a2e]` → `text-dt-primary`
- Headings: `text-[#1a1a2e]` → `text-dt-primary`, third line `text-[#7a7a8e]` → `text-dt-muted`
- Card text: `text-[#6b6b7e]` → `text-dt-muted`
- Italic subtitle: `text-[#5a5a6e]` → `text-dt-secondary`

- [ ] **Step 3: CTASection**

- Section: keep existing structure
- Glow gradient: update from `rgba(13,148,136,...)` → add cosmic purple blend `rgba(107,76,230,...)`
- Text: `text-[#1a1a2e]` → `text-dt-primary`
- Outline text stroke: → `rgba(240,240,245,0.15)`
- Description: `text-[#5a5a6e]` → `text-dt-secondary`
- Primary CTA: `bg-[#1a1a2e] text-white` → `bg-brand-teal text-dark-deep`
- Secondary CTA: `text-[#5a5a6e] border-[#e5e5dd]` → `text-dt-secondary border-white/[0.06]`

- [ ] **Step 4: Add FloatingOrbs to CTA section**

```tsx
import FloatingOrbs from '../../components/FloatingOrbs';
// Inside section, before content:
<FloatingOrbs variant="cta" />
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/home/TestimonialsSection.tsx src/pages/home/WhyChooseSection.tsx src/pages/home/CTASection.tsx
git commit -m "feat: update Testimonials, WhyChoose, CTA sections to dark theme"
```

---

## Phase 5: Content Pages

### Task 5.1: Update Services.tsx + ServiceCategory.tsx + ServiceDetail.tsx

**Files:**
- Modify: `src/pages/Services.tsx`
- Modify: `src/pages/ServiceCategory.tsx`
- Modify: `src/pages/ServiceDetail.tsx`

- [ ] **Step 1: Apply dark color sweep across all three files**

Same pattern as Homepage — replace all:
- `bg-[#faf9f6]` → `bg-dark-base`
- `bg-white` → `bg-dark-surface`
- `bg-[#f3f2ee]` → `bg-dark-elevated`
- `border-[#e5e5dd]` → `border-white/[0.06]`
- `text-[#1a1a2e]` → `text-dt-primary`
- `text-[#5a5a6e]` / `text-[#6b6b7e]` → `text-dt-secondary`
- `text-[#9a9aae]` / `text-[#7a7a8e]` / `text-[#8a8a9e]` → `text-dt-muted`
- `text-[#c0c0c0]` (placeholder) → `text-dt-muted`
- `bg-[#1a1a2e] text-white` (buttons) → `bg-brand-teal text-dark-deep`
- `hover:bg-[#faf9f6]` / `hover:bg-white` → `hover:bg-dark-elevated`
- Blobs: `bg-brand-teal/[0.05]` → `bg-cosmic-purple/[0.06]`
- `bg-amber-500/[0.03]` → `bg-brand-teal/[0.03]`

Add `<FloatingOrbs variant="section" />` to each hero section.

- [ ] **Step 2: Update ServiceDetail inline inquiry form colors**

- Form bg: `bg-white` → `bg-dark-surface`
- Border accent: `border-l-brand-teal` — keep
- Input styles: `bg-[#faf9f6]` → `bg-dark-elevated`
- Button: `bg-[#1a1a2e] text-white` → `bg-brand-teal text-dark-deep`

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Services.tsx src/pages/ServiceCategory.tsx src/pages/ServiceDetail.tsx
git commit -m "feat: update Services pages to dark cosmic theme"
```

---

### Task 5.2: Update Blog.tsx + BlogPost.tsx

**Files:**
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/BlogPost.tsx`

- [ ] **Step 1: Same dark sweep on both files**

All the same replacements as Task 5.1, plus:

**Blog.tsx specific:**
- Search bar: `bg-white` → `bg-dark-surface`, input `bg-[#f3f2ee]` → `bg-dark-elevated`
- Category pills: update border/text colors
- Featured post card: `bg-white` → `bg-dark-surface`
- Grid cards: `bg-white` → `bg-dark-surface`
- Category badge: `bg-[#faf9f6]/80` → `bg-dark-deep/80`

**BlogPost.tsx specific:**
- Content card: `bg-white` → `bg-dark-surface`
- Prose: already handled by CSS update in Task 1.3
- Tags: update bg/border colors
- Related posts: update card colors

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Blog.tsx src/pages/BlogPost.tsx
git commit -m "feat: update Blog pages to dark cosmic theme"
```

---

## Phase 6: Conversion Pages

### Task 6.1: Update Contact.tsx

**Files:**
- Modify: `src/pages/Contact.tsx`

- [ ] **Step 1: Dark sweep**

- All standard replacements
- Form card: `bg-white` → `bg-dark-surface`
- Input class string: update `bg-white` → `bg-dark-elevated`, borders, focus rings
- Sidebar cards: `bg-white` → `bg-dark-surface`
- Booking card: `bg-brand-teal/[0.04]` → `bg-brand-teal/[0.06]`
- FAQ accordion: `bg-white` → `bg-dark-surface`, active border `border-brand-teal/30`

- [ ] **Step 2: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat: update Contact page to dark cosmic theme"
```

---

### Task 6.2: Update BookConsultation.tsx

**Files:**
- Modify: `src/pages/BookConsultation.tsx`

- [ ] **Step 1: Dark sweep**

- Page bg: `bg-[#faf9f6]` → `bg-dark-base`
- Calendar card: `bg-white` → `bg-dark-surface`
- Time slot buttons: `border-[#e5e5dd] text-[#5a5a6e]` → `border-white/[0.06] text-dt-muted`
- Selected slot: keep `bg-brand-teal text-white`
- Form card: `bg-white` → `bg-dark-surface`
- Inputs: `bg-[#faf9f6]` → `bg-dark-elevated`
- Summary card: `bg-brand-teal/5` → `bg-brand-teal/10`
- Progress stepper: inactive `border-[#e5e5dd] text-[#9a9aae]` → `border-white/[0.06] text-dt-muted`
- Submit button: `bg-[#1a1a2e] text-white` → `bg-brand-teal text-dark-deep`
- Disabled dates: `text-[#d0d0d0]` → `text-white/10`
- Success page: update all colors to dark

- [ ] **Step 2: Commit**

```bash
git add src/pages/BookConsultation.tsx
git commit -m "feat: update BookConsultation to dark cosmic theme"
```

---

### Task 6.3: Update About.tsx

**Files:**
- Modify: `src/pages/About.tsx`

- [ ] **Step 1: Dark sweep — same pattern**

- All `bg-[#faf9f6]` → `bg-dark-base`
- All `bg-white` → `bg-dark-surface`
- All `bg-[#f0efeb]` → `bg-dark-elevated`
- Cards, text, borders — same replacements
- Hero blob: → `bg-cosmic-purple/[0.06]`
- Geometric shapes: update border colors for visibility on dark
- CTA glow: add cosmic purple to the radial gradient blend

Add `<FloatingOrbs variant="section" />` to the hero section.

- [ ] **Step 2: Commit**

```bash
git add src/pages/About.tsx
git commit -m "feat: update About page to dark cosmic theme"
```

---

## Phase 7: Secondary Pages

### Task 7.1: Update FAQ.tsx, Team.tsx, Careers.tsx

**Files:**
- Modify: `src/pages/FAQ.tsx`
- Modify: `src/pages/Team.tsx`
- Modify: `src/pages/Careers.tsx`

- [ ] **Step 1: Apply dark sweep to all three**

Same color replacement pattern. Key page-specific items:

**FAQ.tsx:**
- Accordion: `bg-white` → `bg-dark-surface`
- Active accordion border: keep `border-brand-teal/30`
- Search input: update bg/border
- Category tabs: update active/inactive colors

**Team.tsx:**
- Team member cards: `bg-dark-surface`
- Photo placeholder bg: `bg-dark-elevated`
- Social icons: `text-dt-muted` → hover `text-brand-teal`

**Careers.tsx:**
- Job cards: `bg-dark-surface`
- Benefit cards: update colors
- CTA section: `bg-dark-deep` with orbs

- [ ] **Step 2: Commit**

```bash
git add src/pages/FAQ.tsx src/pages/Team.tsx src/pages/Careers.tsx
git commit -m "feat: update FAQ, Team, Careers to dark cosmic theme"
```

---

### Task 7.2: Update CaseStudies, NewsletterArchive, LegalDocument, NotFound, Unsubscribe

**Files:**
- Modify: `src/pages/CaseStudies.tsx`
- Modify: `src/pages/NewsletterArchive.tsx`
- Modify: `src/pages/LegalDocument.tsx`
- Modify: `src/pages/NotFound.tsx`
- Modify: `src/pages/Unsubscribe.tsx`

- [ ] **Step 1: Apply dark sweep to all five**

Same color replacement pattern across all files. These are simpler pages with fewer unique elements.

- [ ] **Step 2: Verify full build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/CaseStudies.tsx src/pages/NewsletterArchive.tsx src/pages/LegalDocument.tsx src/pages/NotFound.tsx src/pages/Unsubscribe.tsx
git commit -m "feat: update remaining pages to dark cosmic theme"
```

---

## Phase 8: Three.js Elements

### Task 8.1: Create HeroParticles component

**Files:**
- Create: `src/components/HeroParticles.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const count = 2500;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.02;
    ref.current.rotation.y = t;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.05;
    // Subtle mouse parallax
    ref.current.position.x += (mouse.current.x * viewport.width * 0.02 - ref.current.position.x) * 0.01;
    ref.current.position.y += (mouse.current.y * viewport.height * 0.02 - ref.current.position.y) * 0.01;
  });

  // Track mouse
  useMemo(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        color="#F0F0F5"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroParticles() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add lazy import to HeroSection.tsx**

```tsx
import { lazy, Suspense } from 'react';
const HeroParticles = lazy(() => import('../../components/HeroParticles'));

const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.hardwareConcurrency < 4);

// Inside the section, before FloatingOrbs:
{!isMobile && <Suspense fallback={null}><HeroParticles /></Suspense>}
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroParticles.tsx src/pages/home/HeroSection.tsx
git commit -m "feat: add Three.js particle star field to hero section"
```

---

### Task 8.2: Create NebulaBackground component

**Files:**
- Create: `src/components/NebulaBackground.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  // Simple noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float n = noise(uv * 3.0 + uTime * 0.08);
    n += noise(uv * 6.0 - uTime * 0.05) * 0.5;
    n *= 0.67;

    vec3 purple = vec3(0.42, 0.30, 0.90);  // #6B4CE6
    vec3 teal = vec3(0.43, 0.83, 0.77);    // #6dd4c4
    vec3 col = mix(purple, teal, n);

    gl_FragColor = vec4(col, n * 0.18);
  }
`;

function NebulaMesh() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function NebulaBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        dpr={[1, 1]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false }}
      >
        <NebulaMesh />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add lazy import to CTASection.tsx**

```tsx
import { lazy, Suspense } from 'react';
const NebulaBackground = lazy(() => import('../../components/NebulaBackground'));
const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.hardwareConcurrency < 4);

// Inside the section, before glowRef div:
{!isMobile && <Suspense fallback={null}><NebulaBackground /></Suspense>}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NebulaBackground.tsx src/pages/home/CTASection.tsx
git commit -m "feat: add Three.js nebula shader to CTA section"
```

---

### Task 8.3: Create WireframeShapes component

**Files:**
- Create: `src/components/WireframeShapes.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function WireframeShape({ geometry, position, rotationSpeed }: {
  geometry: 'icosahedron' | 'torus' | 'octahedron';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += rotationSpeed[0];
    ref.current.rotation.y += rotationSpeed[1];
    ref.current.rotation.z += rotationSpeed[2];
    // Mouse parallax
    ref.current.position.x = position[0] + mouse.current.x * 0.3;
    ref.current.position.y = position[1] + mouse.current.y * 0.3;
  });

  // Mouse tracker — shared across shapes is fine for subtle effect
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true, once: false });
  }

  const geo = {
    icosahedron: <icosahedronGeometry args={[1.5, 0]} />,
    torus: <torusGeometry args={[1.2, 0.3, 8, 16]} />,
    octahedron: <octahedronGeometry args={[1.2, 0]} />,
  };

  return (
    <mesh ref={ref} position={position}>
      {geo[geometry]}
      <meshBasicMaterial color="#6dd4c4" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

export default function WireframeShapes() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <WireframeShape geometry="icosahedron" position={[4, 1.5, 0]} rotationSpeed={[0.002, 0.003, 0.001]} />
        <WireframeShape geometry="torus" position={[-3.5, -1, -2]} rotationSpeed={[0.001, -0.002, 0.002]} />
        <WireframeShape geometry="octahedron" position={[1, -2.5, -3]} rotationSpeed={[-0.002, 0.001, -0.001]} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add lazy import to About.tsx**

In the hero section:
```tsx
import { lazy, Suspense } from 'react';
const WireframeShapes = lazy(() => import('../components/WireframeShapes'));
const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.hardwareConcurrency < 4);

// Inside the hero section, before content:
{!isMobile && <Suspense fallback={null}><WireframeShapes /></Suspense>}
```

- [ ] **Step 3: Final full build verification**

```bash
npx tsc --noEmit && npm run build
```

Expected: build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/WireframeShapes.tsx src/pages/About.tsx
git commit -m "feat: add Three.js wireframe shapes to About page hero"
```

---

### Task 8.4: Final push

- [ ] **Step 1: Push all commits**

```bash
git push origin main
```

- [ ] **Step 2: Verify Vercel deployment**

Check that the Vercel deployment completes successfully and the site renders with the dark cosmic theme.

---

## Verification Checklist

After all phases are complete, verify:

- [ ] All public pages have dark backgrounds (no white sections remaining)
- [ ] All text is readable on dark backgrounds
- [ ] All cards use `dark-surface` or `dark-elevated` backgrounds
- [ ] All buttons use the new teal-primary / outline-secondary styles
- [ ] All form inputs have dark backgrounds with teal focus rings
- [ ] ISO seals render correctly on dark footer
- [ ] Three.js particles render on desktop hero (disabled on mobile)
- [ ] Three.js nebula renders behind CTA section
- [ ] Three.js wireframes render on About page hero
- [ ] FloatingOrbs appear on hero, CTA, and About sections
- [ ] GlowDividers appear between homepage sections
- [ ] Admin panel is completely unchanged
- [ ] All API endpoints work as before
- [ ] Search modal works with dark styling
- [ ] Cookie consent renders dark
- [ ] Back-to-top button renders dark
- [ ] Mobile menu renders dark
- [ ] Blog post prose content is readable on dark
- [ ] Booking form calendar and time slots work on dark
