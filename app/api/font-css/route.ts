import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy Google Fonts CSS API requests server-side.
 * Browser fetch() to Google Fonts can fail due to CORS preflight or
 * response format issues. This route fetches server-side with a proper
 * User-Agent to get woff2 @font-face declarations.
 *
 * ?inline=true  — also fetches the woff2 font files and embeds them
 *                  as base64 data URIs, making fonts fully self-contained.
 *                  This is needed for Systeme.io Raw HTML blocks which
 *                  block external font loading.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const inline = req.nextUrl.searchParams.get("inline") === "true";

  if (!url || !url.startsWith("https://fonts.googleapis.com/")) {
    return NextResponse.json({ error: "Invalid font URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Modern User-Agent so Google returns woff2 format
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Font fetch failed" }, { status: 502 });
    }

    let css = await res.text();

    if (inline) {
      // Extract all font file URLs and replace with base64 data URIs
      const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
      const fontUrls = new Set<string>();
      let m: RegExpExecArray | null;
      while ((m = fontUrlRegex.exec(css)) !== null) {
        fontUrls.add(m[1]);
      }

      // Fetch all font files in parallel
      const entries = await Promise.all(
        Array.from(fontUrls).map(async (fontFileUrl) => {
          try {
            const fontRes = await fetch(fontFileUrl);
            if (!fontRes.ok) return { url: fontFileUrl, dataUri: null };
            const buffer = await fontRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            // Detect format from URL
            const isWoff2 = fontFileUrl.includes(".woff2") || fontFileUrl.includes("woff2");
            const mime = isWoff2 ? "font/woff2" : "font/woff";
            return { url: fontFileUrl, dataUri: `data:${mime};base64,${base64}` };
          } catch {
            return { url: fontFileUrl, dataUri: null };
          }
        })
      );

      // Replace URLs with data URIs in the CSS
      for (const { url: fontFileUrl, dataUri } of entries) {
        if (dataUri) {
          css = css.replaceAll(`url(${fontFileUrl})`, `url(${dataUri})`);
        }
      }
    }

    return new NextResponse(css, {
      headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Font fetch error" }, { status: 500 });
  }
}
