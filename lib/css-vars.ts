import type { StyleOverrides } from "@/lib/page-builder/types";

const SPACING_MAP: Record<string, { desktop: string; mobile: string }> = {
  compact: { desktop: "50px 20px", mobile: "30px 16px" },
  default: { desktop: "80px 20px", mobile: "50px 16px" },
  spacious: { desktop: "120px 20px", mobile: "80px 16px" },
};

export const GOOGLE_FONT_MAP: Record<string, string> = {
  Raleway: "Raleway:wght@400;600;700;800",
  Inter: "Inter:wght@400;500;600;700;800",
  "DM Sans": "DM+Sans:wght@400;500;600;700",
  Poppins: "Poppins:wght@400;500;600;700;800",
  Montserrat: "Montserrat:wght@400;500;600;700;800",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700;800",
  Outfit: "Outfit:wght@400;500;600;700",
  Manrope: "Manrope:wght@400;500;600;700;800",
  Lora: "Lora:wght@400;500;600;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700;800",
  Nunito: "Nunito:wght@400;600;700;800;900",
  "Space Grotesk": "Space+Grotesk:wght@300;400;500;600;700",
  "Instrument Serif": "Instrument+Serif:ital@0;1",
  Newsreader: "Newsreader:ital,wght@0,200;0,400;0,700;1,200;1,400;1,700",
  "General Sans": "General+Sans:wght@400;500;600;700",
  Satoshi: "Satoshi:wght@400;500;700",
};

export const AVAILABLE_FONTS = Object.keys(GOOGLE_FONT_MAP);

/**
 * Build a <style id="sb-theme"> block with CSS custom properties from overrides.
 * This is the ONLY place theme values are declared.
 */
export function buildCssVarBlock(overrides: StyleOverrides): string {
  const fontParam = GOOGLE_FONT_MAP[overrides.fontFamily] || GOOGLE_FONT_MAP["Raleway"]!;
  const spacing = SPACING_MAP[overrides.spacing] || SPACING_MAP["default"]!;

  return `<style id="sb-theme">
@import url('https://fonts.googleapis.com/css2?family=${fontParam}&display=swap');
:root {
  --sb-heading: ${overrides.headingColor};
  --sb-body: ${overrides.bodyColor};
  --sb-muted: ${overrides.mutedColor};
  --sb-accent: ${overrides.accentColor};
  --sb-highlight: ${overrides.highlightBg};
  --sb-cta-bg: ${overrides.ctaBg};
  --sb-cta-text: #FFFFFF;
  --sb-font: '${overrides.fontFamily}', sans-serif;
  --sb-card-radius: ${overrides.cardRadius};
  --sb-btn-radius: ${overrides.buttonRadius};
  --sb-section-pad: ${spacing.desktop};
}
@media (max-width: 768px) {
  :root {
    --sb-section-pad: ${spacing.mobile};
  }
}
</style>`;
}
