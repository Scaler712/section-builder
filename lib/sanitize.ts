export function sanitizeHtml(html: string): string {
  // Strip markdown code fences if AI wraps output
  let cleaned = html.replace(/^```html?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  // Remove prohibited tags
  cleaned = cleaned.replace(/<\/?(html|head|body|footer)(\s[^>]*)?>/gi, "");
  // Replace let/const with var in script blocks
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
