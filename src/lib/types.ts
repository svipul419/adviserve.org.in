export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  icon: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  is_visible: boolean | null;
  sort_order: number | null;
  meta_title: string | null;
  meta_description: string | null;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  created_at: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  target?: string;
  children?: MenuItem[];
}

export interface SiteSettings {
  [key: string]: string;
}

export interface SocialLinks {
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  youtube_url?: string;
}

export interface ContactInfo {
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
}

export interface FooterServiceLink {
  label: string;
  url: string;
}

export interface LegalDocument {
  id: string;
  slug: string;
  title: string;
  content: string;
  version: string | null;
  effective_date: string | null;
  updated_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  status: 'active' | 'unsubscribed';
  source: string | null;
  subscribed_at: string;
}

export interface PageAnalytics {
  id: string;
  page_path: string;
  page_title: string;
  referrer: string | null;
  user_agent: string;
  screen_width: number;
  session_id: string;
  created_at: string;
}

export interface SEOSetting {
  id: string;
  category: string;
  key: string;
  value: string | null;
}
