export interface FeatureItem {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  icon: string;
  image_url: string;
  card_color: string;
  problem_title: string;
  problem_body: string;
  features: FeatureItem[];
  differentiators: FeatureItem[];
  pricing_tiers: PricingTier[];
  cta_title: string;
  cta_description: string;
  seo_title: string;
  seo_description: string;
  is_visible: boolean;
  sort_order: number;
}

export const emptyFormData = {
  title: '',
  slug: '',
  subtitle: '',
  description: '',
  icon: 'users',
  image_url: '',
  card_color: 'rgba(109,212,196,0.95)',
  problem_title: '',
  problem_body: '',
  features: [] as FeatureItem[],
  differentiators: [] as FeatureItem[],
  pricing_tiers: [] as PricingTier[],
  cta_title: '',
  cta_description: '',
  seo_title: '',
  seo_description: '',
  is_visible: true,
  sort_order: 0,
};
