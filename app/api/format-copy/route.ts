import Anthropic from "@anthropic-ai/sdk";
import { FORMAT_SYSTEM_PROMPT, buildFormatCopyPrompt } from "@/lib/ai-prompt";
import { designSystemMap } from "@/lib/design-systems";

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

export async function POST(req: Request) {
  if (!checkRateLimit()) {
    return Response.json({ error: "Rate limited. Try again in a minute." }, { status: 429 });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return Response.json({ error: "Valid Anthropic API key required" }, { status: 401 });
  }

  let body: {
    rawCopy?: string;
    designSystemId?: string;
    language?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { rawCopy, designSystemId, language = "en" } = body;

  if (!rawCopy || rawCopy.trim().length < 10) {
    return Response.json({ error: "Paste at least 10 characters of copy" }, { status: 400 });
  }

  const designSystem = designSystemId ? designSystemMap[designSystemId] : undefined;

  const client = new Anthropic({ apiKey });

  const userPrompt = buildFormatCopyPrompt({
    rawCopy,
    designSystem,
    language,
  });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8192,
    system: FORMAT_SYSTEM_PROMPT,
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
