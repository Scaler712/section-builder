export function sanitizeHtml(html: string): string {
  let cleaned = html;

  // Strip everything before the first HTML tag if AI added commentary
  // Look for first <style, <div, <section, or <!-- SECTION marker
  const firstTagMatch = cleaned.match(/(<style[\s>]|<div[\s>]|<section[\s>]|<!-- SECTION)/i);
  if (firstTagMatch && firstTagMatch.index && firstTagMatch.index > 0) {
    cleaned = cleaned.slice(firstTagMatch.index);
  }

  // Strip trailing non-HTML content (AI explanation after closing tags)
  const lastClosingTag = Math.max(
    cleaned.lastIndexOf("</div>"),
    cleaned.lastIndexOf("</style>"),
    cleaned.lastIndexOf("</script>"),
    cleaned.lastIndexOf("</section>"),
  );
  if (lastClosingTag > 0) {
    const tagEnd = cleaned.indexOf(">", lastClosingTag) + 1;
    if (tagEnd > 0) {
      cleaned = cleaned.slice(0, tagEnd);
    }
  }

  // Strip markdown code fences (```html ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/^```html?\s*\n?/gim, "").replace(/\n?```\s*$/gim, "");

  // Remove prohibited Systeme.io tags
  cleaned = cleaned.replace(/<\/?(html|head|body|footer)(\s[^>]*)?>/gi, "");

  // Replace let/const with var in script blocks for browser compat
  cleaned = cleaned.replace(
    /(<script[\s\S]*?>)([\s\S]*?)(<\/script>)/gi,
    (_, open: string, code: string, close: string) => {
      const fixed = code
        .replace(/\blet\s+/g, "var ")
        .replace(/\bconst\s+/g, "var ");
      return open + fixed + close;
    }
  );

  return cleaned.trim();
}
