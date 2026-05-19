# Adviserve Website — Manual Test Cases

> **Total test cases: 180+**
> Test on: Chrome, Firefox, Safari, Edge | Desktop, Tablet (iPad), Mobile (iPhone, Android)
> Mark each: PASS / FAIL / SKIP | Add notes for failures

---

## 1. Homepage (`/`)

### 1.1 Hero Section
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.1.1 | Page loads without blank screen | Hero text visible within 1 second | |
| 1.1.2 | "recruit. consult. transform." text animation | Words slide up sequentially with stagger delay | |
| 1.1.3 | "transform." shows as ghost/outline text | Visible with stroke outline, not invisible | |
| 1.1.4 | Hero subtitle displays correct copy | "Adviserve is a new-age services firm..." | |
| 1.1.5 | "Talk to Us" button links to `/contact` | Navigates to contact page | |
| 1.1.6 | "See What We Do" button links to `/services` | Navigates to services page | |
| 1.1.7 | Buttons have hover effects | Background color changes on hover | |
| 1.1.8 | Hero section has proper top padding | Content doesn't overlap with fixed header | |

### 1.2 Marquee Ticker
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.2.1 | Ticker scrolls continuously | Horizontal scroll loop, no gaps | |
| 1.2.2 | Ticker pauses on hover | Animation pauses when mouse hovers | |
| 1.2.3 | Ticker shows service keywords | Recruitment, HR Services, Legal Advisory, etc. | |

### 1.3 About / Stats Section
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.3.1 | Section fades in on scroll | FadeUp animation triggers when scrolled into view | |
| 1.3.2 | Stats grid shows 4 items | "6 Service Verticals", "All Sizes", "End-to-End", "Real" | |
| 1.3.3 | About body text matches PDF | "Most businesses waste time jumping between..." | |
| 1.3.4 | Stats grid responsive | 2 columns on mobile, 4 on desktop | |

### 1.4 Services Accordion
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.4.1 | 6 service rows displayed | HR, Recruitment, Consulting, Legal, IT, Development | |
| 1.4.2 | Each row links to service detail page | Clicking navigates to `/services/{slug}` | |
| 1.4.3 | Row hover effect works | Background highlight + teal color on name | |
| 1.4.4 | Arrow icon changes on hover | Border and icon color change to teal | |
| 1.4.5 | Tags visible on desktop | Service tags shown on large screens | |
| 1.4.6 | Tags hidden on mobile | Tags not visible on small screens | |
| 1.4.7 | "View All" link goes to `/services` | Navigates correctly | |

### 1.5 Process Section
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.5.1 | 4 process steps displayed | Listen, Propose, Execute, Measure | |
| 1.5.2 | Hover shows teal top border animation | Border scales from left on hover | |
| 1.5.3 | Ghost numbers visible in background | Large semi-transparent numbers | |
| 1.5.4 | Responsive grid | 1 col mobile, 2 col tablet, 4 col desktop | |

### 1.6 Industries Section
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.6.1 | 6 industry cards displayed | Technology, Healthcare, Finance, Manufacturing, E-Commerce, Education | |
| 1.6.2 | Icons scale on hover | Icon grows slightly on hover | |
| 1.6.3 | Responsive grid | 2 col mobile, 3 col tablet, 6 col desktop | |

### 1.7 Testimonials
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.7.1 | Testimonial quote displays | Founder quote with attribution | |
| 1.7.2 | Previous/Next buttons work | Navigates between testimonials | |
| 1.7.3 | Dot indicators show active state | Active dot is wider and teal | |
| 1.7.4 | Click on dots changes testimonial | Navigates to clicked testimonial | |
| 1.7.5 | Touch targets adequate | Buttons at least 44px | |

### 1.8 Why Choose Section
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.8.1 | 4 value prop cards displayed | Everything in one place, Built for business, Ownership, Startup energy | |
| 1.8.2 | Cards have hover effect | Border color changes on hover | |
| 1.8.3 | Large numbers displayed | 01, 02, 03, 04 with proper styling | |

### 1.9 CTA Section
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.9.1 | Heading matches PDF | "Let's figure out what your business needs." | |
| 1.9.2 | "Book a Free Call" links to `/contact` | Navigates correctly | |
| 1.9.3 | "Learn More" links to `/about` | Navigates correctly | |
| 1.9.4 | Background glow effect visible | Radial gradient teal glow | |

---

## 2. Navigation & Header

### 2.1 Desktop Navigation
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 2.1.1 | Logo links to homepage | Clicking logo navigates to `/` | |
| 2.1.2 | Logo image loads | Image displays without broken icon | |
| 2.1.3 | "ADVISERVE" text visible | Display font text next to logo | |
| 2.1.4 | Nav links match menu items | Home, Services, About, Case Studies, Careers, Blog, Contact | |
| 2.1.5 | Active page highlighted | Current page link has full-width underline | |
| 2.1.6 | Hover underline animation | Teal underline grows from left on hover | |
| 2.1.7 | "Contact" CTA button visible | Separate button on right side | |
| 2.1.8 | Header transparent on top | No background when at top of page | |
| 2.1.9 | Header blur on scroll | Background appears with blur after scrolling 20px | |

### 2.2 Mobile Navigation
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 2.2.1 | Hamburger menu visible on mobile | Three-line icon shown below lg breakpoint | |
| 2.2.2 | Hamburger animates to X | Lines rotate to form X when open | |
| 2.2.3 | Mobile menu opens on tap | Overlay slides down with menu items | |
| 2.2.4 | Backdrop blur behind menu | Semi-transparent overlay | |
| 2.2.5 | Menu items stagger animation | Items appear one by one with delay | |
| 2.2.6 | Tapping link closes menu | Menu closes and navigates | |
| 2.2.7 | Body scroll locked when open | Page behind menu doesn't scroll | |
| 2.2.8 | Active page shown with teal dot | Current page has indicator dot | |

---

## 3. Footer

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 3.1 | Newsletter email input works | Can type email, submit subscribes | |
| 3.2 | Newsletter shows "Done" on success | Button text changes to "Done" | |
| 3.3 | Newsletter handles empty email | Form validation prevents empty submit | |
| 3.4 | Brand tagline matches PDF | "We help startups, growing businesses..." | |
| 3.5 | Quick links navigate correctly | All 7+ links go to correct pages | |
| 3.6 | Service links include all 6 | HR, Recruitment, Consulting, Legal, IT, Development | |
| 3.7 | Contact info displays from settings | Email, phone, address from Supabase | |
| 3.8 | Social links open in new tab | External links use target="_blank" | |
| 3.9 | Copyright year is current | Shows 2026 (or current year) | |
| 3.10 | Privacy and Terms links work | Navigate to legal pages | |

---

## 4. Services Page (`/services`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 4.1 | Heading matches PDF | "Six services. One team. Zero handoff headaches." | |
| 4.2 | Subtitle matches PDF | "Businesses don't run in silos..." | |
| 4.3 | Search bar filters services | Typing filters service list in real-time | |
| 4.4 | Clear search (X) resets list | Clicking X shows all services | |
| 4.5 | Service count updates on filter | "Showing X services" reflects filtered count | |
| 4.6 | Service cards link to detail pages | Clicking navigates to `/services/{slug}` | |
| 4.7 | Empty search shows message | "No matches found" with clear button | |
| 4.8 | Loading skeleton shows first | Shimmer cards during data fetch | |

---

## 5. Service Detail Pages (`/services/:slug`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 5.1 | Service title displays | Correct service name from DB | |
| 5.2 | Service description shows | Full HTML content rendered | |
| 5.3 | Breadcrumbs navigable | Home > Services > Category > Service links work | |
| 5.4 | Sidebar CTA visible on desktop | "Ready to Take the Next Step?" card | |
| 5.5 | Sidebar sticky on desktop only | Sidebar scrolls with page on mobile | |
| 5.6 | Related services show | Up to 3 sibling services displayed | |
| 5.7 | Non-existent slug shows error | Helpful message with link back to services | |

---

## 6. About Page (`/about`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 6.1 | Heading matches PDF | "We started Adviserve because we kept seeing the same problem." | |
| 6.2 | Origin story paragraphs display | 4 paragraphs about vendor coordination problem | |
| 6.3 | Mission section shows | "What we're here to do" heading with body | |
| 6.4 | 4 values displayed | Honesty, Ownership, Depth, Growth | |
| 6.5 | Team section shows | "The people behind Adviserve" | |
| 6.6 | FadeUp animations trigger on scroll | Sections animate in as you scroll | |

---

## 7. Blog Page (`/blog`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 7.1 | Blog listing loads | Posts displayed in grid layout | |
| 7.2 | Search filters by title/excerpt | Real-time filtering works | |
| 7.3 | Featured post (first) is larger | First post spans 2 columns on desktop | |
| 7.4 | Post cards show: image, category, date, title, excerpt | All metadata visible | |
| 7.5 | "Read article" links work | Navigate to `/blog/{slug}` | |
| 7.6 | Empty state shows message | "No articles found" when no posts | |
| 7.7 | Loading skeleton visible | Shimmer cards during fetch | |

---

## 8. Blog Post Page (`/blog/:slug`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 8.1 | Post title and content display | Full article renders | |
| 8.2 | "Back to Blog" link works | Navigates to `/blog` | |
| 8.3 | Category badge visible | Styled badge above title | |
| 8.4 | Date, author, reading time shown | Metadata below title | |
| 8.5 | Share buttons work | Twitter, LinkedIn, Facebook open share dialogs | |
| 8.6 | Share button touch targets | Minimum 44px size | |
| 8.7 | Back to top button appears on scroll | Visible after scrolling 500px | |
| 8.8 | Non-existent slug shows error | "Post not found" with link to blog | |

---

## 9. Contact Page (`/contact`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 9.1 | Heading matches PDF | "Let's have a proper conversation." | |
| 9.2 | All form fields render | Name, Email, Phone, Company, Service Interest, Message | |
| 9.3 | Service interest dropdown options | HR, Recruitment, Business Consulting, Legal, IT, Development, Not sure yet | |
| 9.4 | Required field validation | Name, Email, Message required — form won't submit without | |
| 9.5 | Successful submission shows thank you | Success message with "Send another" button | |
| 9.6 | Submission saves to Supabase | Check `contact_inquiries` table for new row | |
| 9.7 | Email auto-subscribes to newsletter | Check `email_subscribers` for contact email | |
| 9.8 | Error state displays | Network error shows retry message | |
| 9.9 | Reassurance text visible | "No spam. No automated sales sequences..." | |
| 9.10 | FAQ accordion toggles | Click question to expand/collapse answer | |
| 9.11 | Only one FAQ open at a time | Opening one closes others | |
| 9.12 | Contact sidebar info displays | Email, phone, address from settings | |
| 9.13 | Business hours visible | Mon-Fri 9-6 IST, Sat 10-2, Sun closed | |

---

## 10. Careers Page (`/careers`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 10.1 | Page loads with content | Hero, why section, culture highlights | |
| 10.2 | Job listings section shows | Either open roles or empty state | |
| 10.3 | Empty state has mailto link | "Send your CV to careers@adviserve.org.in" | |

---

## 11. Case Studies Page (`/case-studies`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 11.1 | Page loads with case study cards | Grid of case study items | |
| 11.2 | Cards have staggered animation | FadeUp with delay per card | |
| 11.3 | CTA section at bottom | Contact CTA with link | |

---

## 12. 404 Page (any invalid URL)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 12.1 | Visit `/nonexistent-page` | 404 page displays | |
| 12.2 | Heading matches PDF | "This page doesn't exist. But we do." | |
| 12.3 | Subtext matches PDF | "Looks like something went wrong..." | |
| 12.4 | "Back to homepage" button works | Navigates to `/` | |
| 12.5 | "Go Back" button works | Browser history back | |
| 12.6 | Quick links visible | Services, Blog, About, Contact | |

---

## 13. Unsubscribe Page (`/unsubscribe`)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 13.1 | Visit with `?email=test@test.com` | Auto-submits unsubscribe | |
| 13.2 | Success state shows | "You've been unsubscribed" with checkmark | |
| 13.3 | Email not found shows message | "Email not found" with amber icon | |
| 13.4 | Visit without email param | Shows manual email input form | |
| 13.5 | Manual unsubscribe works | Enter email, click unsubscribe, success | |
| 13.6 | "Return to homepage" link works | Navigates to `/` | |

---

## 14. Authentication & Admin Access

### 14.1 Login (`/admin/login`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 14.1.1 | Login page renders | Email, password fields, sign in button | |
| 14.1.2 | Valid credentials login | Redirects to `/admin` dashboard | |
| 14.1.3 | Invalid credentials show error | Red error message displayed | |
| 14.1.4 | Toggle to Sign Up mode | Form switches to "Create Account" | |
| 14.1.5 | Empty fields prevented | Form validation on required fields | |
| 14.1.6 | "Back to website" link works | Navigates to `/` | |
| 14.1.7 | Loading state during auth | Button shows "Please wait..." | |

### 14.2 Protected Routes
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 14.2.1 | Visit `/admin` without login | Redirects to `/admin/login` | |
| 14.2.2 | Sign out from admin | Clears session, redirects to login | |
| 14.2.3 | Session persists on refresh | Stays logged in after page reload | |

---

## 15. Admin Panel

### 15.1 Dashboard (`/admin`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.1.1 | Stats cards show counts | Services, Posts, Inquiries, Subscribers | |
| 15.1.2 | Stats link to respective pages | Clicking card navigates correctly | |
| 15.1.3 | Quick actions visible | New Post, Inquiries, Campaign, Subscribers | |

### 15.2 Admin Sidebar
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.2.1 | Sidebar scrolls | All nav items accessible by scrolling | |
| 15.2.2 | Active page highlighted teal | Current page has teal background | |
| 15.2.3 | Collapse button works | Sidebar shrinks to icon-only | |
| 15.2.4 | Collapsed shows tooltips | Hovering icon shows page name | |
| 15.2.5 | User email displayed | Current user email at bottom | |
| 15.2.6 | Sign Out button works | Logs out and redirects | |
| 15.2.7 | Mobile sidebar opens/closes | Hamburger toggles drawer | |
| 15.2.8 | Mobile overlay closes on click | Clicking backdrop closes sidebar | |

### 15.3 Services Management (`/admin/services`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.3.1 | Service list loads | Table with all services | |
| 15.3.2 | Add new service | Fill form, save, appears in list | |
| 15.3.3 | Edit service | Click edit, modify fields, save | |
| 15.3.4 | Delete service | Click delete, confirm, removed from list | |
| 15.3.5 | Toggle visibility | Eye icon toggles is_visible | |
| 15.3.6 | Required field validation | Can't save without title/slug | |

### 15.4 Blog Management (`/admin/blog`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.4.1 | Post list loads | Table with all blog posts | |
| 15.4.2 | Create new post | Fill form with rich text editor, save | |
| 15.4.3 | Edit existing post | Load form with data, modify, save | |
| 15.4.4 | Delete post | Confirm deletion, removed from list | |
| 15.4.5 | Publish/Unpublish toggle | Status changes between draft/published | |
| 15.4.6 | Rich text editor works | Bold, italic, headings, links, lists | |
| 15.4.7 | Published post appears on `/blog` | Frontend shows published posts only | |

### 15.5 Contact Inquiries (`/admin/inquiries`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.5.1 | Inquiries list loads | Cards with inquiry details | |
| 15.5.2 | Filter by status | All, New, In Progress, Resolved, Archived | |
| 15.5.3 | Change inquiry status | Dropdown updates status immediately | |
| 15.5.4 | New inquiry from contact form appears | Submit contact form, check admin | |

### 15.6 Email Subscribers (`/admin/email-subscribers`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.6.1 | Subscriber list loads | Table with emails and status | |
| 15.6.2 | Add subscriber manually | Enter email, click add | |
| 15.6.3 | Search subscribers | Filter by email/name | |
| 15.6.4 | Delete subscriber | Remove from list with confirmation | |
| 15.6.5 | Status filter works | Active, Unsubscribed, Bounced | |

### 15.7 Site Settings (`/admin/settings`)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.7.1 | Template selector shows 2 options | Dark Editorial and Light Clean | |
| 15.7.2 | Switching template updates site | Body class changes, colors update | |
| 15.7.3 | Active template shows badge | "Active" label on current template | |
| 15.7.4 | Logo upload via file picker | Select image, uploads and previews | |
| 15.7.5 | Logo upload via URL | Enter URL, click save, logo updates | |
| 15.7.6 | Favicon upload works | Same as logo but for favicon | |
| 15.7.7 | Remove logo | X button clears logo | |
| 15.7.8 | Company info saves | Name, tagline saved to Supabase | |
| 15.7.9 | Contact info saves | Email, phone, address saved | |
| 15.7.10 | Social links save | All 6 social URL fields save | |
| 15.7.11 | Success message appears | Green banner after save | |
| 15.7.12 | Error message appears | Red banner on failure | |

### 15.8 Other Admin Pages
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 15.8.1 | Menu Management loads | Can view/edit navigation items | |
| 15.8.2 | Page Management loads | Can view/manage custom pages | |
| 15.8.3 | SEO Management loads | Can edit per-page SEO meta | |
| 15.8.4 | Legal Documents loads | Can create/edit legal docs | |
| 15.8.5 | Home Page Editor loads | Can edit homepage sections | |
| 15.8.6 | About Page Editor loads | Can edit about page content | |
| 15.8.7 | Contact Page Editor loads | Can edit contact page content | |
| 15.8.8 | Footer Editor loads | Can edit footer content | |
| 15.8.9 | Analytics Dashboard loads | Shows page view data | |
| 15.8.10 | Email Lists loads | Can manage email lists | |
| 15.8.11 | Email Templates loads | Can manage templates | |
| 15.8.12 | Email Campaigns loads | Can manage campaigns | |

---

## 16. Animations & Visual Effects

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 16.1 | FadeUp triggers on scroll | Elements animate upward as they enter viewport | |
| 16.2 | Staggered delays on card grids | Cards appear one after another, not all at once | |
| 16.3 | Custom cursor visible on desktop | Teal dot + ring follow mouse | |
| 16.4 | Cursor enlarges on interactive elements | Dot grows on links/buttons | |
| 16.5 | No custom cursor on touch devices | Standard cursor on mobile/tablet | |
| 16.6 | Smooth scroll works | Scrolling feels buttery, not jumpy | |
| 16.7 | Admin sidebar not affected by Lenis | Sidebar scrolls normally (native scroll) | |
| 16.8 | Marquee animation continuous | No gaps or jumps in ticker loop | |

---

## 17. Responsive Design

### 17.1 Mobile (< 640px)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 17.1.1 | No horizontal overflow | No sideways scrollbar on any page | |
| 17.1.2 | Hamburger menu works | Mobile nav accessible | |
| 17.1.3 | Hero text readable | Font clamp reduces size appropriately | |
| 17.1.4 | Cards stack to 1 column | Service/blog cards single column | |
| 17.1.5 | Form inputs full width | Touch-friendly input sizing | |
| 17.1.6 | Touch targets >= 44px | All buttons/links tappable | |
| 17.1.7 | Decorative blurs hidden | Large blur circles not rendered on mobile | |

### 17.2 Tablet (640px - 1024px)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 17.2.1 | 2-column grids work | Services, blog use 2-col layout | |
| 17.2.2 | Navigation pill nav visible | Or hamburger menu, depending on breakpoint | |
| 17.2.3 | Sidebar works (admin) | Collapsible or drawer mode | |

### 17.3 Desktop (> 1024px)
| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 17.3.1 | Full navigation visible | All nav links + CTA button | |
| 17.3.2 | Multi-column grids work | 3-4-6 column layouts render correctly | |
| 17.3.3 | Hover effects active | All hover animations work | |
| 17.3.4 | Sticky sidebar (admin) | Sidebar fixed on scroll | |

---

## 18. SEO & Meta Tags

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 18.1 | Homepage has correct title | "India's Trusted HR, Recruitment & Business Advisory Partner" | |
| 18.2 | Each page has unique meta description | Check via View Source or SEO tool | |
| 18.3 | OG tags present | og:title, og:description, og:image, og:url | |
| 18.4 | Twitter card tags present | twitter:card, twitter:title, twitter:description | |
| 18.5 | Canonical URL set | Correct canonical on each page | |
| 18.6 | Structured data (JSON-LD) | Organization schema on homepage | |
| 18.7 | Favicon loads | Browser tab shows correct icon | |

---

## 19. Performance

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 19.1 | Homepage loads < 3 seconds | On broadband connection | |
| 19.2 | Lighthouse score > 80 | Run Lighthouse audit in Chrome DevTools | |
| 19.3 | No CLS (layout shift) | Content doesn't jump during load | |
| 19.4 | Images lazy loaded | Images below fold load on scroll | |
| 19.5 | Admin pages lazy loaded | Bundle splits for admin routes | |
| 19.6 | Animations smooth at 60fps | No jank during scroll animations | |

---

## 20. Error Handling

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 20.1 | Invalid URL shows 404 | Visit `/xyz123` — 404 page renders | |
| 20.2 | Missing Supabase data uses fallback | Site works even without DB data | |
| 20.3 | Network error shows graceful message | Disconnect internet, forms show error | |
| 20.4 | Broken logo image hides gracefully | No broken image icon | |
| 20.5 | Admin form errors display | Red error messages on save failures | |
| 20.6 | Toast notifications show | Success/error toasts in admin panel | |

---

## 21. Security

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 21.1 | XSS in contact form message | HTML tags escaped, not rendered | |
| 21.2 | XSS in search fields | Script tags don't execute | |
| 21.3 | Admin routes protected | Cannot access without auth | |
| 21.4 | RLS enforced | Anon users can't write to admin tables | |
| 21.5 | No secrets in frontend code | API keys are anon-only (public) | |

---

## 22. Cross-Browser Compatibility

| # | Browser | Desktop | Mobile | Status |
|---|---------|---------|--------|--------|
| 22.1 | Chrome | Test all pages | Test responsive | |
| 22.2 | Firefox | Test all pages | Test responsive | |
| 22.3 | Safari | Test all pages | Test on iPhone | |
| 22.4 | Edge | Test all pages | Test responsive | |

---

## 23. Accessibility

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 23.1 | Tab navigation works | Can navigate entire site with keyboard | |
| 23.2 | Skip to content link | Hidden link visible on focus, jumps to main | |
| 23.3 | Focus visible on all elements | Blue/teal outline on focused elements | |
| 23.4 | Alt text on images | All images have meaningful alt text | |
| 23.5 | Form labels associated | Labels linked to inputs with htmlFor | |
| 23.6 | ARIA labels on icon buttons | Screen readers announce button purpose | |
| 23.7 | Color contrast sufficient | Text readable on dark background | |
| 23.8 | Headings in logical order | H1 > H2 > H3 hierarchy maintained | |

---

## 24. Theme Switching

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 24.1 | Dark theme is default | Site loads with navy background | |
| 24.2 | Switch to light theme via admin | Settings > Template > Light Clean | |
| 24.3 | Light theme applies immediately | Background white, text dark, pill nav | |
| 24.4 | Theme persists on page reload | Refresh browser, theme stays | |
| 24.5 | Switch back to dark | Settings > Template > Dark Editorial | |
| 24.6 | All pages respect theme | Check Home, Services, About, Contact, Blog | |
| 24.7 | Header changes per theme | Pill nav (light) vs mono nav (dark) | |
| 24.8 | Footer changes per theme | Light/dark color variants | |

---

## 25. Data Flow (End-to-End)

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 25.1 | Submit contact form | Row appears in `contact_inquiries` + `email_subscribers` | |
| 25.2 | Subscribe via footer newsletter | Row appears in `email_subscribers` | |
| 25.3 | Unsubscribe via link | Status changes to 'unsubscribed' in DB | |
| 25.4 | Create blog post in admin | Post appears on `/blog` (if published) | |
| 25.5 | Create service in admin | Service appears on `/services` (if visible) | |
| 25.6 | Update site settings | Footer/header reflect new values | |
| 25.7 | Upload logo in admin | Logo updates across header/footer | |
| 25.8 | Change inquiry status | Status badge updates in admin list | |

---

## Test Environment Checklist

- [ ] Supabase project active and accessible
- [ ] Environment variables set correctly on Vercel
- [ ] Database tables seeded with initial data
- [ ] Admin user created (admin@adviserve.org.in)
- [ ] All pages deployed and accessible
- [ ] Browser DevTools console clear of errors
- [ ] Network tab shows 200 responses for Supabase API calls

---

## Notes

- **Test URL:** https://adviserve-website.vercel.app
- **Admin URL:** https://adviserve-website.vercel.app/admin/login
- **Supabase Dashboard:** https://supabase.com/dashboard/project/wwwzlvdqslccuthmpqam
