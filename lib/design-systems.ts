import type { StyleOverrides } from "@/lib/page-builder/types";
import {
  swissEchoHtml,
  neoBrutalistYellowHtml,
  brutalistAntonHtml,
  atmosphericGlassHtml,
  softlyWellnessHtml,
  disruptorHtml,
  luxuryDarkGoldHtml,
  obsidianLimeHtml,
  redNoirHtml,
  acidBrutalistHtml,
  digitalNaturalismHtml,
  cyberSerifHtml,
  redSunHtml,
  organicWaveHtml,
  glassmorphicDepthHtml,
  hyperFintechHtml,
  blueprintHtml,
  claymorphismHtml,
} from "@/lib/design-system-references";

export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  colorPalette: string[]; // 4-5 preview swatches
  styleOverrides: StyleOverrides;
  /** Full design spec injected into AI prompt for accurate generation */
  aiContext: string;
  /** Pre-built hero HTML showing the design system's unique aesthetic */
  referenceHtml: string;
  /** Concrete CSS patterns the AI MUST use for cards, buttons, headings, grids, etc. */
  cssPatterns: string;
}

export const designSystems: DesignSystem[] = [
  // ── 0. Default (built-in) ──
  {
    id: "default",
    name: "Clean Editorial",
    description: "Default warm neutral with yellow accents",
    colorPalette: ["#2B2B2B", "#FFF2C2", "#E8B931", "#FFFFFF"],
    styleOverrides: {
      headingColor: "#2B2B2B",
      bodyColor: "#3A3A3A",
      mutedColor: "#6B6B6B",
      accentColor: "#E8B931",
      highlightBg: "#FFF2C2",
      ctaBg: "#2B2B2B",
      fontFamily: "Raleway",
      spacing: "default",
      cardRadius: "18px",
      buttonRadius: "50px",
    },
    aiContext: "Clean editorial with Raleway font. Warm neutral palette. Yellow pill highlights. Cards with 18px radius and subtle shadows. Buttons with full 50px pill radius. Section padding 80px 20px desktop, 50px 16px mobile.",
    referenceHtml: "",
    cssPatterns: `/* CARDS */ background: #ffffff; border-radius: var(--sb-card-radius); box-shadow: 0 2px 16px rgba(0,0,0,0.06); padding: 32px;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 16px 40px; font-weight: 700; transition: opacity 0.3s;
/* BADGES */ background: var(--sb-highlight); color: var(--sb-accent); padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
/* HEADINGS */ font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
/* SECTION BG */ background: #ffffff; padding: var(--sb-section-pad);
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* ANIMATION */ opacity:0; transform:translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease;`,
  },

  // ── 1. Swiss Minimalist / Luxury-Brutalist Echo ──
  {
    id: "swiss-echo",
    name: "Swiss Echo",
    description: "Typography-first, editorial luxury-brutalist with text echoes",
    colorPalette: ["#111111", "#f2f2f2", "#b6b5b5", "#1e1e1e"],
    styleOverrides: {
      headingColor: "#111111",
      bodyColor: "#333333",
      mutedColor: "#838282",
      accentColor: "#111111",
      highlightBg: "#f2f2f2",
      ctaBg: "#1e1e1e",
      fontFamily: "DM Sans",
      spacing: "spacious",
      cardRadius: "0px",
      buttonRadius: "50px",
    },
    aiContext: `Swiss minimalist luxury-brutalist. Fonts: headlines in bold geometric sans (weight 700, tracking -0.05em, leading 0.9), body in medium sans (weight 500). Background #f2f2f2, text #111111, grays #b6b5b5 to #d9d9d9. Pill-shaped contact buttons with 1px solid #1e1e1e border that inverts on hover. Hero: massive centered text (11vw or 180px), no imagery — pure typographic weight. Cards with #1e1e1e/10 borders, transparent to white on hover. Footer: #1e1e1e bg with 60% opacity #f6f6f6 text. Transitions: 700ms cubic-bezier(0.77, 0, 0.175, 1). Grayscale-to-color image transitions on hover.`,
    referenceHtml: swissEchoHtml,
    cssPatterns: `/* CARDS */ background: transparent; border: 1px solid rgba(30,30,30,0.1); padding: 40px; transition: all 700ms cubic-bezier(0.77, 0, 0.175, 1); hover: background #ffffff;
/* BUTTONS */ background: transparent; color: var(--sb-cta-bg); border: 1px solid var(--sb-cta-bg); border-radius: var(--sb-btn-radius); padding: 16px 52px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; transition: all 700ms cubic-bezier(0.77, 0, 0.175, 1); hover: background var(--sb-cta-bg), color var(--sb-highlight);
/* BADGES */ color: var(--sb-muted); font-size: 12px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; border: none; background: none;
/* HEADINGS */ font-weight: 700; line-height: 0.9; letter-spacing: -0.05em; font-size: clamp(48px, 8vw, 180px); NO imagery — pure typographic weight;
/* SECTION BG */ background: var(--sb-highlight); padding: var(--sb-section-pad); text-align: center;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(30,30,30,0.1); children background: var(--sb-highlight);
/* ANIMATION */ opacity:0; transform:translateY(30px); transition: opacity 700ms cubic-bezier(0.77, 0, 0.175, 1), transform 700ms cubic-bezier(0.77, 0, 0.175, 1);
/* KEY RULE */ Zero decoration. No shadows. No gradients. Only borders, typography, and whitespace.`,
  },

  // ── 2. Neo-Brutalist Yellow SaaS ──
  {
    id: "neo-brutalist-yellow",
    name: "Neo-Brutalist Yellow",
    description: "Vibrant yellow neo-brutalism with hard shadows",
    colorPalette: ["#171e19", "#ffe17c", "#b7c6c2", "#000000"],
    styleOverrides: {
      headingColor: "#000000",
      bodyColor: "#272727",
      mutedColor: "#666666",
      accentColor: "#ffe17c",
      highlightBg: "#ffe17c",
      ctaBg: "#000000",
      fontFamily: "DM Sans",
      spacing: "default",
      cardRadius: "8px",
      buttonRadius: "8px",
    },
    aiContext: `Neo-Brutalist SaaS. Primary yellow #ffe17c, charcoal bg #171e19, sage #b7c6c2. Headlines: extrabold geometric sans (tracking-tighter). Body: medium sans (500). 2px solid black borders everywhere. Hard shadows: 4px 4px 0px 0px #000 (standard), 8px 8px 0px 0px #000 (large). Button hover: translate(4px, 4px) removes shadow. Radial dot pattern at 10% opacity background. No gradients, no soft shadows. Max 12px border-radius on buttons. Social proof marquee. Problem vs Solution split cards. Feature grid 3-col. How It Works 3-step flow. Testimonials with asymmetric rounding.`,
    referenceHtml: neoBrutalistYellowHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border: 2px solid var(--sb-heading); border-radius: var(--sb-card-radius); box-shadow: 4px 4px 0px 0px #000; padding: 32px;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border: 2px solid var(--sb-cta-bg); border-radius: var(--sb-btn-radius); box-shadow: 4px 4px 0px 0px #000; padding: 16px 40px; font-weight: 700; transition: transform 0.15s ease, box-shadow 0.15s ease; hover: transform translate(4px, 4px), box-shadow none;
/* BADGES */ background: var(--sb-accent); color: var(--sb-heading); border: 2px solid var(--sb-heading); border-radius: 6px; box-shadow: 3px 3px 0px 0px #000; padding: 6px 16px; font-weight: 800; text-transform: uppercase;
/* HEADINGS */ font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;
/* SECTION BG */ background: #ffffff; position: relative; before: radial-gradient(#000 1px, transparent 1px), background-size 20px 20px, opacity 0.07;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* LARGE CARD */ box-shadow: 8px 8px 0px 0px #000; border: 2px solid var(--sb-heading);
/* STAT BAR */ display: flex; border: 2px solid var(--sb-heading); border-radius: 10px; overflow: hidden; box-shadow: 4px 4px 0px 0px #000; children: border-right 2px solid;
/* KEY RULE */ No gradients. No soft shadows. No blur. Only hard 2px borders and hard offset shadows everywhere.`,
  },

  // ── 3. Brutalist-Lite Anton ──
  {
    id: "brutalist-anton",
    name: "Brutalist Anton",
    description: "Bold editorial B2C with golden yellow accents",
    colorPalette: ["#171e19", "#ffe17c", "#272727", "#ffffff"],
    styleOverrides: {
      headingColor: "#171e19",
      bodyColor: "#272727",
      mutedColor: "#666666",
      accentColor: "#ffe17c",
      highlightBg: "#ffe17c",
      ctaBg: "#171e19",
      fontFamily: "DM Sans",
      spacing: "default",
      cardRadius: "8px",
      buttonRadius: "8px",
    },
    aiContext: `Bold editorial B2C SaaS. Accent: #ffe17c golden yellow, backgrounds #ffffff and #171e19 charcoal, sage #b7c6c2. Headlines: uppercase bold sans (line-height 0.9). Body: sans (400, 500, 700). 40px grid background pattern. 15-degree rotated yellow highlight rectangles behind key words. Cards: 300ms cubic-bezier(0.4, 0, 0.2, 1) transitions. Problem-Solution contrast split layout. Bento feature grid 3-col with spans. Sticky title + numbered steps. Alternating light/dark testimonial cards with 4px vertical offset on center card.`,
    referenceHtml: brutalistAntonHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border: 2px solid var(--sb-heading); border-radius: var(--sb-card-radius); padding: 32px; transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
/* DARK CARDS */ background: var(--sb-heading); color: #ffffff; border: 2px solid var(--sb-heading);
/* BUTTONS */ background: var(--sb-accent); color: var(--sb-heading); border: 2px solid var(--sb-heading); border-radius: var(--sb-btn-radius); font-weight: 700; padding: 16px 40px; box-shadow: 4px 4px 0px 0px #000;
/* BADGES */ background: var(--sb-accent); padding: 4px 12px; transform: rotate(-2deg); font-weight: 700; text-transform: uppercase;
/* HIGHLIGHTED TEXT */ position: relative; z-index: 1; &::before: content '', position absolute, background var(--sb-accent), transform rotate(-2deg), inset -2px -4px, z-index -1;
/* HEADINGS */ font-weight: 800; line-height: 0.9; text-transform: uppercase;
/* SECTION BG */ background: #ffffff; background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px);
/* CONTRAST SECTION */ background: var(--sb-heading); color: #ffffff;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ Alternate between white and dark charcoal sections. Use 15-degree rotated yellow highlight rectangles behind key words. Hard 2px borders.`,
  },

  // ── 4. Atmospheric Glassmorphism ──
  {
    id: "atmospheric-glass",
    name: "Atmospheric Glass",
    description: "Futuristic premium glassmorphism with indigo",
    colorPalette: ["#0f172a", "#6366f1", "#f8f9fa", "#a78bfa"],
    styleOverrides: {
      headingColor: "#0f172a",
      bodyColor: "#334155",
      mutedColor: "#64748b",
      accentColor: "#6366f1",
      highlightBg: "#eef2ff",
      ctaBg: "#6366f1",
      fontFamily: "Lora",
      spacing: "spacious",
      cardRadius: "18px",
      buttonRadius: "50px",
    },
    aiContext: `Atmospheric glassmorphism. Primary dark #0f172a, brand indigo #6366f1, surface #f8f9fa. Headlines: serif (Lora, 400-700, tracking-tight, leading 1.1). Body: sans (Inter, 400-600, leading-relaxed). Glassmorphism Soft: rgba(255,255,255,0.05) + blur(12px). Glassmorphism Strong: rgba(30,41,59,0.7) + blur(16px). Outer glow: radial-gradient indigo/purple/pink + blur(20px) at 30% opacity. Feature scroll-spy layout 25/75 split with sticky sidebar. Masonry testimonials. 500ms smooth transitions.`,
    referenceHtml: atmosphericGlassHtml,
    cssPatterns: `/* CARDS */ background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sb-card-radius); padding: 32px; transition: all 500ms ease;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 16px 40px; font-weight: 600; box-shadow: 0 4px 20px rgba(99,102,241,0.3); transition: all 500ms ease; hover: box-shadow 0 8px 30px rgba(99,102,241,0.4), transform translateY(-2px);
/* BADGES */ background: rgba(99,102,241,0.1); color: var(--sb-accent); padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 600; border: 1px solid rgba(99,102,241,0.2);
/* HEADINGS */ font-family: var(--sb-font); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em;
/* SECTION BG */ background: var(--sb-highlight); padding: var(--sb-section-pad); position: relative; overflow: hidden;
/* GLOW */ position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.15), rgba(168,85,247,0.1), transparent 70%); filter: blur(60px); pointer-events: none;
/* DARK SECTION */ background: #0f172a; color: #ffffff; CARDS become: background rgba(30,41,59,0.7), backdrop-filter blur(16px), border 1px solid rgba(255,255,255,0.1);
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ Always add 2-3 ambient glow orbs per section. Glass effect on every card. Serif headings, sans body.`,
  },

  // ── 5. Digital Wellness / Softly ──
  {
    id: "softly-wellness",
    name: "Softly Wellness",
    description: "Warm pastel, mobile-first digital minimalism",
    colorPalette: ["#292524", "#FFB7B2", "#E8EFE8", "#FDFCF8"],
    styleOverrides: {
      headingColor: "#292524",
      bodyColor: "#44403c",
      mutedColor: "#78716C",
      accentColor: "#FFB7B2",
      highlightBg: "#FFF0F0",
      ctaBg: "#292524",
      fontFamily: "Outfit",
      spacing: "spacious",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Digital wellness pastel aesthetic. Background #FDFCF8 cream, sage #E8EFE8, lavender #EFEDF4, coral accent #FFB7B2. Headings: Outfit (48-96px, tracking -0.025em). 0.35 opacity fractal noise grain overlay. Border-radius 2rem-4rem everywhere. Soft shadows: 0 4px 20px -2px rgba(0,0,0,0.05). Reveal-on-scroll: translateY 30px, 0.8s. Background blobs at 10% opacity with 6s floating animation. Diary-style testimonial cards with slight rotation (+/-1deg). Sentence-case only — never all-caps. Floating pill navigation.`,
    referenceHtml: softlyWellnessHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border-radius: 2rem; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); padding: 32px;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 18px 44px; font-weight: 600; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.1); transition: all 0.4s ease;
/* BADGES */ background: rgba(255,183,178,0.15); color: var(--sb-accent); padding: 8px 20px; border-radius: 50px; font-size: 13px; font-weight: 500;
/* HEADINGS */ font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; NEVER uppercase — sentence case only;
/* SECTION BG */ background: #FDFCF8; padding: var(--sb-section-pad);
/* ALT SECTION BG */ background: #E8EFE8 (sage) or #EFEDF4 (lavender);
/* BLOB */ position: absolute; width: 300px; height: 300px; border-radius: 50%; background: var(--sb-accent); opacity: 0.08; filter: blur(80px); animation: float 6s ease-in-out infinite;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* TESTIMONIAL */ transform: rotate(-1deg) or rotate(1deg); border-radius: 2rem; background: #ffffff; padding: 32px;
/* KEY RULE */ Everything super soft. No hard edges. 2rem+ border-radius everywhere. Pastel backgrounds. Floating blobs. NEVER all-caps.`,
  },

  // ── 6. Industrial Brutalist / Disruptor ──
  {
    id: "disruptor",
    name: "Disruptor",
    description: "Industrial-themed brutalist with neon volt green",
    colorPalette: ["#000000", "#CCFF00", "#121212", "#FFFFFF"],
    styleOverrides: {
      headingColor: "#000000",
      bodyColor: "#121212",
      mutedColor: "#475569",
      accentColor: "#CCFF00",
      highlightBg: "#f0ff66",
      ctaBg: "#000000",
      fontFamily: "Plus Jakarta Sans",
      spacing: "compact",
      cardRadius: "8px",
      buttonRadius: "8px",
    },
    aiContext: `Industrial brutalist. Black #000000, dark grey #121212, white #FFFFFF, volt green #CCFF00, muted #475569. Headlines: display font (all-caps, leading 0.85, up to 180px). Technical labels: monospace (uppercase, 0.1em tracking, bold). Body: Plus Jakarta Sans. Only solid shadows, no blur. Minimum 4px borders. Neo-shadows: 8px 8px solid offsets. No rounded corners > 8px. No gradients or transparency except watermarks. Vertical text bars (writing-mode: vertical-rl). Tilted sticker containers (rotate 2-5deg). High-impact comparison split layout.`,
    referenceHtml: disruptorHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border: 4px solid var(--sb-heading); border-radius: var(--sb-card-radius); box-shadow: 8px 8px 0px 0px var(--sb-heading); padding: 32px;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border: 4px solid var(--sb-heading); border-radius: var(--sb-btn-radius); box-shadow: 8px 8px 0px 0px var(--sb-heading); padding: 18px 44px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
/* ACCENT BUTTONS */ background: var(--sb-accent); color: var(--sb-heading); border: 4px solid var(--sb-heading);
/* BADGES */ font-family: monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--sb-accent);
/* HEADINGS */ font-weight: 800; text-transform: uppercase; line-height: 0.85; font-size: clamp(48px, 10vw, 180px);
/* SECTION BG */ background: #ffffff; padding: var(--sb-section-pad);
/* DARK SECTION */ background: var(--sb-heading); color: #ffffff;
/* STICKER */ display: inline-block; background: var(--sb-accent); color: var(--sb-heading); padding: 12px 24px; transform: rotate(2deg); border: 4px solid var(--sb-heading); box-shadow: 4px 4px 0px 0px var(--sb-heading);
/* VERTICAL TEXT */ writing-mode: vertical-rl; text-orientation: mixed; position: absolute; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ Minimum 4px borders. No blur shadows — only hard offset shadows. No rounded corners > 8px. No gradients. Raw industrial.`,
  },

  // ── 7. Luxury Dark Gold ──
  {
    id: "luxury-dark-gold",
    name: "Luxury Dark Gold",
    description: "Dark-mode luxury with gold neural network aesthetic",
    colorPalette: ["#0a0a0a", "#a78b71", "#c9b8a0", "#e8d5b7"],
    styleOverrides: {
      headingColor: "#e8d5b7",
      bodyColor: "#c9b8a0",
      mutedColor: "#8a7a6a",
      accentColor: "#a78b71",
      highlightBg: "#1a1510",
      ctaBg: "#a78b71",
      fontFamily: "Playfair Display",
      spacing: "spacious",
      cardRadius: "18px",
      buttonRadius: "50px",
    },
    aiContext: `Dark-mode luxury gold. Background #0a0a0a, base gold #a78b71, light gold #c9b8a0, hover gold #e8d5b7. Headlines: Playfair Display italic. Body: Inter (300-700). Dot grid: white at 8% opacity. Glassmorphism: rgba(255,255,255,0.03) + blur(10px) + 1px solid rgba(255,255,255,0.1). Central glow: box-shadow 0 0 100px rgba(167,139,113,0.2). Heavy letter-spacing on small uppercase text. No blue/purple — strictly gold/bronze accent palette. Glass feature cards 4-col grid. 3-tier pricing with toggle.`,
    referenceHtml: luxuryDarkGoldHtml,
    cssPatterns: `/* CARDS */ background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sb-card-radius); padding: 32px; transition: all 0.5s ease;
/* BUTTONS */ background: var(--sb-accent); color: #0a0a0a; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
/* BADGES */ color: var(--sb-accent); font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid rgba(167,139,113,0.3); padding: 6px 16px; border-radius: 50px;
/* HEADINGS */ font-family: var(--sb-font); font-style: italic; font-weight: 700; line-height: 1.1; color: var(--sb-heading);
/* SECTION BG */ background: #0a0a0a; color: var(--sb-body); padding: var(--sb-section-pad); position: relative;
/* DOT GRID */ background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 20px 20px;
/* GLOW */ box-shadow: 0 0 100px rgba(167,139,113,0.15);
/* LABELS */ font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sb-accent);
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ ALWAYS dark background #0a0a0a. Gold text and accents. No blue/purple. Italic serif headings. Glass cards with subtle borders.`,
  },

  // ── 8. Obsidian & Lime ──
  {
    id: "obsidian-lime",
    name: "Obsidian & Lime",
    description: "Futuristic dark bento-grid with neon lime",
    colorPalette: ["#0c0c0c", "#ccff00", "#10b981", "#ebebeb"],
    styleOverrides: {
      headingColor: "#ebebeb",
      bodyColor: "#ebebeb",
      mutedColor: "#999999",
      accentColor: "#ccff00",
      highlightBg: "#1a1a1a",
      ctaBg: "#ccff00",
      fontFamily: "DM Sans",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Futuristic dark mode. Base: #000000 / #0c0c0c obsidian, accent: #ccff00 neon lime, secondary: #10b981 emerald, text: #ebebeb, secondary text 60% opacity. Headlines: Space Grotesk (300-700, tracking -0.06em). Technical labels: JetBrains Mono (uppercase). Floating shell container max-w 1600px rounded 2.5rem. Pill-shaped nav. Hero 7:5 split with 7.5rem type. Bento grid features 4-col. Glassmorphism: rgba(255,255,255,0.03) + blur(16px) + 1px solid rgba(255,255,255,0.1). 60x60px grid pattern. Noise SVG at 15% overlay. All containers minimum 2rem border-radius. Massive watermark text at 5% opacity.`,
    referenceHtml: obsidianLimeHtml,
    cssPatterns: `/* CARDS */ background: rgba(255,255,255,0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); border-radius: 2rem; padding: 32px;
/* BUTTONS */ background: var(--sb-accent); color: #000000; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 600;
/* OUTLINE BUTTONS */ background: transparent; color: var(--sb-accent); border: 1px solid var(--sb-accent); border-radius: var(--sb-btn-radius);
/* BADGES */ font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--sb-accent);
/* HEADINGS */ font-family: 'Space Grotesk', var(--sb-font), sans-serif; font-weight: 700; letter-spacing: -0.06em; line-height: 1.05;
/* SECTION BG */ background: #0c0c0c; color: #ebebeb; padding: var(--sb-section-pad);
/* SHELL */ max-width: 1600px; margin: 0 auto; border-radius: 2.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 48px;
/* GRID PATTERN */ background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 60px 60px;
/* BENTO GRID */ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; (some cards span 2 cols);
/* WATERMARK */ position: absolute; font-size: 20vw; font-weight: 700; opacity: 0.03; pointer-events: none;
/* KEY RULE */ ALWAYS dark background. Minimum 2rem border-radius on containers. Neon lime accent sparingly. Glass cards.`,
  },

  // ── 9. Red Noir ──
  {
    id: "red-noir",
    name: "Red Noir",
    description: "Dark cinematic with red accent and parallax stars",
    colorPalette: ["#0a0a0a", "#ef233c", "#1a0505", "#ffffff"],
    styleOverrides: {
      headingColor: "#ffffff",
      bodyColor: "#d4d4d8",
      mutedColor: "#71717a",
      accentColor: "#ef233c",
      highlightBg: "#1a0505",
      ctaBg: "#ef233c",
      fontFamily: "Manrope",
      spacing: "default",
      cardRadius: "18px",
      buttonRadius: "50px",
    },
    aiContext: `Dark cinematic. Accent red #ef233c, glow rgba(239,35,60,0.5), background black with #1a0505 gradient, dark surfaces zinc-900/800. Headlines: Manrope (200-800, tracking-tight). Body: Inter (300-600). Dot grid pattern at 0.1 opacity. Text stroke for outline effect. Gradient text: white to white/40. Shiny CTA button with conic-gradient border spin animation (2.5s linear infinite). Fade-in-up animations 0.8s. Logo ticker strip with continuous scroll. Selection color: red.`,
    referenceHtml: redNoirHtml,
    cssPatterns: `/* CARDS */ background: rgba(39,39,42,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sb-card-radius); padding: 32px; backdrop-filter: blur(8px);
/* BUTTONS */ position: relative; background: var(--sb-cta-bg); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 700; overflow: hidden;
/* SHINY BUTTON */ &::before: content '', position absolute, inset -2px, background conic-gradient(from 0deg, transparent, var(--sb-accent), transparent 30%), border-radius inherit, animation spin 2.5s linear infinite; &::after: content '', position absolute, inset 2px, background var(--sb-cta-bg), border-radius inherit;
/* BADGES */ color: var(--sb-accent); font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
/* HEADINGS */ font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; color: #ffffff;
/* OUTLINE TEXT */ color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.3);
/* SECTION BG */ background: #0a0a0a; color: #d4d4d8; padding: var(--sb-section-pad); position: relative;
/* RED GLOW */ position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(239,35,60,0.15), transparent 70%); filter: blur(80px);
/* DOT GRID */ background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 24px 24px;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ ALWAYS dark background. Red accents glow. Shiny spinning border on CTAs. Cinematic atmosphere.`,
  },

  // ── 10. Acid Brutalist ──
  {
    id: "acid-brutalist",
    name: "Acid Brutalist",
    description: "Bold neo-brutalist with acid yellow-green and glitch effects",
    colorPalette: ["#09090B", "#D2E823", "#F8F4E8", "#ffffff"],
    styleOverrides: {
      headingColor: "#09090B",
      bodyColor: "#1a1a1a",
      mutedColor: "#555555",
      accentColor: "#D2E823",
      highlightBg: "#F8F4E8",
      ctaBg: "#09090B",
      fontFamily: "DM Sans",
      spacing: "compact",
      cardRadius: "8px",
      buttonRadius: "8px",
    },
    aiContext: `Acid Neo-Brutalist. Background #F8F4E8 paper, primary/borders #09090B ink black, accent #D2E823 acid yellow-green. Headlines: bold display (all-caps, tracking-tighter). Body: Space Grotesk (400-700). 2px borders on all interactive elements. Hard shadows: 4px 4px 0px 0px #09090B. SVG noise overlay at 3% opacity. Bento category grid mixed aspect ratios. Horizontal scrolling products. Marquee: 20s linear loop. Max border-radius 32px. Floating animations +/-10px. Interactive cursor: 32px circle, mix-blend-mode difference.`,
    referenceHtml: acidBrutalistHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border: 2px solid var(--sb-heading); border-radius: 20px; box-shadow: 4px 4px 0px 0px var(--sb-heading); padding: 32px;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border: 2px solid var(--sb-heading); border-radius: 20px; box-shadow: 4px 4px 0px 0px var(--sb-heading); padding: 16px 40px; font-weight: 700; text-transform: uppercase;
/* ACCENT BUTTONS */ background: var(--sb-accent); color: var(--sb-heading);
/* BADGES */ background: var(--sb-accent); color: var(--sb-heading); border: 2px solid var(--sb-heading); border-radius: 20px; padding: 6px 16px; font-weight: 700; text-transform: uppercase;
/* HEADINGS */ font-weight: 800; text-transform: uppercase; letter-spacing: -0.03em; line-height: 1.05;
/* SECTION BG */ background: var(--sb-highlight); padding: var(--sb-section-pad);
/* MARQUEE */ overflow: hidden; white-space: nowrap; animation: marquee 20s linear infinite; font-size: 48px; font-weight: 800; text-transform: uppercase; border-top: 2px solid var(--sb-heading); border-bottom: 2px solid var(--sb-heading); padding: 16px 0;
/* BENTO GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; some items span 2 cols or 2 rows;
/* FLOAT ANIMATION */ @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
/* KEY RULE */ Paper #F8F4E8 background. 2px borders on everything. Hard shadows. Bold uppercase headings. Max 32px border-radius.`,
  },

  // ── 11. Digital Naturalism / Avant-Garde Dark ──
  {
    id: "digital-naturalism",
    name: "Digital Naturalism",
    description: "Editorial dark mode, serif-meets-brutalist acid lime",
    colorPalette: ["#0C0A09", "#D4F268", "#1C1917", "#E7E5E4"],
    styleOverrides: {
      headingColor: "#E7E5E4",
      bodyColor: "#d6d3d1",
      mutedColor: "#a8a29e",
      accentColor: "#D4F268",
      highlightBg: "#1C1917",
      ctaBg: "#D4F268",
      fontFamily: "Lora",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Editorial dark mode. Background #0C0A09 stone black, accent #D4F268 acid lime, surface #1C1917 warm charcoal, foreground #E7E5E4 off-white, cards #292524, borders rgba(255,255,255,0.1). Serif display headlines (lightweight 200-400, italics for emphasis, -0.02em tracking). Body: sans-serif (400-600, 18px, 14px labels). Glassmorphism nav. Asymmetrical hero 5:7. Noise overlay at 0.04 opacity mix-blend-mode overlay. Corner radii: 24px cards, 9999px buttons. Transitions: 300ms cubic-bezier(0.4,0,0.2,1). Never use pure black — use stone-tinted. Showcase grid with grayscale-to-color hover.`,
    referenceHtml: digitalNaturalismHtml,
    cssPatterns: `/* CARDS */ background: #292524; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--sb-card-radius); padding: 32px; transition: all 300ms cubic-bezier(0.4,0,0.2,1);
/* BUTTONS */ background: var(--sb-accent); color: #0C0A09; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 600; transition: all 300ms cubic-bezier(0.4,0,0.2,1);
/* OUTLINE BUTTONS */ background: transparent; color: var(--sb-heading); border: 1px solid rgba(255,255,255,0.2); border-radius: var(--sb-btn-radius);
/* BADGES */ color: var(--sb-accent); font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
/* HEADINGS */ font-family: var(--sb-font); font-weight: 300; font-style: italic; line-height: 1.1; letter-spacing: -0.02em; (bold 700 for emphasis words);
/* SECTION BG */ background: #0C0A09; color: #E7E5E4; padding: var(--sb-section-pad);
/* SURFACE SECTION */ background: #1C1917;
/* NOISE OVERLAY */ position: absolute; inset: 0; opacity: 0.04; mix-blend-mode: overlay; background: url("data:image/svg+xml,...noise...");
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ Stone-tinted dark backgrounds (never pure black). Lightweight italic serif headings. Acid lime accents. 24px card radius, pill buttons.`,
  },

  // ── 12. Cyber Serif ──
  {
    id: "cyber-serif",
    name: "Cyber Serif",
    description: "Premium avant-garde serif + monospace with emerald",
    colorPalette: ["#050505", "#10b981", "#EBEBEB", "#1a1a1a"],
    styleOverrides: {
      headingColor: "#EBEBEB",
      bodyColor: "#d4d4d8",
      mutedColor: "#71717a",
      accentColor: "#10b981",
      highlightBg: "#0a1a14",
      ctaBg: "#10b981",
      fontFamily: "Lora",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Premium avant-garde. Background #050505, text #EBEBEB, accent #10b981 emerald. Headlines: serif (Newsreader-style, 200-800, italic support, tracking-tighter). Body: Inter sans. Labels: uppercase monospace (0.2em tracking, 10px). Fixed nav transparent to blurred glass on scroll. Hero: 100vh, 100px serif headline. Feature grid 3-col spotlight cards with shimmer borders. Shimmer border: 3-color linear gradient at 200% size, animating position from 200% to -200% over 4s. Glassmorphism: rgba(255,255,255,0.02) + blur(12px). CTA with gradient text animation. Use emerald sparingly — never as block background. Rounded-3xl or pill shapes only.`,
    referenceHtml: cyberSerifHtml,
    cssPatterns: `/* CARDS */ background: rgba(255,255,255,0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 32px; position: relative; overflow: hidden;
/* SHIMMER CARD */ &::before: content '', position absolute, inset -1px, background linear-gradient(135deg, transparent 40%, var(--sb-accent) 50%, transparent 60%), background-size 200% 200%, animation shimmer 4s linear infinite, border-radius inherit, z-index -1; &::after: content '', position absolute, inset 1px, background #0a0a0a, border-radius inherit, z-index -1;
/* BUTTONS */ background: var(--sb-accent); color: #050505; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 600;
/* BADGES */ font-family: monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--sb-accent);
/* HEADINGS */ font-family: var(--sb-font); font-weight: 200; font-style: italic; line-height: 1.05; letter-spacing: -0.04em; font-size: clamp(48px, 8vw, 100px);
/* SECTION BG */ background: #050505; color: #EBEBEB; padding: var(--sb-section-pad);
/* GRADIENT TEXT */ background: linear-gradient(135deg, var(--sb-accent), #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ ALWAYS dark background #050505. Emerald as accent only — never block background. Lightweight italic serif headings. Shimmer borders on cards. Pill shapes.`,
  },

  // ── 13. Red Sun / Coral & Ink ──
  {
    id: "red-sun",
    name: "Red Sun",
    description: "Editorial serif with coral-ink duo and ambient blur",
    colorPalette: ["#2D3B42", "#EF4623", "#FDF1EE", "#ffffff"],
    styleOverrides: {
      headingColor: "#2D3B42",
      bodyColor: "#374151",
      mutedColor: "#6b7280",
      accentColor: "#EF4623",
      highlightBg: "#FDF1EE",
      ctaBg: "#EF4623",
      fontFamily: "Manrope",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Editorial coral-ink. Primary #EF4623 coral, secondary #2D3B42 ink, background accent #FDF1EE soft peach. Headlines: serif (60-160px, tracking-tight, italicized for emphasis). Body: Manrope (300-700, 18px, leading-relaxed). Glassmorphism nav on scroll: backdrop-blur 12px, white/80. Buttons: 30px corner radius + shadow-lg shadow-primary/20. Ambient blurs: #EF4623 at 10% opacity, 100-120px blur. Hero 10rem serif with ambient blur circles. Bento value proposition 2-col. Features grid 3-col bento with 48px radius. Full-width CTA with dot grid background. Animations: cubic-bezier(0.16,1,0.3,1) starting with 2-degree rotation.`,
    referenceHtml: redSunHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border-radius: var(--sb-card-radius); box-shadow: 0 4px 24px rgba(0,0,0,0.06); padding: 32px; transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border-radius: 30px; padding: 16px 44px; font-weight: 600; box-shadow: 0 8px 24px rgba(239,70,35,0.2);
/* BADGES */ background: var(--sb-highlight); color: var(--sb-accent); padding: 8px 20px; border-radius: 50px; font-size: 13px; font-weight: 600;
/* HEADINGS */ font-family: var(--sb-font); font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; font-style: italic for emphasis;
/* SECTION BG */ background: #ffffff; padding: var(--sb-section-pad); position: relative; overflow: hidden;
/* PEACH SECTION */ background: var(--sb-highlight);
/* AMBIENT BLUR */ position: absolute; width: 300px; height: 300px; border-radius: 50%; background: var(--sb-accent); opacity: 0.1; filter: blur(100px); pointer-events: none;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* BENTO GRID */ display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; border-radius: 48px; overflow: hidden;
/* ANIMATION */ opacity: 0; transform: translateY(30px) rotate(2deg); transition: all 0.8s cubic-bezier(0.16,1,0.3,1);
/* KEY RULE */ Coral ambient blur circles in every section. Serif italic headings. 30px+ button radius. Peach (#FDF1EE) alternate sections.`,
  },

  // ── 14. Organic Intelligence ──
  {
    id: "organic-intelligence",
    name: "Organic Wave",
    description: "Editorial-tech hybrid with wave architecture and fluid motion",
    colorPalette: ["#171717", "#4338ca", "#fcfbf9", "#e5e5e5"],
    styleOverrides: {
      headingColor: "#171717",
      bodyColor: "#374151",
      mutedColor: "#6b7280",
      accentColor: "#4338ca",
      highlightBg: "#eef2ff",
      ctaBg: "#171717",
      fontFamily: "Playfair Display",
      spacing: "spacious",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Editorial-tech hybrid with fluid interactions. Background #fcfbf9 cream, dark #171717 charcoal, accent #4338ca indigo, borders #e5e5e5. Headlines: Playfair Display serif (italic for emphasis, hero 11vw-14vw). Body: Inter (400-500, leading 1.2-1.5). Labels: JetBrains Mono (uppercase, tracking 0.3-0.5em, 10-14px). Signature ease: cubic-bezier(0.22,1,0.36,1). Reveal: translateY(40px) + opacity over 1000ms. Wave container at section bottoms: 120% width div with 50% border-radius. Button pulse: scale(1.02) + 20px blur indigo shadow, 3s loop. Footer with 5rem top radius. No harsh box-shadows — use colored blurs or 1px borders.`,
    referenceHtml: organicWaveHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border: 1px solid #e5e5e5; border-radius: var(--sb-card-radius); padding: 32px; transition: all 500ms cubic-bezier(0.22,1,0.36,1);
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 600; animation: pulse 3s ease-in-out infinite;
/* PULSE */ @keyframes pulse { 0%,100% { box-shadow: 0 0 0 rgba(67,56,202,0); } 50% { box-shadow: 0 0 20px rgba(67,56,202,0.3); transform: scale(1.02); } }
/* BADGES */ font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; color: var(--sb-accent);
/* HEADINGS */ font-family: var(--sb-font); font-weight: 700; font-style: italic; line-height: 1.05; letter-spacing: -0.02em;
/* SECTION BG */ background: #fcfbf9; padding: var(--sb-section-pad); position: relative;
/* DARK SECTION */ background: var(--sb-heading); color: #ffffff; border-radius: 5rem 5rem 0 0;
/* WAVE DIVIDER */ position: relative; &::after: content '', position absolute, bottom -60px, left -10%, width 120%, height 120px, background var(--sb-highlight) or section-bg, border-radius 50%;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* ANIMATION */ opacity: 0; transform: translateY(40px); transition: all 1000ms cubic-bezier(0.22,1,0.36,1);
/* KEY RULE */ No harsh box-shadows — use colored blurs or 1px borders. Wave dividers between sections. Italic serif headings. Monospace labels.`,
  },

  // ── 15. Glassmorphic Depth ──
  {
    id: "glassmorphic-depth",
    name: "Glassmorphic Depth",
    description: "Monochrome + emerald glassmorphism with depth layers",
    colorPalette: ["#18181B", "#34D399", "#F4F4F5", "#000000"],
    styleOverrides: {
      headingColor: "#18181B",
      bodyColor: "#3f3f46",
      mutedColor: "#71717A",
      accentColor: "#34D399",
      highlightBg: "#ecfdf5",
      ctaBg: "#18181B",
      fontFamily: "Inter",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Glassmorphic depth system. Dark #000000, light bg #F4F4F5, zinc #18181B, emerald #34D399, body #71717A, border rgba(255,255,255,0.1). Inter only — headings 500-700 tracking -0.05em leading 1.05, body 300-400, labels 700 10px tracking 0.2em uppercase. Floating glass navbar 20px blur pill. Hero 92vh with 22vw background text at 3% opacity. Feature grid 2-col sticky + card. Dark productivity block with 3D-transformed mockup. Pricing bento grid 3-col. Glassmorphism: rgba(255,255,255,0.05) + blur(12px) + 1px solid rgba(255,255,255,0.1). Grain overlay noise SVG at 15% opacity. Corner radius: 2.5rem containers, 1-1.5rem cards. Hover: 105% scale + 300ms.`,
    referenceHtml: glassmorphicDepthHtml,
    cssPatterns: `/* CARDS light */ background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 1.5rem; padding: 32px; transition: transform 300ms ease; hover: transform scale(1.05);
/* CARDS dark */ background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: 32px;
/* BUTTONS */ background: var(--sb-cta-bg); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 16px 44px; font-weight: 600;
/* ACCENT BUTTONS */ background: var(--sb-accent); color: #000000;
/* BADGES */ font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: var(--sb-accent);
/* HEADINGS */ font-weight: 600; letter-spacing: -0.05em; line-height: 1.05;
/* SECTION BG light */ background: #F4F4F5; padding: var(--sb-section-pad);
/* SECTION BG dark */ background: #000000; color: #ffffff;
/* CONTAINER */ max-width: 1200px; margin: 0 auto; border-radius: 2.5rem; overflow: hidden;
/* WATERMARK TEXT */ font-size: 22vw; font-weight: 700; opacity: 0.03; position: absolute; pointer-events: none;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ Alternate light (#F4F4F5) and dark (#000000) sections. Glass cards on dark, solid cards on light. 2.5rem container radius. Emerald accent sparingly.`,
  },

  // ── 16. Hyper-Saturated Fintech ──
  {
    id: "hyper-fintech",
    name: "Hyper Fintech",
    description: "High-saturation glassmorphism with cyber yellow",
    colorPalette: ["#0A0A0A", "#FDE047", "#171717", "#FFFFFF"],
    styleOverrides: {
      headingColor: "#FFFFFF",
      bodyColor: "#d4d4d8",
      mutedColor: "#71717a",
      accentColor: "#FDE047",
      highlightBg: "#171717",
      ctaBg: "#FDE047",
      fontFamily: "Inter",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Hyper-saturated fintech. Shout color: #FDE047 cyber yellow, background #0A0A0A deep onyx, surface #171717 charcoal, white #FFFFFF, deep gray #262626. Geometric sans-serif (Inter or General Sans). Hero: text-6xl to 8xl bold tracking-tight. Labels: text-[10px] uppercase tracking-widest. Liquid sectioning: rounded-[100px] or clip-path waves. One "shout" color at 60% viewport. Pill shapes (rounded-full) for buttons. Glass: backdrop-blur-xl, bg-white/10, 1px white border at 20% opacity. Fluid elastic ease: cubic-bezier(0.22,1,0.36,1). Active:scale-95. No standard 8px/12px radii — extreme pills or huge organic curves. Flat vibrant "shout" color, no gradients on it.`,
    referenceHtml: hyperFintechHtml,
    cssPatterns: `/* CARDS */ background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); border-radius: 2rem; padding: 32px;
/* SHOUT CARD */ background: var(--sb-accent); color: #000000; border-radius: 100px; padding: 48px;
/* BUTTONS */ background: var(--sb-accent); color: #000000; border-radius: 9999px; padding: 18px 48px; font-weight: 700; transition: all 0.3s cubic-bezier(0.22,1,0.36,1); active: transform scale(0.95);
/* OUTLINE BUTTONS */ background: transparent; color: #ffffff; border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px;
/* BADGES */ font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; color: var(--sb-accent);
/* HEADINGS */ font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; font-size: clamp(48px, 8vw, 96px);
/* SECTION BG */ background: #0A0A0A; color: #ffffff; padding: var(--sb-section-pad);
/* SHOUT SECTION */ background: var(--sb-accent); color: #000000; border-radius: 100px; margin: 0 20px;
/* LIQUID SECTION */ border-radius: 100px; overflow: hidden; margin: 0 20px;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ ALWAYS dark #0A0A0A background. One "shout" yellow section per page. Extreme pill shapes (100px radius). No standard radii. Flat vibrant accent — no gradients on it.`,
  },

  // ── 17. Architectural Blueprint ──
  {
    id: "blueprint",
    name: "Blueprint",
    description: "Technical drawing / floor plan aesthetic",
    colorPalette: ["#003366", "#FFFFFF", "#FF3333", "#00FFFF"],
    styleOverrides: {
      headingColor: "#FFFFFF",
      bodyColor: "#cccccc",
      mutedColor: "#8899aa",
      accentColor: "#FF3333",
      highlightBg: "#003366",
      ctaBg: "#FF3333",
      fontFamily: "DM Sans",
      spacing: "default",
      cardRadius: "0px",
      buttonRadius: "0px",
    },
    aiContext: `Architectural blueprint aesthetic. Background #003366 blueprint blue, lines #FFFFFF at 80% opacity, accents #FF3333 redline, measurements #00FFFF cyan. Notes: handwritten style font. Technical: Roboto Mono. Block caps for headings. 20px repeating CSS grid squares. Blueprint paper grain texture. Cards: thin white outlines with crosshair corner intersections. Buttons: technical stamps / "Approved" boxes. Dividers: dimension arrows. Measurement markers and coordinate labels. Everything aligns to 10px/50px grid intersections. Drafting reveal animations with stroke-dashoffset.`,
    referenceHtml: blueprintHtml,
    cssPatterns: `/* CARDS */ background: transparent; border: 1px solid rgba(255,255,255,0.3); border-radius: 0; padding: 32px; position: relative;
/* CARD CROSSHAIRS */ &::before, &::after: content '+', position absolute, font-size: 16px, color: rgba(255,255,255,0.4); &::before: top -8px, left -8px; &::after: bottom -8px, right -8px;
/* BUTTONS */ background: transparent; color: var(--sb-accent); border: 2px solid var(--sb-accent); border-radius: 0; padding: 14px 36px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; position: relative;
/* STAMPS */ border: 2px solid var(--sb-accent); color: var(--sb-accent); transform: rotate(-3deg); padding: 8px 24px; text-transform: uppercase; font-weight: 700;
/* BADGES */ font-family: monospace; font-size: 10px; color: #00FFFF; text-transform: uppercase; letter-spacing: 0.2em;
/* HEADINGS */ font-family: monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ffffff;
/* SECTION BG */ background: #003366; color: rgba(255,255,255,0.8); padding: var(--sb-section-pad); background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 19px, rgba(255,255,255,0.05) 20px);
/* DIMENSION LINE */ border-top: 1px solid rgba(255,255,255,0.3); position: relative; &::before, &::after: content '', position absolute, top -4px, width 1px, height 8px, background rgba(255,255,255,0.3);
/* COORDINATES */ font-family: monospace; font-size: 9px; color: #00FFFF; position: absolute;
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ ALWAYS blueprint blue #003366 background. White wireframe outlines. No solid fills. Crosshair corners on cards. Monospace text. Measurement markers.`,
  },

  // ── 18. Claymorphism ──
  {
    id: "claymorphism",
    name: "Claymorphism",
    description: "Digital clay with tactile 3D and candy-store colors",
    colorPalette: ["#332F3A", "#7C3AED", "#F4F1FA", "#DB2777"],
    styleOverrides: {
      headingColor: "#332F3A",
      bodyColor: "#4a4550",
      mutedColor: "#635F69",
      accentColor: "#7C3AED",
      highlightBg: "#F4F1FA",
      ctaBg: "#7C3AED",
      fontFamily: "DM Sans",
      spacing: "default",
      cardRadius: "24px",
      buttonRadius: "50px",
    },
    aiContext: `Claymorphism digital clay. Canvas #F4F1FA pale lavender, text #332F3A soft charcoal, muted #635F69. Accent: #7C3AED vivid violet, secondary #DB2777 hot pink, tertiary #0EA5E9 sky blue, success #10B981, warning #F59E0B. Headings: Nunito (700-900, rounded terminals). Body: DM Sans (400-700). 4-layer shadow system for clay depth. Minimum rounded-[20px] everywhere — never rounded-md. Button gradient: from-[#A78BFA] to-[#7C3AED]. Background blobs: accent colors at 10% opacity + blur-3xl. Clay float animation: 8s translateY(-20px) rotate(2deg). Active press: scale-[0.92]. Hover lift: -translate-y-1 to -translate-y-3. Always animated background blobs. Never gradient text below text-5xl.`,
    referenceHtml: claymorphismHtml,
    cssPatterns: `/* CARDS */ background: #ffffff; border-radius: 24px; box-shadow: 0 2px 4px rgba(124,58,237,0.04), 0 8px 16px rgba(124,58,237,0.06), 0 16px 32px rgba(124,58,237,0.08), inset 0 -2px 4px rgba(0,0,0,0.02); padding: 32px; transition: all 0.3s ease; hover: transform translateY(-4px); active: transform scale(0.92);
/* BUTTONS */ background: linear-gradient(135deg, #A78BFA, #7C3AED); color: #ffffff; border-radius: var(--sb-btn-radius); padding: 18px 44px; font-weight: 700; box-shadow: 0 4px 12px rgba(124,58,237,0.3); active: transform scale(0.92);
/* SECONDARY BUTTONS */ background: linear-gradient(135deg, #F472B6, #DB2777); color: #ffffff;
/* BADGES */ background: rgba(124,58,237,0.1); color: var(--sb-accent); padding: 8px 20px; border-radius: 50px; font-weight: 700;
/* HEADINGS */ font-family: 'Nunito', var(--sb-font), sans-serif; font-weight: 900; line-height: 1.1;
/* SECTION BG */ background: var(--sb-highlight); padding: var(--sb-section-pad); position: relative; overflow: hidden;
/* BLOB */ position: absolute; width: 400px; height: 400px; border-radius: 50%; opacity: 0.1; filter: blur(80px); animation: clayFloat 8s ease-in-out infinite;
/* BLOB COLORS */ var(--sb-accent) violet, #DB2777 pink, #0EA5E9 blue (different blob per section);
/* FLOAT */ @keyframes clayFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
/* GRID */ display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
/* KEY RULE */ Minimum 20px border-radius on EVERYTHING. 4-layer clay shadows. Animated background blobs in every section. Candy-store accent colors. Nunito headings.`,
  },
];

export const designSystemMap: Record<string, DesignSystem> = Object.fromEntries(
  designSystems.map((ds) => [ds.id, ds])
);
