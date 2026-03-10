import Anthropic from "@anthropic-ai/sdk";
import { templateMap } from "@/lib/templates";
import { PAGE_SYSTEM_PROMPT, buildPageSectionPrompt } from "@/lib/ai-prompt";
import { designSystemMap } from "@/lib/design-systems";

// Simple in-memory rate limiter
const requests: number[] = [];
const RATE_LIMIT = 30;
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

export async function POST(req: Request) {
  if (!checkRateLimit()) {
    return Response.json({ error: "Rate limited. Try again in a minute." }, { status: 429 });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return Response.json({ error: "Valid Anthropic API key required" }, { status: 401 });
  }

  let body: {
    sectionType?: string;
    sectionIndex?: number;
    totalSections?: number;
    previousSections?: string[];
    productName?: string;
    description?: string;
    audience?: string;
    price?: string;
    language?: string;
    designSystemId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    sectionType,
    sectionIndex = 0,
    totalSections = 1,
    previousSections = [],
    productName = "Product",
    description,
    audience,
    price,
    language = "en",
    designSystemId,
  } = body;

  if (!sectionType) {
    return Response.json({ error: "sectionType required" }, { status: 400 });
  }

  const template = templateMap[sectionType];
  const referenceHtml = template?.defaultHtml || "";
  const aiPromptHints = template?.aiPromptHints || "";

  const designSystem = designSystemId ? designSystemMap[designSystemId] : undefined;

  const client = new Anthropic({ apiKey });

  const userPrompt = buildPageSectionPrompt({
    sectionType,
    sectionIndex,
    totalSections,
    previousSections,
    productName,
    description,
    audience,
    price,
    language,
    referenceHtml,
    aiPromptHints,
    designSystem,
  });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: PAGE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

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
