/**
 * CMS seed data — single source of truth.
 *
 * Consumed by:
 *   - scripts/run-seed.ts  (build-time auto-seed on every Vercel deploy)
 *
 * Pure TypeScript — no external imports. Safe to run in Node.js or edge runtimes.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentType = 'text' | 'json' | 'toggle';

export interface ContentRow {
  section_key: string;
  section_label: string;
  content_type: ContentType;
  content_value: string;
  is_visible: boolean;
  display_order: number;
}

export interface PageSeed {
  slug: string;
  title: string;
  rows: ContentRow[];
}

// ─── Inline constants ─────────────────────────────────────────────────────────

const ROTATING_WORDS = [
  'Hiring.', 'Payroll.', 'Compliance.', 'Contracts.',
  'Training.', 'Infrastructure.', 'Audits.',
];

const HERO_TRUST_ITEMS = [
  '3,000+ placements', 'DPDP-ready', 'ISO 9001 / 20000 / 27001', 'Since 2017',
];

const HOME_WHY_STATS = [
  { n: 3000, suf: '+',    t: 'Placements shipped',      s: 'Across manufacturing, fintech, SaaS' },
  { n: 48,   suf: ' hrs', t: 'Average kickoff',          s: 'From scoping call to live team' },
  { n: 100,  suf: '%',    t: 'Statutory compliance',     s: 'PF, ESI, POSH, DPDP across clients' },
  { n: 1,    suf: '',     t: 'Throat to choke',          s: 'One contract, one SLA, one team' },
];

const HOME_FAQ_ITEMS = [
  {
    q: "What's the difference between an HRMS and an HRIS?",
    a: "An HRIS is the database of record for people data. An HRMS adds workflow \u2014 payroll, leave, lifecycle, case management \u2014 on top. Adviserve People is an HRMS; it includes the HRIS layer.",
  },
  {
    q: 'Is DPDP Act 2023 applicable to small businesses in India?',
    a: "Yes, with almost no carve-outs. If you process personal data of Indian residents \u2014 employees, customers, website visitors \u2014 you're in scope. Penalties run up to \u20B9250 crore per instance.",
  },
  {
    q: 'How long does a DPDP compliance project take?',
    a: 'A standard engagement runs 10\u201314 weeks: 3 weeks of data mapping, 4 weeks of policy + flow design, 3 weeks of rollout + training, 2 weeks of audit readiness. We stage it so you have working controls in week 5.',
  },
  {
    q: "What's included in corporate training engagements?",
    a: "Assessment, curriculum design, facilitators, post-training reinforcement, and a written outcomes brief. We don't sell one-off keynotes \u2014 every engagement has a 12-week measurement window.",
  },
  {
    q: 'Do you work with startups or only enterprises?',
    a: "Both. Our smallest active client is a 14-person seed-stage fintech; our largest is a listed manufacturer. The engagement shape changes; the operator-grade bar doesn't.",
  },
  {
    q: 'How fast can you ramp up recruitment?',
    a: '48 hours to embedded team, 7 days to first calibrated shortlist, typical time-to-offer of 22 days on mid-senior roles. We publish these numbers per engagement and track them weekly.',
  },
];

const HOME_STATS = [
  { icon: 'Users',       label: 'Practices, One Roof',    value: '6' },
  { icon: 'Target',      label: 'Sign to Kickoff',         value: '48 hrs' },
  { icon: 'Briefcase',   label: 'Response Guarantee',      value: '<24 hr' },
  { icon: 'TrendingUp',  label: 'Startup to Enterprise',   value: 'All Sizes' },
];

const WHY_CHOOSE_ITEMS = [
  { title: 'Six practices, one partner',         description: "Recruitment, HR, training, legal, business consulting, and IT \u2014 all under one roof. No more coordinating five vendors who don\u2019t talk to each other.", imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200' },
  { title: 'Built for how businesses actually work', description: "We don\u2019t offer rigid packages. We look at what you need, where you are, and build around that. Your engagement scales with your business.", imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200' },
  { title: 'We take ownership, not just briefs',  description: "We\u2019re not consultants who hand you a 40-page report and disappear. We get involved, stay involved, and own the outcomes alongside you.", imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200' },
  { title: 'Startup energy, senior expertise',    description: 'Our team brings deep experience from across industries \u2014 and the drive that comes with building something new. Every client matters to us.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200' },
  { title: '48-hour kickoff, every time',         description: 'No three-month onboarding cycles. We go from signed agreement to active engagement in 48 hours. Speed matters when your business is moving.', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200' },
  { title: 'Transparent pricing, no surprises',   description: 'Clear scope, clear deliverables, clear cost. No hidden fees, no scope creep charges, no invoices that need a decoder ring to understand.', imageUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1200' },
];

const TESTIMONIALS = [
  { name: 'Founder & CEO', role: '', company: 'Series A SaaS Company, Bengaluru', quote: 'We came in overwhelmed \u2014 no HR structure, three roles open, a compliance gap we had not spotted. Adviserve showed up as one team, not three vendors. By week two it felt like we had hired an ops function.' },
  { name: 'Head of People', role: '', company: 'D2C Brand, Mumbai', quote: 'We had cycled through agencies who sent volume over fit. Adviserve read our culture, our stack, our pace \u2014 and the hires stayed. That is the part nobody else got right.' },
  { name: 'Managing Director', role: '', company: 'Manufacturing Company, Pune', quote: 'Legal, HR, and training used to be three separate problems on my desk. Now they are one conversation. The team catches things before they become issues, and that is the real value.' },
  { name: 'COO', role: '', company: 'Healthcare Group, Hyderabad', quote: 'What we needed was continuity \u2014 not a deck, not a diagnosis, not a disappearance. Adviserve stayed through the hard parts: the restructuring, the audit, the rollout. That is rare.' },
  { name: 'Co-Founder', role: '', company: 'Fintech Startup, Gurugram', quote: 'One point of contact who already knew our compliance posture when we asked about a new hire \u2014 that should not feel radical, but it does. Adviserve is how advisory should work.' },
];

const PROCESS_STEPS = [
  { code: '01', name: 'Listen &\nScope',      desc: 'A focused discovery session to understand your business, challenges, and what success looks like. No generic questionnaires \u2014 just the right questions.' },
  { code: '02', name: 'Propose &\nPrice',     desc: 'A tailored engagement plan within 48 hours. Clear scope, specific deliverables, realistic timelines, and transparent pricing. No hidden fees.' },
  { code: '03', name: 'Execute &\nEmbed',     desc: 'Our specialists work as an extension of your team \u2014 not outside vendors handing off documents. Weekly check-ins. Shared dashboards. Real accountability.' },
  { code: '04', name: 'Measure &\nImprove',   desc: 'Every metric that matters, tracked in real time. Monthly reviews to optimise, adjust, and scale what is working.' },
];

const MARQUEE_ITEMS = [
  'Recruitment', 'HR Services', 'Corporate Training', 'Business Consulting',
  'Legal Advisory', 'IT Solutions', 'Compliance', 'Digital Transformation',
];

const ACCORDION_ITEMS = [
  { id: 1, title: 'Recruitment & Talent Acquisition',  description: 'From executive search to campus hiring \u2014 we build talent pipelines that deliver the right people, at the right level, in the right timeframe. Permanent, contract, and RPO models with a 96% retention guarantee.', href: '/services/recruitment', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop' },
  { id: 2, title: 'HR Services & Consulting',          description: 'Policy design, payroll, compliance audits, and HRIS implementation. CHRO-level expertise without the full-time cost \u2014 whether you are a 10-person startup or a 5,000-person enterprise.', href: '/services/hr-services', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, title: 'Corporate Training & L&D',          description: 'Leadership development, POSH compliance, soft skills, and technical upskilling. Programmes designed around measurable behaviour change \u2014 not checkbox completion.', href: '/services/corporate-training', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, title: 'Business Consulting & Strategy',    description: 'Market entry, growth strategy, M&A advisory, and operational optimization. We work with founders and leadership teams to turn ambition into a plan with numbers behind it.', href: '/services/business-consulting', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, title: 'Legal Consulting & Compliance',     description: 'Labour law across all Indian states, employment contracts, POSH implementation, corporate governance, and dispute resolution. One legal team that understands your business context.', href: '/services/legal-consulting', imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2112&auto=format&fit=crop' },
  { id: 6, title: 'IT Consulting & Development',       description: 'Cloud architecture, cybersecurity, custom software, and digital transformation. We design, build, and manage technology that actually fits how your team works.', href: '/services/it-services', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' },
];

const ADVANTAGE_TABS = [
  { title: 'The Problem',  value: 'problem',  eyebrow: '01 \u2014 The Problem', headline: 'Five vendors. Five silos. Five invoices.', body: 'An HR consultant, a recruiter, a lawyer, an IT team, a training firm. None of them talk. You end up as the switchboard \u2014 half your week spent coordinating instead of building.', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200', bgGradient: 'from-[#1a1a2e] to-[#0d1b2a]' },
  { title: 'The Shift',    value: 'shift',    eyebrow: '02 \u2014 The Shift',   headline: 'One firm. Shared context.', body: 'Adviserve folds recruitment, HR, legal, strategy, training, and IT into one team. When your lawyer needs to know what your HR consultant did last quarter, they already know.', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200', bgGradient: 'from-brand-teal/90 to-brand-teal' },
  { title: 'The Result',   value: 'result',   eyebrow: '03 \u2014 The Result',  headline: 'One partner with the full picture.', body: 'Faster decisions. Fewer mistakes. Not six vendors pretending to be aligned.', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200', bgGradient: 'from-brand-teal/80 to-brand-teal/40' },
  { title: '6 Practices',  value: 'practices', eyebrow: 'Our Practices',        headline: 'Recruitment \u00B7 HR \u00B7 Legal \u00B7 Strategy \u00B7 Training \u00B7 IT', body: 'Six disciplines under one roof. One team, shared files, shared context. Stop being the switchboard.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200', linkText: 'See the six practices', linkUrl: '/services', bgGradient: 'from-[#161616] to-[#111111]' },
  { title: '48hr Kickoff', value: 'kickoff',  eyebrow: 'Speed Guarantee',       headline: 'Sign to kickoff in 48 hours.', body: 'No three-month onboarding cycles. We go from signed agreement to active engagement in 48 hours. Speed matters when your business is moving.', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200', linkText: 'Book a free consultation', linkUrl: '/book', bgGradient: 'from-[#1a1a2e] to-brand-teal/30' },
];

const ABOUT_STATS = [
  { icon: 'Users',       value: '6',        label: 'Practices, One Roof' },
  { icon: 'Globe',       value: '48 hrs',   label: 'Sign to Kickoff' },
  { icon: 'Clock',       value: '<24 hr',   label: 'Response Guarantee' },
  { icon: 'TrendingUp',  value: 'All Sizes', label: 'Startup to Enterprise' },
];

const SERVICES_DATA = [
  { number: '01', name: 'Recruitment',        description: 'Tech, GTM, leadership hires across India. Series A\u2192C scaling teams, mid-market manufacturing. Retainer \u00B7 per-hire \u00B7 embedded RPO.', outcomes: [['Avg time-to-offer', '22 days'], ['Offer\u2192join rate', '86%'], ['Cost per hire vs market', '\u221234%']], href: '/services/recruitment', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', reverse: false },
  { number: '02', name: 'HR Operations',      description: 'Payroll, lifecycle, POSH, EDLI, statutory. 50\u2013500 employee orgs without a HR head. Retainer \u00B7 per-employee \u00B7 outcome-based.', outcomes: [['Payroll cycle', '< 2 business days'], ['Statutory compliance', '100%'], ['Employee NPS lift', '+18']], href: '/services/hr-services', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', reverse: true },
  { number: '03', name: 'Training',           description: 'Corporate, leadership, induction, behavioural. Teams rolling out new managers or restructuring. Cohort \u00B7 keynote \u00B7 12-week program.', outcomes: [['Manager confidence', '+42%'], ['Regrettable attrition', '\u221227%'], ['Train-the-trainer certified', 'yes']], href: '/services/corporate-training', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', reverse: false },
  { number: '04', name: 'Business Consulting', description: 'Org design, GTM, operating cadence. Founders past Series A, family businesses in handover. Project \u00B7 fractional \u00B7 outcome-based.', outcomes: [['Strategy\u2192execution gap', 'closed, documented'], ['Operating reviews', 'weekly']], href: '/services/business-consulting', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', reverse: true },
  { number: '05', name: 'Legal & Compliance', description: 'DPDP, labour, commercial, IP, disputes. Any business processing personal data in India. Project \u00B7 retainer \u00B7 fractional GC.', outcomes: [['DPDP readiness', 'audit-ready'], ['Contract turnaround', '48 hrs']], href: '/services/legal-consulting', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80', reverse: false },
  { number: '06', name: 'Custom Development', description: 'Internal tools, integrations, dashboards. Teams with a painful spreadsheet ops. Fixed-scope project \u00B7 engagement from \u20B98L.', outcomes: [['Spreadsheet \u2192 app', 'typical 6 weeks'], ['Integrations shipped', 'Zoho, Tally, ERP']], href: '/services/it-services', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', reverse: true },
];

const HOME_FRAMEWORK_CARDS = [
  {
    label: '01 \u2014 THE PROBLEM',
    heading: 'A back office stitched together from six vendors.',
    body: 'Hiring sits with one agency. Payroll with another. Training, compliance, legal, IT \u2014 each in a different inbox, each with its own SLA. The work between them \u2014 the part where things actually break \u2014 has no owner.',
    backHeading: 'What it costs you',
    backBody: 'Audit findings nobody saw coming. Hires that ghost between offer and onboarding. POSH, EDLI, and DPDP gaps that surface during diligence. A Head of People spending half their week chasing vendors instead of running people ops.',
  },
  {
    label: '02 \u2014 THE SHIFT',
    heading: 'One operator-grade pod, six disciplines, one engagement.',
    body: 'Recruiters, HR ops leads, trainers, advisors, legal counsel, and build engineers \u2014 working under a single contract with a single accountable lead. The disciplines you used to coordinate, we coordinate. The gaps between them disappear into one team.',
    backHeading: 'How it runs',
    backBody: 'A named operator owns each workstream. SLAs sit on outcomes, not activity. You see one weekly cadence with one engagement lead. When something breaks across disciplines \u2014 a hire that needs a quick legal review, an HR ops change that triggers an IT update \u2014 it\u2019s already inside the same team.',
  },
  {
    label: '03 \u2014 THE RESULT',
    heading: 'A back office that scales with the company.',
    body: 'Hiring you can forecast. Compliance that\u2019s audit-ready by default. Contracts that close in days. Internal tools that replace spreadsheets. Training your managers actually use. All under one engagement, accountable to one outcome \u2014 yours.',
    backHeading: 'What changes for you',
    backBody: 'Your Head of People runs people ops, not vendor relationships. Your founder isn\u2019t on the hook for compliance edge cases. Your board hears about HR as a function that works, not as a recurring agenda risk. The back office stops being where growth gets stuck.',
  },
];

const HOME_KICKOFF_NODES = [
  { pill: '/ 01', heading: 'Scoping',         body: 'A 30-minute call to map your gaps across hiring, HR ops, training, advisory, legal, and IT. You leave with a one-page engagement plan. No discovery decks, no scoping fees.' },
  { pill: '/ 02', heading: 'Pod assembly',    body: 'Your operator pod takes shape \u2014 recruiter, HR ops lead, legal counsel, build engineer. Every name has a face, a phone number, and a Slack handle.' },
  { pill: '/ 03', heading: 'Playbooks',       body: 'The pod gets oriented inside your tools and processes. ATS access, HRMS context, compliance calendar, commercial contracts. The shape of the work becomes visible.' },
  { pill: '/ 04', heading: 'Engagement live', body: 'Workstreams move from setup into delivery. You see momentum across every track you scoped, with regular cadence on what\u2019s progressing and what\u2019s blocked.' },
];

const FOOTER_ISO_CERTS = [
  { id: 'iso9001',  num: '9001',  label: 'Quality Management',   band: 'QUALITY \u2022 MANAGEMENT \u2022 SYSTEM \u2022 ISO 9001:2026 \u2022 ' },
  { id: 'iso20000', num: '20000', label: 'IT Service Management', band: 'IT \u2022 SERVICE \u2022 MANAGEMENT \u2022 ISO 20000:2026 \u2022 ' },
  { id: 'iso27001', num: '27001', label: 'Information Security',  band: 'INFORMATION \u2022 SECURITY \u2022 MGMT \u2022 ISO 27001:2026 \u2022 ' },
];

const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];


const INDUSTRIES_DATA = [
  { name: 'Manufacturing',          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80' },
  { name: 'IT / ITES',              image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  { name: 'Fintech',                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80' },
  { name: 'Healthcare',             image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80' },
  { name: 'Retail',                 image: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80' },
  { name: 'Education',              image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
  { name: 'Logistics',              image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80' },
  { name: 'Professional Services',  image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80' },
];

const CAREERS_BENEFITS = [
  { title: 'Remote-First Culture',         description: 'Work from anywhere. Flexible hours. Async-first collaboration. We measure output, not screen time.',                                              icon: 'globe' },
  { title: 'Annual Learning Budget',       description: 'Courses, certifications, conferences, books. Your professional growth is a line item in our budget.',                                           icon: 'book-open' },
  { title: 'Impact Across Six Practices',  description: 'Your work directly shapes how companies across India hire, comply, operate, and build technology.',                                              icon: 'layers' },
  { title: 'No Corporate Theatre',         description: 'Flat hierarchy. Direct feedback. Decisions based on merit and evidence \u2014 not tenure or politics.',                                          icon: 'zap' },
];

const CAREERS_CULTURE = [
  { title: 'Weekly Knowledge Sharing', description: 'Every Friday, someone presents a case study, a new regulation, or a methodology.' },
  { title: 'Quarterly Offsites',       description: 'In-person retreats for strategy and connection. Past locations: Goa, Udaipur, Coorg.' },
  { title: 'Wellbeing First',          description: 'Mental health days. Unlimited sick leave. Annual wellness allowance.' },
];

// ─── Page seed definitions ────────────────────────────────────────────────────

export const PAGES: PageSeed[] = [

  // ─────────────────────────────────────── HOME
  {
    slug: 'home',
    title: 'Home',
    rows: [
      { section_key: 'hero_badge_text',            section_label: 'Hero Badge Text',             content_type: 'text', content_value: 'DPIIT-RECOGNISED \u00B7 ISO 9001 IN PROGRESS',                        is_visible: true, display_order: 1 },
      { section_key: 'hero_title',                 section_label: 'Hero H1 Line 1',              content_type: 'text', content_value: 'You build what you do best.',                                          is_visible: true, display_order: 2 },
      { section_key: 'hero_scramble_phrases',      section_label: 'Hero Rotating Words',         content_type: 'json', content_value: JSON.stringify(ROTATING_WORDS),                                         is_visible: true, display_order: 3 },
      { section_key: 'hero_subtitle',              section_label: 'Hero Credibility Line',       content_type: 'text', content_value: 'Compliance-first \u00B7 AI-augmented \u00B7 Always transparent',       is_visible: true, display_order: 4 },
      { section_key: 'hero_trust_items',           section_label: 'Hero Trust Items',            content_type: 'json', content_value: JSON.stringify(HERO_TRUST_ITEMS),                                       is_visible: true, display_order: 5 },
      { section_key: 'hero_cta_text',              section_label: 'Hero CTA Text',               content_type: 'text', content_value: 'Book a 30-min scoping call \u2192',                                    is_visible: true, display_order: 6 },
      { section_key: 'hero_cta_link',              section_label: 'Hero CTA Link',               content_type: 'text', content_value: '/book',                                                                is_visible: true, display_order: 7 },
      { section_key: 'hero_secondary_text',        section_label: 'Hero Secondary Button Text',  content_type: 'text', content_value: 'See what we ship',                                                     is_visible: true, display_order: 8 },
      { section_key: 'hero_secondary_link',        section_label: 'Hero Secondary Button Link',  content_type: 'text', content_value: '/products',                                                            is_visible: true, display_order: 9 },
      { section_key: 'hero_description',           section_label: 'Hero Description (unused)',   content_type: 'text', content_value: '',                                                                      is_visible: true, display_order: 10 },
      { section_key: 'hero_h1_prefix',             section_label: 'Hero H1 Line 2 Prefix',       content_type: 'text', content_value: 'We own the',                                                           is_visible: true, display_order: 11 },
      { section_key: 'hero_video_url',             section_label: 'Hero Background Video URL',    content_type: 'text', content_value: '/Hero-BG.mp4',                                                             is_visible: true, display_order: 12 },
      { section_key: 'stats_data',                 section_label: 'Stats Section',               content_type: 'json', content_value: JSON.stringify(HOME_STATS),                                             is_visible: true, display_order: 15 },
      { section_key: 'service_verticals_data',     section_label: 'Service Verticals',           content_type: 'json', content_value: JSON.stringify(SERVICES_DATA),                                          is_visible: true, display_order: 20 },
      { section_key: 'home_framing_heading',       section_label: 'Framing Heading (00.02\u00B0)',        content_type: 'text', content_value: 'Six practices. One team.\nOne throat to choke.',                                                                                                                                                                                                      is_visible: true, display_order: 26 },
      { section_key: 'home_framing_body_1',        section_label: 'Framing Body Paragraph 1',            content_type: 'text', content_value: 'Most operators run six vendors and call it scale. We run one team and call it accountability.',                                                                                                                                                         is_visible: true, display_order: 27 },
      { section_key: 'home_framing_body_2',        section_label: 'Framing Body Paragraph 2',            content_type: 'text', content_value: 'When something breaks \u2014 a hire that ghosts, a notice from labour, a payroll error, a contract that won\u2019t close \u2014 you call one number. We own the fix. You stay focused on the work that earns the company its next round.',          is_visible: true, display_order: 28 },
      { section_key: 'home_framing_cta_text',      section_label: 'Framing CTA Link Text',               content_type: 'text', content_value: 'See how we work \u2192',                                                                                                                                                                                                                               is_visible: true, display_order: 281 },
      { section_key: 'home_framing_cta_href',      section_label: 'Framing CTA Link URL',                content_type: 'text', content_value: '/about',                                                                                                                                                                                                                                               is_visible: true, display_order: 282 },
      { section_key: 'home_framework_cards',       section_label: 'Framework Cards (00.02.A\u00B0)',      content_type: 'json', content_value: JSON.stringify(HOME_FRAMEWORK_CARDS),                                                                                                                                                                                                               is_visible: true, display_order: 29 },
      { section_key: 'practices_section_heading',  section_label: 'Practices Section Heading',   content_type: 'text', content_value: 'What we actually do.',                                                 is_visible: true, display_order: 21 },
      { section_key: 'why_section_title',          section_label: 'Why Adviserve Title',         content_type: 'text', content_value: 'Four proofs you can verify.',                                          is_visible: true, display_order: 30 },
      { section_key: 'why_stats_data',             section_label: 'Why Adviserve Stats',         content_type: 'json', content_value: JSON.stringify(HOME_WHY_STATS),                                         is_visible: true, display_order: 31 },
      { section_key: 'testimonials_section_heading', section_label: 'Testimonials Section Heading',   content_type: 'text', content_value: 'The people we work for.',                                                                                                                                                                                                             is_visible: true, display_order: 32 },
      { section_key: 'home_kickoff_heading',        section_label: 'Kickoff Heading (two lines)',        content_type: 'text', content_value: 'Day zero is when work starts.\nNot when paperwork ends.',                                                                                                                                                                                              is_visible: true, display_order: 33 },
      { section_key: 'home_kickoff_subtitle',       section_label: 'Kickoff Subtitle Paragraph',        content_type: 'text', content_value: 'Most engagements stall in scoping. Ours starts moving on day one. Here\u2019s how a typical kickoff with an Adviserve pod takes shape.',                                                                                                               is_visible: true, display_order: 34 },
      { section_key: 'home_kickoff_nodes',          section_label: 'Kickoff Steps',                     content_type: 'json', content_value: JSON.stringify(HOME_KICKOFF_NODES),                                                                                                                                                                                                                    is_visible: true, display_order: 35 },
      { section_key: 'home_kickoff_cta_text',       section_label: 'Kickoff CTA Button Text',           content_type: 'text', content_value: 'Book a 30-min scoping call \u2192',                                                                                                                                                                                                                   is_visible: true, display_order: 36 },
      { section_key: 'home_kickoff_cta_href',       section_label: 'Kickoff CTA Button Link',           content_type: 'text', content_value: '/book',                                                                                                                                                                                                                                               is_visible: true, display_order: 37 },
      { section_key: 'faq_section_title',          section_label: 'FAQ Section Title',           content_type: 'text', content_value: 'The questions operators actually ask.',                                is_visible: true, display_order: 40 },
      { section_key: 'faq_items_home',             section_label: 'FAQ Items (Home)',             content_type: 'json', content_value: JSON.stringify(HOME_FAQ_ITEMS),                                         is_visible: true, display_order: 41 },
      { section_key: 'why_choose_title',           section_label: 'Why Choose Us Title',         content_type: 'text', content_value: "We don\u2019t just advise. We embed with your team to implement.",     is_visible: true, display_order: 50 },
      { section_key: 'why_choose_badge',           section_label: 'Why Choose Us Badge',         content_type: 'text', content_value: '// 00.06\u00B0',                                                       is_visible: true, display_order: 51 },
      { section_key: 'why_choose_items',           section_label: 'Why Choose Us Items',         content_type: 'json', content_value: JSON.stringify(WHY_CHOOSE_ITEMS),                                       is_visible: true, display_order: 52 },
      { section_key: 'testimonials_data',          section_label: 'Testimonials',                content_type: 'json', content_value: JSON.stringify(TESTIMONIALS),                                           is_visible: true, display_order: 55 },
      { section_key: 'cta_title',                  section_label: 'CTA Title',                   content_type: 'text', content_value: "Let\u2019s figure out what your business actually needs.",         is_visible: true, display_order: 60 },
      { section_key: 'cta_description',            section_label: 'CTA Description',             content_type: 'text', content_value: 'No sales pitch. No long forms. Just a straight conversation about where you are and how we can help.', is_visible: true, display_order: 61 },
      { section_key: 'cta_button_text',            section_label: 'CTA Button Text',             content_type: 'text', content_value: 'Book a call \u2192',                                                   is_visible: true, display_order: 62 },
      { section_key: 'cta_button_link',            section_label: 'CTA Button Link',             content_type: 'text', content_value: '/book',                                                                is_visible: true, display_order: 63 },
      { section_key: 'cta_subtitle_secondary',     section_label: 'CTA Subtitle Secondary',      content_type: 'text', content_value: 'what your business needs.',                                            is_visible: true, display_order: 64 },
      { section_key: 'cta_secondary_text',         section_label: 'CTA Secondary Button Text',   content_type: 'text', content_value: 'Learn more',                                                           is_visible: true, display_order: 65 },
      { section_key: 'cta_secondary_link',         section_label: 'CTA Secondary Button Link',   content_type: 'text', content_value: '/about',                                                               is_visible: true, display_order: 66 },
      { section_key: 'process_steps_data',         section_label: 'Process Steps',               content_type: 'json', content_value: JSON.stringify(PROCESS_STEPS),                                          is_visible: true, display_order: 70 },
      { section_key: 'industries_data',            section_label: 'Industries',                  content_type: 'json', content_value: JSON.stringify(INDUSTRIES_DATA),                                        is_visible: true, display_order: 71 },
      { section_key: 'marquee_items_data',         section_label: 'Marquee Items',               content_type: 'json', content_value: JSON.stringify(MARQUEE_ITEMS),                                          is_visible: true, display_order: 72 },
      { section_key: 'accordion_items_data',       section_label: 'Accordion Items',             content_type: 'json', content_value: JSON.stringify(ACCORDION_ITEMS),                                        is_visible: true, display_order: 73 },
      { section_key: 'advantage_tabs_data',        section_label: 'Advantage Tabs',              content_type: 'json', content_value: JSON.stringify(ADVANTAGE_TABS),                                         is_visible: true, display_order: 74 },
      { section_key: 'advantage_badge',            section_label: 'Advantage Badge',             content_type: 'text', content_value: '// 00.02\u00B0 \u2014 One Firm, Six Practices',                        is_visible: true, display_order: 75 },
      { section_key: 'advantage_title',            section_label: 'Advantage Title',             content_type: 'text', content_value: 'Why six practices,\nunder one roof,\nchanges everything.',             is_visible: true, display_order: 76 },
      { section_key: 'practices_badge',            section_label: 'Practices Badge',             content_type: 'text', content_value: '// 00.03\u00B0 \u2014 The Practices',                                  is_visible: true, display_order: 77 },
      { section_key: 'practices_title',            section_label: 'Practices Title',             content_type: 'text', content_value: 'Six disciplines. One operating team.',                                 is_visible: true, display_order: 78 },
      { section_key: 'process_badge',              section_label: 'Process Badge',               content_type: 'text', content_value: '// 00.04\u00B0 \u2014 How We Work',                                    is_visible: true, display_order: 79 },
      { section_key: 'process_title',              section_label: 'Process Title',               content_type: 'text', content_value: 'Four steps. No surprises.',                                            is_visible: true, display_order: 80 },
      { section_key: 'industries_badge',           section_label: 'Industries Badge',            content_type: 'text', content_value: '// 00.06\u00B0 \u2014 Industries',                                     is_visible: true, display_order: 81 },
      { section_key: 'industries_title',           section_label: 'Industries Title',            content_type: 'text', content_value: 'Trusted across sectors.',                                              is_visible: true, display_order: 82 },
      { section_key: 'process_description',        section_label: 'Process Description',         content_type: 'text', content_value: 'Every engagement follows the same disciplined process \u2014 whether you need one practice or all six.', is_visible: true, display_order: 83 },
      { section_key: 'founding_year',              section_label: 'Founding Year',               content_type: 'text', content_value: '2017',                                                                  is_visible: true, display_order: 90 },
      { section_key: 'copyright_name',             section_label: 'Copyright Name',              content_type: 'text', content_value: 'Adviserve',                                                            is_visible: true, display_order: 91 },
      { section_key: 'meta_title',                 section_label: 'SEO \u2014 Meta Title',       content_type: 'text', content_value: "Adviserve | India's Integrated HR, Recruitment, Legal & Business Advisory", is_visible: true, display_order: 100 },
      { section_key: 'meta_description',           section_label: 'SEO \u2014 Meta Description', content_type: 'text', content_value: 'One firm for recruitment, HR consulting, legal compliance, business strategy, corporate training, and IT solutions. 3,000+ placements. 96% retention. 25+ industries across India.', is_visible: true, display_order: 101 },
      { section_key: 'og_image',                   section_label: 'SEO \u2014 OG Image URL',     content_type: 'text', content_value: '',                          is_visible: true, display_order: 102 },
      { section_key: 'canonical_url',              section_label: 'SEO \u2014 Canonical URL',    content_type: 'text', content_value: 'https://adviserve.in',       is_visible: true, display_order: 103 },
    ],
  },

  // ─────────────────────────────────────── ABOUT
  {
    slug: 'about',
    title: 'About',
    rows: [
      { section_key: 'about_title',    section_label: 'About Title',        content_type: 'text', content_value: 'We started Adviserve because we kept seeing the same problem.', is_visible: true, display_order: 1 },
      { section_key: 'about_intro',    section_label: 'About Intro',        content_type: 'text', content_value: 'We started Adviserve because we kept seeing the same problem.', is_visible: true, display_order: 2 },
      { section_key: 'about_eyebrow',  section_label: 'About Eyebrow',      content_type: 'text', content_value: '// 00.03 \u2014 About', is_visible: true, display_order: 3 },
      { section_key: 'story_badge',    section_label: 'Story Badge',        content_type: 'text', content_value: '// Our Story',                                                  is_visible: true, display_order: 10 },
      { section_key: 'story_title',    section_label: 'Story Title',        content_type: 'text', content_value: 'The Story\nBehind\nAdviserve',                                  is_visible: true, display_order: 11 },
      {
        section_key: 'story_paragraphs', section_label: 'Story Paragraphs', content_type: 'json',
        content_value: JSON.stringify([
          'Businesses \u2014 especially growing ones \u2014 spend an enormous amount of time and money trying to stitch together support from different directions. A recruitment agency here. A freelance HR consultant there. A law firm on retainer that charges for every email. An IT vendor that doesn\u2019t understand the business context.',
          'Nobody was coordinating it. Nobody was taking ownership. And the people running the business were spending half their energy managing vendors instead of managing their company.',
          'We built Adviserve to be the firm we wished existed. One team. Multiple specialisms. A single point of accountability. The kind of partner that gets into the details of your business and genuinely cares about what happens next.',
          'We\u2019re a startup ourselves \u2014 young, independent, and building our own reputation one client at a time. That keeps us honest. We can\u2019t afford to coast on legacy brand name. Every engagement matters to us, and that shows in how we work.',
        ]),
        is_visible: true, display_order: 12,
      },
      { section_key: 'approach_title', section_label: 'Approach Title',     content_type: 'text', content_value: 'How We Work', is_visible: true, display_order: 20 },
      {
        section_key: 'approach_steps', section_label: 'Approach Steps',     content_type: 'json',
        content_value: JSON.stringify([
          { num: '01', title: 'Diagnose', desc: 'We audit your current operations, people systems, compliance posture, and technology stack.' },
          { num: '02', title: 'Design',   desc: 'We build a custom roadmap with clear milestones, KPIs, and a realistic timeline.' },
          { num: '03', title: 'Deploy',   desc: 'Our specialists embed with your team to implement changes \u2014 not hand off a report.' },
          { num: '04', title: 'Optimize', desc: 'We track outcomes at 30, 60, and 90 days, iterating until targets are met.' },
        ]),
        is_visible: true, display_order: 21,
      },
      { section_key: 'approach_badge', section_label: 'Approach Badge',     content_type: 'text', content_value: '// Our Approach', is_visible: true, display_order: 22 },
      {
        section_key: 'mission_items', section_label: 'Mission/Vision/Team', content_type: 'json',
        content_value: JSON.stringify([
          { title: 'What we\u2019re here to do', description: 'Help businesses of every size access the kind of integrated, expert support that used to only be available to large companies with large budgets \u2014 and deliver it in a way that\u2019s honest, practical, and genuinely useful.', iconColor: 'teal' },
          { title: 'The people behind Adviserve', description: 'Our team brings experience from across HR, recruitment, law, business strategy, and technology. We\u2019ve worked with startups and enterprises alike, which means we understand both the ambition and the chaos that comes with building something.', iconColor: 'orange' },
        ]),
        is_visible: true, display_order: 30,
      },
      { section_key: 'impact_badge',   section_label: 'Impact Badge',       content_type: 'text', content_value: '// Mission', is_visible: true, display_order: 31 },
      { section_key: 'values_badge',    section_label: 'Values Badge',      content_type: 'text', content_value: '// Values',      is_visible: true, display_order: 40 },
      { section_key: 'values_title',    section_label: 'Values Title',      content_type: 'text', content_value: 'Our Core Values', is_visible: true, display_order: 41 },
      { section_key: 'values_subtitle', section_label: 'Values Subtitle',   content_type: 'text', content_value: '',               is_visible: true, display_order: 42 },
      {
        section_key: 'core_values', section_label: 'Core Values', content_type: 'json',
        content_value: JSON.stringify([
          { title: 'Honesty before comfort',  description: 'We\u2019ll tell you what we think, even when it\u2019s not what you\u2019re hoping to hear. You\u2019re better served by the truth than by a consultant who nods along.', iconColor: 'yellow' },
          { title: 'Ownership over advice',   description: 'There\u2019s a difference between telling someone what to do and actually helping them do it. We lean toward the second one.', iconColor: 'red' },
          { title: 'Depth, not jargon',       description: 'We have real specialists across all our service areas. They know their stuff. And they know how to explain it without making it complicated.', iconColor: 'blue' },
          { title: 'We grow with you',        description: 'Our best relationships are the ones that evolve. A client who comes to us for recruitment ends up working with our HR and legal teams too. That\u2019s how we know we\u2019re doing something right.', iconColor: 'teal' },
        ]),
        is_visible: true, display_order: 43,
      },
      { section_key: 'about_stats',          section_label: 'Stats Section',        content_type: 'json', content_value: JSON.stringify(ABOUT_STATS), is_visible: true, display_order: 50 },
      { section_key: 'about_cta_heading',     section_label: 'About CTA Heading',    content_type: 'text', content_value: 'Want To Learn More?',    is_visible: true, display_order: 51 },
      { section_key: 'about_cta_button_text', section_label: 'About CTA Button Text', content_type: 'text', content_value: 'Book a Free Call',       is_visible: true, display_order: 52 },
      { section_key: 'about_cta_button_href', section_label: 'About CTA Button Href', content_type: 'text', content_value: '/book',                  is_visible: true, display_order: 53 },
      { section_key: 'meta_title',       section_label: 'SEO \u2014 Meta Title',       content_type: 'text', content_value: "About Adviserve | India's Integrated Business Advisory Firm", is_visible: true, display_order: 60 },
      { section_key: 'meta_description', section_label: 'SEO \u2014 Meta Description', content_type: 'text', content_value: 'Six practices. One team. Since 2017, Adviserve has placed 3,000+ professionals across 25+ industries with 96% retention.', is_visible: true, display_order: 61 },
      { section_key: 'og_image',         section_label: 'SEO \u2014 OG Image URL',     content_type: 'text', content_value: '',                               is_visible: true, display_order: 62 },
      { section_key: 'canonical_url',    section_label: 'SEO \u2014 Canonical URL',    content_type: 'text', content_value: 'https://adviserve.in/about',      is_visible: true, display_order: 63 },
      { section_key: 'about_header_field_visibility',   section_label: 'Header Field Visibility',   content_type: 'json', content_value: '{}', is_visible: true, display_order: 4  },
      { section_key: 'about_story_field_visibility',    section_label: 'Story Field Visibility',    content_type: 'json', content_value: '{}', is_visible: true, display_order: 13 },
      { section_key: 'about_approach_field_visibility', section_label: 'Approach Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 24 },
      { section_key: 'about_mission_field_visibility',  section_label: 'Mission Field Visibility',  content_type: 'json', content_value: '{}', is_visible: true, display_order: 32 },
      { section_key: 'about_values_field_visibility',   section_label: 'Values Field Visibility',   content_type: 'json', content_value: '{}', is_visible: true, display_order: 44 },
      { section_key: 'about_cta_field_visibility',      section_label: 'CTA Field Visibility',      content_type: 'json', content_value: '{}', is_visible: true, display_order: 55 },
    ],
  },

  // ─────────────────────────────────────── TEAM
  {
    slug: 'team',
    title: 'Team',
    rows: [
      {
        section_key: 'founder', section_label: 'Founder', content_type: 'json',
        content_value: JSON.stringify({ name: 'Ritu Raj', initials: 'RR', title: 'Founder', bio: '', linkedin: '#' }),
        is_visible: true, display_order: 1,
      },
      { section_key: 'team_members',          section_label: 'Team Members',          content_type: 'json', content_value: '[]',                   is_visible: true, display_order: 2 },
      { section_key: 'team_founder_eyebrow',  section_label: 'Founder Eyebrow',       content_type: 'text', content_value: '// Founder',            is_visible: true, display_order: 3 },
      { section_key: 'team_cta_heading',      section_label: 'Team CTA Heading',      content_type: 'text', content_value: 'Want To Join Our Team?', is_visible: true, display_order: 4 },
      { section_key: 'team_cta_body',         section_label: 'Team CTA Body',         content_type: 'text', content_value: 'We are always looking for talented professionals who share our passion for helping businesses succeed.', is_visible: true, display_order: 5 },
      { section_key: 'team_cta_button_text',  section_label: 'Team CTA Button Text',  content_type: 'text', content_value: 'View Open Positions',    is_visible: true, display_order: 6 },
      { section_key: 'team_cta_button_href',  section_label: 'Team CTA Button Href',  content_type: 'text', content_value: '/careers',              is_visible: true, display_order: 7 },
      { section_key: 'meta_title',       section_label: 'SEO \u2014 Meta Title',       content_type: 'text', content_value: 'Our Team',                         is_visible: true, display_order: 10 },
      { section_key: 'meta_description', section_label: 'SEO \u2014 Meta Description', content_type: 'text', content_value: "Meet the leadership and team behind Adviserve \u2014 India's trusted full-service HR and corporate advisory firm.", is_visible: true, display_order: 11 },
      { section_key: 'og_image',         section_label: 'SEO \u2014 OG Image URL',     content_type: 'text', content_value: '',                               is_visible: true, display_order: 12 },
      { section_key: 'canonical_url',    section_label: 'SEO \u2014 Canonical URL',    content_type: 'text', content_value: 'https://adviserve.in/team',       is_visible: true, display_order: 13 },
      { section_key: 'team_founder_field_visibility', section_label: 'Founder Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 8 },
      { section_key: 'team_cta_field_visibility',     section_label: 'CTA Field Visibility',     content_type: 'json', content_value: '{}', is_visible: true, display_order: 9 },
    ],
  },

  // ─────────────────────────────────────── CONTACT
  {
    slug: 'contact',
    title: 'Contact',
    rows: [
      { section_key: 'contact_title',          section_label: 'Contact Title',          content_type: 'text', content_value: "Let\u2019s have a proper conversation.", is_visible: true, display_order: 1 },
      { section_key: 'contact_intro',          section_label: 'Contact Intro',          content_type: 'text', content_value: "Not a discovery call. Not a demo. Just a straightforward conversation about your business, what you're trying to solve, and whether we're the right fit to help. Fill out the form and someone from our team will get back to you within 24 hours.", is_visible: true, display_order: 2 },
      { section_key: 'form_title',             section_label: 'Form Title',             content_type: 'text', content_value: 'Send us a Message',                  is_visible: true, display_order: 10 },
      { section_key: 'success_message',        section_label: 'Success Message',        content_type: 'text', content_value: "Thank you for your message! We'll get back to you soon.", is_visible: true, display_order: 11 },
      {
        section_key: 'service_options', section_label: 'Service Options', content_type: 'json',
        content_value: JSON.stringify([
          { value: 'hr',                  label: 'HR' },
          { value: 'recruitment',         label: 'Recruitment' },
          { value: 'business-consulting', label: 'Business Consulting' },
          { value: 'legal',               label: 'Legal' },
          { value: 'it',                  label: 'IT' },
          { value: 'development',         label: 'Development' },
          { value: 'not-sure',            label: 'Not sure yet' },
        ]),
        is_visible: true, display_order: 12,
      },
      { section_key: 'business_hours_title', section_label: 'Business Hours Title', content_type: 'text', content_value: 'Business Hours', is_visible: true, display_order: 20 },
      {
        section_key: 'business_hours', section_label: 'Business Hours', content_type: 'json',
        content_value: JSON.stringify([
          { day: 'Monday - Friday',   hours: '9:00 AM - 6:00 PM IST' },
          { day: 'Saturday',          hours: '10:00 AM - 2:00 PM IST' },
          { day: 'Sunday & Holidays', hours: 'Closed' },
        ]),
        is_visible: true, display_order: 21,
      },
      { section_key: 'contact_form_labels', section_label: 'Form Field Labels', content_type: 'json', content_value: JSON.stringify({ name: 'Full Name', email: 'Email', phone: 'Phone', company: 'Company', message: 'Message' }), is_visible: true, display_order: 13 },
      { section_key: 'contact_form_placeholders', section_label: 'Form Placeholders', content_type: 'json', content_value: JSON.stringify({ name: 'Your name', email: 'you@company.com', phone: '+91 00000 00000', company: 'Acme Inc.', message: 'Your message here' }), is_visible: true, display_order: 14 },
      { section_key: 'contact_form_btn_submit', section_label: 'Submit Button Text', content_type: 'text', content_value: 'Get In Touch', is_visible: true, display_order: 15 },
      { section_key: 'contact_form_btn_reset',  section_label: 'Reset Button Text',  content_type: 'text', content_value: 'Send another message', is_visible: true, display_order: 16 },
      { section_key: 'contact_form_disclaimer', section_label: 'Form Disclaimer',    content_type: 'text', content_value: 'No spam. No automated sales sequences. Just a real person reading your message and getting back to you.', is_visible: true, display_order: 17 },
      { section_key: 'contact_sidebar_title', section_label: 'Contact Sidebar Title', content_type: 'text', content_value: 'Get in Touch', is_visible: true, display_order: 30 },
      { section_key: 'contact_schedule_title', section_label: 'Schedule Card Title',  content_type: 'text', content_value: 'Schedule Directly',  is_visible: true, display_order: 35 },
      { section_key: 'contact_schedule_btn',   section_label: 'Schedule Button Text', content_type: 'text', content_value: 'Book a Time Slot',   is_visible: true, display_order: 36 },
      {
        section_key: 'faqs', section_label: 'FAQs', content_type: 'json',
        content_value: JSON.stringify([
          { question: 'How fast can you start?',                               answer: 'Most engagements kick off within 48 hours of signing. For urgent recruitment needs, we can present pre-vetted candidates from our pipeline within 5 business days.' },
          { question: 'Is the initial consultation really free?',             answer: 'Yes \u2014 no strings attached. We use the first 30-minute call to understand your challenges, share relevant case studies, and outline a potential approach.' },
          { question: 'Can you handle multiple services simultaneously?',     answer: "Absolutely. That\u2019s our core differentiator. Many clients start with one service and expand as they see results. Our cross-functional teams coordinate internally." },
          { question: 'Do you work with startups or only large enterprises?', answer: 'Both. We serve 20-person startups and 5,000-person enterprises. Our engagement models scale from project-based work to full embedded partnerships.' },
          { question: 'What makes Adviserve different from specialised firms?', answer: 'We integrate five practices under one roof \u2014 recruitment, HR, legal, business consulting, and IT \u2014 so every recommendation accounts for the full picture.' },
        ]),
        is_visible: true, display_order: 40,
      },
      { section_key: 'contact_header_field_visibility',  section_label: 'Header Field Visibility',  content_type: 'json', content_value: '{}', is_visible: true, display_order: 3  },
      { section_key: 'contact_form_field_visibility',    section_label: 'Form Field Visibility',    content_type: 'json', content_value: '{}', is_visible: true, display_order: 18 },
      { section_key: 'contact_sidebar_field_visibility', section_label: 'Sidebar Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 37 },
    ],
  },

  // ─────────────────────────────────────── CAREERS
  {
    slug: 'careers',
    title: 'Careers',
    rows: [
      { section_key: 'hero_title',      section_label: 'Hero Title',         content_type: 'text',   content_value: 'Build something that matters.',                                                                                    is_visible: true, display_order: 1 },
      { section_key: 'hero_subtitle',   section_label: 'Hero Subtitle',      content_type: 'text',   content_value: 'We are recruiters, HR strategists, business consultants, lawyers, and technologists who solve complex problems for ambitious companies.', is_visible: true, display_order: 2 },
      { section_key: 'hero_visible',    section_label: 'Hero Visible',       content_type: 'toggle', content_value: 'true',                                                                                                               is_visible: true, display_order: 3 },
      { section_key: 'benefits',        section_label: 'Benefits',           content_type: 'json',   content_value: JSON.stringify(CAREERS_BENEFITS),                                                                                     is_visible: true, display_order: 10 },
      { section_key: 'culture',         section_label: 'Culture Highlights', content_type: 'json',   content_value: JSON.stringify(CAREERS_CULTURE),                                                                                      is_visible: true, display_order: 20 },
      { section_key: 'cta_title',       section_label: 'CTA Title',          content_type: 'text',   content_value: 'Do not see your role?',                                                                                              is_visible: true, display_order: 30 },
      { section_key: 'cta_description', section_label: 'CTA Description',    content_type: 'text',   content_value: 'We are always looking for exceptional people. Send a speculative application.',                                       is_visible: true, display_order: 31 },
      { section_key: 'cta_visible',     section_label: 'CTA Visible',        content_type: 'toggle', content_value: 'true',                                                                                                              is_visible: true, display_order: 32 },
      { section_key: 'apply_modal_header',         section_label: 'Apply Modal Header',         content_type: 'text', content_value: 'Apply Now',                                                                                                                                                                       is_visible: true, display_order: 33 },
      { section_key: 'apply_modal_labels',         section_label: 'Apply Modal Labels',         content_type: 'json', content_value: JSON.stringify({ name: 'Full Name', email: 'Email', phone: 'Phone', linkedin: 'LinkedIn URL', resume: 'Resume', cover: 'Cover Message' }),                                        is_visible: true, display_order: 34 },
      { section_key: 'apply_modal_placeholder_cover', section_label: 'Apply Cover Placeholder', content_type: 'text', content_value: "Tell us why you\u2019re a great fit\u2026",                                                                                                                                       is_visible: true, display_order: 35 },
      { section_key: 'apply_modal_btn_submit',     section_label: 'Apply Submit Button',        content_type: 'text', content_value: 'Submit Application',                                                                                                                                                              is_visible: true, display_order: 36 },
      { section_key: 'apply_modal_received_title', section_label: 'Application Received Title', content_type: 'text', content_value: 'Application Received',                                                                                                                                                            is_visible: true, display_order: 37 },
      { section_key: 'apply_modal_received_text',  section_label: 'Application Received Text',  content_type: 'text', content_value: "We\u2019ll review your application and get back to you within 5 business days.",                                                                                                  is_visible: true, display_order: 38 },
      { section_key: 'meta_title',       section_label: 'SEO \u2014 Meta Title',       content_type: 'text', content_value: "Careers at Adviserve | Join India's Integrated Advisory Team", is_visible: true, display_order: 40 },
      { section_key: 'meta_description', section_label: 'SEO \u2014 Meta Description', content_type: 'text', content_value: "Join India's fastest-growing advisory firm. Remote-first culture, annual learning budget, and impact across 6 practices. Explore open positions.", is_visible: true, display_order: 41 },
      { section_key: 'og_image',         section_label: 'SEO \u2014 OG Image URL',     content_type: 'text', content_value: '',                                  is_visible: true, display_order: 42 },
      { section_key: 'canonical_url',    section_label: 'SEO \u2014 Canonical URL',    content_type: 'text', content_value: 'https://adviserve.in/careers',       is_visible: true, display_order: 43 },
      { section_key: 'careers_hero_field_visibility',  section_label: 'Hero Field Visibility',  content_type: 'json', content_value: '{}', is_visible: true, display_order: 5  },
      { section_key: 'careers_cta_field_visibility',   section_label: 'CTA Field Visibility',   content_type: 'json', content_value: '{}', is_visible: true, display_order: 39 },
      { section_key: 'careers_modal_field_visibility', section_label: 'Modal Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 40 },
    ],
  },

  // ─────────────────────────────────────── FOOTER
  {
    slug: 'footer',
    title: 'Footer',
    rows: [
      { section_key: 'footer_header_contact',        section_label: 'Contact Column Header',         content_type: 'text', content_value: 'Contact',                               is_visible: true, display_order: 10 },
      { section_key: 'footer_header_navigation',     section_label: 'Navigation Column Header',      content_type: 'text', content_value: 'Navigation',                           is_visible: true, display_order: 11 },
      { section_key: 'footer_header_subscribe',      section_label: 'Subscribe Column Header',       content_type: 'text', content_value: 'Subscribe',                            is_visible: true, display_order: 12 },
      { section_key: 'footer_header_certifications', section_label: 'Certifications Section Header', content_type: 'text', content_value: 'Certifications',                       is_visible: true, display_order: 13 },
      { section_key: 'footer_copyright_name',         section_label: 'Copyright Name',                content_type: 'text', content_value: 'Adviserve',                             is_visible: true, display_order: 14 },
      { section_key: 'footer_legal_links',           section_label: 'Footer Legal Links',            content_type: 'json', content_value: JSON.stringify(FOOTER_LEGAL_LINKS),     is_visible: true, display_order: 15 },
      { section_key: 'iso_certifications',           section_label: 'ISO Certifications',            content_type: 'json', content_value: JSON.stringify(FOOTER_ISO_CERTS),       is_visible: true, display_order: 20 },
      { section_key: 'footer_field_visibility', section_label: 'Footer Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 21 },
    ],
  },

  // ─────────────────────────────────────── BLOG
  {
    slug: 'blog',
    title: 'Blog',
    rows: [
      { section_key: 'blog_page_title',         section_label: 'Page Title',               content_type: 'text', content_value: 'Insights \u0026 Resources',                                                                                                                         is_visible: true, display_order: 1 },
      { section_key: 'blog_page_subtitle',      section_label: 'Page Subtitle',            content_type: 'text', content_value: 'Practical guides on hiring, team building, HR strategy, and workforce trends \u2014 written by the people who do this work every day.',              is_visible: true, display_order: 2 },
      { section_key: 'blog_seo_description',    section_label: 'SEO Description',          content_type: 'text', content_value: 'Practical guides on hiring, team building, HR strategy, and workforce trends \u2014 written by the people who do this work every day.',              is_visible: true, display_order: 3 },
      { section_key: 'blog_search_placeholder', section_label: 'Search Placeholder',       content_type: 'text', content_value: 'Search articles...',                                                                                                                                 is_visible: true, display_order: 4 },
      { section_key: 'blog_empty_heading',      section_label: 'Empty State Heading',      content_type: 'text', content_value: 'No articles found',                                                                                                                                  is_visible: true, display_order: 5 },
      { section_key: 'blog_empty_body',         section_label: 'Empty State Body',         content_type: 'text', content_value: "We're working on fresh content. Check back soon for insights on recruitment, HR strategy, and more.",                                                 is_visible: true, display_order: 6 },
      { section_key: 'blog_card_read_more',     section_label: 'Card Read More Label',     content_type: 'text', content_value: 'Read more',                                                                                                                                          is_visible: true, display_order: 7 },
      { section_key: 'meta_title',              section_label: 'SEO \u2014 Meta Title',    content_type: 'text', content_value: 'Blog | Adviserve \u2014 Insights on HR, Recruitment & Advisory',                                                                                      is_visible: true, display_order: 10 },
      { section_key: 'meta_description',        section_label: 'SEO \u2014 Meta Description', content_type: 'text', content_value: 'Practical guides on hiring, team building, HR strategy, and workforce trends \u2014 written by the people who do this work every day.',           is_visible: true, display_order: 11 },
      { section_key: 'og_image',                section_label: 'SEO \u2014 OG Image URL', content_type: 'text', content_value: '',                                                                                                                                                     is_visible: true, display_order: 12 },
      { section_key: 'canonical_url',           section_label: 'SEO \u2014 Canonical URL', content_type: 'text', content_value: 'https://adviserve.in/blog',                                                                                                                          is_visible: true, display_order: 13 },
      { section_key: 'blog_chrome_field_visibility', section_label: 'Chrome Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 7 },
    ],
  },

  // ─────────────────────────────────────── CASE STUDIES
  {
    slug: 'case-studies',
    title: 'Case Studies',
    rows: [
      { section_key: 'cs_hero_heading',       section_label: 'Hero Heading',                content_type: 'text', content_value: 'What connected advisory looks like in practice.',                                                                                                   is_visible: true, display_order: 1 },
      { section_key: 'cs_hero_subtitle',      section_label: 'Hero Subtitle',               content_type: 'text', content_value: 'Real engagements. Real outcomes. Every case study shows how integrating multiple practices under one team delivers results that siloed vendors cannot.', is_visible: true, display_order: 2 },
      { section_key: 'cs_cta_heading',        section_label: 'CTA Heading',                 content_type: 'text', content_value: 'Ready to be our next success story?',                                                                                                               is_visible: true, display_order: 3 },
      { section_key: 'cs_cta_body',           section_label: 'CTA Body',                    content_type: 'text', content_value: "Every case study started with a single conversation. Tell us about your challenge, and we'll show you what's possible.",                             is_visible: true, display_order: 4 },
      { section_key: 'cs_cta_primary_text',   section_label: 'CTA Primary Button Text',     content_type: 'text', content_value: 'Book a Consultation',                                                                                                                               is_visible: true, display_order: 5 },
      { section_key: 'cs_cta_primary_href',   section_label: 'CTA Primary Button Href',     content_type: 'text', content_value: '/book',                                                                                                                                             is_visible: true, display_order: 6 },
      { section_key: 'cs_cta_secondary_text', section_label: 'CTA Secondary Button Text',   content_type: 'text', content_value: 'Explore Our Services',                                                                                                                              is_visible: true, display_order: 7 },
      { section_key: 'cs_cta_secondary_href', section_label: 'CTA Secondary Button Href',   content_type: 'text', content_value: '/services',                                                                                                                                         is_visible: true, display_order: 8 },
      { section_key: 'meta_title',            section_label: 'SEO \u2014 Meta Title',        content_type: 'text', content_value: 'Case Studies | Adviserve \u2014 HR, Recruitment, Legal & Business Advisory Results',                                                                is_visible: true, display_order: 10 },
      { section_key: 'meta_description',      section_label: 'SEO \u2014 Meta Description',  content_type: 'text', content_value: 'Real engagements. Real outcomes. Every case study shows how integrating multiple practices under one team delivers results that siloed vendors cannot.', is_visible: true, display_order: 11 },
      { section_key: 'og_image',              section_label: 'SEO \u2014 OG Image URL',      content_type: 'text', content_value: '',                                                                                                                                                   is_visible: true, display_order: 12 },
      { section_key: 'canonical_url',         section_label: 'SEO \u2014 Canonical URL',     content_type: 'text', content_value: 'https://adviserve.in/case-studies',                                                                                                                 is_visible: true, display_order: 13 },
      { section_key: 'cs_hero_field_visibility', section_label: 'Hero Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 9  },
      { section_key: 'cs_cta_field_visibility',  section_label: 'CTA Field Visibility',  content_type: 'json', content_value: '{}', is_visible: true, display_order: 10 },
    ],
  },

  // ─────────────────────────────────────── FAQ
  {
    slug: 'faq',
    title: 'FAQ',
    rows: [
      {
        section_key: 'faq_items', section_label: 'FAQ Items', content_type: 'json',
        content_value: JSON.stringify([
          { id: 'q1', category: 'General',  question: "What's the difference between an HRMS and an HRIS?",        answer: "An HRIS is the database of record for people data. An HRMS adds workflow \u2014 payroll, leave, lifecycle, case management \u2014 on top. Adviserve People is an HRMS; it includes the HRIS layer." },
          { id: 'q2', category: 'Services', question: 'Is DPDP Act 2023 applicable to small businesses in India?', answer: "Yes, with almost no carve-outs. If you process personal data of Indian residents \u2014 employees, customers, website visitors \u2014 you're in scope. Penalties run up to \u20B9250 crore per instance." },
          { id: 'q3', category: 'Process',  question: 'How long does a DPDP compliance project take?',             answer: 'A standard engagement runs 10\u201314 weeks: 3 weeks of data mapping, 4 weeks of policy + flow design, 3 weeks of rollout + training, 2 weeks of audit readiness. We stage it so you have working controls in week 5.' },
          { id: 'q4', category: 'Services', question: "What's included in corporate training engagements?",        answer: "Assessment, curriculum design, facilitators, post-training reinforcement, and a written outcomes brief. We don't sell one-off keynotes \u2014 every engagement has a 12-week measurement window." },
          { id: 'q5', category: 'General',  question: 'Do you work with startups or only enterprises?',            answer: "Both. Our smallest active client is a 14-person seed-stage fintech; our largest is a listed manufacturer. The engagement shape changes; the operator-grade bar doesn't." },
          { id: 'q6', category: 'Services', question: 'How fast can you ramp up recruitment?',                     answer: '48 hours to embedded team, 7 days to first calibrated shortlist, typical time-to-offer of 22 days on mid-senior roles. We publish these numbers per engagement and track them weekly.' },
        ]),
        is_visible: true, display_order: 1,
      },
      { section_key: 'faq_hero_heading',       section_label: 'FAQ Hero Heading',          content_type: 'text', content_value: 'Frequently Asked Questions', is_visible: true, display_order: 2 },
      { section_key: 'faq_hero_intro',         section_label: 'FAQ Hero Intro',            content_type: 'text', content_value: 'Everything you need to know about working with Adviserve. Cannot find your answer? Talk to us.', is_visible: true, display_order: 3 },
      { section_key: 'faq_search_placeholder', section_label: 'FAQ Search Placeholder',    content_type: 'text', content_value: 'Search questions...',         is_visible: true, display_order: 4 },
      { section_key: 'faq_cta_heading',        section_label: 'FAQ CTA Heading',           content_type: 'text', content_value: 'Still Have Questions?',        is_visible: true, display_order: 5 },
      { section_key: 'faq_cta_body',           section_label: 'FAQ CTA Body',              content_type: 'text', content_value: 'Our team is happy to help. Get in touch for a free 30-minute consultation.', is_visible: true, display_order: 6 },
      { section_key: 'faq_cta_primary_text',   section_label: 'FAQ CTA Primary Button',    content_type: 'text', content_value: 'Contact Us',                   is_visible: true, display_order: 7 },
      { section_key: 'faq_cta_primary_href',   section_label: 'FAQ CTA Primary Href',      content_type: 'text', content_value: '/contact',                     is_visible: true, display_order: 8 },
      { section_key: 'faq_cta_secondary_text', section_label: 'FAQ CTA Secondary Button',  content_type: 'text', content_value: 'Or book a free call',           is_visible: true, display_order: 9 },
      { section_key: 'faq_cta_secondary_href', section_label: 'FAQ CTA Secondary Href',    content_type: 'text', content_value: '/book',                        is_visible: true, display_order: 9 },
      { section_key: 'meta_title',       section_label: 'SEO \u2014 Meta Title',       content_type: 'text', content_value: 'FAQ | Adviserve \u2014 Recruitment, HR, Legal & Business Advisory', is_visible: true, display_order: 10 },
      { section_key: 'meta_description', section_label: 'SEO \u2014 Meta Description', content_type: 'text', content_value: "Common questions about Adviserve's services, pricing, process, and engagement model. Learn how our integrated advisory works for your business.", is_visible: true, display_order: 11 },
      { section_key: 'og_image',         section_label: 'SEO \u2014 OG Image URL',     content_type: 'text', content_value: '',                             is_visible: true, display_order: 12 },
      { section_key: 'canonical_url',    section_label: 'SEO \u2014 Canonical URL',    content_type: 'text', content_value: 'https://adviserve.in/faq',     is_visible: true, display_order: 13 },
      { section_key: 'faq_chrome_field_visibility', section_label: 'Chrome Field Visibility', content_type: 'json', content_value: '{}', is_visible: true, display_order: 11 },
      { section_key: 'faq_cta_field_visibility',    section_label: 'CTA Field Visibility',    content_type: 'json', content_value: '{}', is_visible: true, display_order: 12 },
    ],
  },

  // ─────────────────────────────────────── PRODUCTS
  {
    slug: 'products',
    title: 'Products',
    rows: [
      { section_key: 'products_hero_title',    section_label: 'Products Hero Title',    content_type: 'text', content_value: 'Software built from real advisory experience.', is_visible: true, display_order: 1 },
      { section_key: 'products_hero_subtitle', section_label: 'Products Hero Subtitle', content_type: 'text', content_value: 'Three products. All built from thousands of hours of doing the actual work \u2014 not from a product manager\u2019s imagination. And all connect directly to Adviserve\u2019s advisory team when you need more than software.', is_visible: true, display_order: 2 },
    ],
  },
];

// ─── Products seed ────────────────────────────────────────────────────────────

export const SEED_PRODUCTS = [
  {
    title: 'Adviserve People',
    slug: 'hris-portal',
    subtitle: 'HRIS',
    description: 'Employee data, attendance, payroll, compliance, and performance management \u2014 built for Indian businesses by the HR consultants who run HR for a living. Free for up to 50 employees.',
    icon: 'users',
    image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    card_color: 'rgba(109,212,196,0.95)',
    sort_order: 1,
    is_visible: true,
  },
  {
    title: 'Adviserve Hire',
    slug: 'ats-system',
    subtitle: 'ATS',
    description: 'Track candidates from application to offer. AI screening, Naukri integration, WhatsApp communication, and hiring analytics \u2014 built by the team that has placed 3,000+ professionals. Free for up to 5 active jobs.',
    icon: 'target',
    image_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    card_color: 'rgba(58,100,176,0.95)',
    sort_order: 2,
    is_visible: true,
  },
  {
    title: 'Adviserve Comply',
    slug: 'dpdp-compliance',
    subtitle: 'DPDP',
    description: 'DPDP compliance assessment, document generation, and ongoing monitoring for Indian businesses. Free assessment. Premium from Rs. 8,000/month.',
    icon: 'shield',
    image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    card_color: 'rgba(10,74,173,0.95)',
    sort_order: 3,
    is_visible: true,
  },
  {
    title: 'Adviserve Learn',
    slug: 'adviserve-learn',
    subtitle: 'LEARNING',
    description: 'Cut training costs 30%. Mobile-first delivery with AI-driven adaptive learning paths that lift engagement up to 85%.',
    icon: 'book-open',
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    card_color: 'rgba(212,165,116,0.95)',
    sort_order: 4,
    is_visible: true,
  },
];

/**
 * Seeds default products into the products table.
 * New rows: INSERT WHERE NOT EXISTS (admin edits never overwritten).
 * Existing rows: backfills image_url/card_color only if NULL (safe for admin edits).
 */
export async function seedProducts(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<number> {
  let seeded = 0;
  for (const p of SEED_PRODUCTS) {
    await sql.query(
      `INSERT INTO products (title, slug, subtitle, description, icon, image_url, card_color, sort_order, is_visible, features, differentiators, pricing_tiers)
       SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb
       WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = $2)`,
      [p.title, p.slug, p.subtitle, p.description, p.icon, p.image_url, p.card_color, p.sort_order, p.is_visible],
    );
    // Backfill image_url/card_color for existing rows that have NULL values
    await sql.query(
      `UPDATE products SET image_url = $1, card_color = $2 WHERE slug = $3 AND (image_url IS NULL OR card_color IS NULL)`,
      [p.image_url, p.card_color, p.slug],
    );
    seeded++;
  }
  return seeded;
}

// ─── Table migrations ─────────────────────────────────────────────────────────

/**
 * Creates the products table if it doesn't exist, then backfills any columns
 * added after the initial deploy (ALTER TABLE IF NOT EXISTS is idempotent).
 */
export async function createProductsTable(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS products (
      id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title            TEXT        NOT NULL,
      slug             TEXT        NOT NULL UNIQUE,
      subtitle         TEXT,
      description      TEXT,
      icon             TEXT,
      image_url        TEXT,
      card_color       TEXT,
      problem_title    TEXT,
      problem_body     TEXT,
      features         JSONB       NOT NULL DEFAULT '[]',
      differentiators  JSONB       NOT NULL DEFAULT '[]',
      pricing_tiers    JSONB       NOT NULL DEFAULT '[]',
      cta_title        TEXT,
      cta_description  TEXT,
      seo_title        TEXT,
      seo_description  TEXT,
      sort_order       INT         NOT NULL DEFAULT 0,
      is_visible       BOOLEAN     NOT NULL DEFAULT true,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  // Backfill columns for tables created before image_url/card_color were added
  await sql.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`);
  await sql.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS card_color TEXT`);
}

/**
 * Must be created BEFORE job_applications (FK dependency).
 */
export async function createJobPositionsTable(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS job_positions (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title       TEXT        NOT NULL,
      department  TEXT,
      location    TEXT,
      type        TEXT,
      description TEXT,
      is_active   BOOLEAN     NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

/**
 * Auto-creates the job_applications table on every Vercel deploy.
 * Called from scripts/run-seed.ts before content seeding.
 * Safe to call repeatedly — uses CREATE TABLE IF NOT EXISTS.
 */
export async function createJobApplicationsTable(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      job_position_id UUID        REFERENCES job_positions(id) ON DELETE SET NULL,
      applicant_name  TEXT        NOT NULL,
      email           TEXT        NOT NULL,
      phone           TEXT        NOT NULL,
      linkedin_url    TEXT,
      resume_url      TEXT        NOT NULL,
      cover_message   TEXT,
      status          TEXT        NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new','reviewed','contacted','rejected','hired')),
      notes           TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

/**
 * Auto-creates the dpdp_assessments table on every Vercel deploy.
 * Called from scripts/run-seed.ts before content seeding.
 * Safe to call repeatedly — uses CREATE TABLE IF NOT EXISTS.
 */
export async function createDPDPAssessmentsTable(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS dpdp_assessments (
      id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name    TEXT         NOT NULL,
      email        TEXT         NOT NULL,
      company      TEXT         NOT NULL,
      company_size TEXT,
      notes        TEXT,
      total_score  INTEGER      NOT NULL,
      tier         TEXT         NOT NULL,
      answers      JSONB        NOT NULL DEFAULT '{}',
      gaps         JSONB        NOT NULL DEFAULT '[]',
      submitted_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

/**
 * Auto-creates the case_studies table on every Vercel deploy.
 * Called from scripts/run-seed.ts before content seeding.
 * Safe to call repeatedly — uses CREATE TABLE IF NOT EXISTS.
 */
export async function createCaseStudiesTable(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS case_studies (
      id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      title               TEXT        NOT NULL,
      slug                TEXT        NOT NULL UNIQUE,
      industry            TEXT,
      timeline            TEXT,
      practices           JSONB       NOT NULL DEFAULT '[]',
      client_name         TEXT,
      client_description  TEXT,
      challenge           TEXT,
      work_sections       JSONB       NOT NULL DEFAULT '[]',
      results             JSONB       NOT NULL DEFAULT '[]',
      integration_quote   TEXT,
      seo_title           TEXT,
      seo_description     TEXT,
      is_visible          BOOLEAN     NOT NULL DEFAULT true,
      sort_order          INT         NOT NULL DEFAULT 0,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

/**
 * Creates navigation_menus and menu_items tables.
 * Safe to call repeatedly — uses CREATE TABLE IF NOT EXISTS.
 */
export async function createNavigationTables(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS navigation_menus (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT        NOT NULL UNIQUE,
      location   TEXT        NOT NULL DEFAULT 'header',
      is_active  BOOLEAN     NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      menu_id    UUID        NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
      parent_id  UUID        REFERENCES menu_items(id) ON DELETE CASCADE,
      label      TEXT        NOT NULL,
      url        TEXT        NOT NULL,
      icon       TEXT,
      target     TEXT        NOT NULL DEFAULT '_self',
      sort_order INT         NOT NULL DEFAULT 0,
      is_visible BOOLEAN     NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

const NAV_SEED_ITEMS = [
  { label: "Home",         url: "/",             sort_order: 1 },
  { label: "Products",     url: "/products",     sort_order: 2 },
  { label: "Services",     url: "/services",     sort_order: 3 },
  { label: "About",        url: "/about",        sort_order: 4 },
  { label: "Case Studies", url: "/case-studies", sort_order: 5 },
  { label: "Careers",      url: "/careers",      sort_order: 6 },
  { label: "Blog",         url: "/blog",         sort_order: 7 },
  { label: "Contact",      url: "/contact",      sort_order: 8 },
  { label: "FAQ",          url: "/faq",          sort_order: 9 },
  { label: "Testimonials", url: "/testimonials", sort_order: 10 },
];

/**
 * Seeds the main_navigation menu + default 8 items.
 * Only inserts items when the menu has no items yet (preserves admin edits).
 * Returns the number of items inserted.
 */
export async function seedNavigation(
  sql: { query: (text: string, params?: unknown[]) => Promise<unknown[]> },
): Promise<number> {
  // Upsert the menu row
  const menuRows = await sql.query(`
    INSERT INTO navigation_menus (name, location, is_active)
    VALUES ('main_navigation', 'header', true)
    ON CONFLICT (name) DO UPDATE SET is_active = true
    RETURNING id
  `) as Array<{ id: string }>;

  const menuId = menuRows[0].id;

  // Only seed items when the menu is empty (fresh DB / first deploy)
  const countRows = await sql.query(
    `SELECT COUNT(*)::int AS cnt FROM menu_items WHERE menu_id = $1`,
    [menuId],
  ) as Array<{ cnt: number }>;

  if ((countRows[0]?.cnt ?? 0) > 0) return 0;

  for (const item of NAV_SEED_ITEMS) {
    await sql.query(
      `INSERT INTO menu_items (menu_id, label, url, sort_order, is_visible)
       VALUES ($1, $2, $3, $4, true)`,
      [menuId, item.label, item.url, item.sort_order],
    );
  }

  return NAV_SEED_ITEMS.length;
}
