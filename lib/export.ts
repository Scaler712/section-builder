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
export async function optimizeForSystemeio(html: string, overrides: StyleOverrides, checkoutUrl?: string): Promise<string> {
  if (!html.trim()) return html;

  // ── Detect if HTML has its own complete CSS system ──
  // HTML with custom root wrappers (like .lp-root) that already have full CSS
  // with !important declarations should NOT get font overrides injected.
  // These pages were designed to survive Systeme.io's CSS overrides on their own.
  const hasOwnCssSystem = /\.[a-z]+-root[\s,{]/i.test(html) &&
    /font-family:[^}]*!important/i.test(html);

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
  // Strip <link> tags — they've been converted to @import or JS injection above.
  // BUT preserve top-level <link> tags for HTML with its own CSS system (e.g. .lp-root)
  // since their fonts are already referenced in their own CSS.
  if (!hasOwnCssSystem) {
    stripped = stripped.replace(/<link[^>]*>/gi, "");
  } else {
    // Only strip non-font links, keep Google Fonts links as-is
    stripped = stripped.replace(/<link[^>]*>/gi, (tag) => {
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com|preconnect/i.test(tag)) return tag;
      return "";
    });
  }

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

  // Extract all <script> blocks — preserve source scripts, merge with our own
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const sourceScripts: string[] = [];
  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptRegex.exec(clean)) !== null) {
    const content = scriptMatch[1]!.trim();
    if (content) sourceScripts.push(content);
  }
  clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").trim();

  // ── Strip base64 images to reduce file size ──
  // base64-encoded images can be 1-2MB each, making the HTML too large for Systeme.io.
  // Replace with a tiny SVG placeholder. Users must upload images to a host separately.
  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23111' width='800' height='600'/%3E%3Ctext x='400' y='290' text-anchor='middle' fill='%23c44' font-size='28' font-family='sans-serif'%3EUPLOAD IMAGE%3C/text%3E%3Ctext x='400' y='330' text-anchor='middle' fill='%23888' font-size='16' font-family='sans-serif'%3EReplace this src with a hosted image URL%3C/text%3E%3C/svg%3E";
  clean = clean.replace(
    /src="data:image\/[^;]+;base64,[A-Za-z0-9+/=]+"/g,
    `src="${placeholderSvg}"`
  );

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
    // Scope all class/element selectors under .sb-root so page CSS doesn't
    // leak into or get overridden by Systeme.io's own styles.
    result = scopeSelectorsUnderRoot(result);
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
/* SVG icon color preservation — Systeme.io overrides parent color which breaks currentColor in SVGs */
.sb-root svg { color: inherit !important; }
/* Do NOT set generic img/video/iframe rules here — page CSS handles sizing with !important */
@media (max-width: 768px) {
  .sb-root [style*="display: flex"][style*="flex-direction: row"],
  .sb-root [style*="display:flex"][style*="flex-direction:row"] { flex-direction: column !important; }
  .sb-root [style*="width:"][style*="px"] { width: 100% !important; max-width: 100% !important; }
  .sb-root h1 { font-size: clamp(1.75rem, 6vw, 3rem) !important; }
  .sb-root h2 { font-size: clamp(1.5rem, 5vw, 2.25rem) !important; }
}`;

  // Wrap content in .sb-root container for alignment control
  clean = `<div class="sb-root">\n${clean}\n</div>`;

  // ── Inject font-family + font-weight inline on every text element ──
  // Systeme.io overrides both font-family AND font-weight via its own CSS.
  // Inline styles with !important survive everything.
  // IMPORTANT: Use string replacement, NOT DOMParser serialization.
  // DOMParser moves <style> from body to head, destroying CSS when reading body.innerHTML.
  // SKIP if the HTML already has its own font system with !important declarations.
  const fontFamily = overrides.fontFamily || "Raleway";
  const fontFamilyDecl = `font-family: '${fontFamily}', sans-serif !important`;

  // Default font-weights per tag — headings should be bold, body text normal
  const tagWeights: Record<string, string> = {
    h1: "700", h2: "700", h3: "600", h4: "600", h5: "600", h6: "600",
    button: "600", label: "500",
  };

  // Only inject inline fonts if HTML doesn't have its own font system
  if (!hasOwnCssSystem) {
    const textTags = "h1|h2|h3|h4|h5|h6|p|span|a|li|button|label|div|blockquote|figcaption|td|th";
    // Match ALL opening tags of text elements
    clean = clean.replace(
      new RegExp(`<(${textTags})(\\s[^>]*)?>`, "gi"),
      (match, tag, attrs) => {
        if (!attrs) attrs = "";
        const tagLower = tag.toLowerCase();

        // Extract existing font-weight from inline style if present
        const existingWeightMatch = attrs.match(/font-weight:\s*(\d+|bold|normal|lighter|bolder)/);
        const existingWeight = existingWeightMatch ? existingWeightMatch[1] : null;

        // Determine font-weight: use existing > tag default > skip
        const weight = existingWeight || tagWeights[tagLower] || null;
        const weightDecl = weight ? `; font-weight: ${weight} !important` : "";

        // Already has font-family with !important — just add weight if needed
        if (attrs.includes("font-family") && attrs.includes("!important")) {
          if (weight && !attrs.includes("font-weight")) {
            return match.replace(/style="([^"]*)"/, `style="$1${weightDecl}"`);
          }
          return match;
        }

        // Build the style additions
        const additions = `${fontFamilyDecl}${weightDecl}`;

        // Has style attribute — append
        if (attrs.includes('style="')) {
          // Strip any existing font-family (we're replacing it with !important version)
          const cleanedMatch = match.replace(/font-family:[^;"]*(;|\s*")/g, "$1");
          return cleanedMatch.replace(/style="([^"]*)"/, `style="$1; ${additions}"`);
        }
        // No style attribute — add one
        return `<${tag}${attrs} style="${additions}">`;
      }
    );
  }

  // ── Inline color on SVG icon containers for Systeme.io ──
  // SVGs use currentColor which inherits CSS color. Systeme.io overrides color
  // on containers, breaking icon colors. Fix: add inline color !important to
  // elements with Tailwind text-color classes so currentColor resolves correctly.
  const twColorMap: Record<string, string> = {
    "text-red-400": "#f87171", "text-red-500": "#ef4444", "text-red-600": "#dc2626",
    "text-green-400": "#4ade80", "text-green-500": "#22c55e", "text-green-600": "#16a34a",
    "text-blue-400": "#60a5fa", "text-blue-500": "#3b82f6", "text-blue-600": "#2563eb",
    "text-yellow-400": "#facc15", "text-yellow-500": "#eab308", "text-amber-500": "#f59e0b",
    "text-orange-500": "#f97316", "text-purple-500": "#a855f7", "text-pink-500": "#ec4899",
    "text-emerald-500": "#10b981", "text-emerald-600": "#059669",
    "text-rose-500": "#f43f5e", "text-indigo-500": "#6366f1",
    "text-teal-500": "#14b8a6", "text-cyan-500": "#06b6d4",
    "text-white": "#ffffff",
    "text-gray-400": "#9ca3af", "text-gray-500": "#6b7280", "text-gray-600": "#4b5563",
    "text-slate-400": "#94a3b8", "text-slate-500": "#64748b",
  };
  for (const [cls, hex] of Object.entries(twColorMap)) {
    // Match opening tags that have this class
    const escaped = cls.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
    clean = clean.replace(
      new RegExp(`(<[a-z][a-z0-9]*\\s[^>]*class="[^"]*${escaped}[^"]*")`, "gi"),
      (match) => {
        // Add inline color if no style attribute, or append to existing
        if (match.includes('style="')) {
          return match.replace(/style="([^"]*)"/, `style="$1; color: ${hex} !important"`);
        }
        return match + ` style="color: ${hex} !important"`;
      }
    );
  }

  // ── Reinforce image inline styles for Systeme.io ──
  // Systeme.io's CSS overrides image sizing. Add !important to critical properties.
  // For images WITH existing inline styles, reinforce them.
  // For images WITHOUT inline styles, the CSS !important rules (added above) handle it.
  clean = clean.replace(
    /<img\s([^>]*?)style="([^"]*)"([^>]*?)>/gi,
    (match, pre, style, post) => {
      let reinforced = style
        .replace(/width:\s*([^;!]+)(;|$)/g, "width: $1 !important;")
        .replace(/height:\s*([^;!]+)(;|$)/g, "height: $1 !important;")
        .replace(/object-fit:\s*([^;!]+)(;|$)/g, "object-fit: $1 !important;")
        .replace(/object-position:\s*([^;!]+)(;|$)/g, "object-position: $1 !important;");
      return `<img ${pre}style="${reinforced}"${post}>`;
    }
  );

  // Also reinforce explicit height on image container divs
  // (containers with height that directly contain an img)
  clean = clean.replace(
    /(<div\s[^>]*?style="[^"]*height:\s*\d+[^"]*"[^>]*>)\s*(<img\s)/gi,
    (match, divTag, imgStart) => {
      // Add !important to the container's height
      const reinforcedDiv = divTag.replace(
        /height:\s*([^;!"]+)(;|")/g,
        "height: $1 !important$2"
      );
      return `${reinforcedDiv}\n${imgStart}`;
    }
  );

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
  const fontUrls = new Set<string>();

  // From theme block
  const themeImportMatch = themeBlock.match(/@import\s+url\(['"]?([^'")]+)['"]?\)/);
  if (themeImportMatch?.[1]) fontUrls.add(themeImportMatch[1]);

  // From <head> <link> tags
  if (headMatch) {
    const linkTags = headMatch[1]!.match(/<link[^>]*>/gi) || [];
    for (const l of linkTags) {
      if (/fonts\.googleapis\.com/.test(l)) {
        const href = l.match(/href="([^"]+)"/)?.[1];
        if (href) fontUrls.add(href);
      }
    }
  }

  // From CSS @import declarations we already collected
  for (const imp of allImports) {
    const urlMatch = imp.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (urlMatch?.[1] && /fonts/.test(urlMatch[1])) fontUrls.add(urlMatch[1]);
  }

  // ── Fetch @font-face declarations as CSS fallback ──
  // Primary font loading is via JS <link> injection in the script block.
  // This CSS @font-face is a secondary fallback in case scripts are blocked.
  let inlinedFontFaces = "";
  for (const fontUrl of fontUrls) {
    try {
      const proxyUrl = `/api/font-css?url=${encodeURIComponent(fontUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const css = await res.text();
        inlinedFontFaces += css + "\n";
      }
    } catch {
      // If fetch fails, skip — JS injection + inline styles handle fonts
    }
  }

  // Extract theme CSS (without <style> tags and without @import)
  const themeCss = themeBlock
    .replace(/@import\s+url\([^)]+\)\s*;?\s*\n?/g, "")
    .replace(/<\/?style[^>]*>/gi, "")
    .trim();

  // Combined page styles (already have @imports stripped)
  const combinedCss = cleanedStyles
    .filter((s) => s.trim())
    .join("\n\n");

  // Font family + weight CSS overrides as backup (inline styles are primary method)
  // Skip when HTML has its own font system — it already handles font overrides
  const fontOverride = hasOwnCssSystem ? "" : `.sb-root, .sb-root * { font-family: '${fontFamily}', sans-serif !important; }
.sb-root h1 { font-weight: 700 !important; }
.sb-root h2 { font-weight: 700 !important; }
.sb-root h3 { font-weight: 600 !important; }
.sb-root h4 { font-weight: 600 !important; }
.sb-root h5 { font-weight: 600 !important; }
.sb-root h6 { font-weight: 600 !important; }
.sb-root button { font-weight: 600 !important; }`;

  // ── Reinforce media element CSS rules with !important ──
  // Systeme.io applies its own sizing overrides to img, iframe, and video elements
  // which breaks class-based sizing rules. Fix: add !important to sizing properties
  // on any CSS rule targeting these elements.
  const mediaSizingProps = ["width", "height", "min-height", "max-width", "min-width", "object-fit", "object-position", "aspect-ratio", "position", "top", "left", "right", "bottom", "border"];
  const mediaElementRegex = /([^{}@]*\b(?:img|iframe|video)\b[^{]*)\{([^}]+)\}/g;
  let reinforcedCss = combinedCss.replace(
    mediaElementRegex,
    (match, selector, body) => {
      let reinforced = body;
      for (const prop of mediaSizingProps) {
        reinforced = reinforced.replace(
          new RegExp(`(${prop}):\\s*([^;!}]+)(;)`, "g"),
          `$1: $2 !important;`
        );
      }
      return `${selector}{${reinforced}}`;
    }
  );

  // Also reinforce container rules critical for video/image layout
  // (containers with aspect-ratio, or explicit height that wrap media)
  const containerSizingProps = ["width", "height", "min-height", "max-width", "aspect-ratio", "position", "overflow"];
  const containerKeywords = ["video", "iframe", "image", "img", "media", "embed", "player"];
  reinforcedCss = reinforcedCss.replace(
    /([^{}@][^{]*)\{([^}]+)\}/g,
    (match, selector, body) => {
      const sel = selector.toLowerCase();
      // Only target selectors that look like media containers
      const isMediaContainer = containerKeywords.some(kw => sel.includes(kw));
      if (!isMediaContainer) return match;
      // Skip if this is a media query or already processed media element rule
      if (sel.includes("@") || /\b(img|iframe|video)\b/.test(sel)) return match;
      let reinforced = body;
      for (const prop of containerSizingProps) {
        reinforced = reinforced.replace(
          new RegExp(`(${prop}):\\s*([^;!}]+)(;)`, "g"),
          `$1: $2 !important;`
        );
      }
      return `${selector}{${reinforced}}`;
    }
  );

  // ── Reinforce font-weight in ALL CSS rules with !important ──
  // Systeme.io overrides font-weight. Add !important to any font-weight declaration.
  reinforcedCss = reinforcedCss.replace(
    /font-weight:\s*([^;!}]+)(;)/g,
    "font-weight: $1 !important;"
  );

  // ── Reinforce color declarations with !important ──
  // Systeme.io overrides text color, which breaks SVG icons using currentColor.
  // Add !important to all color declarations so Tailwind color classes survive.
  reinforcedCss = reinforcedCss.replace(
    /([^-])color:\s*([^;!}]+)(;)/g,
    "$1color: $2 !important;"
  );

  // Everything in ONE <style> block: inlined @font-face first, then CSS rules
  let cssBody = [
    inlinedFontFaces.trim(),
    themeCss,
    fontOverride,
    reinforcedCss,
    fadeUpFix,
    alignmentFix,
  ].filter((s) => s.trim()).join("\n\n");

  // ── Resolve CSS custom properties (var(--xxx)) to actual values ──
  // Systeme.io may not respect :root CSS variable definitions.
  // Extract all --variable definitions, then replace var() references
  // with actual values so the CSS is fully self-contained.
  const cssVars = extractCssVariables(cssBody);
  if (cssVars.size > 0) {
    cssBody = resolveCssVariables(cssBody, cssVars);
    // Also resolve var() in inline styles throughout the HTML
    clean = resolveInlineStyleVars(clean, cssVars);
  }

  parts.push(`<style>\n${cssBody}\n</style>`);

  // HTML content
  if (clean.trim()) {
    parts.push(clean);
  }

  // Build font URL list for JS injection
  const fontUrlList = Array.from(fontUrls).map(u => `'${u.replace(/'/g, "\\'")}'`).join(",");

  // Single unified script — font loading + animations.
  // Font loading: dynamically injects <link> tags into <head> at runtime.
  // This bypasses Systeme.io's CSS stripping — scripts run, so we load fonts via JS.
  // Animation: IntersectionObserver with fade-up class handling.
  parts.push(`<script>
(function() {
  // ── Load Google Fonts via JS (bypasses Systeme.io CSS stripping) ──
  var fontUrls = [${fontUrlList}];
  if (fontUrls.length > 0) {
    var pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);
    var pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    document.head.appendChild(pc2);
    for (var f = 0; f < fontUrls.length; f++) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrls[f];
      document.head.appendChild(link);
    }
  }

  // ── Fade-up animations ──
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
${sourceScripts.length > 0 ? "\n  // ── Source page scripts (FAQ, scroll reveal, etc.) ──\n" + sourceScripts.map(s => `  ${s}`).join("\n\n") : ""}
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
          // Allow bare element selectors (img, body, html, etc.) — they're safe inside .sb-root
          const bareElements = ["img", "body", "html", "a", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "table", "iframe", "video", "button", "input", "label", "span", "div", "section", "nav", "header", "footer", "main", "article", "aside", "figure", "figcaption", "blockquote"];
          if (trimmed && !trimmed.startsWith(".sb-") && !trimmed.startsWith(":root") && !trimmed.startsWith("@") && !bareElements.includes(trimmed)) {
            warnings.push(`Unscoped CSS selector: ${trimmed} (should use .sb- prefix)`);
            break;
          }
        }
      }
    }
  }

  // Check for base64 images (massive size bloat)
  const base64Count = (html.match(/data:image\/[^;]+;base64,/g) || []).length;
  if (base64Count > 0) {
    warnings.push(`Contains ${base64Count} base64-encoded image(s) — these massively inflate file size. Upload images to a host and use URLs instead`);
  }

  // Check HTML size
  const sizeKb = new Blob([html]).size / 1024;
  if (sizeKb > 2000) {
    warnings.push(`HTML size is ${Math.round(sizeKb)}KB — may be slow to load. Systeme.io may truncate or fail on large HTML blocks`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Extract Google Fonts header code for Systeme.io's Header injection point.
 * Generates <link> tags that go in Settings → Tracking → Header.
 * This is more reliable than @font-face inlining inside Raw HTML blocks.
 */
export function extractHeaderFontCode(html: string, overrides?: StyleOverrides): string {
  const fontUrls = new Set<string>();

  // From <link> tags in the HTML
  const linkTags = html.match(/<link[^>]*>/gi) || [];
  for (const l of linkTags) {
    if (/fonts\.googleapis\.com/.test(l)) {
      const href = l.match(/href="([^"]+)"/)?.[1];
      if (href) fontUrls.add(href);
    }
  }

  // From @import declarations in CSS
  const importMatches = html.matchAll(/@import\s+url\(['"]?([^'")]+)['"]?\)/g);
  for (const m of importMatches) {
    if (m[1] && /fonts/.test(m[1])) fontUrls.add(m[1]);
  }

  // From style overrides (theme font)
  if (overrides?.fontFamily) {
    const themeFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(overrides.fontFamily)}:wght@300;400;500;600;700;800&display=swap`;
    fontUrls.add(themeFontUrl);
  }

  if (fontUrls.size === 0) return "";

  const lines: string[] = [
    '<!-- Google Fonts for Section Builder page -->',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  ];

  for (const url of fontUrls) {
    lines.push(`<link href="${url}" rel="stylesheet">`);
  }

  return lines.join("\n");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scope CSS selectors under .sb-root to prevent leaking into Systeme.io.
 * Handles: class selectors, element selectors, combinator selectors.
 * Skips: :root, @keyframes, @font-face, already-scoped .sb- selectors.
 */
function scopeSelectorsUnderRoot(css: string): string {
  // Process CSS rule by rule. Split on } but keep @-rules intact.
  // Strategy: find each "selector { ... }" and prefix the selector.
  return css.replace(
    /([^{}@]+)\{/g,
    (match, selectorBlock) => {
      const trimmed = selectorBlock.trim();
      // Skip already-scoped, :root, and special selectors
      if (!trimmed) return match;
      if (trimmed.startsWith(":root")) return match;
      if (trimmed.startsWith(".sb-root")) return match;
      if (trimmed.startsWith(".sb-")) return match;
      if (trimmed.startsWith("from") || trimmed.startsWith("to") || /^\d+%$/.test(trimmed)) return match; // @keyframes steps
      // Scope each comma-separated selector
      const selectors = trimmed.split(",").map((s: string) => {
        const sel = s.trim();
        if (!sel) return sel;
        if (sel.startsWith(":root")) return sel;
        if (sel.startsWith(".sb-root")) return sel;
        if (sel.startsWith(".sb-")) return sel;
        return `.sb-root ${sel}`;
      });
      // Preserve original whitespace before the {
      const leadingWhitespace = selectorBlock.match(/^(\s*)/)?.[1] || "";
      return `${leadingWhitespace}${selectors.join(", ")} {`;
    }
  );
}

/**
 * Parse :root blocks and extract CSS custom property definitions.
 * Returns a map of --variable-name → value.
 */
function extractCssVariables(css: string): Map<string, string> {
  const vars = new Map<string, string>();
  // Match :root { ... } blocks (may appear multiple times)
  const rootBlockRegex = /:root\s*\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = rootBlockRegex.exec(css)) !== null) {
    const body = match[1]!;
    // Extract --name: value pairs
    const propRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let propMatch: RegExpExecArray | null;
    while ((propMatch = propRegex.exec(body)) !== null) {
      vars.set(propMatch[1]!, propMatch[2]!.trim());
    }
  }
  return vars;
}

/**
 * Resolve all var(--xxx) references in CSS to their actual values.
 * Handles nested vars and fallbacks: var(--x, fallback).
 * Runs multiple passes to resolve vars that reference other vars.
 */
function resolveCssVariables(css: string, vars: Map<string, string>): string {
  let resolved = css;
  // Up to 5 passes to resolve nested variable references
  for (let pass = 0; pass < 5; pass++) {
    const before = resolved;
    resolved = resolved.replace(
      /var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/g,
      (match, name, fallback) => {
        const value = vars.get(name);
        if (value !== undefined) return value;
        if (fallback !== undefined) return fallback.trim();
        return match; // Can't resolve — leave as-is
      }
    );
    if (resolved === before) break; // No more changes
  }
  return resolved;
}

/**
 * Resolve var() references in inline style attributes throughout HTML.
 */
function resolveInlineStyleVars(html: string, vars: Map<string, string>): string {
  return html.replace(
    /style="([^"]*)"/g,
    (match, styleContent) => {
      if (!styleContent.includes("var(")) return match;
      const resolved = resolveCssVariables(styleContent, vars);
      return `style="${resolved}"`;
    }
  );
}
