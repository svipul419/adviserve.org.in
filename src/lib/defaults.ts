import type { Service, MenuItem, FooterServiceLink } from './types';

// ─── Header ───
// Per §NAV-FOOTER. Primary nav: Services · Products · Industries · Insights · About.
// Right utility: Trust · Careers · Book a call (handled in Header component).
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Services', url: '/services', parent_id: null, sort_order: 1, is_visible: true },
  { id: '2', label: 'Products', url: '/products', parent_id: null, sort_order: 2, is_visible: true },
  { id: '3', label: 'Industries', url: '/industries', parent_id: null, sort_order: 3, is_visible: true },
  { id: '4', label: 'Insights', url: '/insights', parent_id: null, sort_order: 4, is_visible: true },
  { id: '5', label: 'About', url: '/about', parent_id: null, sort_order: 5, is_visible: true },
];

// ─── Services ───
// NOTE: Slugs feed both the /services index rows and /services/:slug detail pages
// rendered by ServiceCategory. Detail content lives in DEFAULT_SERVICE_PRACTICES.
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'saas-products', title: 'SaaS Products', slug: 'saas-products',
    description: 'Modular SaaS — HRMS, candidate screening, DPDP compliance — plus custom-build engagements. API-first, role-based, encrypted-at-rest, ISO 27001-aligned.',
    icon: '🧩', is_visible: true, sort_order: 1, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'cybersecurity', title: 'Cybersecurity', slug: 'cybersecurity',
    description: 'Vulnerability assessment, threat intelligence, data-protection architecture, and risk management — operated under an ISO/IEC 27001-aligned ISMS.',
    icon: '🛡️', is_visible: true, sort_order: 2, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'compliance-regtech', title: 'Compliance & RegTech', slug: 'compliance-regtech',
    description: 'DPDP Act 2023, operationalised. Assess, gap-map, remediate, sustain — with audit-ready evidence and continuous monitoring.',
    icon: '⚖️', is_visible: true, sort_order: 3, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'hr-services', title: 'HR Services & Staffing', slug: 'hr-services',
    description: 'Manpower consultancy, executive search, placement, capability development — backed by our HRMS, candidate screening, and training engine.',
    icon: '👥', is_visible: true, sort_order: 4, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'it-services', title: 'IT Consulting', slug: 'it-services',
    description: 'System integration, cloud infrastructure, data analytics, digital transformation — lifecycle-managed under ISO/IEC 20000-1 with documented SLAs.',
    icon: '💻', is_visible: true, sort_order: 5, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'legal-consulting', title: 'Legal Consulting', slug: 'legal-consulting',
    description: 'Corporate, regulatory, advisory — structured engagement model across project, retainer, and embedded modes. Integrated with our cybersecurity, RegTech, and IT work.',
    icon: '📜', is_visible: true, sort_order: 6, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'corporate-training', title: 'Corporate Training', slug: 'corporate-training',
    description: '6,000+ professionals trained across 26+ enterprise clients. 15 capability tracks, Kirkpatrick-based effectiveness measurement, GECL Excellence Award 2020.',
    icon: '🎓', is_visible: true, sort_order: 7, image_url: null, is_featured: true, meta_title: null, meta_description: null,
    content: '',
    created_at: '', updated_at: '',
  },
];

// ─── Footer ───
export const DEFAULT_FOOTER_SERVICE_LINKS: FooterServiceLink[] = [
  { label: 'SaaS Products', url: '/services/saas-products' },
  { label: 'Cybersecurity', url: '/services/cybersecurity' },
  { label: 'Compliance & RegTech', url: '/services/compliance-regtech' },
  { label: 'HR Services', url: '/services/hr-services' },
  { label: 'IT Consulting', url: '/services/it-services' },
  { label: 'Legal Consulting', url: '/services/legal-consulting' },
  { label: 'Corporate Training', url: '/services/corporate-training' },
];

// ─── Contact ───
export interface BusinessHour { day: string; hours: string; }
export interface ServiceOption { value: string; label: string; }
export interface FAQ { question: string; answer: string; }

export const DEFAULT_SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'saas-products', label: 'SaaS Products' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'compliance-regtech', label: 'Compliance & RegTech' },
  { value: 'hr-services', label: 'HR Services & Staffing' },
  { value: 'it-services', label: 'IT Consulting' },
  { value: 'legal-consulting', label: 'Legal Consulting' },
  { value: 'corporate-training', label: 'Corporate Training' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
  { day: 'Saturday', hours: '10:00 AM - 2:00 PM IST' },
  { day: 'Sunday & Holidays', hours: 'Closed' },
];

export const DEFAULT_FAQS: FAQ[] = [
  { question: 'How fast can you start?', answer: 'Most engagements kick off within 48 hours of signing. For urgent recruitment needs, we can present pre-vetted candidates from our pipeline within 5 business days.' },
  { question: 'Is the initial consultation really free?', answer: 'Yes — no strings attached. We use the first 30-minute call to understand your challenges, share relevant case studies, and outline a potential approach.' },
  { question: 'Can you handle multiple services simultaneously?', answer: 'Absolutely. That\'s our core differentiator. Many clients start with one service and expand as they see results. Our cross-functional teams coordinate internally so you don\'t have to manage multiple vendors.' },
  { question: 'Do you work with startups or only large enterprises?', answer: 'Both. We serve 20-person startups and 5,000-person enterprises. Our engagement models scale from project-based work to full embedded partnerships.' },
  { question: 'What makes Adviserve different from specialised firms?', answer: 'We integrate six practices under one roof — recruitment, HR, training, legal, business consulting, and IT — so every recommendation accounts for the full picture. Your hiring strategy aligns with your compliance posture, your IT decisions account for your growth plan.' },
  { question: 'Do you work only in India?', answer: 'Our primary operations are in India, but we support clients with distributed teams and have experience with cross-border compliance, international recruitment, and multi-geography HR operations.' },
];

// ─── About ───
export const DEFAULT_STORY_PARAGRAPHS = [
  'Adviserve began in 2015 as a focused learning and capability-building practice — delivering personalised technical training to Indian enterprises. Over the next decade, the practice grew to 6,000+ professionals trained across 26+ enterprise clients, recognised by the GECL Excellence Award in 2020.',
  'In 2022, we launched our online learning platform. In 2026, we incorporated Adviserve Talent & Consulting Private Limited — an integrated technology and advisory firm bringing SaaS, cybersecurity, compliance, HR, IT consulting, legal, and corporate training under one operating standard.',
  'The arc is continuous. The capability is compounded. The standard is the same.',
];

export interface ApproachStep { num: string; title: string; desc: string; }
export interface MissionItem { title: string; description: string; iconColor: string; }
export interface CoreValue { title: string; description: string; iconColor: string; }

export const DEFAULT_APPROACH_STEPS: ApproachStep[] = [
  { num: '01', title: 'Diagnose with evidence', desc: 'Documented intake, stakeholder map, data discovery, gap analysis, risk classification, and option framing — before anything is built.' },
  { num: '02', title: 'Design with structure', desc: 'Solution architecture, RACI, milestones, and SLA — documented and signed off before deploy.' },
  { num: '03', title: 'Sustain with audit trails', desc: 'Phased deployment with audit-ready evidence at each gate. Lifecycle maintenance, post-deployment reinforcement, capability transfer.' },
];

export const DEFAULT_MISSION_ITEMS: MissionItem[] = [
  { title: 'Trusted', description: 'Auditable, compliant, ISO-certified.', iconColor: 'teal' },
  { title: 'Intelligent', description: 'AI-assisted, structured outputs.', iconColor: 'teal' },
  { title: 'Usable', description: 'Designed for non-technical stakeholders.', iconColor: 'teal' },
];

export const DEFAULT_CORE_VALUES: CoreValue[] = [
  { title: 'Modular & Interoperable', description: 'Composable services with well-defined contracts.', iconColor: 'teal' },
  { title: 'Data-Driven', description: 'Decisions and audit trails grounded in measurable signals, not anecdote.', iconColor: 'yellow' },
  { title: 'Automated', description: 'Repeatable, scriptable operations across compliance, security, and HR flows.', iconColor: 'blue' },
  { title: 'Structured', description: 'Reduction of ambiguity in cybersecurity, regulatory, and decision contexts.', iconColor: 'red' },
];

// \u2500\u2500\u2500 About: timeline nodes \u2500\u2500\u2500
export interface AboutTimelineNode {
  year: string;
  label: string;
}

export const DEFAULT_ABOUT_TIMELINE: AboutTimelineNode[] = [
  { year: '2015', label: 'Practice Established' },
  { year: '2020', label: 'GECL Award' },
  { year: '2022', label: 'LMS Launch' },
  { year: '2026', label: 'Adviserve Incorporated' },
];

// ─── Hero Stats ───
export const DEFAULT_HERO_STATS: Array<{ value: string; label: string }> = [
  { value: '3,000+', label: 'Placements' },
  { value: '96%', label: 'Retention' },
  { value: '25+', label: 'Industries' },
  { value: '6', label: 'Practices' },
];

// ─── Home: Accordion Items ───
export interface AccordionItemCMS {
  id: number;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
}

export const DEFAULT_ACCORDION_ITEMS: AccordionItemCMS[] = [
  {
    id: 1,
    title: 'Recruitment & Talent Acquisition',
    description: 'From executive search to campus hiring — we build talent pipelines that deliver the right people, at the right level, in the right timeframe. Permanent, contract, and RPO models with a 96% retention guarantee.',
    href: '/services/recruitment',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'HR Services & Consulting',
    description: 'Policy design, payroll, compliance audits, and HRIS implementation. CHRO-level expertise without the full-time cost — whether you are a 10-person startup or a 5,000-person enterprise.',
    href: '/services/hr-services',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Corporate Training & L&D',
    description: 'Leadership development, POSH compliance, soft skills, and technical upskilling. Programmes designed around measurable behaviour change — not checkbox completion.',
    href: '/services/corporate-training',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Business Consulting & Strategy',
    description: 'Market entry, growth strategy, M&A advisory, and operational optimization. We work with founders and leadership teams to turn ambition into a plan with numbers behind it.',
    href: '/services/business-consulting',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Legal Consulting & Compliance',
    description: 'Labour law across all Indian states, employment contracts, POSH implementation, corporate governance, and dispute resolution. One legal team that understands your business context.',
    href: '/services/legal-consulting',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2112&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'IT Consulting & Development',
    description: 'Cloud architecture, cybersecurity, custom software, and digital transformation. We design, build, and manage technology that actually fits how your team works.',
    href: '/services/it-services',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
  },
];

// ─── Home: Process Steps ───
export interface ProcessStepCMS {
  code: string;
  name: string;
  desc: string;
}

export const DEFAULT_PROCESS_STEPS: ProcessStepCMS[] = [
  { code: '01', name: 'Listen &\nScope', desc: 'A focused discovery session to understand your business, challenges, and what success looks like. No generic questionnaires — just the right questions.' },
  { code: '02', name: 'Propose &\nPrice', desc: 'A tailored engagement plan within 48 hours. Clear scope, specific deliverables, realistic timelines, and transparent pricing. No hidden fees.' },
  { code: '03', name: 'Execute &\nEmbed', desc: 'Our specialists work as an extension of your team — not outside vendors handing off documents. Weekly check-ins. Shared dashboards. Real accountability.' },
  { code: '04', name: 'Measure &\nImprove', desc: 'Every metric that matters, tracked in real time. Monthly reviews to optimise, adjust, and scale what is working.' },
];

// ─── Home: Industries ───
export interface IndustryItemCMS {
  icon: string;
  label: string;
  tagline?: string;
}

export const DEFAULT_INDUSTRIES: IndustryItemCMS[] = [
  { icon: 'Cpu',           label: 'Technology',    tagline: 'Engineering hires, equity hygiene, DPDP from day one.' },
  { icon: 'Stethoscope',   label: 'Healthcare',    tagline: 'Clinical talent, NABH compliance, patient-data governance.' },
  { icon: 'Building2',     label: 'Finance',       tagline: 'RBI-grade compliance, risk hiring, controlled outsourcing.' },
  { icon: 'Factory',       label: 'Manufacturing', tagline: 'Plant staffing, labour law, shop-floor training that sticks.' },
  { icon: 'ShoppingCart',  label: 'E-Commerce',    tagline: 'Seasonal hiring, marketplace compliance, CX at scale.' },
  { icon: 'GraduationCap', label: 'Education',     tagline: 'Faculty sourcing, accreditation support, learner data safety.' },
];

// ─── Careers: Benefits ───
export interface CareersBenefitCMS {
  icon: string;
  title: string;
  description: string;
}

// Per §CAREERS: three "Why Adviserve" reasons replace prior benefits.
export const DEFAULT_CAREERS_BENEFITS: CareersBenefitCMS[] = [
  { icon: 'Layers', title: 'Cross-discipline by design', description: "Most consulting careers narrow into one practice. Ours don't have to. The disciplines share work, evidence, and review." },
  { icon: 'Award', title: 'Audited standards, not slogans', description: 'ISO 9001, ISO 20000-1, ISO 27001 — three certifications that change how we work every day, not just what we put on a slide.' },
  { icon: 'Star', title: 'Founding-team window', description: 'The firm is months old. The roles being filled now shape what the firm becomes.' },
];

// ─── Careers: Culture ───
export interface CareersCultureCMS {
  icon: string;
  title: string;
  description: string;
}

export const DEFAULT_CAREERS_CULTURE: CareersCultureCMS[] = [
  { icon: 'BookOpen', title: 'Write things down', description: 'Documentation is delivery, not afterthought.' },
  { icon: 'Eye', title: 'Show the working', description: 'Outputs that can be audited. Decisions that can be traced.' },
  { icon: 'Users', title: 'Disagree out loud', description: 'Better to argue at the design stage than fix at the deploy stage.' },
];

// ─── Careers: Positions ───
export interface CareerPositionCMS {
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
  is_visible?: boolean;
  sort_order?: number;
}

export const DEFAULT_CAREERS_POSITIONS: CareerPositionCMS[] = [
  { title: 'Senior Talent Acquisition Specialist', location: 'Remote', type: 'Full-time', department: 'Recruitment', description: 'Lead end-to-end recruitment for enterprise clients across technology and healthcare sectors. Manage candidate pipelines, conduct behavioural assessments, and maintain a 95%+ retention rate on all placements.' },
  { title: 'HR Business Partner', location: 'Hybrid — Mumbai', type: 'Full-time', department: 'HR Services', description: 'Embed with client organisations to drive HR transformation and people strategy. Conduct workforce audits, design org structures, and implement performance management frameworks.' },
  { title: 'Business Strategy Consultant', location: 'Remote', type: 'Full-time', department: 'Business Consulting', description: 'Work with founders and leadership teams to define strategic direction, build growth roadmaps, and optimise operations. Clients range from Series A startups to mid-market enterprises.' },
  { title: 'Corporate Legal Advisor', location: 'On-site — Delhi NCR', type: 'Full-time', department: 'Legal', description: 'Advise clients on Indian labour law compliance, employment contracts, POSH, and corporate governance. Manage statutory registrations and represent clients in dispute resolution.' },
  { title: 'IT Solutions Architect', location: 'Hybrid — Bengaluru', type: 'Full-time', department: 'IT Consulting', description: 'Design cloud infrastructure, lead digital transformation initiatives, and architect technology solutions for enterprise clients across AWS, Azure, and GCP.' },
];

// ─── Case Studies: Listing Cards ───
export interface CaseStudyCardCMS {
  slug: string;
  title: string;
  industry: string;
  practices: string[];
}

export const DEFAULT_CASE_STUDY_CARDS: CaseStudyCardCMS[] = [
  { slug: 'yamaha-servicenow', title: 'Yamaha Motors — ServiceNow rollout, in-house ITSM in under six months.', industry: 'Automobile', practices: ['IT Consulting', 'Corporate Training'] },
  { slug: 'grapecity-aws-migration', title: 'GrapeCity — Azure→AWS migration with role-based enablement that halved adoption time.', industry: 'Software Dev', practices: ['IT Consulting', 'Corporate Training'] },
  { slug: 'serverguy-dual-skill', title: 'ServerGuy — dual-skill talent model with 85%+ placement of AWS-certified hires.', industry: 'Consulting', practices: ['HR Services', 'Corporate Training'] },
];

// \u2500\u2500\u2500 Case study detail content \u2500\u2500\u2500
export interface CaseStudyMetric { value: string; label: string; }
export interface CaseStudyDetail {
  slug: string;
  eyebrow: string;
  company: string;
  subtitle: string;
  metrics: CaseStudyMetric[];
  strip: {
    industry: string;
    geography: string;
    duration: string;
    practices: string;
    anchoredBy: string;
  };
  context: string;
  challenge: string;
  approach: string[];
  outcomes: string[];
  quote: { text: string; attribution: string };
  techStack: string;
  related: Array<{ slug: string; label: string }>;
}

export const DEFAULT_CASE_STUDIES_DETAIL: Record<string, CaseStudyDetail> = {
  'yamaha-servicenow': {
    slug: 'yamaha-servicenow',
    eyebrow: 'CASE 01 · AUTOMOBILE',
    company: 'Yamaha Motors',
    subtitle: 'ServiceNow rollout · in-house ITSM transition',
    metrics: [
      { value: '~150%', label: 'ROI' },
      { value: '25%', label: 'Efficiency gain' },
      { value: '<6 mo', label: 'Time to live' },
    ],
    strip: {
      industry: 'Automobile manufacturing',
      geography: 'India',
      duration: 'Phased, completed in under 6 months',
      practices: 'IT Consulting, Corporate Training, ServiceNow',
      anchoredBy: 'ISO/IEC 20000-1, ISO 9001:2015',
    },
    context: 'Yamaha Motors operated service management through a legacy outsourced model — expensive, slow to change, and disconnected from operational reality. The business case for bringing ITSM in-house was clear; the execution challenge was building deep ServiceNow capability across both IT and business users in parallel with the technical rollout.',
    challenge: 'Stand up 4 core ServiceNow applications, configure 30+ services and 70+ reports, populate 20,000+ CMDB records — and make it stick. Not just deliver software, but transfer the operating capability into Yamaha’s IT and business teams so the system would survive day one of go-live.',
    approach: [
      'A phased rollout with role-specific training tracks for IT versus business users. We resisted the temptation to run one combined programme; the cognitive load and the use cases were too different. Follow-up refresher sessions were built in from the start, not bolted on after complaints.',
      'Adviserve ran the training engine alongside the technical implementation — same operating standard, same documentation discipline. Audit-ready evidence accumulated through delivery, not assembled retroactively for go-live sign-off.',
    ],
    outcomes: [
      '~150% return on investment within the first measurement window',
      '25% efficiency gain in service management operations',
      '4 core applications live, 30+ services configured, 70+ reports built',
      '20,000+ CMDB records populated and validated',
      'Live in under 6 months from kickoff',
    ],
    quote: { text: '~150% ROI on the ServiceNow rollout, 25% efficiency gain, and live in under six months. Adviserve made the in-house ITSM transition work.', attribution: 'Yamaha Motors · Service Management Lead' },
    techStack: 'ServiceNow (ITSM, ITOM, CMDB) · Adviserve training engine',
    related: [
      { slug: 'grapecity-aws-migration', label: 'GrapeCity' },
      { slug: 'serverguy-dual-skill', label: 'ServerGuy' },
    ],
  },

  'grapecity-aws-migration': {
    slug: 'grapecity-aws-migration',
    eyebrow: 'CASE 02 · SOFTWARE DEV',
    company: 'GrapeCity',
    subtitle: 'Azure → AWS migration · role-based enablement',
    metrics: [
      { value: '50%', label: 'Faster adoption' },
      { value: '4', label: 'Role-based tracks' },
      { value: 'High', label: 'Stakeholder alignment' },
    ],
    strip: {
      industry: 'Software product development',
      geography: 'Global',
      duration: 'Migration + enablement in parallel',
      practices: 'IT Consulting, Corporate Training, Cloud',
      anchoredBy: 'ISO/IEC 20000-1',
    },
    context: 'GrapeCity needed to migrate a critical .NET application from Microsoft Azure to AWS — a substantial technical lift compounded by an even harder problem: the engineering team had deep Azure muscle memory and limited AWS hands-on time. A successful migration meant not just landing the application on AWS, but transforming the workforce in parallel.',
    challenge: 'Migrate the application without breaking production while building AWS competency across four distinct engineering roles. Most enablement programmes fail here by running a single AWS overview course and hoping for the best. Cognitive overload, low retention, slow adoption.',
    approach: [
      'Four role-based learning tracks, each led by a subject-matter expert: Infrastructure, Security, DevOps, and App Development. No combined sessions. Heavy emphasis on labs and hands-on exercises rather than slideware. Stakeholder alignment workshops between technical and business leadership ran in parallel to keep the migration scope and team capability in sync.',
      'Internal champions were identified early and given accelerated tracks — they became the in-team teachers after the formal programme ended.',
    ],
    outcomes: [
      '50% faster AWS adoption than industry baselines for comparable migrations',
      '4 role-based tracks delivered without cognitive overload complaints',
      'High stakeholder alignment between engineering and product leadership',
      'Smooth AWS deployment with internal champions sustaining post-handover',
    ],
    quote: { text: "Migrating Azure to AWS while training the team in parallel — Adviserve's role-based tracks halved our adoption time and prevented cognitive overload.", attribution: 'GrapeCity · Engineering Lead' },
    techStack: 'AWS (compute, storage, networking) · .NET · Adviserve training engine',
    related: [
      { slug: 'yamaha-servicenow', label: 'Yamaha' },
      { slug: 'serverguy-dual-skill', label: 'ServerGuy' },
    ],
  },

  'serverguy-dual-skill': {
    slug: 'serverguy-dual-skill',
    eyebrow: 'CASE 03 · CONSULTING',
    company: 'ServerGuy',
    subtitle: 'Dual-skill talent model · AWS sales + technical',
    metrics: [
      { value: '85%+', label: 'Placement' },
      { value: '↓ Cost', label: 'Recruitment' },
      { value: '↑ Agility', label: 'Operating' },
    ],
    strip: {
      industry: 'Cloud consulting & managed services',
      geography: 'India',
      duration: 'Pipeline programme, ongoing cohorts',
      practices: 'HR Services, Corporate Training, AWS',
      anchoredBy: 'ISO 9001:2015',
    },
    context: "ServerGuy faced a structural talent problem: high attrition in technical roles, rising lateral-hire costs, and a market shortage of candidates who could credibly do both AWS sales and AWS technical work. The conventional move — hire two separate roles — was expensive and didn't fit ServerGuy's go-to-market model. They needed a different talent pipeline.",
    challenge: 'Build a sustainable, AWS-certified workforce capable of operating across both sales conversations and technical implementation — without paying lateral-market premiums and without the attrition cycle resetting the talent base every 18 months.',
    approach: [
      'Targeted recruitment of MBA and BTech graduates with the right cognitive profile — strong technical foundation, comfortable in client-facing settings. Dual-path training combining AWS commercial fluency and hands-on AWS technical capability, with AWS Solutions Architect Associate certification as a credential gate.',
      "The programme was designed for ServerGuy's operating model from the outset, not adapted from a generic AWS curriculum. Certification support was structured (cohort scheduling, mock exams, instructor office hours) rather than left to candidates to self-manage.",
    ],
    outcomes: [
      '85%+ placement rate of trained graduates into ServerGuy operating roles',
      'Significant reduction in recruitment cost per hire versus lateral market',
      'Flexible workforce deployable across sales and technical engagements',
      'Sustainable AWS-certified pipeline, replenished by ongoing cohorts',
    ],
    quote: { text: 'Their dual-skill talent model gave us 85%+ placement of AWS-certified hires and cut recruitment cost significantly. A sustainable pipeline, not a one-off fix.', attribution: 'ServerGuy · Talent Operations' },
    techStack: 'AWS · AWS Solutions Architect Associate certification · Adviserve training engine',
    related: [
      { slug: 'yamaha-servicenow', label: 'Yamaha' },
      { slug: 'grapecity-aws-migration', label: 'GrapeCity' },
    ],
  },
};

// ─── About: Stats ───
export interface AboutStatCMS {
  icon: string;
  value: string;
  label: string;
}

export const DEFAULT_ABOUT_STATS: AboutStatCMS[] = [
  { icon: 'Users', value: '6', label: 'Practices, One Roof' },
  { icon: 'Globe', value: '48 hrs', label: 'Sign to Kickoff' },
  { icon: 'Clock', value: '<24 hr', label: 'Response Guarantee' },
  { icon: 'TrendingUp', value: 'All Sizes', label: 'Startup to Enterprise' },
];

// ─── Home ───
export interface StatItem { icon: string; label: string; value: string; }
export interface WhyChooseItem { title: string; description: string; imageUrl?: string; }
export interface Testimonial { name: string; role: string; company: string; quote: string; }

export const DEFAULT_HOME_STATS: StatItem[] = [
  { icon: 'Users', label: 'Practices, One Roof', value: '6' },
  { icon: 'Target', label: 'Sign to Kickoff', value: '48 hrs' },
  { icon: 'Briefcase', label: 'Response Guarantee', value: '<24 hr' },
  { icon: 'TrendingUp', label: 'Startup to Enterprise', value: 'All Sizes' },
];

export const DEFAULT_WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  { title: 'Six practices, one partner', description: 'Recruitment, HR, training, legal, business consulting, and IT — all under one roof. No more coordinating five vendors who don\'t talk to each other.', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200' },
  { title: 'Built for how businesses actually work', description: 'We don\'t offer rigid packages. We look at what you need, where you are, and build around that. Your engagement scales with your business.', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200' },
  { title: 'We take ownership, not just briefs', description: 'We\'re not consultants who hand you a 40-page report and disappear. We get involved, stay involved, and own the outcomes alongside you.', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200' },
  { title: 'Startup energy, senior expertise', description: 'Our team brings deep experience from across industries — and the drive that comes with building something new. Every client matters to us.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200' },
  { title: '48-hour kickoff, every time', description: 'No three-month onboarding cycles. We go from signed agreement to active engagement in 48 hours. Speed matters when your business is moving.', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200' },
  { title: 'Transparent pricing, no surprises', description: 'Clear scope, clear deliverables, clear cost. No hidden fees, no scope creep charges, no invoices that need a decoder ring to understand.', imageUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1200' },
];

// ─── Home: Advantage Tabs ───
export interface AdvantageTab {
  title: string;
  value: string;
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  linkText?: string;
  linkUrl?: string;
  bgGradient: string;
}

export const DEFAULT_ADVANTAGE_TABS: AdvantageTab[] = [
  { title: 'The Problem', value: 'problem', eyebrow: '01 — The Problem', headline: 'Five vendors. Five silos. Five invoices.', body: "An HR consultant, a recruiter, a lawyer, an IT team, a training firm. None of them talk. You end up as the switchboard — half your week spent coordinating instead of building.", imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200', bgGradient: 'from-ink-base to-ink-raised' },
  { title: 'The Shift', value: 'shift', eyebrow: '02 — The Shift', headline: 'One firm. Shared context.', body: "Adviserve folds recruitment, HR, legal, strategy, training, and IT into one team. When your lawyer needs to know what your HR consultant did last quarter, they already know.", imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200', bgGradient: 'from-ink-base to-ink-raised' },
  { title: 'The Result', value: 'result', eyebrow: '03 — The Result', headline: 'One partner with the full picture.', body: 'Faster decisions. Fewer mistakes. Not six vendors pretending to be aligned.', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200', bgGradient: 'from-ink-raised to-ink-base' },
  { title: '6 Practices', value: 'practices', eyebrow: 'Our Practices', headline: 'Recruitment · HR · Legal · Strategy · Training · IT', body: 'Six disciplines under one roof. One team, shared files, shared context. Stop being the switchboard.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200', linkText: 'See the six practices', linkUrl: '/services', bgGradient: 'from-ink-raised to-ink-base' },
  { title: '48hr Kickoff', value: 'kickoff', eyebrow: 'Speed Guarantee', headline: 'Sign to kickoff in 48 hours.', body: "No three-month onboarding cycles. We go from signed agreement to active engagement in 48 hours. Speed matters when your business is moving.", imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200', linkText: 'Book a free consultation', linkUrl: '/book', bgGradient: 'from-ink-base to-ink-raised' },
];

// ─── Hero: Scramble Phrases ───
export const DEFAULT_SCRAMBLE_PHRASES: string[] = [
  "Recruitment. HR. Legal. Strategy. Training. IT.",
  "One team. Shared files. Shared context.",
  "Stop being the switchboard.",
];

// ─── Home: Marquee ───
export const DEFAULT_MARQUEE_ITEMS: string[] = [
  'Recruitment', 'HR Services', 'Corporate Training', 'Business Consulting',
  'Legal Advisory', 'IT Solutions', 'Compliance', 'Digital Transformation',
];

// ─── Home: Products (stacked cards) ───
export interface HomeProduct {
  slug: string;
  title: string;
  subtitle?: string;
  label?: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export const DEFAULT_HOME_PRODUCTS: HomeProduct[] = [
  {
    slug: 'hris-portal',
    title: 'Adviserve People',
    subtitle: 'HRMS Platform',
    label: 'MVP · EARLY ACCESS',
    description: 'Recruitment-to-retire workflows. ISO 27001-aligned, API-first, role-based access.',
    icon: 'users',
    imageUrl: '/images/products/hris-portal.jpg',
  },
  {
    slug: 'ats-system',
    title: 'Adviserve Hire',
    subtitle: 'Candidate Screening',
    label: 'MVP · EARLY ACCESS',
    description: 'AI-assisted CV parsing. Explainable scoring. Bias-mitigation review layer.',
    icon: 'user-check',
    imageUrl: '/images/products/ats-system.jpg',
  },
  {
    slug: 'dpdp-compliance',
    title: 'Adviserve Comply',
    subtitle: 'DPDP Compliance',
    label: 'PILOT · OPEN',
    description: 'Assess, gap-map, remediate, sustain. Plain-language statutory mapping.',
    icon: 'shield-check',
    imageUrl: '/images/products/dpdp-compliance.jpg',
  },
  {
    slug: 'saas-products',
    title: 'Custom build',
    subtitle: 'Tailored SaaS',
    label: 'BESPOKE',
    description: 'Modular components, ISO 27001-aligned by default. Engineered for your workflows.',
    icon: 'sparkles',
    imageUrl: '/images/products/custom-build.jpg',
  },
];

// ─── Service practice rows for the Home 00.03° Practices section + the /services index page. ───
export interface ServiceRow {
  number: string;
  name: string;
  description: string;
  outcomes: [string, string][];
  href: string;
  imageUrl: string;
  reverse: boolean;
}

export const DEFAULT_HOME_PRACTICES: ServiceRow[] = [
  {
    number: '01',
    name: 'Cybersecurity',
    description: 'Vulnerability assessment, threat intelligence, data-protection architecture. Anchored by an ISO/IEC 27001-aligned ISMS.',
    outcomes: [['Anchor', 'ISO 27001']],
    href: '/services/cybersecurity',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&q=80',
    reverse: false,
  },
  {
    number: '02',
    name: 'Compliance & RegTech',
    description: 'DPDP Act 2023, operationalised. Assess, gap-map, remediate, sustain — with audit-ready evidence by default.',
    outcomes: [['Posture', 'DPDP first-mover']],
    href: '/services/compliance-regtech',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80',
    reverse: true,
  },
  {
    number: '03',
    name: 'SaaS Products',
    description: 'Modular HRMS, candidate screening, and DPDP compliance. API-first, role-based, encrypted-at-rest.',
    outcomes: [['Catalogue', '3 products · MVP/Pilot']],
    href: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
    reverse: false,
  },
  {
    number: '04',
    name: 'HR Services & Staffing',
    description: 'Manpower consultancy, executive search, placement, and capability development — backed by our HRMS and screening tools.',
    outcomes: [['Reach', '26+ enterprise clients']],
    href: '/services/hr-services',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80',
    reverse: true,
  },
  {
    number: '05',
    name: 'IT Consulting',
    description: 'System integration, cloud infrastructure, data analytics, digital transformation. Lifecycle-managed under ISO/IEC 20000-1.',
    outcomes: [['Envelope', 'ISO 20000-1']],
    href: '/services/it-services',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80',
    reverse: false,
  },
  {
    number: '06',
    name: 'Legal Consulting',
    description: 'Corporate, regulatory, advisory practice — structured engagement model across project, retainer, and embedded modes.',
    outcomes: [['Modes', '3 engagement modes']],
    href: '/services/legal-consulting',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80',
    reverse: true,
  },
];

// Placeholder testimonials — anonymized archetypes. Replace with real client quotes (name + logo + permission) before marketing push.
// ─── Blog: posts (used as fallback when the CMS API is empty/unreachable
//      so the Insights grid never ships blank on a fresh deploy) ───
import type { BlogPost } from './types';

const ISO = (d: string) => `${d}T00:00:00.000Z`;

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'default-1',
    title: 'How integrated advisory beats best-of-breed vendors',
    slug: 'integrated-advisory-vs-vendors',
    excerpt: 'Six vendors, one client, zero shared context. Why we built Adviserve as one team across recruitment, HR, legal, IT, training, and consulting.',
    content: null,
    image_url: null,
    category: 'Strategy',
    author: 'Adviserve Editorial',
    tags: ['advisory', 'operating-model'],
    status: 'published',
    is_featured: true,
    published_at: ISO('2026-04-22'),
    meta_title: null,
    meta_description: null,
    created_at: ISO('2026-04-22'),
    updated_at: ISO('2026-04-22'),
  },
  {
    id: 'default-2',
    title: 'DPDP Act 2023 — the compliance checklist most founders miss',
    slug: 'dpdp-compliance-checklist',
    excerpt: 'India\'s Digital Personal Data Protection Act has eight implementation gaps that surface in audits. We mapped each one with a remediation playbook.',
    content: null,
    image_url: null,
    category: 'Legal',
    author: 'Adviserve Legal',
    tags: ['dpdp', 'compliance'],
    status: 'published',
    is_featured: false,
    published_at: ISO('2026-04-09'),
    meta_title: null,
    meta_description: null,
    created_at: ISO('2026-04-09'),
    updated_at: ISO('2026-04-09'),
  },
  {
    id: 'default-3',
    title: 'Recruitment SLAs that actually move pipeline',
    slug: 'recruitment-slas-that-work',
    excerpt: 'Time-to-shortlist, replacement guarantees, and pipeline transparency — what to put in your recruitment partner contract.',
    content: null,
    image_url: null,
    category: 'Recruitment',
    author: 'Adviserve Talent',
    tags: ['recruitment', 'sla'],
    status: 'published',
    is_featured: false,
    published_at: ISO('2026-03-28'),
    meta_title: null,
    meta_description: null,
    created_at: ISO('2026-03-28'),
    updated_at: ISO('2026-03-28'),
  },
  {
    id: 'default-4',
    title: 'Performance management systems for 50-200 person teams',
    slug: 'performance-management-systems',
    excerpt: 'OKRs, KPIs, 360 reviews — and what to skip. A practical guide to picking a PMS that matches your operating cadence.',
    content: null,
    image_url: null,
    category: 'HR',
    author: 'Adviserve HR',
    tags: ['performance', 'hris'],
    status: 'published',
    is_featured: false,
    published_at: ISO('2026-03-15'),
    meta_title: null,
    meta_description: null,
    created_at: ISO('2026-03-15'),
    updated_at: ISO('2026-03-15'),
  },
  {
    id: 'default-5',
    title: 'The hidden cost of fragmented HR tooling',
    slug: 'fragmented-hr-tooling',
    excerpt: 'Three HRIS instances, two ATS tools, manual reconciliation in Excel. Why consolidation matters more than feature parity.',
    content: null,
    image_url: null,
    category: 'IT',
    author: 'Adviserve IT',
    tags: ['hris', 'tooling'],
    status: 'published',
    is_featured: false,
    published_at: ISO('2026-03-02'),
    meta_title: null,
    meta_description: null,
    created_at: ISO('2026-03-02'),
    updated_at: ISO('2026-03-02'),
  },
  {
    id: 'default-6',
    title: 'Series A to Series C — how the HR function should scale',
    slug: 'hr-function-scaling',
    excerpt: 'What a Series A HR org looks like, what breaks at 200 headcount, and how to staff the gaps before they become incidents.',
    content: null,
    image_url: null,
    category: 'Strategy',
    author: 'Adviserve Editorial',
    tags: ['scale-up', 'org-design'],
    status: 'published',
    is_featured: false,
    published_at: ISO('2026-02-18'),
    meta_title: null,
    meta_description: null,
    created_at: ISO('2026-02-18'),
    updated_at: ISO('2026-02-18'),
  },
];

// ─── Team members (fallback for /team when CMS empty) ───
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  linkedin?: string;
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  { id: 't1', name: 'Adviserve Founder', role: 'Principal — Advisory', bio: 'Twenty years across recruitment, HR strategy, and business consulting for India\'s growth-stage companies.', image_url: null },
  { id: 't2', name: 'Head of People', role: 'Practice Lead — HR & Compliance', bio: 'Built and scaled HR functions at multiple Series B-C companies. Specialist in DPDP and labour-law multi-state rollouts.', image_url: null },
  { id: 't3', name: 'Head of Talent', role: 'Practice Lead — Recruitment', bio: 'Closed 800+ leadership and engineering mandates. Designs embedded RPO models for scale-ups.', image_url: null },
  { id: 't4', name: 'Head of Legal', role: 'Practice Lead — Legal & Compliance', bio: 'Corporate, employment, and data-privacy advisory. Former GC at a listed tech services firm.', image_url: null },
  { id: 't5', name: 'Head of IT', role: 'Practice Lead — IT Advisory', bio: 'HRIS, ATS, and analytics tooling implementer. Bridges advisory and software product teams.', image_url: null },
  { id: 't6', name: 'Head of Training', role: 'Practice Lead — Corporate L&D', bio: 'Leadership, managerial, and compliance training across cohorts of 20 to 2000.', image_url: null },
];

// ─── Home: CMS content fallback (used when /api/content/home is unreachable
//      or returns empty — e.g., local `npm run dev` without Vercel proxy, or
//      a fresh deploy before the CMS is seeded). Keys mirror the
//      website_content section_keys read in Home.tsx. ───
export const DEFAULT_HOME_CMS: Record<string, string> = {
  // SEO
  meta_title: 'Adviserve · One firm. Seven disciplines. One standard.',
  meta_description: 'Most enterprises buy compliance from one firm, security from another, talent from a third. Adviserve does all of it, to one standard. ISO 9001:2015. ISO/IEC 20000-1. ISO/IEC 27001.',
  canonical_url: 'https://adviserve.org.in/',
  og_image: '/adviserve-logo.png',

  // 00.01° Hero — §HOME-HERO
  hero_badge_text: 'ONE TEAM · SEVEN PRACTICES',
  hero_title: 'Bring us the question',
  hero_h1_prefix: '',
  hero_scramble_phrases: JSON.stringify([
    'no vendor will answer.',
    'the auditor will ask.',
    'the board keeps raising.',
    'your spreadsheet cannot solve.',
  ]),
  hero_subtitle: "You are coordinating four vendors and still answering the same questionnaire on a Friday night. Hire one team. One operating standard. One evidence trail across compliance, security, hiring, IT, legal, SaaS and training — so the answer is ready before the question lands.",
  hero_cta_text: 'Talk to us',
  hero_cta_link: '/consultation',
  hero_secondary_text: 'See how we work',
  hero_secondary_link: '#how-we-work',
  hero_trust_items: JSON.stringify(['ISO 9001:2015', 'ISO/IEC 20000-1', 'ISO/IEC 27001']),
  hero_video_url: '/Hero-BG.mp4',
  hero_field_visibility: JSON.stringify({}),
  home_hero_visible: 'true',

  // 00.02° What we do — §HOME-WHATWEDO
  home_whatwedo_visible: 'true',
  whatwedo_eyebrow: 'WHAT WE DO',
  whatwedo_heading: 'Seven disciplines.\nOne operating standard.',
  whatwedo_lede: "Enterprise problems don't sit inside one discipline. A DPDP breach is a legal problem, a security problem, and a board problem at the same time. A failed hire is a recruitment problem, a training problem, and an operating-model problem. Adviserve runs seven disciplines as one firm, so the work connects — and so does the accountability.",

  // 00.03° Why now — §HOME-WHYNOW
  home_whynow_visible: 'true',
  whynow_eyebrow: 'WHY NOW',
  whynow_heading: "2027 is the deadline\nthat doesn't move.",
  whynow_body_1: 'The Digital Personal Data Protection Act enforces from May 13, 2027. The Data Protection Board is already operational. Penalties run up to ₹250 crore per violation — and the Act gives no cure period, no grace window. Most Indian enterprises are not ready. Most don\'t know where their personal data lives, which vendors touch it, or how they would respond to a breach in seventy-two hours.',
  whynow_body_2: "2026 is the year that decides whether you spend 2027 in compliance or in court. That's the work in front of us. It is also the work most firms aren't structured to do — because it crosses legal, security, technology, and operations at the same time. Adviserve is.",
  whynow_cta_text: 'Take the free DPDP self-assessment',
  whynow_cta_link: '/dpdp-assessment',
  whynow_reassurance: '15 minutes. Anonymous. No call required.',

  // 00.04° How we work — §HOME-HOWWEWORK
  home_howwework_visible: 'true',
  howwework_eyebrow: 'HOW WE WORK',
  howwework_heading: 'One standard.\nEvery engagement.',
  howwework_subtitle: 'Whether the work is a DPDP audit, a CISO search, or an IT modernisation — the structure is the same. The structure is the product.',
  howwework_strip: 'Diagnose · Design · Run · Transfer · Measure',

  // 00.05° Why this firm exists — §HOME-WHYEXISTS
  home_whyexists_visible: 'true',
  whyexists_eyebrow: 'WHY THIS FIRM EXISTS',
  whyexists_heading: 'We watched the same problem\nrepeat for a decade.',
  whyexists_body_1: 'The founders of Adviserve spent the prior decade running training and consulting work across Indian enterprises — manufacturing, IT services, financial services, real estate. Different sectors. Different scales. Same problem: compliance was bought from one firm, security from another, talent from a third. Nothing connected. Every executive we worked with was managing five vendors to solve one operating problem.',
  whyexists_body_2: "Adviserve exists to remove that fragmentation. Not by being a holding company with seven brands — by being one firm with one standard, where the security team reads the legal team's notes, where the compliance team reads the HR team's notes, and where the executive on the other side of the table reads one document, not five.",
  whyexists_cta_text: 'Read the founding rationale →',
  whyexists_cta_link: '/about',

  // 00.06° What we're building — §HOME-PRODUCTS
  home_products_visible: 'true',
  products_section_eyebrow: "WHAT WE'RE BUILDING",
  products_section_heading: 'The platforms behind the practice.',
  products_section_subtitle: 'The same operating standard we apply to client work is being engineered into three software platforms — for organisations that want the discipline embedded in tools, not in retainers alone.',
  products_section_footer: 'Currently engaging anchor partners for pilot deployments. Shipping schedule available on request.',

  // 00.07° Final CTA — §HOME-FINALCTA
  home_cta_visible: 'true',
  cta_title: 'Bring us the question you cannot answer yet.',
  cta_description: "A DPDP deadline. A board ask on security. A hiring gap that has stayed open four months. An IT estate that has drifted past your control. Thirty minutes. We tell you which practice owns it, what it costs and how soon we can start. No pitch deck.",
  cta_button_text: 'Talk to us',
  cta_button_link: '/consultation',
  cta_secondary_text: 'Take the DPDP self-assessment',
  cta_secondary_link: '/dpdp-assessment',
  cta_reassurance: 'Response in under one business day.',
  cta_field_visibility: JSON.stringify({}),

  // Logo cloud — hidden until real partner logos provided
  logo_cloud_visible: 'false',
  logo_cloud_heading: '',
  logo_cloud_logos: JSON.stringify([]),
  logo_cloud_field_visibility: JSON.stringify({}),
};

// DEFAULT_TESTIMONIALS retained for /case-studies + /testimonials routes only.
// Home page no longer renders a testimonials carousel — replaced by §HOME-WHYEXISTS
// statement. No claimed metrics, no fabricated client quotes per spec.
export const DEFAULT_TESTIMONIALS: Testimonial[] = [];

// ─── Service practice detail content (drives /services/:slug pages) ───
// Schema rebuilt per spec §-blocks: dark hero, 3-paragraph problem statement,
// 4 numbered engagement stages, 4–6 walk-away bullets, single why-not-generalist
// paragraph, related-services chip row, final CTA.
// Corporate Training keeps catalogue scope (group + items) below the standard layout.
export interface ServicePracticeStage { num: string; title: string; body: string; }
export interface ServicePracticeRelated { label: string; href: string; }
export interface ServicePracticeCatalogueGroup { group: string; items: Array<{ name: string; body: string }>; }

export interface ServicePracticeDetail {
  slug: string;
  eyebrow: string;
  h1Line1: string;
  h1Line2: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  problem: [string, string, string];
  stages: ServicePracticeStage[];
  walkAway: string[];
  whyNotGeneralist: string;
  related: ServicePracticeRelated[];
  finalCtaText: string;
  finalCtaHref: string;
  /** Legal practice uses engagement modes instead of stages where rendered. */
  legalModes?: ServicePracticeStage[];
  /** Training practice catalogue scope. */
  catalogue?: ServicePracticeCatalogueGroup[];
}

export const DEFAULT_SERVICE_PRACTICES: Record<string, ServicePracticeDetail> = {
  cybersecurity: {
    slug: 'cybersecurity',
    eyebrow: 'CYBERSECURITY',
    h1Line1: 'Security work that',
    h1Line2: 'passes the board.',
    subtitle: 'For organisations where security is now a board-level conversation — and a ninety-question vendor questionnaire arrived last Tuesday.',
    primaryCtaText: 'Talk to the practice',
    primaryCtaHref: '/contact?practice=cybersecurity',
    secondaryCtaText: 'Read how we work',
    secondaryCtaHref: '/about#how-we-work',
    problem: [
      "Two things changed in the last eighteen months. The DPDP Act made security a regulatory question, not just an IT one. And every enterprise customer with a CISO started sending vendor security questionnaires to anyone selling them anything. Most Indian mid-market firms now have someone in their inbox asking for SOC 2, ISO 27001, or DPDP attestation — and they don't know how to answer.",
      "The deeper problem is upstream. Security in most organisations is held by a small team with too many tickets, no time for strategic work, and no easy way to explain risk to the executives who actually own the budget. The CISO knows. The CFO doesn't. The board doesn't. The line manager whose system was just flagged in a scan doesn't. Translation is the missing layer.",
      'We build that translation layer. The vulnerability scan, the threat intelligence, the data protection architecture, the governance dashboards — those are the inputs. What we ship is a security posture that the board can defend, the auditor can sign off, and the line manager can act on. Same evidence, three audiences.',
    ],
    stages: [
      { num: '01', title: 'Diagnose.', body: 'We map your estate — web, infrastructure, applications, vendors, data flows. Two weeks. The output is a written diagnostic, not a slideware deck.' },
      { num: '02', title: 'Prioritise.', body: 'We classify findings by business impact, not technical severity. Twenty critical findings is a list. Three findings you can act on this quarter is a plan.' },
      { num: '03', title: 'Remediate.', body: 'We work with your team to close the priorities — guided implementation, not throw-it-over-the-wall recommendations.' },
      { num: '04', title: 'Sustain.', body: "Monitoring, governance dashboards, quarterly review. Evidence accumulates as we go, so the next audit doesn't start from zero." },
    ],
    walkAway: [
      'A written security diagnostic your CFO can read',
      'A prioritised remediation plan with named owners and timelines',
      "A vendor-questionnaire response file that doesn't take three weeks to assemble",
      'Governance dashboards that report risk in language the board uses',
      'Quarterly evidence packs ready for audit, regulator, or customer due diligence',
    ],
    whyNotGeneralist:
      'Most cybersecurity consultancies sell tools or scans. We sell the translation between what the scan found and what the business does about it — which is the work that determines whether security spend produces results or backlog.',
    related: [
      { label: 'Compliance & RegTech', href: '/services/compliance-regtech' },
      { label: 'Legal Consulting', href: '/services/legal-consulting' },
      { label: 'IT Consulting', href: '/services/it-services' },
    ],
    finalCtaText: 'Talk to cybersecurity',
    finalCtaHref: '/contact?practice=cybersecurity',
  },

  'compliance-regtech': {
    slug: 'compliance-regtech',
    eyebrow: 'COMPLIANCE & REGTECH',
    h1Line1: 'DPDP enforces in 2027.',
    h1Line2: 'Get ready in 2026.',
    subtitle: 'For organisations that processed Indian personal data yesterday, today, and tomorrow — and have an enforceable Act with a ₹250 crore penalty cap to plan around.',
    primaryCtaText: 'Start the free DPDP self-assessment',
    primaryCtaHref: '/dpdp-assessment',
    secondaryCtaText: 'Talk to the practice',
    secondaryCtaHref: '/contact?practice=compliance',
    problem: [
      "The Digital Personal Data Protection Act, 2023 became fully enforceable on May 13, 2027. The Data Protection Board of India has been operational since November 13, 2025. The Act gives no cure period — no grace window between violation and penalty. The penalty cap runs to ₹250 crore per breach. For most Indian enterprises, the question is not whether they're compliant. The question is whether they could prove it on a deadline.",
      "Proving it is the harder part. The Act requires a data inventory, a lawful basis for every processing activity, an explicit and granular consent mechanism, a breach response plan that operates inside seventy-two hours, a grievance channel with a documented SLA, a Data Protection Officer or equivalent function, and a retention policy that's actually enforced — not just written. Most organisations have one or two of these. None have all eight in production.",
      "We build the missing pieces. Methodically. From the data inventory outward. Because every other DPDP requirement collapses if you don't know where your personal data is. We work in plain language so legal, ops, and product owners can act on the same evidence — and we leave you with an audit-ready posture, not a binder.",
    ],
    stages: [
      { num: '01', title: 'Assess.', body: "We map your data — what's collected, where it lives, who touches it, which vendors process it, and how it leaves the organisation. Two to four weeks depending on scale." },
      { num: '02', title: 'Score the gaps.', body: 'Each finding is rated by DPDP article, severity, and remediation effort. You see a heatmap, not a list.' },
      { num: '03', title: 'Remediate.', body: 'We run the implementation — consent flows, retention enforcement, breach playbook, grievance channel, DPO function. With your team, not over their heads.' },
      { num: '04', title: 'Sustain.', body: 'Continuous monitoring with quarterly evidence packs. When the regulator asks, the file is ready.' },
    ],
    walkAway: [
      'A documented inventory of personal data and the systems that process it',
      'A consent mechanism that meets the granularity and revocability the Act requires',
      'A breach playbook tested against the seventy-two-hour clock',
      'A grievance channel with a published SLA and a DPO of record',
      'Quarterly evidence packs structured for inspection by the Data Protection Board',
    ],
    whyNotGeneralist:
      "Most DPDP work in the market today is either pure legal interpretation or pure technical implementation. The two don't talk. Our legal and technology teams sit in the same review. The output is a single posture, signed off across both functions.",
    related: [
      { label: 'Cybersecurity', href: '/services/cybersecurity' },
      { label: 'Legal Consulting', href: '/services/legal-consulting' },
      { label: 'SaaS Products', href: '/services/saas-products' },
    ],
    finalCtaText: 'Start with the free self-assessment',
    finalCtaHref: '/dpdp-assessment',
  },

  'hr-services': {
    slug: 'hr-services',
    eyebrow: 'HR SERVICES & STAFFING',
    h1Line1: 'Hiring that closes',
    h1Line2: 'the capability gap.',
    subtitle: 'For organisations where the cost of a wrong hire — and the gap between hiring and performing — has become a board-level number.',
    primaryCtaText: 'Talk to the practice',
    primaryCtaHref: '/contact?practice=hr',
    secondaryCtaText: 'See training catalogue',
    secondaryCtaHref: '/services/corporate-training',
    problem: [
      "Mid-market and enterprise Indian firms are losing money to two things they don't measure together: bad hires, and the training spend required to remediate them. The recruitment firm gets paid on placement. The training function gets paid to fix what was placed. Nobody owns the gap between hiring intent and operating outcome.",
      'The deeper problem is calibration. Most hiring intake is informal — a job description copied from the last role, a conversation with the line manager, a screening process that asks the same questions whether the role is for a junior analyst or a senior architect. Outcomes are downstream of calibration. Bad calibration produces bad shortlists, which produce bad hires, which produce remediation cost.',
      "We run sourcing and capability as one practice. Calibration is documented before sourcing starts. Screening produces explainable scoring, not black-box rankings. Where the candidate is the right shape but missing a specific skill, we close the gap through the same training engine that built this firm. The hiring engagement doesn't end when the offer is signed. It ends when the person is performing.",
    ],
    stages: [
      { num: '01', title: 'Calibrate.', body: 'We document the role with the line manager — outcomes, skills, anti-skills, must-have evidence in the interview. This is the contract for the search.' },
      { num: '02', title: 'Source.', body: 'Targeted sourcing — search firms, network, market mapping. Volume scaled to role.' },
      { num: '03', title: 'Screen.', body: 'Structured assessments, explainable scoring, bias review. Shortlists are defended in writing.' },
      { num: '04', title: 'Onboard and close gaps.', body: 'Where capability requires, we bridge through training — programmed against the actual role, not generic catalogue content.' },
    ],
    walkAway: [
      'Calibrated, defended shortlists for senior, specialised, or volume roles',
      'Hire decisions with documented evidence and explainable scoring',
      'A training plan to close any gap between hired capability and required performance',
      'A documented sourcing process you can re-run yourself',
      'Reduced reliance on external recruiters for repeat hiring patterns',
    ],
    whyNotGeneralist:
      "Most recruitment firms place and exit. Most training firms train and exit. The gap between placement and performance is where most operating cost sits. We're built to close that gap.",
    related: [
      { label: 'Corporate Training', href: '/services/corporate-training' },
      { label: 'Legal Consulting (employment)', href: '/services/legal-consulting' },
      { label: 'SaaS Products (Adviserve Hire)', href: '/products/ats-system' },
    ],
    finalCtaText: 'Talk to HR services',
    finalCtaHref: '/contact?practice=hr',
  },

  'it-services': {
    slug: 'it-services',
    eyebrow: 'IT CONSULTING',
    h1Line1: 'IT delivered',
    h1Line2: 'as a service.',
    subtitle: 'For organisations whose IT estate has drifted, whose vendor count is rising, and whose CFO is asking what the spend is buying.',
    primaryCtaText: 'Talk to the practice',
    primaryCtaHref: '/contact?practice=it',
    secondaryCtaText: 'See the operating standard',
    secondaryCtaHref: '/about',
    problem: [
      'Most mid-market IT estates were assembled, not designed. A point system here, a SaaS subscription there, an integration that someone wrote in a hurry three years ago and has not been touched since. The CIO inherits a stack they did not build. The CFO sees the invoices and asks reasonable questions. The answers are usually unclear.',
      "Project-based IT engagements make this worse. A consultancy ships a system, books the milestone, and leaves. Three months later, nobody remembers why a service was configured the way it was. The runbook is in someone's email. The incident protocol is improvised. The next vendor walks into the same fog the last one created.",
      'We deliver IT as managed service from the first engagement. Documentation is not a deliverable. It is the work. SLAs, change control, incident governance, and audit-trail evidence are produced as the system is built — not assembled retrospectively when something breaks.',
    ],
    stages: [
      { num: '01', title: 'Map.', body: 'We document the existing estate — systems, integrations, vendors, costs, ownership.' },
      { num: '02', title: 'Design.', body: 'Target architecture, migration plan, vendor consolidation strategy, cost model.' },
      { num: '03', title: 'Build.', body: 'Phased implementation with audit-ready evidence at each gate.' },
      { num: '04', title: 'Run.', body: 'Managed service with documented SLAs, change governance, and quarterly review.' },
    ],
    walkAway: [
      'A documented map of your current IT estate and its true cost',
      'A target architecture signed off by your team and ours',
      'Phased migration with audit-trail evidence at every gate',
      'A runbook your team can use without us',
      'Quarterly cost-and-performance reviews against the architecture decisions',
    ],
    whyNotGeneralist:
      "ISO/IEC 20000-1 is not a marketing badge. It is a discipline that requires every engagement to carry an SLA, a change protocol, and an evidence trail. Most IT consultancies don't operate this way because it adds work upfront. We operate this way because the alternative costs more downstream.",
    related: [
      { label: 'Cybersecurity', href: '/services/cybersecurity' },
      { label: 'Compliance & RegTech', href: '/services/compliance-regtech' },
      { label: 'SaaS Products', href: '/services/saas-products' },
    ],
    finalCtaText: 'Talk to IT consulting',
    finalCtaHref: '/contact?practice=it',
  },

  'legal-consulting': {
    slug: 'legal-consulting',
    eyebrow: 'LEGAL CONSULTING',
    h1Line1: 'Counsel that reads',
    h1Line2: 'the system, not just the contract.',
    subtitle: 'For organisations where legal, technology, and regulatory exposure now sit in the same conversation — and need to be answered by counsel who can speak all three languages.',
    primaryCtaText: 'Talk to legal',
    primaryCtaHref: '/contact?practice=legal',
    secondaryCtaText: 'See engagement modes',
    secondaryCtaHref: '#modes',
    problem: [
      'Five years ago, most enterprise legal questions were either commercial or regulatory. Today most are both, and most have a technology layer underneath. A vendor agreement is a data-processing agreement. A board ask on compliance is a question about systems. A regulatory submission requires evidence that lives in a database. The lawyer who cannot read the system is now the lawyer who is wrong.',
      'Most external counsel handle this by asking the engineering team to translate. The engineering team explains the system. The lawyer drafts an opinion. The opinion is correct in law and wrong about the system. Nobody knows until the regulator or the customer points it out.',
      'Our legal practice sits inside the technology, compliance, and security work. The lawyer drafting the contract has read the architecture. The lawyer advising on DPDP has read the breach playbook. The lawyer reviewing a vendor has seen the data flow diagram. The output is a single posture — legally precise, operationally accurate, signed off across both functions.',
    ],
    // Legal practice exposes engagement modes instead of stages.
    stages: [],
    legalModes: [
      { num: '01', title: 'Project.', body: 'Defined deliverables. Fixed fee or milestone. Used for transactions, regulatory submissions, contract drafting.' },
      { num: '02', title: 'Retainer.', body: 'Continuous counsel on a portfolio. Used for ongoing regulatory advisory, DPDP monitoring, employment matters.' },
      { num: '03', title: 'Embedded.', body: 'In-flow support inside transformation programmes. Used when legal exposure changes as the system changes — common in technology modernisation and M&A.' },
    ],
    walkAway: [
      'Counsel that has read your systems, not just your contracts',
      'Documented engagement protocols agreed before work begins',
      'Output that the compliance, security, and IT teams can act on, not just file',
      'Continuous monitoring on portfolio matters (in retainer mode)',
      'A single posture across legal, compliance, and security — not three opinions to reconcile',
    ],
    whyNotGeneralist:
      "The legal market has technology specialists and the technology market has legal advisors. Adviserve's legal practice is neither. It is counsel embedded in the operating standard the rest of the firm uses. The same review gates apply.",
    related: [
      { label: 'Compliance & RegTech', href: '/services/compliance-regtech' },
      { label: 'Cybersecurity', href: '/services/cybersecurity' },
      { label: 'HR Services (employment)', href: '/services/hr-services' },
    ],
    finalCtaText: 'Talk to legal',
    finalCtaHref: '/contact?practice=legal',
  },

  'saas-products': {
    slug: 'saas-products',
    eyebrow: 'SAAS PRODUCTS',
    h1Line1: 'Software built',
    h1Line2: 'to the operating standard.',
    subtitle: 'Three platforms in development. Bespoke builds available. All engineered to the same standard we apply to client engagements.',
    primaryCtaText: 'See products',
    primaryCtaHref: '/products',
    secondaryCtaText: 'Talk about a custom build',
    secondaryCtaHref: '/contact?practice=saas',
    problem: [
      "Enterprise SaaS today asks the customer to bend their operating reality to the tool. The HRMS expects a workforce model that matches the product's assumptions. The compliance tool expects a data inventory that matches the vendor's schema. The screening platform expects a hiring funnel that matches the founder's prior employer. When the customer's reality doesn't match, the deployment becomes a customisation project, then a change-management project, then a regret.",
      'Our products start from the operating reality. The compliance tool maps to the Act, not to a generic privacy framework. The screening tool produces explainable scoring, not black-box rankings. The HRMS is modular so it fits next to your existing ERP, not in place of it. Each platform is engineered against the same standard we apply to client engagements: encrypted by default, role-based access, audit-logged operations, structured output by design.',
      'For organisations whose operating reality requires something none of these cover, we build bespoke modules. Same architecture. Same standard. Same review gates. The difference is the surface — the software ships to your context, not the other way around.',
    ],
    stages: [
      { num: '01', title: 'Adviserve Comply.', body: 'DPDP compliance, operationalised. Pilot, anchor partners open.' },
      { num: '02', title: 'Adviserve Hire.', body: 'Candidate screening with explainable scoring. In development.' },
      { num: '03', title: 'Adviserve People.', body: 'Modular workforce management. In development.' },
      { num: '04', title: 'Custom builds.', body: 'Bespoke modules. Engaged through standard project mode.' },
    ],
    walkAway: [
      'Software that fits your operating model, not the reverse',
      'The same security and audit posture as our service engagements',
      'A documented runbook your team can operate',
      'Optional ongoing managed service through IT Consulting',
    ],
    whyNotGeneralist:
      'Most enterprise SaaS sells the same product to every customer. We sell software built to the same operating standard the rest of the firm runs on — and when the standard requires a bespoke surface, we build that too.',
    related: [
      { label: 'IT Consulting', href: '/services/it-services' },
      { label: 'Compliance & RegTech', href: '/services/compliance-regtech' },
      { label: 'HR Services', href: '/services/hr-services' },
    ],
    finalCtaText: 'Talk about a build',
    finalCtaHref: '/contact?practice=saas',
  },

  'corporate-training': {
    slug: 'corporate-training',
    eyebrow: 'CORPORATE TRAINING',
    h1Line1: 'Training measured',
    h1Line2: 'against the work.',
    subtitle: 'The discipline that started this firm — programmes engineered for outcomes, not attendance.',
    primaryCtaText: 'Talk about a programme',
    primaryCtaHref: '/contact?practice=training',
    secondaryCtaText: 'See the catalogue',
    secondaryCtaHref: '#catalogue',
    problem: [
      'Most corporate training is measured by inputs — hours delivered, attendees enrolled, satisfaction scores collected at the end. None of these correlate with what learners do differently at work two months later. Organisations buy training because they need a capability gap closed. They get reports about engagement instead.',
      'The deeper problem is design. Generic catalogue content is built for a generic learner, not the role in your organisation. The certified architect course assumes one starting point. Your architect starts somewhere else. The communication skills programme assumes one industry context. Your team operates in another. Without role-based design, even good content lands generically.',
      'We design against the work. Training needs analysis maps the actual role, the actual gap, and the actual outcome required. Programmes are built role by role, not catalogue page by catalogue page. Measurement is by Kirkpatrick — Level 3 (behaviour change) and Level 4 (business outcome), not just Level 1 (satisfaction) and Level 2 (knowledge retention). Reinforcement is built into the programme, not bolted on.',
    ],
    stages: [
      { num: '01', title: 'TNA.', body: 'Training needs analysis — role by role, gap by gap. Output is a programme blueprint.' },
      { num: '02', title: 'Design.', body: 'Role-based modules built against the blueprint. SME-led, scenario-anchored.' },
      { num: '03', title: 'Deliver.', body: 'In-person, virtual, or hybrid. Heavy on labs and applied exercises.' },
      { num: '04', title: 'Measure.', body: 'Pre/post assessments, behaviour observation, business-outcome tracking.' },
    ],
    walkAway: [
      'A trained cohort measured against work outcomes, not attendance',
      'A documented training needs analysis you can re-use for the next cohort',
      'Post-training reinforcement that survives the room',
      'An LMS-deployable version of the programme if scale requires',
    ],
    whyNotGeneralist:
      "Adviserve's founders spent a decade running this work before incorporating the firm. The methodology — TNA-led design, Kirkpatrick measurement, role-based delivery — is not new for us. It is the muscle the rest of the firm was built on.",
    related: [
      { label: 'HR Services', href: '/services/hr-services' },
      { label: 'IT Consulting', href: '/services/it-services' },
      { label: 'Cybersecurity (security awareness)', href: '/services/cybersecurity' },
    ],
    finalCtaText: 'Talk about a programme',
    finalCtaHref: '/contact?practice=training',
    catalogue: [
      {
        group: 'Core technology',
        items: [
          { name: 'Cloud', body: 'AWS, Azure, GCP, Kubernetes.' },
          { name: 'Software development', body: 'Java, Python, .NET, full-stack.' },
          { name: 'Web technologies', body: 'Frontend frameworks, modern web platform.' },
          { name: 'OS and infrastructure', body: 'Linux, Windows server, virtualisation.' },
          { name: 'Cybersecurity', body: 'Ethical hacking, SOC, network security.' },
          { name: 'Data analytics', body: 'SQL, BI, ML, big-data tooling.' },
          { name: 'AI and emerging tech', body: 'Generative AI, LLMs, RAG, automation.' },
          { name: 'ERP and CRM platforms', body: 'SAP, Salesforce, Dynamics, Zoho.' },
        ],
      },
      {
        group: 'Professional skills',
        items: [
          { name: 'Autodesk and CAD', body: 'AutoCAD, Revit, SolidWorks, BIM.' },
          { name: 'Digital marketing', body: 'SEO, paid media, analytics, CRM marketing.' },
          { name: 'Project management', body: 'Agile, Scrum, PMP, ITIL.' },
          { name: 'Behavioural skills', body: 'Communication, leadership, EQ.' },
          { name: 'Productivity in IT', body: 'Office, Workspace, security awareness.' },
          { name: 'Languages', body: 'English, Japanese N5/N4.' },
          { name: 'Customised role-based programmes', body: 'Designed against the role, not the catalogue.' },
        ],
      },
    ],
  },
};

