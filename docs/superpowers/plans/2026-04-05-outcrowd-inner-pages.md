# Outcrowd Inner Pages + Text Reveals — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Outcrowd-inspired redesign by converting all inner page heroes to dark, adding text reveal animations, mouse-tracking card effects, and a dynamic section-aware header.

**Architecture:** Each inner page gets a dark hero section (`bg-oc-dark`, `data-section-color="dark"`) with Lora serif headings, while body content stays light. The Header watches `IntersectionObserver` on `[data-section-color]` sections to switch between dark and light nav styles. TextRevealOnScroll component replaces static headings with char-by-char GSAP animations.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lora font (`font-heading`)

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Commit | `src/components/TextRevealOnScroll.tsx` | Reusable char-by-char scroll reveal |
| Modify | `src/pages/Home.tsx` | Add TextRevealOnScroll to stats/process/industries headings |
| Modify | `src/pages/home/WhyChooseSection.tsx` | Add TextRevealOnScroll to heading |
| Modify | `src/pages/Services.tsx` | Dark hero, oc-card on service rows |
| Modify | `src/pages/About.tsx` | Dark hero, Lora headings, text reveals |
| Modify | `src/pages/Contact.tsx` | Dark hero |
| Modify | `src/pages/BookConsultation.tsx` | Dark hero |
| Modify | `src/pages/Blog.tsx` | Dark hero, oc-card on blog cards |
| Modify | `src/pages/BlogPost.tsx` | Dark hero |
| Modify | `src/pages/FAQ.tsx` | Dark hero |
| Modify | `src/pages/Team.tsx` | Dark hero |
| Modify | `src/pages/Careers.tsx` | Dark hero |
| Modify | `src/pages/CaseStudies.tsx` | Dark hero |
| Modify | `src/components/Header.tsx` | IntersectionObserver section-color switching |

---

## Task 1: Commit TextRevealOnScroll + Add to Homepage Sections

**Files:**
- Commit: `src/components/TextRevealOnScroll.tsx` (already created, uncommitted)
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/home/WhyChooseSection.tsx`

- [ ] **Step 1: Commit the TextRevealOnScroll component**

```bash
cd d:\Website_Adviserve.talent\Adviserve-Website
git add src/components/TextRevealOnScroll.tsx
git commit -m "feat: add TextRevealOnScroll component for char-by-char scroll animation"
```

- [ ] **Step 2: Add TextRevealOnScroll to Home.tsx section headings**

In `src/pages/Home.tsx`, add the import at the top:

```tsx
import TextRevealOnScroll from '../components/TextRevealOnScroll';
```

Then replace these static headings with TextRevealOnScroll:

**Stats section heading** (~line 211): Replace the `<h2>` containing "Adviserve" + outline text with:
```tsx
<TextRevealOnScroll
  text="Adviserve Advisory"
  tag="h2"
  className="font-heading text-[clamp(48px,7vw,80px)] leading-[1.05] text-[#1a1a2e]"
/>
```

**Process section heading** (~line 296): Replace `<h2>` containing "The Process" + outline text with:
```tsx
<TextRevealOnScroll
  text="The Process Behind Our Success"
  tag="h2"
  className="font-heading text-[clamp(36px,5vw,64px)] leading-[1.1] text-[#1a1a2e]"
/>
```

**Industries section heading** (~line 323): Replace `<h2>` containing "Trusted Across Sectors" with:
```tsx
<TextRevealOnScroll
  text="Trusted Across Sectors"
  tag="h2"
  className="font-heading text-[clamp(36px,5vw,64px)] leading-[1.1] text-[#1a1a2e]"
/>
```

- [ ] **Step 3: Add TextRevealOnScroll to WhyChooseSection.tsx**

In `src/pages/home/WhyChooseSection.tsx`, add import:
```tsx
import TextRevealOnScroll from '../../components/TextRevealOnScroll';
```

Replace the heading lines (`['6 Practices', 'One Partner', 'Zero Gaps'].map(...)`) with:
```tsx
<TextRevealOnScroll
  text={`${items.length} Practices. One Partner. Zero Gaps.`}
  tag="h2"
  className="font-heading text-[clamp(40px,5vw,68px)] leading-[1.1] text-[#1a1a2e]"
/>
```

- [ ] **Step 4: Verify build**

```bash
npx tsc --noEmit
```
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/home/WhyChooseSection.tsx
git commit -m "feat: add TextRevealOnScroll to homepage stats, process, industries, why-choose"
```

---

## Task 2: Convert Services Page — Dark Hero + oc-card

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] **Step 1: Convert hero section to dark**

In `src/pages/Services.tsx`, find the hero `<section>` (~line 156). Change:
- `className` on the section: add `bg-oc-dark` and `data-section-color="dark"`
- Remove `bg-[#faf9f6]` if present
- All `text-[#1a1a2e]` inside the hero → `text-white`
- All `text-[#5a5a6e]` inside the hero → `text-white/50`
- `text-brand-teal` → keep (teal on dark looks great)
- Blob backgrounds: `bg-brand-teal/[0.06]` → `bg-brand-teal/[0.03]` (subtler on dark)
- `bg-amber-500/[0.03]` → `bg-brand-teal/[0.02]`
- Geometric shape borders: reduce opacity for dark bg

Replace the hero `<h1>` with TextRevealOnScroll:
```tsx
import TextRevealOnScroll from '../components/TextRevealOnScroll';

// In hero:
<TextRevealOnScroll
  text={content.services_page_title || 'Six services. One team. Zero handoff headaches.'}
  tag="h1"
  className="font-heading text-[clamp(36px,6vw,64px)] leading-[1.1] text-white"
/>
```

Hero subtitle: `text-[#5a5a6e]` → `text-white/40`

- [ ] **Step 2: Add oc-card class to service list rows**

In the service list section (below hero), find each service row `<Link>` element. Add `oc-card` to its className. These rows are on a LIGHT background — the oc-card effect works on light too since the radial gradient is subtle teal.

- [ ] **Step 3: Add useMouseTracking**

```tsx
import { useMouseTracking } from '../hooks/useMouseTracking';

// Inside component, add ref to the service list container:
const servicesListRef = useRef<HTMLDivElement>(null);
useMouseTracking(servicesListRef);

// Wrap the service list rows in a div with this ref
```

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Services.tsx
git commit -m "feat: convert Services page to Outcrowd dark hero + oc-card effects"
```

---

## Task 3: Convert About Page — Dark Hero + Text Reveals

**Files:**
- Modify: `src/pages/About.tsx`

- [ ] **Step 1: Convert hero section to dark**

Find `<section ref={heroRef}` (~line 213). Change:
- Add `bg-oc-dark` to className, add `data-section-color="dark"`
- `text-[#1a1a2e]` → `text-white` (inside hero only)
- `text-[#5a5a6e]` → `text-white/50`
- Hero blob: `bg-brand-teal/[0.05]` → `bg-brand-teal/[0.03]`
- Geometric shapes: reduce opacity values

Replace hero `<h1>` with:
```tsx
import TextRevealOnScroll from '../components/TextRevealOnScroll';

<TextRevealOnScroll
  text={content.about_title || 'We started Adviserve because we kept seeing the same problem.'}
  tag="h1"
  className="font-heading text-[clamp(36px,5vw,64px)] leading-[1.1] text-white"
/>
```

Hero subtitle: `text-[#5a5a6e]` → `text-white/40`

- [ ] **Step 2: Add TextRevealOnScroll to Story and Approach headings**

Story section heading: replace with TextRevealOnScroll, keep existing styling classes but switch to `font-heading`.

Approach section heading: same treatment.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/About.tsx
git commit -m "feat: convert About page to Outcrowd dark hero + text reveals"
```

---

## Task 4: Convert Contact + BookConsultation — Dark Heroes

**Files:**
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/BookConsultation.tsx`

- [ ] **Step 1: Contact.tsx dark hero**

Find `<section ref={heroRef}` (~line 216). Change:
- Add `bg-oc-dark` and `data-section-color="dark"`
- Hero text: `text-[#1a1a2e]` → `text-white`
- Hero subtitle: `text-[#5a5a6e]` → `text-white/50`
- Blob bg: reduce opacity for dark
- Geometric shapes: reduce opacity

Replace hero `<h1>` with TextRevealOnScroll:
```tsx
<TextRevealOnScroll
  text={content.contact_title || 'Let us hear from you'}
  tag="h1"
  className="font-heading text-[clamp(36px,6vw,72px)] leading-[1.05] text-white"
/>
```

The form section below stays LIGHT — no changes to form styling.

- [ ] **Step 2: BookConsultation.tsx dark hero**

Find the hero `<section>` (~line 201). Change:
- Wrap hero in dark styling: `bg-oc-dark` + `data-section-color="dark"`
- `text-[#1a1a2e]` → `text-white`
- `text-brand-teal` → keep
- `text-[#6b6b7e]` → `text-white/50`

The booking form section below stays LIGHT.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Contact.tsx src/pages/BookConsultation.tsx
git commit -m "feat: convert Contact + BookConsultation to Outcrowd dark heroes"
```

---

## Task 5: Convert Blog + BlogPost — Dark Hero + oc-card

**Files:**
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/BlogPost.tsx`

- [ ] **Step 1: Blog.tsx dark hero**

Find `<section ref={heroRef}` (~line 201). Change:
- `bg-[#faf9f6]` → remove, add `bg-oc-dark`
- Add `data-section-color="dark"`
- `text-[#1a1a2e]` → `text-white`
- `text-[#5a5a6e]` → `text-white/50`
- Blobs: reduce opacity

Replace `<h1>` with TextRevealOnScroll:
```tsx
<TextRevealOnScroll
  text={content.blog_page_title || 'Insights & Resources'}
  tag="h1"
  className="font-heading text-[clamp(36px,6vw,64px)] leading-[1.1] text-white"
/>
```

- [ ] **Step 2: Add oc-card to blog cards**

In the blog grid (~line 331), add `oc-card` class to each blog card `<Link>`.

Add useMouseTracking:
```tsx
import { useMouseTracking } from '../hooks/useMouseTracking';
// Add ref to blog grid container, call useMouseTracking(ref)
```

- [ ] **Step 3: BlogPost.tsx dark hero**

Find the hero section. Same dark treatment:
- `bg-[#faf9f6]` → `bg-oc-dark` + `data-section-color="dark"`
- Hero text colors: white variants
- Content area below stays light

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Blog.tsx src/pages/BlogPost.tsx
git commit -m "feat: convert Blog pages to Outcrowd dark hero + oc-card effects"
```

---

## Task 6: Convert Remaining Pages — FAQ, Team, Careers, CaseStudies

**Files:**
- Modify: `src/pages/FAQ.tsx`
- Modify: `src/pages/Team.tsx`
- Modify: `src/pages/Careers.tsx`
- Modify: `src/pages/CaseStudies.tsx`

- [ ] **Step 1: Apply dark hero pattern to all 4 files**

Each file has a hero `<section>` starting with `pt-[120px]`. For each:
- Remove `bg-[#faf9f6] text-[#1a1a2e]` from the section className
- Add `bg-oc-dark text-white` and `data-section-color="dark"`
- Inside the hero only: `text-[#1a1a2e]` → `text-white`, `text-[#5a5a6e]` → `text-white/50`
- Blobs: `bg-brand-teal/[0.05]` → `bg-brand-teal/[0.03]`
- `bg-amber-500/[0.03]` → `bg-brand-teal/[0.02]`
- Geometric shapes: reduce opacity values

Replace each hero `<h1>` with TextRevealOnScroll using `font-heading text-white` class.

Body sections below each hero stay LIGHT — no changes.

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/FAQ.tsx src/pages/Team.tsx src/pages/Careers.tsx src/pages/CaseStudies.tsx
git commit -m "feat: convert FAQ, Team, Careers, CaseStudies to Outcrowd dark heroes"
```

---

## Task 7: Dynamic Section-Color Header

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add IntersectionObserver for section-color detection**

In `src/components/Header.tsx`, add a new state and effect:

```tsx
const [onDarkSection, setOnDarkSection] = useState(false);

useEffect(() => {
  const sections = document.querySelectorAll('[data-section-color]');
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // Find the section most visible at the top of the viewport
      for (const entry of entries) {
        if (entry.isIntersecting && entry.boundingClientRect.top < 100) {
          setOnDarkSection(
            (entry.target as HTMLElement).dataset.sectionColor === 'dark'
          );
        }
      }
    },
    { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}, [location.pathname]);
```

- [ ] **Step 2: Apply dynamic styles based on onDarkSection**

For the light theme header (since Adviserve uses `isLight`), when `onDarkSection` is true AND `!isScrolled`:
- Logo/brand text: `text-white` instead of `text-[#1a1a2e]`
- Nav links: `text-white/60` instead of `text-light-text2`
- Burger menu bars: `bg-white` instead of `bg-[#1a1a2e]`
- Search icon: `text-white/50`
- CTA button: `bg-white text-[#1a1a2e]` instead of `bg-[#1a1a2e] text-white`

When scrolled (`isScrolled` = true), always use the light header style regardless of section — because the header background becomes opaque white.

The key logic:
```tsx
const isDarkNav = onDarkSection && !isScrolled;
```

Then use `isDarkNav` to conditionally apply white text classes.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/Header.tsx
git commit -m "feat: dynamic header color switching based on section background"
```

---

## Verification Checklist

After all tasks:

- [ ] Homepage headings animate char-by-char on scroll
- [ ] All inner pages have dark hero sections
- [ ] Hero text is white/readable on dark backgrounds
- [ ] Body content below heroes is still light and readable
- [ ] Header nav text is white when over dark hero, dark when scrolled
- [ ] Blog cards have mouse-tracking radial hover effect
- [ ] Service rows have mouse-tracking hover
- [ ] TypeScript compiles with 0 errors
- [ ] All pages render without React errors in console
