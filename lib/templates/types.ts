export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultHtml: string;
  aiPromptHints: string;
}

export type SectionType =
  | "hero"
  | "benefits-grid"
  | "pain-points"
  | "solution-transition"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "guarantee"
  | "about-bio"
  | "countdown-timer"
  | "video-embed";
