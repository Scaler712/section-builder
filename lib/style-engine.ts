import type { StyleOverrides } from "@/lib/page-builder/types";
import { buildCssVarBlock } from "@/lib/css-vars";

// Re-export for backward compat
export { AVAILABLE_FONTS } from "@/lib/css-vars";

/**
 * Apply style overrides to HTML by stripping any existing <style id="sb-theme">
 * block and prepending a fresh one built from the overrides.
 * Also consolidates duplicate per-section IntersectionObserver scripts into one.
 *
 * No regex color replacement. The HTML uses CSS custom properties (var(--sb-*)),
 * and the theme block declares their values. Changing overrides = changing the block.
 */
export function applyStyleOverrides(html: string, overrides: StyleOverrides): string {
  if (!html.trim()) return html;

  // Strip existing theme block
  let result = html.replace(/<style id="sb-theme">[\s\S]*?<\/style>\s*/g, "");

  // Prepend fresh theme block
  result = buildCssVarBlock(overrides) + "\n" + result;

  // Consolidate duplicate IntersectionObserver scripts into a single one.
  // Each section template has its own script targeting .sb-{type} .fade-up,
  // but they all do the same thing. Replace all with one unified observer.
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const hasScripts = scriptRegex.test(result);
  if (hasScripts) {
    result = result.replace(/<script[^>]*>[\s\S]*?<\/script>\s*/gi, "");
    result += `\n<script>
(function() {
  function init() {
    var els = document.querySelectorAll('.fade-up');
    if (!els.length || !('IntersectionObserver' in window)) {
      for (var j = 0; j < els.length; j++) els[j].classList.add('visible');
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '50px' });
    for (var k = 0; k < els.length; k++) observer.observe(els[k]);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 10);
  }
})();
</script>`;
  }

  return result;
}
