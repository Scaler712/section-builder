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

  // Strip full-document wrappers (from Lovable or other sources)
  // Extract <head> content (styles, links) and <body> content separately
  let stripped = html;

  // Extract link tags from <head> (Google Fonts etc.) before stripping
  const headMatch = stripped.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  let headLinks = "";
  if (headMatch) {
    const linkTags = headMatch[1]!.match(/<link[^>]*>/gi);
    if (linkTags) {
      // Convert link preconnect + font imports to @import in CSS
      const fontLinks = linkTags.filter(l => /fonts\.googleapis\.com\/css/.test(l));
      headLinks = fontLinks.map(l => {
        const href = l.match(/href="([^"]+)"/)?.[1];
        return href ? `@import url('${href}');` : "";
      }).filter(Boolean).join("\n");
    }
  }

  // Extract body content
  const bodyMatch = stripped.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    // Get styles from head
    const headStyles = headMatch ? (headMatch[1]!.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join("\n") : "";
    stripped = headStyles + "\n" + bodyMatch[1]!;
  }

  // Remove remaining document wrappers
  stripped = stripped.replace(/<!DOCTYPE[^>]*>/gi, "");
  stripped = stripped.replace(/<\/?html[^>]*>/gi, "");
  stripped = stripped.replace(/<\/?head[^>]*>/gi, "");
  stripped = stripped.replace(/<\/?body[^>]*>/gi, "");
  stripped = stripped.replace(/<meta[^>]*>/gi, "");
  stripped = stripped.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "");
  stripped = stripped.replace(/<link[^>]*>/gi, ""); // links converted to @import above

  // Strip any existing theme block
  let clean = stripped.replace(/<style id="sb-theme">[\s\S]*?<\/style>\s*/g, "");

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

  // Collect ALL @import declarations, then strip them from CSS blocks.
  // @import MUST be at the very top of a <style> block or browsers ignore them.
  const allImports = new Set<string>();
  const cleanedStyles = styles.map((s) => {
    let result = s.replace(/@import\s+url\([^)]+\)\s*;?\s*/g, (importLine) => {
      const normalized = importLine.trim().replace(/;$/, "");
      if (!allImports.has(normalized)) {
        allImports.add(normalized);
      }
      return ""; // strip from inline position — will be hoisted to top
    });
    // Scope bare `html` and `body` selectors to `.sb-root` to avoid Systeme.io conflicts
    result = result.replace(/(\n|^)\s*html\s*\{/g, "$1.sb-root {");
    result = result.replace(/(\n|^)\s*body\s*\{/g, "$1.sb-root {");
    return result;
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
  const alignmentFix = `/* Systeme.io alignment fix — minimal override */
/* Only neutralize Systeme.io's text-align:center wrapper. */
/* Let the original page CSS handle all other alignment. */
.sb-root { text-align: left; scroll-behavior: smooth; }

/* Mobile responsive fix for Systeme.io */
.sb-root { max-width: 100%; overflow-x: hidden; box-sizing: border-box; }
.sb-root *, .sb-root *::before, .sb-root *::after { box-sizing: border-box; }
.sb-root img, .sb-root video, .sb-root iframe { max-width: 100%; height: auto; }
@media (max-width: 768px) {
  .sb-root [style*="display: flex"][style*="flex-direction: row"],
  .sb-root [style*="display:flex"][style*="flex-direction:row"] { flex-direction: column !important; }
  .sb-root [style*="width:"][style*="px"] { width: 100% !important; max-width: 100% !important; }
  .sb-root h1 { font-size: clamp(1.75rem, 6vw, 3rem) !important; }
  .sb-root h2 { font-size: clamp(1.5rem, 5vw, 2.25rem) !important; }
}`;

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

  // ── Collect ALL font URLs ──
  // Systeme.io encodes & to &amp; in HTML, which breaks Google Fonts URLs
  // like ...css2?family=Inter:wght@400;500&display=swap
  // Fix: strip &display=swap so URLs contain NO ampersands.
  const fontUrls = new Set<string>();

  function sanitizeFontUrl(url: string): string {
    // Remove &display=swap (and any other & params) to avoid & encoding issues
    return url.replace(/&[^&]*/g, "");
  }

  // From theme block
  const themeImportMatch = themeBlock.match(/@import\s+url\(['"]?([^'")]+)['"]?\)/);
  if (themeImportMatch?.[1]) fontUrls.add(sanitizeFontUrl(themeImportMatch[1]));

  // From <head> <link> tags
  if (headMatch) {
    const linkTags = headMatch[1]!.match(/<link[^>]*>/gi) || [];
    for (const l of linkTags) {
      if (/fonts\.googleapis\.com/.test(l)) {
        const href = l.match(/href="([^"]+)"/)?.[1];
        if (href) fontUrls.add(sanitizeFontUrl(href));
      }
    }
  }

  // From CSS @import declarations we already collected
  for (const imp of allImports) {
    const urlMatch = imp.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (urlMatch?.[1] && /fonts/.test(urlMatch[1])) fontUrls.add(sanitizeFontUrl(urlMatch[1]));
  }

  // Build @import lines — these go at the TOP of the <style> block.
  // URLs are now ampersand-free so Systeme.io won't break them.
  const fontImportLines = Array.from(fontUrls)
    .map((u) => `@import url('${u}');`)
    .join("\n");

  // Extract theme CSS (without <style> tags and without @import)
  const themeCss = themeBlock
    .replace(/@import\s+url\([^)]+\)\s*;?\s*\n?/g, "")
    .replace(/<\/?style[^>]*>/gi, "")
    .trim();

  // Combined page styles (already have @imports stripped)
  const combinedCss = cleanedStyles
    .filter((s) => s.trim())
    .join("\n\n");

  // Font family override — force the font on .sb-root so it applies
  // even when the page CSS uses direct font-family or Tailwind's font-sans.
  const fontFamily = overrides.fontFamily || "Raleway";
  const fontOverride = `.sb-root, .sb-root * { font-family: '${fontFamily}', sans-serif !important; }`;

  // Everything in ONE <style> block: @imports first (no & chars), then CSS rules
  const cssBody = [
    fontImportLines,
    themeCss,
    fontOverride,
    combinedCss,
    fadeUpFix,
    alignmentFix,
  ].filter((s) => s.trim()).join("\n\n");

  parts.push(`<style>\n${cssBody}\n</style>`);

  // HTML content
  if (clean.trim()) {
    parts.push(clean);
  }

  // Single unified animation script — replaces all per-section observers.
  // Uses DOMContentLoaded + setTimeout fallback to guarantee execution.
  // Adds .sb-animated class first (re-hides elements), then IntersectionObserver
  // adds .visible (animates them in). If observer isn't supported, elements
  // stay visible via the CSS default.
  // Build font URLs array for the JS fallback (with display=swap for better UX)
  const fontUrlsJs = Array.from(fontUrls).map((u) => `'${u.replace(/'/g, "\\'")}'`).join(",");

  parts.push(`<script>
(function() {
  /* Load Google Fonts via <link> injection — bypasses Systeme.io CSS sanitization */
  var fonts = [${fontUrlsJs}];
  for (var f = 0; f < fonts.length; f++) {
    var exists = document.querySelector('link[href="' + fonts[f] + '"]');
    if (!exists) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fonts[f];
      document.head.appendChild(link);
    }
  }

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
