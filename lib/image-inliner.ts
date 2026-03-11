/**
 * Image Inliner — scans HTML for external <img> URLs and converts them
 * to base64 data URIs via the /api/proxy-image endpoint.
 *
 * This "bakes" images into the HTML so they survive export to Systeme.io,
 * download, or any other platform that can't access the original CDN.
 */

/** Check if a src is already a data URI or relative path (skip these) */
function isAlreadyInlined(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("data:")) return true;
  if (src.startsWith("blob:")) return true;
  // Skip placeholder services
  if (src.includes("placehold.co")) return true;
  if (src.includes("placeholder.com")) return true;
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
  tag: string; // "video", "source", "iframe"
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
 * Scan HTML for external images and replace their src with base64 data URIs.
 * Uses DOMParser for safe HTML manipulation.
 *
 * @param html - The HTML string to process
 * @param onProgress - Optional callback: (completed, total) => void
 */
export async function inlineExternalImages(
  html: string,
  onProgress?: (completed: number, total: number) => void
): Promise<InlineResult> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const images = Array.from(doc.querySelectorAll("img"));
  // Also check CSS background-image URLs in inline styles
  const bgElements = Array.from(doc.querySelectorAll("[style]")).filter((el) => {
    const style = el.getAttribute("style") || "";
    return style.includes("background-image") && style.includes("url(");
  });

  // Collect all unique external URLs
  const urlMap = new Map<string, { elements: Element[]; attr: "src" | "bg" }[]>();

  for (const img of images) {
    const src = img.getAttribute("src") || "";
    if (isAlreadyInlined(src)) continue;
    // Must be absolute URL
    if (!src.startsWith("http://") && !src.startsWith("https://")) continue;

    if (!urlMap.has(src)) urlMap.set(src, []);
    urlMap.get(src)!.push({ elements: [img], attr: "src" });
  }

  for (const el of bgElements) {
    const style = el.getAttribute("style") || "";
    const match = style.match(/background-image:\s*url\(['"]?(https?:\/\/[^'")\s]+)['"]?\)/);
    if (!match) continue;
    const url = match[1];
    if (isAlreadyInlined(url)) continue;

    if (!urlMap.has(url)) urlMap.set(url, []);
    urlMap.get(url)!.push({ elements: [el], attr: "bg" });
  }

  const total = urlMap.size;
  let success = 0;
  let failed = 0;
  const skipped = images.length + bgElements.length - total;
  let completed = 0;

  // Fetch all images in parallel (batched to avoid hammering)
  const batchSize = 5;
  const urls = Array.from(urlMap.keys());

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((url) => proxyFetchImage(url)));

    for (let j = 0; j < batch.length; j++) {
      const url = batch[j];
      const dataUri = results[j];
      const entries = urlMap.get(url)!;

      if (dataUri) {
        for (const entry of entries) {
          for (const el of entry.elements) {
            if (entry.attr === "src") {
              el.setAttribute("src", dataUri);
            } else {
              const style = el.getAttribute("style") || "";
              el.setAttribute(
                "style",
                style.replace(
                  /background-image:\s*url\(['"]?https?:\/\/[^'")\s]+['"]?\)/,
                  `background-image: url('${dataUri}')`
                )
              );
            }
          }
        }
        success++;
      } else {
        failed++;
      }

      completed++;
      onProgress?.(completed, total);
    }
  }

  // Detect external videos that can't be inlined (too large for base64)
  const externalVideos: ExternalVideo[] = [];
  const seenVideoUrls = new Set<string>();

  // <video src="..."> and <video><source src="..."></video>
  for (const video of Array.from(doc.querySelectorAll("video"))) {
    const src = video.getAttribute("src") || "";
    if (src.startsWith("http") && !seenVideoUrls.has(src)) {
      seenVideoUrls.add(src);
      externalVideos.push({ url: src, tag: "video" });
    }
    for (const source of Array.from(video.querySelectorAll("source"))) {
      const ssrc = source.getAttribute("src") || "";
      if (ssrc.startsWith("http") && !seenVideoUrls.has(ssrc)) {
        seenVideoUrls.add(ssrc);
        externalVideos.push({ url: ssrc, tag: "source" });
      }
    }
  }

  // <iframe> with non-YouTube/Vimeo/Loom src (those are fine as embeds)
  for (const iframe of Array.from(doc.querySelectorAll("iframe"))) {
    const src = iframe.getAttribute("src") || "";
    if (!src.startsWith("http")) continue;
    const isPublicEmbed =
      src.includes("youtube.com") ||
      src.includes("youtu.be") ||
      src.includes("vimeo.com") ||
      src.includes("loom.com") ||
      src.includes("wistia.com");
    if (!isPublicEmbed && !seenVideoUrls.has(src)) {
      seenVideoUrls.add(src);
      externalVideos.push({ url: src, tag: "iframe" });
    }
  }

  // Also detect background video in inline styles (rare but possible)
  // e.g. a div with a video poster or custom video players

  // Serialize back to HTML string
  const resultHtml = doc.body.innerHTML;

  return { html: resultHtml, total, success, failed, skipped, externalVideos };
}
