import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy Google Fonts CSS API requests server-side.
 * Browser fetch() to Google Fonts can fail due to CORS preflight or
 * response format issues. This route fetches server-side with a proper
 * User-Agent to get woff2 @font-face declarations.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
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

    const css = await res.text();
    return new NextResponse(css, {
      headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Font fetch error" }, { status: 500 });
  }
}
