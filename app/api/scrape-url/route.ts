/**
 * URL content extractor — fetches a page and returns content + raw HTML.
 * Uses Firecrawl API (env key) for JS-rendered pages, falls back to basic fetch.
 *
 * Returns both `content` (markdown text) and `html` (raw page HTML for design analysis).
 */

// Simple in-memory rate limiter
var requests: number[] = [];
var RATE_LIMIT = 10;
var WINDOW_MS = 60_000;

function checkRateLimit(): boolean {
  var now = Date.now();
  while (requests.length > 0 && requests[0]! < now - WINDOW_MS) {
    requests.shift();
  }
  if (requests.length >= RATE_LIMIT) return false;
  requests.push(now);
  return true;
}

interface ExtractResult {
  markdown: string;
  html: string;
  title?: string;
}

async function extractWithFirecrawl(url: string, apiKey: string): Promise<ExtractResult> {
  var res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "html"],
      waitFor: 3000,
      timeout: 20000,
    }),
  });

  if (!res.ok) {
    var err = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      throw new Error("Invalid Firecrawl API key — check FIRECRAWL_API_KEY in .env.local");
    }
    if (res.status === 402) {
      throw new Error("Firecrawl credits exhausted — upgrade at firecrawl.dev");
    }
    throw new Error((err as { error?: string }).error || `Firecrawl error: ${res.status}`);
  }

  var data = await res.json() as {
    success: boolean;
    data?: { markdown?: string; html?: string; metadata?: { title?: string } };
    error?: string;
  };

  if (!data.success || (!data.data?.markdown && !data.data?.html)) {
    throw new Error(data.error || "Firecrawl returned no content");
  }

  return {
    markdown: data.data.markdown || "",
    html: data.data.html || "",
    title: data.data.metadata?.title,
  };
}

async function extractWithFetch(url: string): Promise<ExtractResult> {
  var controller = new AbortController();
  var timeout = setTimeout(() => controller.abort(), 15000);

  var res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml",
    },
    signal: controller.signal,
    redirect: "follow",
  });

  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  var raw = await res.text();

  // Extract title
  var titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  var title = titleMatch ? titleMatch[1]!.trim() : undefined;

  // Build markdown from HTML
  var text = raw;
  text = text.replace(/<head[\s\S]*?<\/head>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");

  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

  return { markdown: text, html: raw, title };
}

export async function POST(req: Request) {
  if (!checkRateLimit()) {
    return Response.json({ error: "Rate limited. Try again in a minute." }, { status: 429 });
  }

  var body: { url?: string };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  var { url } = body;

  if (!url || !url.trim()) {
    return Response.json({ error: "URL required" }, { status: 400 });
  }

  var parsedUrl: URL;
  try {
    parsedUrl = new URL(url.trim());
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return Response.json({ error: "Invalid URL — must start with http:// or https://" }, { status: 400 });
  }

  try {
    var firecrawlKey = process.env.FIRECRAWL_API_KEY || "";
    var result: ExtractResult;
    var method: string;

    if (firecrawlKey) {
      result = await extractWithFirecrawl(parsedUrl.toString(), firecrawlKey);
      method = "firecrawl";
    } else {
      result = await extractWithFetch(parsedUrl.toString());
      method = "fetch";
    }

    if (result.markdown.length < 30 && result.html.length < 100) {
      return Response.json({
        content: result.markdown,
        html: result.html,
        title: result.title,
        method,
        warning: "Very little content found. The page may need JavaScript to render. Add FIRECRAWL_API_KEY to .env.local for full rendering.",
      });
    }

    return Response.json({
      content: result.markdown,
      html: result.html,
      size: result.markdown.length,
      htmlSize: result.html.length,
      url: parsedUrl.toString(),
      title: result.title,
      method,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return Response.json({ error: "Request timed out (15s)." }, { status: 504 });
    }
    var msg = err instanceof Error ? err.message : "Failed to fetch URL";
    return Response.json({ error: msg }, { status: 502 });
  }
}
