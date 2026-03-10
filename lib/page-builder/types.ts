export type BuilderMode = "section" | "page" | "paste" | "lovable";

export interface PageSection {
  id: string;
  type: string;
  label: string;
  html: string;
  order: number;
}

export interface PageConfig {
  productName: string;
  description: string;
  audience: string;
  price: string;
  language: string;
  sections: string[];
}

export interface StyleOverrides {
  headingColor: string;
  bodyColor: string;
  mutedColor: string;
  accentColor: string;
  highlightBg: string;
  ctaBg: string;
  fontFamily: string;
  spacing: "compact" | "default" | "spacious";
  cardRadius: string;
  buttonRadius: string;
}
