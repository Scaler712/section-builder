/**
 * Content Types — structured data extracted from raw sales copy by AI.
 *
 * The AI parse endpoint returns a ParsedPage containing an array of
 * SectionContent objects. Each is a discriminated union member keyed
 * by `type`, which maps 1:1 to our template section types.
 */

// ── Per-section content interfaces ──

export interface HeroContent {
  type: "hero";
  badge?: string;
  headline: string;
  subheadline?: string;
  cta?: string;
  trust?: string;
}

export interface PainPointsContent {
  type: "pain-points";
  badge?: string;
  headline: string;
  subtitle?: string;
  points: { title: string; description: string }[];
}

export interface SolutionContent {
  type: "solution-transition";
  badge?: string;
  headline: string;
  subtitle?: string;
  body: string;
  bullets?: string[];
}

export interface BenefitsContent {
  type: "benefits-grid";
  badge?: string;
  headline: string;
  subtitle?: string;
  items: { title: string; description: string }[];
}

export interface TestimonialsContent {
  type: "testimonials";
  badge?: string;
  headline: string;
  subtitle?: string;
  items: { quote: string; name: string; role: string }[];
}

export interface PricingContent {
  type: "pricing";
  badge?: string;
  headline: string;
  subtitle?: string;
  tiers: {
    name: string;
    price: string;
    period?: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
  }[];
}

export interface FaqContent {
  type: "faq";
  badge?: string;
  headline: string;
  subtitle?: string;
  items: { question: string; answer: string }[];
}

export interface CtaContent {
  type: "cta";
  headline: string;
  subtitle?: string;
  cta: string;
  trust?: string;
}

export interface GuaranteeContent {
  type: "guarantee";
  badge?: string;
  headline: string;
  body: string;
}

export interface AboutContent {
  type: "about-bio";
  badge?: string;
  headline: string;
  body: string;
  credentials?: string[];
}

export interface VideoContent {
  type: "video-embed";
  badge?: string;
  headline: string;
  subtitle?: string;
  videoUrl?: string;
}

// ── Discriminated union ──

export type SectionContent =
  | HeroContent
  | PainPointsContent
  | SolutionContent
  | BenefitsContent
  | TestimonialsContent
  | PricingContent
  | FaqContent
  | CtaContent
  | GuaranteeContent
  | AboutContent
  | VideoContent;

// ── Parse result ──

export interface ParsedPage {
  sections: SectionContent[];
  detectedLanguage: string;
}

// ── Valid section type strings (matches template registry) ──

export const SECTION_TYPES = [
  "hero",
  "pain-points",
  "solution-transition",
  "benefits-grid",
  "testimonials",
  "pricing",
  "faq",
  "cta",
  "guarantee",
  "about-bio",
  "video-embed",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];
