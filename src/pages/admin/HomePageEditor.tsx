import { useEffect, useRef, useState } from 'react';
import { Save } from 'lucide-react';
import { HomeHeroSection } from './sections/HomeHeroSection';
import { HomeServicesSection } from './sections/HomeServicesSection';
import { HomeWhySection } from './sections/HomeWhySection';
import { HomeFAQSection } from './sections/HomeFAQSection';
import { HomeCTASection } from './sections/HomeCTASection';
import { HomeFramingSection } from './sections/HomeFramingSection';
import { HomeKickoffSection } from './sections/HomeKickoffSection';
import { HomeCompatSection } from './sections/HomeCompatSection';
import { upload } from '@vercel/blob/client';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';

interface ContentBlock {
  id?: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
  display_order: number;
  is_visible: boolean;
}

interface ServiceVertical {
  number: string;
  name: string;
  description: string;
  outcomes: [string, string][];
  href: string;
  imageUrl: string;
  reverse: boolean;
}

interface WhyStatItem { n: number; suf: string; t: string; s: string; }
interface FAQItem { q: string; a: string; }
interface WhyChooseItem { title: string; description: string; imageUrl?: string; }
interface FrameworkCardEdit { label: string; heading: string; body: string; backHeading: string; backBody: string; }
interface KickoffNodeEdit { pill: string; heading: string; body: string; }

interface HeroFieldVisibility {
  badge: boolean;
  h1_line1: boolean;
  h1_line2: boolean;
  credibility_line: boolean;
  primary_cta: boolean;
  secondary_cta: boolean;
  trust_strip: boolean;
  video: boolean;
}
const DEFAULT_HERO_FIELD_VIS: HeroFieldVisibility = {
  badge: true, h1_line1: true, h1_line2: true, credibility_line: true,
  primary_cta: true, secondary_cta: true, trust_strip: true, video: true,
};

interface FramingFieldVisibility { badge: boolean; heading: boolean; body1: boolean; body2: boolean; cta: boolean; }
const DEFAULT_FRAMING_FIELD_VIS: FramingFieldVisibility = { badge: true, heading: true, body1: true, body2: true, cta: true };

interface PracticesFieldVisibility { badge: boolean; heading: boolean; }
const DEFAULT_PRACTICES_FIELD_VIS: PracticesFieldVisibility = { badge: true, heading: true };

interface ProductsFieldVisibility { badge: boolean; title: boolean; description: boolean; }
const DEFAULT_PRODUCTS_FIELD_VIS: ProductsFieldVisibility = { badge: true, title: true, description: true };

interface WhyFieldVisibility { badge: boolean; title: boolean; stats: boolean; }
const DEFAULT_WHY_FIELD_VIS: WhyFieldVisibility = { badge: true, title: true, stats: true };

interface CtaFieldVisibility { badge: boolean; heading: boolean; description: boolean; primary_cta: boolean; secondary_cta: boolean; reassurance: boolean; }
const DEFAULT_CTA_FIELD_VIS: CtaFieldVisibility = { badge: true, heading: true, description: true, primary_cta: true, secondary_cta: true, reassurance: true };

interface LogoCloudLogo { url: string; alt: string; link?: string; }
interface LogoCloudFieldVisibility { heading: boolean; }
const DEFAULT_LOGO_CLOUD_FIELD_VIS: LogoCloudFieldVisibility = { heading: true };

export default function HomePageEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Hero ──
  const [heroBadgeText, setHeroBadgeText] = useState('DPIIT-RECOGNISED · ISO 9001 IN PROGRESS');
  const [heroTitle, setHeroTitle] = useState('You build what you do best.');
  const [heroH1Prefix, setHeroH1Prefix] = useState('We own the');
  const [heroSubtitle, setHeroSubtitle] = useState('Compliance-first · AI-augmented · Always transparent');
  const [heroCtaText, setHeroCtaText] = useState('Book a 30-min scoping call →');
  const [heroCtaLink, setHeroCtaLink] = useState('/book');
  const [heroSecondaryText, setHeroSecondaryText] = useState('See what we ship');
  const [heroSecondaryLink, setHeroSecondaryLink] = useState('/products');
  const [scramblePhrases, setScramblePhrases] = useState<string[]>([
    'Hiring.', 'Payroll.', 'Compliance.', 'Contracts.', 'Training.', 'Infrastructure.', 'Audits.',
  ]);
  const [heroTrustItems, setHeroTrustItems] = useState<string[]>([
    '3,000+ placements', 'DPDP-ready', 'ISO 9001 / 20000 / 27001', 'Since 2017',
  ]);
  const [heroVisible, setHeroVisible] = useState(true);
  const [heroVideoUrl, setHeroVideoUrl] = useState('/Hero-BG.mp4');
  const [heroVideoUploading, setHeroVideoUploading] = useState(false);
  const [heroVideoProgress, setHeroVideoProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [heroFieldVis, setHeroFieldVis] = useState<HeroFieldVisibility>(DEFAULT_HERO_FIELD_VIS);
  const [framingFieldVis, setFramingFieldVis] = useState<FramingFieldVisibility>(DEFAULT_FRAMING_FIELD_VIS);
  const [practicesFieldVis, setPracticesFieldVis] = useState<PracticesFieldVisibility>(DEFAULT_PRACTICES_FIELD_VIS);
  const [productsFieldVis, setProductsFieldVis] = useState<ProductsFieldVisibility>(DEFAULT_PRODUCTS_FIELD_VIS);
  const [whyFieldVis, setWhyFieldVis] = useState<WhyFieldVisibility>(DEFAULT_WHY_FIELD_VIS);
  const [ctaFieldVis, setCtaFieldVis] = useState<CtaFieldVisibility>(DEFAULT_CTA_FIELD_VIS);

  // ── Practices & Testimonials headings ──
  const [practicesSectionHeading, setPracticesSectionHeading] = useState('What we actually do.');
  const [testimonialsSectionHeading, setTestimonialsSectionHeading] = useState('The people we work for.');

  // ── Service Verticals ──
  const [serviceVerticals, setServiceVerticals] = useState<ServiceVertical[]>([]);
  const [serviceVerticalsVisible, setServiceVerticalsVisible] = useState(true);

  // ── Why Adviserve ──
  const [whySectionTitle, setWhySectionTitle] = useState('Four proofs you can verify.');
  const [whyBadge, setWhyBadge] = useState('WHY ADVISERVE');
  const [whyStats, setWhyStats] = useState<WhyStatItem[]>([
    { n: 3000, suf: '+', t: 'Placements shipped', s: 'Across manufacturing, fintech, SaaS' },
    { n: 48, suf: ' hrs', t: 'Average kickoff', s: 'From scoping call to live team' },
    { n: 100, suf: '%', t: 'Statutory compliance', s: 'PF, ESI, POSH, DPDP across clients' },
    { n: 1, suf: '', t: 'Throat to choke', s: 'One contract, one SLA, one team' },
  ]);

  // ── FAQ ──
  const [faqSectionTitle, setFaqSectionTitle] = useState('The questions operators actually ask.');
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    { q: "What’s the difference between an HRMS and an HRIS?", a: "An HRIS is the database of record for people data. An HRMS adds workflow — payroll, leave, lifecycle, case management — on top." },
    { q: 'Is DPDP Act 2023 applicable to small businesses in India?', a: "Yes, with almost no carve-outs. Penalties run up to ₹250 crore per instance." },
    { q: 'How long does a DPDP compliance project take?', a: 'A standard engagement runs 10–14 weeks.' },
    { q: "What’s included in corporate training engagements?", a: "Assessment, curriculum design, facilitators, post-training reinforcement, and a written outcomes brief." },
    { q: 'Do you work with startups or only enterprises?', a: "Both. Our smallest active client is a 14-person seed-stage fintech; our largest is a listed manufacturer." },
    { q: 'How fast can you ramp up recruitment?', a: '48 hours to embedded team, 7 days to first calibrated shortlist, typical time-to-offer of 22 days.' },
  ]);

  // ── CTA ──
  const [ctaTitle, setCtaTitle] = useState("Let’s figure out what your business actually needs.");
  const [ctaDescription, setCtaDescription] = useState('No sales pitch. No long forms. Just a straight conversation about where you are and how we can help.');
  const [ctaButtonText, setCtaButtonText] = useState('Book a call →');
  const [ctaButtonLink, setCtaButtonLink] = useState('/book');
  const [ctaVisible, setCtaVisible] = useState(true);

  // ── Products Header ──
  const [productsHeaderBadge, setProductsHeaderBadge] = useState('PRODUCTS');
  const [productsHeaderTitle, setProductsHeaderTitle] = useState('Your organization, managed your way.');
  const [productsHeaderDescription, setProductsHeaderDescription] = useState('Take total control of your HR, hiring, and compliance with our customizable enterprise toolkit.');

  // ── Why Choose (compat — stored in DB) ──
  const [whyChooseTitle, setWhyChooseTitle] = useState("We don’t just advise. We embed with your team to implement.");
  const [whyChooseBadge, setWhyChooseBadge] = useState('// 00.06°');
  const [whyChooseItems, setWhyChooseItems] = useState<WhyChooseItem[]>([]);
  const [whyChooseVisible, setWhyChooseVisible] = useState(true);


  // ── Section Titles & Badges (compat) ──
  const [advantageBadge, setAdvantageBadge] = useState('// 00.02° — One Firm, Six Practices');
  const [advantageTitle, setAdvantageTitle] = useState('Why six practices,\nunder one roof,\nchanges everything.');
  const [practicesBadge, setPracticesBadge] = useState('// 00.03° — The Practices');
  const [practicesTitle, setPracticesTitle] = useState('Six disciplines. One operating team.');
  const [processBadge, setProcessBadge] = useState('// 00.04° — How We Work');
  const [processTitle, setProcessTitle] = useState('Four steps. No surprises.');
  const [industriesBadge, setIndustriesBadge] = useState('// 00.06° — Industries');
  const [industriesTitle, setIndustriesTitle] = useState('Trusted across sectors.');

  // ── Data arrays (compat) ──
  const [processSteps, setProcessSteps] = useState<{code: string; name: string; desc: string}[]>([]);
  const [processStepsVisible, setProcessStepsVisible] = useState(true);
  const [industries, setIndustries] = useState<{name: string; image: string}[]>([
    { name: 'Manufacturing',         image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80' },
    { name: 'IT / ITES',             image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
    { name: 'Fintech',               image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80' },
    { name: 'Healthcare',            image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80' },
    { name: 'Retail',                image: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80' },
    { name: 'Education',             image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
    { name: 'Logistics',             image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80' },
    { name: 'Professional Services', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80' },
  ]);
  const [industriesVisible, setIndustriesVisible] = useState(true);
  const [marqueeItems, setMarqueeItems] = useState<string[]>([]);
  const [marqueeVisible, setMarqueeVisible] = useState(true);
  const [accordionItems, setAccordionItems] = useState<{id: number; title: string; description: string; imageUrl: string}[]>([]);
  const [accordionVisible, setAccordionVisible] = useState(true);
  const [advantageTabs, setAdvantageTabs] = useState<{title: string; value: string; eyebrow: string; headline: string; body: string; imageUrl: string; linkText?: string; linkUrl?: string; bgGradient: string}[]>([]);
  const [advantageTabsVisible, setAdvantageTabsVisible] = useState(true);

  // ── Logo Cloud ──
  const [logoCloudHeading, setLogoCloudHeading] = useState('Trusted by teams across India');
  const [logoCloudLogos, setLogoCloudLogos] = useState<LogoCloudLogo[]>([]);
  const [logoCloudVisible, setLogoCloudVisible] = useState(true);
  const [logoCloudFieldVis, setLogoCloudFieldVis] = useState<LogoCloudFieldVisibility>(DEFAULT_LOGO_CLOUD_FIELD_VIS);
  const toggleLogoCloudField = (key: keyof LogoCloudFieldVisibility) => { setLogoCloudFieldVis(prev => ({ ...prev, [key]: !prev[key] })); setDirty(true); };

  // ── Section-level visibility toggles for Framing / Framework / Kickoff ──
  const [framingVisible, setFramingVisible] = useState(true);
  const [frameworkVisible, setFrameworkVisible] = useState(true);
  const [kickoffVisible, setKickoffVisible] = useState(true);

  // ── Framing Section (00.02°) ──
  const [framingHeading, setFramingHeading] = useState('Six practices. One team.\nOne throat to choke.');
  const [framingBody1, setFramingBody1] = useState('Most operators run six vendors and call it scale. We run one team and call it accountability.');
  const [framingBody2, setFramingBody2] = useState('When something breaks — a hire that ghosts, a notice from labour, a payroll error, a contract that won’t close — you call one number. We own the fix. You stay focused on the work that earns the company its next round.');

  // ── Framework Cards (00.02.A°) ──
  const [frameworkCards, setFrameworkCards] = useState<FrameworkCardEdit[]>([
    { label: '01 — THE PROBLEM', heading: 'A back office stitched together from six vendors.', body: 'Hiring sits with one agency. Payroll with another. Training, compliance, legal, IT — each in a different inbox, each with its own SLA. The work between them — the part where things actually break — has no owner.', backHeading: 'What it costs you', backBody: 'Audit findings nobody saw coming. Hires that ghost between offer and onboarding. POSH, EDLI, and DPDP gaps that surface during diligence. A Head of People spending half their week chasing vendors instead of running people ops.' },
    { label: '02 — THE SHIFT',   heading: 'One operator-grade pod, six disciplines, one engagement.', body: 'Recruiters, HR ops leads, trainers, advisors, legal counsel, and build engineers — working under a single contract with a single accountable lead. The disciplines you used to coordinate, we coordinate. The gaps between them disappear into one team.', backHeading: 'How it runs', backBody: "A named operator owns each workstream. SLAs sit on outcomes, not activity. You see one weekly cadence with one engagement lead. When something breaks across disciplines — a hire that needs a quick legal review, an HR ops change that triggers an IT update — it’s already inside the same team." },
    { label: '03 — THE RESULT',  heading: 'A back office that scales with the company.', body: "Hiring you can forecast. Compliance that’s audit-ready by default. Contracts that close in days. Internal tools that replace spreadsheets. Training your managers actually use. All under one engagement, accountable to one outcome — yours.", backHeading: 'What changes for you', backBody: "Your Head of People runs people ops, not vendor relationships. Your founder isn’t on the hook for compliance edge cases. Your board hears about HR as a function that works, not as a recurring agenda risk. The back office stops being where growth gets stuck." },
  ]);

  // ── Kickoff Section (00.04°) ──
  const [kickoffHeading, setKickoffHeading] = useState('Day zero is when work starts.\nNot when paperwork ends.');
  const [kickoffSubtitle, setKickoffSubtitle] = useState('Most engagements stall in scoping. Ours starts moving on day one. Here’s how a typical kickoff with an Adviserve pod takes shape.');
  const [kickoffNodes, setKickoffNodes] = useState<KickoffNodeEdit[]>([
    { pill: '/ 01', heading: 'Scoping', body: 'A 30-minute call to map your gaps across hiring, HR ops, training, advisory, legal, and IT. You leave with a one-page engagement plan. No discovery decks, no scoping fees.' },
    { pill: '/ 02', heading: 'Pod assembly', body: 'Your operator pod takes shape — recruiter, HR ops lead, legal counsel, build engineer. Every name has a face, a phone number, and a Slack handle.' },
    { pill: '/ 03', heading: 'Playbooks', body: 'The pod gets oriented inside your tools and processes. ATS access, HRMS context, compliance calendar, commercial contracts. The shape of the work becomes visible.' },
    { pill: '/ 04', heading: 'Engagement live', body: "Workstreams move from setup into delivery. You see momentum across every track you scoped, with regular cadence on what’s progressing and what’s blocked." },
  ]);
  const [kickoffCtaText, setKickoffCtaText] = useState('Book a 30-min scoping call →');
  const [kickoffCtaHref, setKickoffCtaHref] = useState('/book');

  // ── Footer/Branding (compat) ──
  const [processDescription, setProcessDescription] = useState('Every engagement follows the same disciplined process — whether you need one practice or all six.');
  const [ctaSubtitleSecondary, setCtaSubtitleSecondary] = useState('what your business needs.');
  const [ctaSecondaryText, setCtaSecondaryText] = useState('Learn more');
  const [ctaSecondaryLink, setCtaSecondaryLink] = useState('/about');
  const [foundingYear, setFoundingYear] = useState('2017');
  const [copyrightName, setCopyrightName] = useState('Adviserve');

  const toggleHeroField = (key: keyof HeroFieldVisibility) => {
    setHeroFieldVis(prev => ({ ...prev, [key]: !prev[key] }));
    setDirty(true);
  };
  const toggleFramingField = (key: keyof FramingFieldVisibility) => { setFramingFieldVis(prev => ({ ...prev, [key]: !prev[key] })); setDirty(true); };
  const togglePracticesField = (key: keyof PracticesFieldVisibility) => { setPracticesFieldVis(prev => ({ ...prev, [key]: !prev[key] })); setDirty(true); };
  const toggleProductsField = (key: keyof ProductsFieldVisibility) => { setProductsFieldVis(prev => ({ ...prev, [key]: !prev[key] })); setDirty(true); };
const toggleCtaField = (key: keyof CtaFieldVisibility) => { setCtaFieldVis(prev => ({ ...prev, [key]: !prev[key] })); setDirty(true); };

  const handleVideoUpload = async (file: File) => {
    setHeroVideoUploading(true);
    setHeroVideoProgress(0);
    setError(null);
    const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
    if (file.size > MAX_VIDEO_BYTES) {
      setError('Video too large. Maximum 500 MB.');
      setHeroVideoUploading(false);
      return;
    }
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid video type. Accepted: MP4, WebM, MOV, MKV.');
      setHeroVideoUploading(false);
      return;
    }
    try {
      // Client-side direct upload — bypasses the 4.5 MB serverless body limit
      const blob = await upload(`hero-video/${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-token',
        onUploadProgress: ({ percentage }) => {
          setHeroVideoProgress(Math.round(percentage));
        },
      });
      setHeroVideoUrl(blob.url);
      setDirty(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setError(msg);
    }
    setHeroVideoUploading(false);
    setHeroVideoProgress(0);
  };

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const handleSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveRef.current(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'home').maybeSingle();
    if (!pageData) {
      const { data: newPage } = await adminDb.from('website_pages').insert({ slug: 'home', title: 'Home', is_visible: true }).select('id').single();
      if (newPage) setPageId(newPage.id);
      setLoading(false);
      return;
    }
    setPageId(pageData.id);
    const { data: contents } = await adminDb.from('website_content').select('*').eq('page_id', pageData.id).order('display_order');
    if (contents) {
      contents.forEach((c: ContentBlock) => {
        switch (c.section_key) {
          case 'hero_badge_text': setHeroBadgeText(c.content_value || ''); break;
          case 'hero_title': setHeroTitle(c.content_value || ''); break;
          case 'hero_h1_prefix': setHeroH1Prefix(c.content_value || ''); break;
          case 'hero_subtitle': setHeroSubtitle(c.content_value || ''); break;
          case 'hero_cta_text': setHeroCtaText(c.content_value || ''); break;
          case 'hero_cta_link': setHeroCtaLink(c.content_value || ''); break;
          case 'hero_secondary_text': setHeroSecondaryText(c.content_value || ''); break;
          case 'hero_secondary_link': setHeroSecondaryLink(c.content_value || ''); break;
          case 'home_hero_visible': setHeroVisible(c.content_value !== 'false'); break;
          case 'hero_video_url': setHeroVideoUrl(c.content_value || '/Hero-BG.mp4'); break;
          case 'hero_scramble_phrases': try { setScramblePhrases(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'hero_trust_items': try { setHeroTrustItems(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'practices_section_heading': setPracticesSectionHeading(c.content_value || ''); break;
          case 'testimonials_section_heading': setTestimonialsSectionHeading(c.content_value || ''); break;
          case 'service_verticals_data':
            try { setServiceVerticals(JSON.parse(c.content_value || '[]')); } catch {}
            break;
          case 'home_service_verticals_visible': setServiceVerticalsVisible(c.content_value !== 'false'); break;
          case 'why_section_title': setWhySectionTitle(c.content_value || ''); break;
          case 'why_stats_data': try { setWhyStats(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'faq_section_title': setFaqSectionTitle(c.content_value || ''); break;
          case 'faq_items_home': try { setFaqItems(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'cta_title': setCtaTitle(c.content_value || ''); break;
          case 'cta_description': setCtaDescription(c.content_value || ''); break;
          case 'cta_button_text': setCtaButtonText(c.content_value || ''); break;
          case 'cta_button_link': setCtaButtonLink(c.content_value || ''); break;
          case 'home_cta_visible': setCtaVisible(c.content_value !== 'false'); break;
          case 'why_choose_title': setWhyChooseTitle(c.content_value || ''); break;
          case 'why_choose_badge': setWhyChooseBadge(c.content_value || ''); break;
          case 'why_choose_items':
            try { setWhyChooseItems(JSON.parse(c.content_value || '[]')); } catch {}
            setWhyChooseVisible(c.is_visible);
            break;
          case 'advantage_badge': setAdvantageBadge(c.content_value || ''); break;
          case 'advantage_title': setAdvantageTitle(c.content_value || ''); break;
          case 'practices_badge': setPracticesBadge(c.content_value || ''); break;
          case 'practices_title': setPracticesTitle(c.content_value || ''); break;
          case 'process_badge': setProcessBadge(c.content_value || ''); break;
          case 'process_title': setProcessTitle(c.content_value || ''); break;
          case 'industries_badge': setIndustriesBadge(c.content_value || ''); break;
          case 'industries_title': setIndustriesTitle(c.content_value || ''); break;
          case 'process_steps_data':
            try { setProcessSteps(JSON.parse(c.content_value || '[]')); } catch {}
            setProcessStepsVisible(c.is_visible);
            break;
          case 'industries_data':
            try { setIndustries(JSON.parse(c.content_value || '[]')); } catch {}
            break;
          case 'home_industries_visible': setIndustriesVisible(c.content_value !== 'false'); break;
          case 'marquee_items_data':
            try { setMarqueeItems(JSON.parse(c.content_value || '[]')); } catch {}
            setMarqueeVisible(c.is_visible);
            break;
          case 'accordion_items_data':
            try { setAccordionItems(JSON.parse(c.content_value || '[]')); } catch {}
            setAccordionVisible(c.is_visible);
            break;
          case 'advantage_tabs_data':
            try { setAdvantageTabs(JSON.parse(c.content_value || '[]')); } catch {}
            setAdvantageTabsVisible(c.is_visible);
            break;
          case 'process_description': setProcessDescription(c.content_value || ''); break;
          case 'cta_subtitle_secondary': setCtaSubtitleSecondary(c.content_value || ''); break;
          case 'cta_secondary_text': setCtaSecondaryText(c.content_value || ''); break;
          case 'cta_secondary_link': setCtaSecondaryLink(c.content_value || ''); break;
          case 'founding_year': setFoundingYear(c.content_value || ''); break;
          case 'copyright_name': setCopyrightName(c.content_value || ''); break;
          case 'home_framing_heading': setFramingHeading(c.content_value || ''); break;
          case 'home_framing_body_1': setFramingBody1(c.content_value || ''); break;
          case 'home_framing_body_2': setFramingBody2(c.content_value || ''); break;
          case 'home_framework_cards': try { setFrameworkCards(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'home_kickoff_heading': setKickoffHeading(c.content_value || ''); break;
          case 'home_kickoff_subtitle': setKickoffSubtitle(c.content_value || ''); break;
          case 'home_kickoff_nodes': try { setKickoffNodes(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'home_kickoff_cta_text': setKickoffCtaText(c.content_value || ''); break;
          case 'home_kickoff_cta_href': setKickoffCtaHref(c.content_value || ''); break;
          case 'home_framing_visible': setFramingVisible(c.content_value !== 'false'); break;
          case 'home_framework_visible': setFrameworkVisible(c.content_value !== 'false'); break;
          case 'home_kickoff_visible': setKickoffVisible(c.content_value !== 'false'); break;
          case 'hero_field_visibility':
            try { setHeroFieldVis({ ...DEFAULT_HERO_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
          case 'framing_field_visibility':
            try { setFramingFieldVis({ ...DEFAULT_FRAMING_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
          case 'practices_field_visibility':
            try { setPracticesFieldVis({ ...DEFAULT_PRACTICES_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
          case 'products_field_visibility':
            try { setProductsFieldVis({ ...DEFAULT_PRODUCTS_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
          case 'why_field_visibility':
            try { setWhyFieldVis({ ...DEFAULT_WHY_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
          case 'cta_field_visibility':
            try { setCtaFieldVis({ ...DEFAULT_CTA_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
          case 'products_header_badge': setProductsHeaderBadge(c.content_value || ''); break;
          case 'products_header_title': setProductsHeaderTitle(c.content_value || ''); break;
          case 'products_header_description': setProductsHeaderDescription(c.content_value || ''); break;
          case 'why_badge': setWhyBadge(c.content_value || ''); break;
          case 'logo_cloud_heading': setLogoCloudHeading(c.content_value || ''); break;
          case 'logo_cloud_logos': try { setLogoCloudLogos(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'logo_cloud_visible': setLogoCloudVisible(c.content_value !== 'false'); break;
          case 'logo_cloud_field_visibility':
            try { setLogoCloudFieldVis({ ...DEFAULT_LOGO_CLOUD_FIELD_VIS, ...JSON.parse(c.content_value || '{}') }); } catch {}
            break;
        }
      });
    }
    setLoading(false);
  };

  const upsertContent = async (sectionKey: string, sectionLabel: string, contentType: string, contentValue: string, isVisible: boolean, displayOrder: number) => {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb.from('website_content').select('id').eq('page_id', pageId).eq('section_key', sectionKey).maybeSingle();
    if (selectError) { console.error('Fetch error:', selectError); throw selectError; }
    if (existing) {
      const { error: writeError } = await adminDb.from('website_content').update({ section_label: sectionLabel, content_type: contentType, content_value: contentValue, is_visible: isVisible, display_order: displayOrder, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    } else {
      const { error: writeError } = await adminDb.from('website_content').insert({ page_id: pageId, section_key: sectionKey, section_label: sectionLabel, content_type: contentType, content_value: contentValue, is_visible: isVisible, display_order: displayOrder });
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    }
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await Promise.all([
        upsertContent('hero_badge_text', 'Hero Badge Text', 'text', heroBadgeText, true, 1),
        upsertContent('hero_title', 'Hero H1 Line 1', 'text', heroTitle, true, 2),
        upsertContent('hero_h1_prefix', 'Hero H1 Line 2 Prefix', 'text', heroH1Prefix, true, 11),
        upsertContent('hero_subtitle', 'Hero Credibility Line', 'text', heroSubtitle, true, 4),
        upsertContent('hero_cta_text', 'Hero CTA Text', 'text', heroCtaText, true, 6),
        upsertContent('hero_cta_link', 'Hero CTA Link', 'text', heroCtaLink, true, 7),
        upsertContent('hero_secondary_text', 'Hero Secondary Button Text', 'text', heroSecondaryText, true, 8),
        upsertContent('hero_secondary_link', 'Hero Secondary Button Link', 'text', heroSecondaryLink, true, 9),
        upsertContent('hero_scramble_phrases', 'Hero Rotating Words', 'json', JSON.stringify(scramblePhrases), true, 3),
        upsertContent('hero_trust_items', 'Hero Trust Items', 'json', JSON.stringify(heroTrustItems), true, 5),
        upsertContent('hero_video_url', 'Hero Background Video URL', 'text', heroVideoUrl, true, 12),
        upsertContent('practices_section_heading', 'Practices Section Heading', 'text', practicesSectionHeading, true, 21),
        upsertContent('testimonials_section_heading', 'Testimonials Section Heading', 'text', testimonialsSectionHeading, true, 32),
        upsertContent('service_verticals_data', 'Service Verticals', 'json', JSON.stringify(serviceVerticals), serviceVerticalsVisible, 20),
        upsertContent('why_section_title', 'Why Adviserve Title', 'text', whySectionTitle, true, 30),
        upsertContent('why_stats_data', 'Why Adviserve Stats', 'json', JSON.stringify(whyStats), true, 31),
        upsertContent('faq_section_title', 'FAQ Section Title', 'text', faqSectionTitle, true, 40),
        upsertContent('faq_items_home', 'FAQ Items (Home)', 'json', JSON.stringify(faqItems), true, 41),
        upsertContent('cta_title', 'CTA Title', 'text', ctaTitle, ctaVisible, 60),
        upsertContent('cta_description', 'CTA Description', 'text', ctaDescription, ctaVisible, 61),
        upsertContent('cta_button_text', 'CTA Button Text', 'text', ctaButtonText, ctaVisible, 62),
        upsertContent('cta_button_link', 'CTA Button Link', 'text', ctaButtonLink, ctaVisible, 63),
        upsertContent('why_choose_title', 'Why Choose Us Title', 'text', whyChooseTitle, whyChooseVisible, 50),
        upsertContent('why_choose_badge', 'Why Choose Us Badge', 'text', whyChooseBadge, whyChooseVisible, 51),
        upsertContent('why_choose_items', 'Why Choose Us Items', 'json', JSON.stringify(whyChooseItems), whyChooseVisible, 52),
        upsertContent('advantage_badge', 'Advantage Badge', 'text', advantageBadge, true, 75),
        upsertContent('advantage_title', 'Advantage Title', 'text', advantageTitle, true, 76),
        upsertContent('practices_badge', 'Practices Badge', 'text', practicesBadge, true, 77),
        upsertContent('practices_title', 'Practices Title', 'text', practicesTitle, true, 78),
        upsertContent('process_badge', 'Process Badge', 'text', processBadge, true, 79),
        upsertContent('process_title', 'Process Title', 'text', processTitle, true, 80),
        upsertContent('industries_badge', 'Industries Badge', 'text', industriesBadge, true, 81),
        upsertContent('industries_title', 'Industries Title', 'text', industriesTitle, true, 82),
        upsertContent('process_steps_data', 'Process Steps', 'json', JSON.stringify(processSteps), processStepsVisible, 70),
        upsertContent('industries_data', 'Industries', 'json', JSON.stringify(industries), industriesVisible, 71),
        upsertContent('marquee_items_data', 'Marquee Items', 'json', JSON.stringify(marqueeItems), marqueeVisible, 72),
        upsertContent('accordion_items_data', 'Accordion Items', 'json', JSON.stringify(accordionItems), accordionVisible, 73),
        upsertContent('advantage_tabs_data', 'Advantage Tabs', 'json', JSON.stringify(advantageTabs), advantageTabsVisible, 74),
        upsertContent('process_description', 'Process Description', 'text', processDescription, true, 83),
        upsertContent('cta_subtitle_secondary', 'CTA Subtitle Secondary', 'text', ctaSubtitleSecondary, ctaVisible, 64),
        upsertContent('cta_secondary_text', 'CTA Secondary Button Text', 'text', ctaSecondaryText, ctaVisible, 65),
        upsertContent('cta_secondary_link', 'CTA Secondary Button Link', 'text', ctaSecondaryLink, ctaVisible, 66),
        upsertContent('founding_year', 'Founding Year', 'text', foundingYear, true, 90),
        upsertContent('copyright_name', 'Copyright Name', 'text', copyrightName, true, 91),
        // ── Section-visibility toggle rows — is_visible always true; on/off lives in content_value ──
        upsertContent('home_hero_visible',               'Hero Section Visible',                        'toggle', String(heroVisible),             true, 0),
        upsertContent('home_service_verticals_visible',  'Service Verticals Visible',                   'toggle', String(serviceVerticalsVisible),  true, 19),
        upsertContent('home_cta_visible',                'Final CTA Visible',                           'toggle', String(ctaVisible),               true, 59),
        upsertContent('home_industries_visible',         'Industries Visible',                          'toggle', String(industriesVisible),         true, 70),
        upsertContent('home_framing_visible',            'Framing Section Visible',                     'toggle', String(framingVisible),            true, 25),
        upsertContent('home_framework_visible',          'Framework Cards Visible (renders on /about)', 'toggle', String(frameworkVisible),          true, 28),
        upsertContent('home_kickoff_visible',            'Kickoff Section Visible (renders on /about)', 'toggle', String(kickoffVisible),            true, 32),
        upsertContent('home_framing_heading', 'Framing Heading', 'text', framingHeading, true, 26),
        upsertContent('home_framing_body_1', 'Framing Body 1', 'text', framingBody1, true, 27),
        upsertContent('home_framing_body_2', 'Framing Body 2', 'text', framingBody2, true, 28),
        upsertContent('home_framework_cards', 'Framework Cards', 'json', JSON.stringify(frameworkCards), true, 29),
        upsertContent('home_kickoff_heading', 'Kickoff Heading', 'text', kickoffHeading, true, 33),
        upsertContent('home_kickoff_subtitle', 'Kickoff Subtitle', 'text', kickoffSubtitle, true, 34),
        upsertContent('home_kickoff_nodes', 'Kickoff Nodes', 'json', JSON.stringify(kickoffNodes), true, 35),
        upsertContent('home_kickoff_cta_text', 'Kickoff CTA Text', 'text', kickoffCtaText, true, 36),
        upsertContent('home_kickoff_cta_href', 'Kickoff CTA Href', 'text', kickoffCtaHref, true, 37),
        upsertContent('hero_field_visibility', 'Hero Field Visibility', 'json', JSON.stringify(heroFieldVis), true, 15),
        upsertContent('framing_field_visibility', 'Framing Field Visibility', 'json', JSON.stringify(framingFieldVis), true, 39),
        upsertContent('practices_field_visibility', 'Practices Field Visibility', 'json', JSON.stringify(practicesFieldVis), true, 22),
        upsertContent('products_field_visibility', 'Products Field Visibility', 'json', JSON.stringify(productsFieldVis), true, 46),
        upsertContent('why_field_visibility', 'Why Field Visibility', 'json', JSON.stringify(whyFieldVis), true, 38),
        upsertContent('cta_field_visibility', 'CTA Field Visibility', 'json', JSON.stringify(ctaFieldVis), true, 67),
        upsertContent('products_header_badge', 'Products Header Badge', 'text', productsHeaderBadge, true, 43),
        upsertContent('products_header_title', 'Products Header Title', 'text', productsHeaderTitle, true, 44),
        upsertContent('products_header_description', 'Products Header Description', 'text', productsHeaderDescription, true, 45),
        upsertContent('why_badge', 'Why Adviserve Badge', 'text', whyBadge, true, 85),
        upsertContent('logo_cloud_heading', 'Logo Cloud Heading', 'text', logoCloudHeading, true, 95),
        upsertContent('logo_cloud_logos', 'Logo Cloud Logos', 'json', JSON.stringify(logoCloudLogos), logoCloudVisible, 96),
        upsertContent('logo_cloud_visible', 'Logo Cloud Visible', 'toggle', String(logoCloudVisible), true, 94),
        upsertContent('logo_cloud_field_visibility', 'Logo Cloud Field Visibility', 'json', JSON.stringify(logoCloudFieldVis), true, 97),
      ]);
      setDirty(false);
      setSuccess('Home page content saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save content. Please try again.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const inp = 'w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30';
  const inpSm = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-500">Loading home page content...</p></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Page Editor</h1>
          <p className="mt-1 text-gray-600">Edit all sections of the home page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
          <Save size={18} />{saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">{success}</div>}

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>

        <HomeHeroSection
          inp={inp} inpSm={inpSm}
          heroBadgeText={heroBadgeText} setHeroBadgeText={setHeroBadgeText}
          heroTitle={heroTitle} setHeroTitle={setHeroTitle}
          heroH1Prefix={heroH1Prefix} setHeroH1Prefix={setHeroH1Prefix}
          heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
          heroCtaText={heroCtaText} setHeroCtaText={setHeroCtaText}
          heroCtaLink={heroCtaLink} setHeroCtaLink={setHeroCtaLink}
          heroSecondaryText={heroSecondaryText} setHeroSecondaryText={setHeroSecondaryText}
          heroSecondaryLink={heroSecondaryLink} setHeroSecondaryLink={setHeroSecondaryLink}
          heroVisible={heroVisible} setHeroVisible={setHeroVisible}
          heroFieldVis={heroFieldVis} toggleHeroField={toggleHeroField}
          heroVideoUrl={heroVideoUrl} setHeroVideoUrl={setHeroVideoUrl}
          heroVideoUploading={heroVideoUploading} heroVideoProgress={heroVideoProgress}
          videoInputRef={videoInputRef} handleVideoUpload={handleVideoUpload}
          scramblePhrases={scramblePhrases} setScramblePhrases={setScramblePhrases}
          heroTrustItems={heroTrustItems} setHeroTrustItems={setHeroTrustItems}
          setDirty={setDirty}
        />

        <HomeServicesSection
          inp={inp} inpSm={inpSm}
          serviceVerticals={serviceVerticals} setServiceVerticals={setServiceVerticals}
          serviceVerticalsVisible={serviceVerticalsVisible} setServiceVerticalsVisible={setServiceVerticalsVisible}
          practicesFieldVis={practicesFieldVis} togglePracticesField={togglePracticesField}
          practicesBadge={practicesBadge} setPracticesBadge={setPracticesBadge}
          practicesSectionHeading={practicesSectionHeading} setPracticesSectionHeading={setPracticesSectionHeading}
          productsFieldVis={productsFieldVis} toggleProductsField={toggleProductsField}
          productsHeaderBadge={productsHeaderBadge} setProductsHeaderBadge={setProductsHeaderBadge}
          productsHeaderTitle={productsHeaderTitle} setProductsHeaderTitle={setProductsHeaderTitle}
          productsHeaderDescription={productsHeaderDescription} setProductsHeaderDescription={setProductsHeaderDescription}
          setDirty={setDirty}
        />

        <HomeWhySection
          inp={inp}
          testimonialsSectionHeading={testimonialsSectionHeading} setTestimonialsSectionHeading={setTestimonialsSectionHeading}
          setDirty={setDirty}
        />

        <HomeFAQSection
          inp={inp} inpSm={inpSm}
          faqSectionTitle={faqSectionTitle} setFaqSectionTitle={setFaqSectionTitle}
          faqItems={faqItems} setFaqItems={setFaqItems}
          setDirty={setDirty}
        />

        <HomeCTASection
          inp={inp}
          ctaVisible={ctaVisible} setCtaVisible={setCtaVisible}
          ctaFieldVis={ctaFieldVis} toggleCtaField={toggleCtaField}
          ctaTitle={ctaTitle} setCtaTitle={setCtaTitle}
          ctaDescription={ctaDescription} setCtaDescription={setCtaDescription}
          ctaButtonText={ctaButtonText} setCtaButtonText={setCtaButtonText}
          ctaButtonLink={ctaButtonLink} setCtaButtonLink={setCtaButtonLink}
          setDirty={setDirty}
        />

        <HomeFramingSection
          inp={inp} inpSm={inpSm}
          framingVisible={framingVisible} setFramingVisible={setFramingVisible}
          framingFieldVis={framingFieldVis} toggleFramingField={toggleFramingField}
          advantageBadge={advantageBadge} setAdvantageBadge={setAdvantageBadge}
          framingHeading={framingHeading} setFramingHeading={setFramingHeading}
          framingBody1={framingBody1} setFramingBody1={setFramingBody1}
          framingBody2={framingBody2} setFramingBody2={setFramingBody2}
          frameworkVisible={frameworkVisible} setFrameworkVisible={setFrameworkVisible}
          frameworkCards={frameworkCards} setFrameworkCards={setFrameworkCards}
          setDirty={setDirty}
        />

        <HomeKickoffSection
          inp={inp} inpSm={inpSm}
          kickoffVisible={kickoffVisible} setKickoffVisible={setKickoffVisible}
          kickoffHeading={kickoffHeading} setKickoffHeading={setKickoffHeading}
          kickoffSubtitle={kickoffSubtitle} setKickoffSubtitle={setKickoffSubtitle}
          kickoffCtaText={kickoffCtaText} setKickoffCtaText={setKickoffCtaText}
          kickoffCtaHref={kickoffCtaHref} setKickoffCtaHref={setKickoffCtaHref}
          kickoffNodes={kickoffNodes} setKickoffNodes={setKickoffNodes}
          setDirty={setDirty}
        />

        <HomeCompatSection
          inp={inp} inpSm={inpSm}
          advantageBadge={advantageBadge} setAdvantageBadge={setAdvantageBadge}
          advantageTitle={advantageTitle} setAdvantageTitle={setAdvantageTitle}
          practicesBadge={practicesBadge} setPracticesBadge={setPracticesBadge}
          practicesTitle={practicesTitle} setPracticesTitle={setPracticesTitle}
          processBadge={processBadge} setProcessBadge={setProcessBadge}
          processTitle={processTitle} setProcessTitle={setProcessTitle}
          processSteps={processSteps} setProcessSteps={setProcessSteps}
          processStepsVisible={processStepsVisible} setProcessStepsVisible={setProcessStepsVisible}
          processDescription={processDescription} setProcessDescription={setProcessDescription}
          foundingYear={foundingYear} setFoundingYear={setFoundingYear}
          copyrightName={copyrightName} setCopyrightName={setCopyrightName}
          ctaSubtitleSecondary={ctaSubtitleSecondary} setCtaSubtitleSecondary={setCtaSubtitleSecondary}
          ctaSecondaryText={ctaSecondaryText} setCtaSecondaryText={setCtaSecondaryText}
          ctaSecondaryLink={ctaSecondaryLink} setCtaSecondaryLink={setCtaSecondaryLink}
          logoCloudHeading={logoCloudHeading} setLogoCloudHeading={setLogoCloudHeading}
          logoCloudLogos={logoCloudLogos} setLogoCloudLogos={setLogoCloudLogos}
          logoCloudVisible={logoCloudVisible} setLogoCloudVisible={setLogoCloudVisible}
          logoCloudFieldVis={logoCloudFieldVis} toggleLogoCloudField={toggleLogoCloudField}
          setDirty={setDirty}
        />

        <div className="flex justify-end pb-8">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
            <Save size={18} />{saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
