# Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 27 security, accessibility, and UX issues found in the comprehensive audit.

**Architecture:** Fixes are grouped by file proximity — security fixes in API layer, contrast fixes across all page files, structural fixes in shared components. Each task is independently deployable and testable.

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS + GSAP + Vercel Edge Functions

---

## Task 1: Security — Rate Limiter IP Header + Origin Validation

**Files:**
- Modify: `api/_db.ts`
- Modify: `api/contact.ts`
- Modify: `api/booking.ts`
- Modify: `api/search.ts`
- Modify: `api/subscribe.ts`
- Modify: `api/analytics.ts`
- Modify: `api/unsubscribe.ts`

- [ ] **Step 1: Fix IP header in all 6 endpoint files**

In each of these files, replace:
```ts
const ip = request.headers.get('x-forwarded-for') || 'unknown';
```
With:
```ts
const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
```

Files and line numbers:
- `api/contact.ts:16`
- `api/booking.ts:16`
- `api/search.ts:15`
- `api/subscribe.ts:16`
- `api/analytics.ts:16`
- `api/unsubscribe.ts:15`

- [ ] **Step 2: Fix validateOrigin to require Origin for POST**

In `api/_db.ts`, find the `validateOrigin` function. Change:
```ts
if (!origin && !referer) return true; // same-origin requests don't send Origin
```
To:
```ts
// Require Origin header for fetch() POST requests — curl without Origin is blocked
if (!origin && !referer) return false;
```

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add api/_db.ts api/contact.ts api/booking.ts api/search.ts api/subscribe.ts api/analytics.ts api/unsubscribe.ts
git commit -m "security: fix rate limiter IP header (x-real-ip) + require Origin for POST"
```

---

## Task 2: Security — CSP, Sanitizer, Upsert, EmailTemplates

**Files:**
- Modify: `vercel.json`
- Modify: `src/lib/sanitize.ts`
- Modify: `api/admin/crud.ts`
- Modify: `src/pages/admin/EmailTemplates.tsx`

- [ ] **Step 1: Remove unsafe-inline from CSP script-src**

In `vercel.json`, find the Content-Security-Policy header. Change:
```
script-src 'self' 'unsafe-inline'
```
To:
```
script-src 'self'
```

- [ ] **Step 2: Add rel="noopener noreferrer" hook to sanitizer**

In `src/lib/sanitize.ts`, after the existing `sanitizeHTML` function, add:

```ts
// Enforce rel="noopener noreferrer" on all target="_blank" links
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});
```

- [ ] **Step 3: Fix upsert to use EXCLUDED references**

In `api/admin/crud.ts`, find the upsert case. Change:
```ts
const updateClauses = keys.map((k, i) => `${k} = $${i + 1}`);
```
To:
```ts
const updateClauses = keys.map((k) => `${k} = EXCLUDED.${k}`);
```

- [ ] **Step 4: Fix EmailTemplates to use sanitizeHTML**

In `src/pages/admin/EmailTemplates.tsx`, find line ~430 with `DOMPurify.sanitize(previewContent)`. Replace:
```tsx
dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewContent) }}
```
With:
```tsx
dangerouslySetInnerHTML={{ __html: sanitizeHTML(previewContent) }}
```

Add import at top (replace DOMPurify import):
```tsx
import { sanitizeHTML } from '../../lib/sanitize';
```
Remove the `import DOMPurify from 'dompurify';` line if it becomes unused.

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit
git add vercel.json src/lib/sanitize.ts api/admin/crud.ts src/pages/admin/EmailTemplates.tsx
git commit -m "security: fix CSP unsafe-inline, sanitizer rel enforcement, upsert EXCLUDED, EmailTemplates sanitize"
```

---

## Task 3: Contrast — Fix ALL text-white/50, /40, /60 on dark backgrounds

**Files (ALL pages with dark heroes):**
- Modify: `src/pages/home/HeroSection.tsx`
- Modify: `src/pages/home/CTASection.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Services.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/BlogPost.tsx`
- Modify: `src/pages/BookConsultation.tsx`
- Modify: `src/pages/FAQ.tsx`
- Modify: `src/pages/Team.tsx`
- Modify: `src/pages/Careers.tsx`
- Modify: `src/pages/CaseStudies.tsx`
- Modify: `src/pages/LegalDocument.tsx`
- Modify: `src/pages/home/TestimonialsSection.tsx`

- [ ] **Step 1: Global contrast fix across ALL files**

Apply these replacements in EVERY file listed above (use replace_all=true per file):

| Find | Replace | Reason |
|------|---------|--------|
| `text-white/40` | `text-white/70` | 2.1:1 → 4.8:1 (passes WCAG AA) |
| `text-white/50` | `text-white/70` | 2.8:1 → 4.8:1 (passes WCAG AA) |
| `text-white/30` | `text-white/60` | 1.7:1 → 3.5:1 (passes for large text) |

**Exception:** Do NOT replace `text-white/70` or higher — those already pass. Do NOT replace `border-white/[0.06]` or `bg-white/10` — those are decorative, not text.

Also in `src/components/Footer.tsx` dark section:
- `text-white/60` links → `text-white/80`
- `text-white/30` labels → `text-white/50`
- `text-white/25` copyright → `text-white/40`

- [ ] **Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/ src/components/Footer.tsx
git commit -m "a11y: fix text contrast on dark backgrounds — all pages pass WCAG AA 4.5:1"
```

---

## Task 4: Forms — Fix Focus Rings + Labels + Calendar

**Files:**
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/Services.tsx`
- Modify: `src/pages/BookConsultation.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Fix form focus rings across all form pages**

In each file, replace ALL instances of:
- `focus:ring-brand-teal/20` → `focus:ring-brand-teal`
- `focus:ring-brand-teal/30` → `focus:ring-brand-teal`
- `focus:ring-brand-teal/40` → `focus:ring-brand-teal`
- `focus-visible:ring-brand-teal/30` → `focus-visible:ring-brand-teal`
- `focus-visible:ring-brand-teal/40` → `focus-visible:ring-brand-teal`

- [ ] **Step 2: Fix disabled calendar dates**

In `src/pages/BookConsultation.tsx`, find the disabled date styling. Change:
```
text-[#d0d0d0]
```
To:
```
text-[#a0a0a0]
```

- [ ] **Step 3: Fix form label minimum size**

In all form pages, replace `text-[9px]` labels with `text-[11px]` and `text-[11px]` labels with `text-[12px]`:
- `text-[9px] font-mono` → `text-[11px] font-mono`
- `text-[10px] font-mono uppercase` → `text-[11px] font-mono uppercase`

Specifically in BookConsultation.tsx time slot labels and form labels.

- [ ] **Step 4: Increase oc-card hover opacity**

In `src/index.css`, find `.oc-card::before` radial gradient. Change:
```css
rgba(109, 212, 196, 0.06)
```
To:
```css
rgba(109, 212, 196, 0.12)
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Contact.tsx src/pages/Blog.tsx src/pages/Services.tsx src/pages/BookConsultation.tsx src/index.css
git commit -m "a11y: fix form focus rings (100% opacity), calendar dates, label sizes, card hover"
```

---

## Task 5: Footer — Remove Duplicate, Consolidate

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Remove the legacy light footer section**

The file currently has TWO footer sections:
1. Dark Outcrowd footer (lines ~386-457) — KEEP this
2. Light legacy footer (lines ~461-602) — REMOVE this, BUT keep the ISO certifications component

Move the `<ISOCertifications>` call from the light footer into the dark footer, just before the bottom bar.

The key changes:
- Remove the entire `<div className={...t.footerBg...}>` wrapper and everything inside it (light footer)
- Keep the `ISOCertifications` component definition (it's defined at the top of the file)
- Add `<ISOCertifications isLight={false} border="border-white/[0.06]" muted="text-white/50" />` inside the dark footer section, after the large wordmark and before the bottom bar

- [ ] **Step 2: Remove the now-unused `showAllLinks` state and related variables**

Since the light footer with Quick Links is removed, the `showAllLinks` state can be removed.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/Footer.tsx
git commit -m "fix: remove duplicate light footer — single dark Outcrowd footer with ISO seals"
```

---

## Task 6: Header Smoothing + Z-Index System

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/WhatsAppWidget.tsx`
- Modify: `src/components/CookieConsent.tsx`
- Modify: `src/components/SearchModal.tsx`
- Modify: `src/components/BackToTop.tsx`

- [ ] **Step 1: Add transition to header color switching**

In `src/components/Header.tsx`, find the main header element. Add `transition-colors duration-500` to the text color classes so the dark↔light transition is smooth, not abrupt.

Specifically, the brand text, nav pills container, nav links, search icon, CTA button, and burger bars should all have `transition-colors duration-300` in their className (many already do, verify all have it).

- [ ] **Step 2: Standardize z-index across all overlay components**

Apply this z-index system:

| Component | Current | New |
|-----------|---------|-----|
| BackToTop | `z-40` | `z-30` |
| WhatsAppWidget | `z-40` | `z-30` |
| CookieConsent | `z-50` | `z-40` |
| SearchModal backdrop | `z-[600]` | `z-[100]` |
| Header | `z-[500]` | `z-[50]` |
| Mobile menu overlay | `z-[499]` | `z-[49]` |

In each file, replace the z-index values:
- `BackToTop.tsx`: `z-40` → `z-30`
- `WhatsAppWidget.tsx`: `z-40` → `z-30`
- `CookieConsent.tsx`: `z-50` → `z-40`
- `SearchModal.tsx`: `z-[600]` → `z-[100]`
- `Header.tsx`: `z-[500]` → `z-[50]`, `z-[499]` → `z-[49]`

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/Header.tsx src/components/WhatsAppWidget.tsx src/components/CookieConsent.tsx src/components/SearchModal.tsx src/components/BackToTop.tsx
git commit -m "fix: smooth header transition + standardize z-index system across overlays"
```

---

## Task 7: Animations — Reduced Motion + Stagger Fix

**Files:**
- Modify: `src/components/Footer.tsx` (ISO seal rotation)
- Modify: `src/components/WhatsAppWidget.tsx` (pulse animation)
- Modify: `src/pages/Home.tsx` (industry float)
- Modify: `src/components/TextRevealOnScroll.tsx` (stagger timing)

- [ ] **Step 1: Add reduced-motion guard to ISO seal rotation**

In `src/components/Footer.tsx`, the ISO seal continuous rotation GSAP loop (inside `useGSAP`) already has a top-level reduced-motion check. Verify it covers the rotation block. If the rotation `gsap.to(band, { rotation: 360, repeat: -1 ...})` is outside the guard, wrap it.

- [ ] **Step 2: Fix WhatsApp pulse**

In `src/components/WhatsAppWidget.tsx`, the `animate-ping` class on the pulse ring is CSS-based and does NOT respect `prefers-reduced-motion`. Add a utility class:

Change:
```tsx
className="... animate-ping ..."
```
To:
```tsx
className="... motion-safe:animate-ping ..."
```

Tailwind's `motion-safe:` prefix only applies the animation when `prefers-reduced-motion: no-preference`.

- [ ] **Step 3: Fix industry card float animation**

In `src/pages/Home.tsx`, find the industry cards floating animation (the `gsap.to(card, { y: -8, repeat: -1, yoyo: true ...})` inside the industries `useGSAP`). Verify it's inside the `prefers-reduced-motion` check. If not, add:
```ts
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```
at the top of that `useGSAP` block.

- [ ] **Step 4: Fix TextRevealOnScroll stagger**

In `src/components/TextRevealOnScroll.tsx`, change the default stagger prop:
```ts
stagger = 0.015
```
To:
```ts
stagger = 0.035
```

This slows the character reveal to be perceivable (was 15ms per char = too fast).

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/Footer.tsx src/components/WhatsAppWidget.tsx src/pages/Home.tsx src/components/TextRevealOnScroll.tsx
git commit -m "a11y: fix reduced-motion on pulse/float/rotation + slower text reveal stagger"
```

---

## Task 8: Visual Polish — Borders, Spacing, Fonts, Section Transitions

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/home/HeroSection.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Fix invisible stat card borders**

In `src/pages/Home.tsx`, find stat cards with `border-[#e8e8e0]`. Change:
```
border border-[#e8e8e0]
```
To:
```
border border-[#d0cfc9]
```
This darkens the border for visibility on `#faf9f6` background (contrast goes from 1.1:1 to 1.4:1).

- [ ] **Step 2: Add section transition gradient**

In `src/index.css`, add a new utility class:

```css
.section-transition-dark-to-light {
  background: linear-gradient(to bottom, #191919 0%, #faf9f6 100%);
  height: 80px;
  margin-top: -1px;
}
```

Then in `src/pages/home/HeroSection.tsx`, add after the closing `</section>`:
```tsx
<div className="section-transition-dark-to-light" aria-hidden="true" />
```

This creates a smooth gradient between the dark hero and light content below.

- [ ] **Step 3: Standardize font usage**

In `src/pages/Home.tsx`, find any remaining `font-display` on section headings and replace with `font-heading`:
- stat numbers: keep `font-display` (these are numerical, Bebas Neue works)
- process card titles: `font-display` → `font-heading`
- everything else should already be `font-heading`

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/Home.tsx src/pages/home/HeroSection.tsx src/index.css
git commit -m "fix: stat card borders, dark→light section gradient, font consistency"
```

---

## Task 9: Final Push + Verification

- [ ] **Step 1: Run full build**

```bash
npx tsc --noEmit && npm run build
```
Expected: 0 errors, build succeeds.

- [ ] **Step 2: Push**

```bash
git push origin main
```

- [ ] **Step 3: Update code-review-graph**

```bash
code-review-graph update
```

---

## Verification Checklist

After all tasks:
- [ ] No `text-white/40` or `text-white/50` remains on dark backgrounds (search codebase)
- [ ] All form focus rings use `ring-brand-teal` (no opacity)
- [ ] CSP no longer contains `unsafe-inline` for scripts
- [ ] Rate limiter uses `x-real-ip` in all endpoints
- [ ] Only ONE footer exists (dark Outcrowd style)
- [ ] ISO seals are in the dark footer
- [ ] Z-index values are coordinated (no overlapping)
- [ ] WhatsApp pulse respects reduced-motion
- [ ] TextRevealOnScroll stagger is 0.035 (not 0.015)
- [ ] `sanitizeHTML` enforces `rel="noopener noreferrer"` on `target="_blank"` links
- [ ] TypeScript compiles with 0 errors
- [ ] Build succeeds
