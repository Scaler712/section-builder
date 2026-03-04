export const tokens = {
  colors: {
    text: "#2B2B2B",
    textSecondary: "#3A3A3A",
    textLight: "#6B6B6B",
    highlight: "#FFF2C2",
    highlightAlt: "#FFF4CC",
    cardBg: "#FFFFFF",
    sectionBg: "#FAFAFA",
    sectionBgAlt: "#F5F5F5",
    ctaBg: "#2B2B2B",
    ctaText: "#FFFFFF",
    accent: "#E8B931",
    border: "rgba(0,0,0,0.06)",
  },
  font: {
    family: "'Raleway', sans-serif",
    importUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap",
    weights: { regular: 400, semibold: 600, bold: 700, extrabold: 800 },
  },
  spacing: {
    sectionDesktop: "80px 20px",
    sectionMobile: "50px 16px",
    maxWidth: "1100px",
  },
  radius: {
    card: "18px",
    button: "50px",
    pill: "8px",
  },
  shadow: {
    card: "0 2px 16px rgba(0,0,0,0.06)",
    cardHover: "0 4px 24px rgba(0,0,0,0.10)",
  },
} as const;

export const fontImport = `@import url('${tokens.font.importUrl}');`;

export const baseStyles = `
${fontImport}

.sb-section * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: ${tokens.font.family};
}
`;
