export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  targetAudience: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
  highlightColor?: string;
}

export interface PainPointItem {
  id: string;
  title: string;
  problem: string;
  solution: string;
  iconName: string;
  highlightText: string;
}

export interface FeatureTab {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  highlights: string[];
  mockupType: "pos" | "payroll" | "analytics";
}
