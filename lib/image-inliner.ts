/**
 * Image Inliner — scans HTML for external <img> URLs and converts them
 * to base64 data URIs via the /api/proxy-image endpoint.
 *
 * IMPORTANT: Uses DOMParser ONLY to extract URLs (read-only).
 * Actual replacement is done via string replace on the original HTML
 * to avoid DOMParser mangling the document structure (stripping styles, etc).
 */

/** Check if a src should be skipped */
function shouldSkip(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("data:")) return true;
  if (src.startsWith("blob:")) return true;
  if (src.includes("placehold.co")) return true;
  if (src.includes("placeholder.com")) return true;
  if (!src.startsWith("http://") && !src.startsWith("https://")) return true;
  return false;
}

/** Fetch a single image via the proxy and return its data URI */
async function proxyFetchImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.dataUri || null;
  } catch {
    return null;
  }
}

export interface ExternalVideo {
  url: string;
  tag: string;
}

export interface InlineResult {
  html: string;
  total: number;
  success: number;
  failed: number;
  skipped: number;
  externalVideos: ExternalVideo[];
}

/**
 * Extract unique external image URLs from HTML using DOMParser (read-only).
 * Returns deduplicated list of URLs.
 */
function extractImageUrls(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const urls = new Set<string>();

  // <img src="...">
  for (const img of Array.from(doc.querySelectorAll("img"))) {
    const src = img.getAttribute("src") || "";
    if (!shouldSkip(src)) urls.add(src);
  }

  // background-image: url(...)
  for (const el of Array.from(doc.querySelectorAll("[style]"))) {
    const style = el.getAttribute("style") || "";
    const match = style.match(/background-image:\s*url\(['"]?(https?:\/\/[^'")\s]+)['"]?\)/);
    if (match && !shouldSkip(match[1])) urls.add(match[1]);
  }

  return Array.from(urls);
}

/**
 * Extract external video URLs from HTML using DOMParser (read-only).
 */
function extractVideoUrls(html: string): ExternalVideo[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const videos: ExternalVideo[] = [];
  const seen = new Set<string>();

  for (const video of Array.from(doc.querySelectorAll("video"))) {
    const src = video.getAttribute("src") || "";
    if (src.startsWith("http") && !seen.has(src)) {
      seen.add(src);
      videos.push({ url: src, tag: "video" });
    }
    for (const source of Array.from(video.querySelectorAll("source"))) {
      const ssrc = source.getAttribute("src") || "";
      if (ssrc.startsWith("http") && !seen.has(ssrc)) {
        seen.add(ssrc);
        videos.push({ url: ssrc, tag: "source" });
      }
    }
  }

  for (const iframe of Array.from(doc.querySelectorAll("iframe"))) {
    const src = iframe.getAttribute("src") || "";
    if (!src.startsWith("http")) continue;
    const isPublicEmbed =
      src.includes("youtube.com") ||
      src.includes("youtu.be") ||
      src.includes("vimeo.com") ||
      src.includes("loom.com") ||
      src.includes("wistia.com");
    if (!isPublicEmbed && !seen.has(src)) {
      seen.add(src);
      videos.push({ url: src, tag: "iframe" });
    }
  }

  return videos;
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scan HTML for external images, fetch them via proxy, and replace URLs
 * with base64 data URIs using pure string replacement (no DOM serialization).
 */
export async function inlineExternalImages(
  html: string,
  onProgress?: (completed: number, total: number) => void
): Promise<InlineResult> {
  const urls = extractImageUrls(html);
  const externalVideos = extractVideoUrls(html);

  const total = urls.length;
  let success = 0;
  let failed = 0;
  let completed = 0;
  let resultHtml = html;

  // Fetch in parallel batches
  const batchSize = 5;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((url) => proxyFetchImage(url)));

    for (let j = 0; j < batch.length; j++) {
      const url = batch[j];
      const dataUri = results[j];

      if (dataUri) {
        // Replace ALL occurrences of this URL in the raw HTML string.
        // This preserves the entire document structure — no DOM serialization.
        const escaped = escapeRegex(url);
        resultHtml = resultHtml.replace(new RegExp(escaped, "g"), dataUri);
        success++;
      } else {
        failed++;
      }

      completed++;
      onProgress?.(completed, total);
    }
  }

  return {
    html: resultHtml,
    total,
    success,
    failed,
    skipped: 0,
    externalVideos,
  };
}
