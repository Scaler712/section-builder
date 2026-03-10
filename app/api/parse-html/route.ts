import Anthropic from "@anthropic-ai/sdk";

// Simple in-memory rate limiter
const requests: number[] = [];
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

function checkRateLimit(): boolean {
  const now = Date.now();
  while (requests.length > 0 && requests[0]! < now - WINDOW_MS) {
    requests.shift();
  }
  if (requests.length >= RATE_LIMIT) return false;
  requests.push(now);
  return true;
}

const PARSE_HTML_SYSTEM = `You are an expert HTML parser for sales/landing pages. Your job is to take raw HTML and split it into logical sections.

You MUST:
1. Read the HTML structure carefully
2. Identify logical sections by analyzing: <section> tags, <!-- SECTION --> comments, major div containers, semantic landmarks
3. Classify each section as one of these types:
   hero, pain-points, solution-transition, benefits-grid, testimonials, pricing, faq, cta, guarantee, about-bio, video-embed, countdown-timer, navigation, footer, custom
4. Extract each section's HTML verbatim (preserve all styles, classes, and structure)
5. Return ONLY valid JSON

## Section Classification Guide
- hero: Main headline area, value proposition, primary CTA. Usually the first major content block.
- navigation: Header/navbar — skip this if it's minimal (just a logo)
- pain-points: Problems the audience faces. "Are you tired of...", frustration-focused content
- solution-transition: Introduction of the product as the answer. "Introducing...", "That's why..."
- benefits-grid: Key benefits, features, what's included. Cards, grids, icon lists
- testimonials: Customer quotes, reviews, case studies, social proof, star ratings
- pricing: Pricing tiers, packages, investment options, price tables
- faq: Questions and answers, accordion-style content
- cta: Final call-to-action, urgency section, "last chance" blocks
- guarantee: Risk reversal, money-back guarantee, trust badges
- about-bio: About the creator/company, credentials, story, team
- video-embed: Video players, demo sections, walkthrough areas
- countdown-timer: Urgency timers, deadline counters
- footer: Page footer with links, copyright, etc — skip unless significant
- custom: Anything that doesn't fit the above categories

## Output JSON Format

Return an array of section objects:

[
  {
    "type": "hero",
    "label": "Hero Section",
    "html": "<div class=\\"hero\\">...full section HTML here...</div>"
  },
  {
    "type": "benefits-grid",
    "label": "Key Benefits",
    "html": "<div class=\\"benefits\\">...full section HTML here...</div>"
  }
]

## Rules
- Preserve ALL original HTML, CSS, and inline styles. Do not modify the code.
- Include <style> blocks that belong to each section WITH that section's HTML
- If there's a global <style> block at the top, include it with the first section
- Skip empty or purely structural wrapper divs — focus on content-bearing sections
- Order sections as they appear in the source HTML
- Each section's HTML should be self-contained and renderable on its own
- If the HTML is a single section (no clear divisions), return it as one "custom" section
- Strip <script> tags unless they're essential for animations (IntersectionObserver, scroll effects)
- Remove tracking scripts, analytics, chat widgets, cookie banners
- Return ONLY the JSON array. No markdown, no code fences, no explanations.`;

export async function POST(req: Request) {
  if (!checkRateLimit()) {
    return Response.json({ error: "Rate limited. Try again in a minute." }, { status: 429 });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return Response.json({ error: "Valid Anthropic API key required" }, { status: 401 });
  }

  var body: { html?: string };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { html } = body;

  if (!html || html.trim().length < 20) {
    return Response.json({ error: "HTML content too short" }, { status: 400 });
  }

  // Truncate very large HTML to avoid token limits
  const maxChars = 120000;
  const trimmedHtml = html.length > maxChars
    ? html.slice(0, maxChars) + "\n<!-- truncated -->"
    : html;

  const client = new Anthropic({ apiKey });

  // Stream to keep connection alive
  const stream = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 16000,
    system: PARSE_HTML_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Parse this HTML into sections:\n\n${trimmedHtml}`,
      },
    ],
    stream: true,
  });

  // Collect streamed text and pipe to response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
