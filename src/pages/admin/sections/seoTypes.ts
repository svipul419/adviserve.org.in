export type TabKey = 'seo_global' | 'aeo' | 'geo' | 'local_seo';

export interface FAQItem {
  id?: string;
  page_type: string;
  page_ref_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DEFAULT_OPENING_HOURS: OpeningHour[] = DAYS_OF_WEEK.map((day) => ({
  day,
  open: '09:00',
  close: '18:00',
}));
