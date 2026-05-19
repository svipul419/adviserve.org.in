export interface ContentBlock {
  id?: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
  display_order: number;
  is_visible: boolean;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface CultureItem {
  title: string;
  description: string;
}

export interface JobPosition {
  id?: string;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
  is_visible: boolean;
  sort_order: number;
}

export const DEFAULT_BENEFITS: BenefitItem[] = [
  { title: 'Remote-First Culture', description: 'Work from anywhere. Flexible hours. Async-first collaboration. We measure output, not screen time.', icon: 'globe' },
  { title: 'Annual Learning Budget', description: 'Courses, certifications, conferences, books. Your professional growth is a line item in our budget.', icon: 'book-open' },
  { title: 'Impact Across Six Practices', description: 'Your work directly shapes how companies across India hire, comply, operate, and build technology.', icon: 'layers' },
  { title: 'No Corporate Theatre', description: 'Flat hierarchy. Direct feedback. Decisions based on merit and evidence — not tenure or politics.', icon: 'zap' },
];

export const DEFAULT_CULTURE: CultureItem[] = [
  { title: 'Weekly Knowledge Sharing', description: 'Every Friday, someone presents a case study, a new regulation, or a methodology.' },
  { title: 'Quarterly Offsites', description: 'In-person retreats for strategy and connection. Past locations: Goa, Udaipur, Coorg.' },
  { title: 'Wellbeing First', description: 'Mental health days. Unlimited sick leave. Annual wellness allowance.' },
];
