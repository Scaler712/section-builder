import { SectionTemplate } from "./types";
import { hero } from "./hero";
import { benefitsGrid } from "./benefits-grid";
import { painPoints } from "./pain-points";
import { solutionTransition } from "./solution-transition";
import { testimonials } from "./testimonials";
import { pricing } from "./pricing";
import { faq } from "./faq";
import { cta } from "./cta";
import { guarantee } from "./guarantee";
import { aboutBio } from "./about-bio";
import { countdownTimer } from "./countdown-timer";
import { videoEmbed } from "./video-embed";

export const templates: SectionTemplate[] = [
  hero,
  benefitsGrid,
  painPoints,
  solutionTransition,
  testimonials,
  pricing,
  faq,
  cta,
  guarantee,
  aboutBio,
  countdownTimer,
  videoEmbed,
];

export const templateMap: Record<string, SectionTemplate> = Object.fromEntries(
  templates.map((t) => [t.id, t])
);

export type { SectionTemplate } from "./types";
export type { SectionType } from "./types";
