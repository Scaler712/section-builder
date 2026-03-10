export interface PageSectionConfig {
  type: string;
  label: string;
  description: string;
}

export const DEFAULT_PAGE_SECTIONS: PageSectionConfig[] = [
  { type: "hero", label: "Hero", description: "Bold headline with value proposition and CTA" },
  { type: "pain-points", label: "Pain Points", description: "Address problems the audience faces" },
  { type: "solution-transition", label: "Solution", description: "Introduce the product as the answer" },
  { type: "benefits-grid", label: "Benefits", description: "Key benefits in visual grid layout" },
  { type: "video-embed", label: "Video", description: "Product demo or explainer video" },
  { type: "testimonials", label: "Testimonials", description: "Social proof from real customers" },
  { type: "pricing", label: "Pricing", description: "Clear pricing with feature breakdown" },
  { type: "guarantee", label: "Guarantee", description: "Risk reversal / money-back guarantee" },
  { type: "faq", label: "FAQ", description: "Common questions answered" },
  { type: "cta", label: "Final CTA", description: "Last push with urgency and clear action" },
];
