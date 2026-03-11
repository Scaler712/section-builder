import type { StyleOverrides } from "@/lib/page-builder/types";
import { buildCssVarBlock } from "@/lib/css-vars";

/**
 * Optimize HTML for Systeme.io paste.
 * - Prepends CSS variable theme block
 * - Forces fade-up elements visible (prevents flash-of-invisible)
 * - Deduplicates @import font declarations
 * - Combines all <style> blocks into one
 * - Replaces per-section IntersectionObservers with a single robust one
 * - Strips prohibited tags
 */
export function optimizeForSystemeio(html: string, overrides: StyleOverrides, checkoutUrl?: string): string {
  if (!html.trim()) return html;

  // Strip any existing theme block
  let clean = html.replace(/<style id="sb-theme">[\s\S]*?<\/style>\s*/g, "");

  // Build fresh theme block
  const themeBlock = buildCssVarBlock(overrides);

  // Extract all <style> blocks
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const styles: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = styleRegex.exec(clean)) !== null) {
    styles.push(match[1]!.trim());
  }
  clean = clean.replace(styleRegex, "").trim();

  // Extract all <script> blocks (we'll replace with a single unified script)
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  clean = clean.replace(scriptRegex, "").trim();

  // Deduplicate @import declarations across all styles
  const imports = new Set<string>();
  const cleanedStyles = styles.map((s) => {
    return s.replace(/@import\s+url\([^)]+\)\s*;?\s*/g, (importLine) => {
      const normalized = importLine.trim().replace(/;$/, "");
      if (imports.has(normalized)) return "";
      imports.add(normalized);
      return importLine;
    });
  });

  // ── Fix fade-up visibility ──
  // Override all .fade-up rules: make elements visible immediately,
  // then let the script add animation as progressive enhancement.
  // This prevents flash-of-invisible if scripts load late.
  const fadeUpFix = `.fade-up { opacity: 1 !important; transform: none !important; }
.fade-up.sb-animated { opacity: 0 !important; transform: translateY(30px) !important; transition: opacity 0.6s ease, transform 0.6s ease !important; }
.fade-up.sb-animated.visible { opacity: 1 !important; transform: translateY(0) !important; }`;

  // ── Fix Systeme.io alignment override ──
  // Systeme.io wraps Raw HTML blocks in a container with text-align: center.
  // We wrap ALL content in a .sb-root container with text-align: left,
  // then selectively center only elements that should be centered.
  // Works with ANY class naming convention (sb- prefixed, Lovable classes, or plain HTML).
  const alignmentFix = `/* Systeme.io alignment fix — universal */
.sb-root { text-align: left !important; }
.sb-root * { text-align: inherit; }
/* Center headings by default (common layout pattern) */
.sb-root h2 { text-align: center !important; }
/* Center hero, CTA, guarantee, and transition sections */
.sb-root [class*="hero"],
.sb-root [class*="cta"],
.sb-root [class*="guarantee"],
.sb-root [class*="transition"] { text-align: center !important; }
.sb-root [class*="hero"] h1, .sb-root [class*="hero"] h2, .sb-root [class*="hero"] p,
.sb-root [class*="cta"] h1, .sb-root [class*="cta"] h2, .sb-root [class*="cta"] p,
.sb-root [class*="guarantee"] h2, .sb-root [class*="guarantee"] p,
.sb-root [class*="transition"] h2, .sb-root [class*="transition"] p { text-align: center !important; }
/* Pricing cards: center card, left-align feature lists */
.sb-root [class*="pricing-card"] { text-align: center !important; }
.sb-root [class*="pricing-card"] ul,
.sb-root [class*="pricing-card"] li,
.sb-root [class*="pricing-card"] [class*="features"],
.sb-root [class*="pricing-card"] [class*="features"] li { text-align: left !important; }
/* Button alignment: inherit from parent (centered in hero/cta, left elsewhere) */
.sb-root a, .sb-root button { text-align: inherit; }
html { scroll-behavior: smooth; }`;

  // Wrap content in .sb-root container for alignment control
  clean = `<div class="sb-root">\n${clean}\n</div>`;

  // ── Replace dead links with checkout URL or anchor ──
  if (checkoutUrl && checkoutUrl.trim()) {
    clean = clean.replace(/href="#"/g, `href="${checkoutUrl.trim()}"`);
  } else {
    // No checkout URL — point buttons to pricing section anchor
    clean = clean.replace(/href="#"/g, 'href="#sb-pricing"');
  }

  // ── Add anchor IDs to sections for smooth scroll ──
  clean = clean.replace(/class="sb-pricing"/g, 'id="sb-pricing" class="sb-pricing"');
  clean = clean.replace(/class="sb-faq"/g, 'id="sb-faq" class="sb-faq"');
  clean = clean.replace(/class="sb-testimonials"/g, 'id="sb-testimonials" class="sb-testimonials"');

  // Build output
  const parts: string[] = [];

  // Theme block first (with its own @import)
  parts.push(themeBlock);

  // Combined styles (skip any @import that duplicates the theme block's import)
  const themeImportMatch = themeBlock.match(/@import url\('[^']+'\)/);
  const themeImportUrl = themeImportMatch ? themeImportMatch[0] : "";

  const combinedCss = cleanedStyles
    .map((s) => {
      if (themeImportUrl) {
        return s.replace(new RegExp(escapeRegex(themeImportUrl) + "\\s*;?\\s*", "g"), "");
      }
      return s;
    })
    .filter((s) => s.trim())
    .join("\n\n");

  if (combinedCss.trim()) {
    parts.push(`<style>\n${combinedCss}\n\n${fadeUpFix}\n\n${alignmentFix}\n</style>`);
  } else {
    parts.push(`<style>\n${fadeUpFix}\n\n${alignmentFix}\n</style>`);
  }

  // HTML content
  if (clean.trim()) {
    parts.push(clean);
  }

  // Single unified animation script — replaces all per-section observers.
  // Uses DOMContentLoaded + setTimeout fallback to guarantee execution.
  // Adds .sb-animated class first (re-hides elements), then IntersectionObserver
  // adds .visible (animates them in). If observer isn't supported, elements
  // stay visible via the CSS default.
  parts.push(`<script>
(function() {
  function initAnimations() {
    var els = document.querySelectorAll('.fade-up');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '50px' });
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('sb-animated');
      observer.observe(els[i]);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    setTimeout(initAnimations, 50);
  }
})();
</script>`);

  return parts.join("\n\n");
}

/**
 * Validate HTML for Systeme.io compatibility.
 * Returns warnings for common issues.
 */
export function validateSystemeioHtml(html: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for prohibited tags
  const prohibitedTags = ["<html", "<head", "<body", "<footer", "<!DOCTYPE"];
  for (const tag of prohibitedTags) {
    if (html.toLowerCase().includes(tag.toLowerCase())) {
      warnings.push(`Contains prohibited tag: ${tag}`);
    }
  }

  // Check for let/const (Systeme.io may run in older browser contexts)
  if (/\b(let|const)\s+\w/g.test(html)) {
    warnings.push("Contains let/const — use var for max browser compatibility");
  }

  // Check for unscoped CSS
  const styleContent = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleContent) {
    for (const block of styleContent) {
      if (block.includes('id="sb-theme"')) continue;
      const selectors = block.match(/\n\s*([.#]?[a-zA-Z][a-zA-Z0-9_-]*)\s*\{/g);
      if (selectors) {
        for (const sel of selectors) {
          const trimmed = sel.trim().replace(/\s*\{$/, "");
          if (trimmed && !trimmed.startsWith(".sb-") && !trimmed.startsWith(":root") && !trimmed.startsWith("@")) {
            warnings.push(`Unscoped CSS selector: ${trimmed} (should use .sb- prefix)`);
            break;
          }
        }
      }
    }
  }

  // Check HTML size
  const sizeKb = new Blob([html]).size / 1024;
  if (sizeKb > 500) {
    warnings.push(`HTML size is ${Math.round(sizeKb)}KB — may be slow to load`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
