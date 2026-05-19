# Frontend Guidelines

## Adviserve Website — React + TypeScript + Tailwind

**Version:** 1.0
**Last Updated:** 2026-04-01

---

## 1. Project Structure

```
src/
├── components/           # Shared UI components
│   ├── admin/            # Admin-specific reusable components
│   │   ├── ConfirmDialog.tsx
│   │   ├── Pagination.tsx
│   │   ├── SaveButton.tsx
│   │   ├── SearchInput.tsx
│   │   └── adminStyles.ts     # Shared admin design tokens
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AdminLayout.tsx
│   ├── SearchModal.tsx
│   ├── WhatsAppWidget.tsx
│   ├── CookieConsent.tsx
│   ├── CustomCursor.tsx
│   ├── ErrorBoundary.tsx
│   ├── SEOHead.tsx
│   ├── RichTextEditor.tsx
│   └── animations.tsx         # FadeUp, FadeIn, SlideUp wrappers
│
├── pages/                # Route-level page components
│   ├── Home.tsx
│   ├── home/             # Home page sub-sections
│   │   ├── HeroSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── WhyChooseSection.tsx
│   ├── Services.tsx
│   ├── ServiceCategory.tsx
│   ├── ServiceDetail.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx
│   ├── Contact.tsx
│   ├── About.tsx
│   ├── [... other pages]
│   └── admin/            # Admin page components (lazy-loaded)
│       ├── Dashboard.tsx
│       ├── BlogManagement.tsx
│       ├── Bookings.tsx
│       └── [... 17 more admin pages]
│
├── lib/                  # Core utilities and context
│   ├── api.ts            # API client (publicApi, formApi, adminApi)
│   ├── adminDb.ts        # Supabase-compatible QueryBuilder for admin
│   ├── AuthContext.tsx    # Auth provider + useAuth hook
│   ├── (deleted)          # Theme provider moved to components/ThemeProvider.tsx
│   ├── ScrollEngine.tsx   # Lenis + GSAP ScrollTrigger
│   ├── sanitize.ts       # DOMPurify strict config
│   ├── types.ts          # Shared TypeScript interfaces
│   ├── defaults.ts       # Fallback data when DB is empty
│   ├── constants.ts      # SITE_URL
│   ├── structuredData.ts # JSON-LD schema generators
│   ├── slugify.ts        # URL slug helper
│   ├── supabase.ts       # Supabase client (auth only)
│   └── themeClasses.ts   # Theme-aware CSS class generators
│
├── hooks/                # Custom React hooks
│   ├── usePageTracking.ts     # Analytics page view tracking
│   ├── useSiteContent.ts      # Fetch page content from API
│   ├── useSiteSettings.ts     # Fetch site settings from API
│   ├── useSiteAssets.ts       # Fetch logo/favicon
│   ├── useSEOSettings.ts      # Fetch SEO settings
│   ├── useScrollAnimations.ts # GSAP scroll animation helpers
│   └── useScrollReveal.ts     # Intersection observer reveals
│
├── App.tsx               # Root component + all routes
├── main.tsx              # Entry point
└── index.css             # Tailwind imports + custom CSS
```

---

## 2. Component Conventions

### File Naming

- **Pages:** PascalCase, match route name — `BookConsultation.tsx`, `ServiceDetail.tsx`
- **Components:** PascalCase — `SearchModal.tsx`, `WhatsAppWidget.tsx`
- **Hooks:** camelCase with `use` prefix — `useSiteContent.ts`
- **Utilities:** camelCase — `sanitize.ts`, `slugify.ts`

### Component Pattern

```tsx
// Standard page component structure
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { publicApi } from '../lib/api';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';

export default function PageName() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await publicApi.getSomething();
        setData(result);
      } catch {
        // Fallback to defaults
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col bg-[#faf9f6]">
      <SEOHead title="Page Title" description="..." />
      {/* Hero */}
      <section className="relative pt-[120px] pb-20">
        <FadeUp>
          {/* content */}
        </FadeUp>
      </section>
    </div>
  );
}
```

### Admin Page Pattern

```tsx
// Admin pages use adminDb (Supabase-compatible QueryBuilder)
import { adminDb } from '../../lib/adminDb';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await adminDb
      .from('table_name')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) setItems(data);
    setLoading(false);
  }

  // CRUD operations use adminDb.from('table').insert/update/delete
}
```

---

## 3. Styling Guidelines

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#faf9f6` | Page background (warm off-white) |
| **Text Primary** | `#1a1a2e` | Headings, body text |
| **Text Secondary** | `#5a5a6e` | Descriptions, subtitles |
| **Text Tertiary** | `#6b6b7e` / `#9a9aae` | Captions, labels |
| **Brand Teal** | `#6dd4c4` (Tailwind: `brand-teal`) | Accent color, CTAs, links |
| **Border** | `#e5e5dd` | Cards, dividers, inputs |
| **Surface** | `#f3f2ee` | Card backgrounds, hover states |
| **White** | `#ffffff` | Cards, modals, header (scrolled) |

### Typography (Dark Editorial Theme)

| Element | Style |
|---------|-------|
| **Display headings** | `font-display`, uppercase, tight tracking |
| **Code labels** | `font-mono`, 9–11px, uppercase, wide tracking |
| **Body text** | System sans-serif, 14–16px, relaxed leading |
| **Teal accents** | `text-brand-teal` for labels like `// 01.00 — Services` |

### Tailwind Patterns

```tsx
// Section spacing
<section className="py-20 lg:py-28 px-6 sm:px-12">

// Max width container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Card
<div className="bg-white border border-[#e5e5dd] rounded-2xl p-8">

// Button (primary)
<button className="font-mono text-[10px] uppercase tracking-[0.16em] bg-[#1a1a2e] text-white px-8 py-4 hover:bg-brand-teal transition-all">

// Button (secondary)
<button className="border border-[#e5e5dd] text-[#1a1a2e] px-7 py-[15px] hover:border-brand-teal hover:text-brand-teal transition-all">

// Input
<input className="w-full px-4 py-3.5 bg-[#faf9f6] border border-[#e5e5dd] text-[#1a1a2e] text-sm placeholder:text-[#c0c0c0] focus:outline-none focus:border-brand-teal/40 transition-colors" />

// Mono label
<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-teal">// Section Label</p>
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Default | 0–639px | Mobile (single column) |
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets (2-column grids) |
| `lg` | 1024px | Desktop (show/hide nav, 3-column) |
| `xl` | 1280px | Wide desktop |

### Touch Targets

All interactive elements must have a minimum 44x44px touch target:

```tsx
// Good — min-h-[44px] ensures touch target
<button className="px-4 py-2 min-h-[44px] inline-flex items-center">

// Good — padding creates adequate target
<Link className="py-3.5 inline-flex items-center min-h-[44px]">
```

---

## 4. Animation Guidelines

### GSAP Patterns

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function AnimatedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Always check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.card');
    gsap.fromTo(cards,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: sectionRef });

  return <section ref={sectionRef}>...</section>;
}
```

**Rules:**
- Always wrap GSAP in `useGSAP` (not `useEffect`) for proper cleanup
- Always check `prefers-reduced-motion` before animating
- Use `{ scope: ref }` to limit GSAP's DOM queries
- Avoid `pin: true` — it breaks layout. Use simple `scrub` parallax instead
- Keep animations subtle — max 60px translate, 0.8s duration

### FadeUp Component

```tsx
// For simple scroll reveals, use the FadeUp wrapper
import { FadeUp } from '../components/animations';

<FadeUp>
  <h2>This fades in on scroll</h2>
</FadeUp>

<FadeUp delay={0.15}>
  <p>This fades in slightly later</p>
</FadeUp>
```

---

## 5. Data Fetching

### Public Pages

Use `publicApi` from `src/lib/api.ts`:

```tsx
const posts = await publicApi.getBlogPosts();
const service = await publicApi.getService('hr-advisory');
const settings = await publicApi.getSettings(['company_email', 'company_phone']);
```

### CMS Content

Use `useSiteContent` hook for page-specific content:

```tsx
const { content } = useSiteContent('home');
// content.hero_title, content.hero_subtitle, etc.
// Falls back to defaults if empty
```

### Admin Pages

Use `adminDb` (mirrors Supabase API):

```tsx
// Select
const { data } = await adminDb.from('blog_posts').select('*').eq('status', 'published');

// Insert
const { data } = await adminDb.from('blog_posts').insert({ title, slug, content, status: 'draft' });

// Update
const { error } = await adminDb.from('blog_posts').update({ title }).eq('id', postId);

// Delete
const { error } = await adminDb.from('blog_posts').delete().eq('id', postId);

// Count
const { count } = await adminDb.from('blog_posts').select('*', { count: 'exact', head: true });
```

---

## 6. SEO

Every page must include `<SEOHead>`:

```tsx
<SEOHead
  title="Page Title"                          // Appended to site name
  description="Page description for search"
  canonical="https://adviserve-website.vercel.app/page"
  structuredData={generateSomeSchema(...)}    // Optional JSON-LD
/>
```

Available schema generators in `src/lib/structuredData.ts`:
- `generateOrganizationSchema()`
- `generateServiceSchema()`
- `generateBlogPostSchema()`
- `generateFAQSchema()`
- `generateBreadcrumbSchema()`

---

## 7. Error Handling

- **ErrorBoundary** wraps the entire app — catches React render errors
- **Loading states:** Every page shows shimmer/skeleton while fetching
- **Fallback data:** `src/lib/defaults.ts` provides fallback content when API fails
- **Toast notifications:** Admin operations show success/error via `react-hot-toast`
- **Form validation:** Client-side validation before API call, server re-validates

---

## 8. Performance Rules

| Rule | Implementation |
|------|----------------|
| Admin pages are lazy-loaded | `React.lazy()` + `Suspense` in App.tsx |
| No admin code in public bundle | Separate chunk via dynamic import |
| Images use `loading="lazy"` | Applied to all `<img>` tags |
| Fonts: system stack for body | No web font download for body text |
| Fonts: display font loaded via CSS | `font-display: swap` |
| No unnecessary re-renders | `useMemo` for derived data, stable deps in `useEffect` |
| Debounced search | 300ms debounce on SearchModal input |
| API response caching | `Cache-Control` headers on GET endpoints |
