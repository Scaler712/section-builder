"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ClipboardPaste, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { loadTemplate, loadRegistry } from "@/lib/template-registry";
import { injectContent } from "@/lib/content-injector";
import type { PageSection } from "@/lib/page-builder/types";
import type { ParsedPage, SectionContent } from "@/lib/content-types";

interface PasteGeneratorProps {
  apiKey: string;
  activePreset: string | null;
  onGenerated: (sections: PageSection[]) => void;
  onParsedContent: (parsed: ParsedPage) => void;
  onRawHtmlImport?: (html: string) => void;
}

type Stage = "input" | "analyzing" | "building" | "complete" | "error";

const languages = [
  { value: "en", label: "English" },
  { value: "lv", label: "Latvian" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ru", label: "Russian" },
];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  "pain-points": "Pain Points",
  "solution-transition": "Solution",
  "benefits-grid": "Benefits",
  testimonials: "Testimonials",
  pricing: "Pricing",
  faq: "FAQ",
  cta: "Final CTA",
  guarantee: "Guarantee",
  "about-bio": "About",
  "video-embed": "Video",
};

const LOADING_JOKES = [
  "Convincing AI your landing page isn't spam.",
  "Running your copy through the bullshit detector.",
  "Counting how many times you said 'revolutionary'.",
  "Your competitors are watching. Move faster.",
  "Converting caffeine-fueled rants into sections.",
  "Parsing your genius. Or delusion. We'll see.",
  "AI is reading. AI is judging. AI is formatting.",
  "Briefly questioning all your font choices.",
  "Teaching a robot to appreciate your prose.",
  "Extracting buzzwords at terminal velocity.",
  "Looking for the CTA you forgot to write.",
  "Don't worry, we only steal your best ideas.",
  "Somewhere, a designer just felt a disturbance.",
  "Making your copy look more expensive than it is.",
  "The AI has opinions about your headline. Strong ones.",
  "Searching for the part where you explain the price.",
];

function LoadingBar({ stage }: { stage: "analyzing" | "building" }) {
  const [jokeIndex, setJokeIndex] = useState(() => Math.floor(Math.random() * LOADING_JOKES.length));
  const [progress, setProgress] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const jokeInterval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % LOADING_JOKES.length);
    }, 3500);
    return () => clearInterval(jokeInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      // Asymptotic progress — never reaches 100% until actually done
      var pct = stage === "building" ? 85 + Math.min(14, (elapsed / 200)) : Math.min(80, (elapsed / 400));
      setProgress(pct);
    }, 100);
    return () => clearInterval(progressInterval);
  }, [stage]);

  return (
    <div className="space-y-2">
      <div className="w-full h-1.5 bg-[#efede8] overflow-hidden">
        <div
          className="h-full bg-[#3d7068] ed-transition"
          style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
        />
      </div>
      <p className="font-mono text-[10px] text-[#7a7a72] italic min-h-[16px]">
        {LOADING_JOKES[jokeIndex]}
      </p>
    </div>
  );
}

export function PasteGenerator({ apiKey, activePreset, onGenerated, onParsedContent, onRawHtmlImport }: PasteGeneratorProps) {
  const [rawCopy, setRawCopy] = useState("");
  const [language, setLanguage] = useState("en");
  const [stage, setStage] = useState<Stage>("input");
  const [stageDetail, setStageDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Detect if pasted content is pre-styled HTML (has <style> blocks + HTML structure)
  const isHtmlContent = rawCopy.length > 50 &&
    /<style[\s>]/i.test(rawCopy) &&
    (/<div[\s>]/i.test(rawCopy) || /<section[\s>]/i.test(rawCopy));

  const handleRawHtmlImport = () => {
    if (!onRawHtmlImport || !rawCopy.trim()) return;
    onRawHtmlImport(rawCopy.trim());
    toast.success("Raw HTML imported — preview it in the right panel");
    setStage("complete");
    setTimeout(() => setStage("input"), 2000);
  };

  const generate = async () => {
    if (!rawCopy.trim() || rawCopy.trim().length < 10) {
      toast.error("Paste at least 10 characters of copy");
      return;
    }
    if (!apiKey || !apiKey.startsWith("sk-ant-")) {
      toast.error("Enter a valid Anthropic API key first");
      return;
    }

    const designSystemId = activePreset || "default";

    setStage("analyzing");
    setStageDetail("Analyzing copy structure...");
    setErrorMessage("");

    try {
      // ── Stage 1: Parse copy into structured JSON (streamed) ──
      console.log("[paste] Starting parse request...");

      const res = await fetch("/api/parse-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          rawCopy: rawCopy.trim(),
          language,
        }),
      });

      console.log("[paste] Response status:", res.status);

      if (!res.ok) {
        const errBody = await res.text();
        console.error("[paste] Error response:", errBody);
        var errObj: { error?: string };
        try {
          errObj = JSON.parse(errBody);
        } catch {
          errObj = { error: `Server error (${res.status})` };
        }
        throw new Error(errObj.error || `Server error (${res.status})`);
      }

      // Stream-collect the response (keeps connection alive, no timeout)
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      var fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        // Update progress with character count
        setStageDetail(`Analyzing copy structure... (${fullText.length} chars)`);
      }

      console.log("[paste] Stream complete, length:", fullText.length);

      // Strip markdown code fences if present
      var jsonText = fullText.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
      }

      var parsed: ParsedPage | null = null;
      try {
        parsed = JSON.parse(jsonText) as ParsedPage;
      } catch {
        // Try to salvage truncated JSON — find the last complete section object
        console.warn("[paste] JSON truncated, attempting recovery...");
        var lastBracket = jsonText.lastIndexOf("}");
        while (lastBracket > 0 && !parsed) {
          var attempt = jsonText.slice(0, lastBracket + 1);
          // Close any open arrays/objects
          var openBraces = (attempt.match(/\{/g) || []).length - (attempt.match(/\}/g) || []).length;
          var openBrackets = (attempt.match(/\[/g) || []).length - (attempt.match(/\]/g) || []).length;
          attempt += "]".repeat(Math.max(0, openBrackets)) + "}".repeat(Math.max(0, openBraces));
          try {
            parsed = JSON.parse(attempt) as ParsedPage;
            console.log("[paste] Recovered truncated JSON with", parsed.sections?.length, "sections");
            toast.warning("Response was truncated — some sections may be missing");
          } catch {
            lastBracket = jsonText.lastIndexOf("}", lastBracket - 1);
          }
        }
        if (!parsed) {
          console.error("[paste] Failed to parse or recover JSON:", jsonText.slice(0, 500));
          throw new Error("AI returned invalid JSON. Try again.");
        }
      }

      if (!parsed.sections || parsed.sections.length === 0) {
        throw new Error("No sections detected in the copy");
      }

      console.log("[paste] Parsed", parsed.sections.length, "sections:", parsed.sections.map((s) => s.type));

      // Cache parsed content for design system switching
      onParsedContent(parsed);

      // ── Stage 2: Build sections from templates ──
      setStage("building");
      setStageDetail(`Building ${parsed.sections.length} sections...`);

      const sections = await buildSectionsFromParsed(parsed, designSystemId);

      console.log("[paste] Built", sections.length, "sections");

      // ── Stage 3: Complete ──
      onGenerated(sections);
      setStage("complete");
      toast.success(`Built ${sections.length} section${sections.length > 1 ? "s" : ""} from your copy`);

      // Reset to input after a short delay
      setTimeout(() => setStage("input"), 2000);
    } catch (err) {
      console.error("[paste] Error:", err);
      const msg = err instanceof Error ? err.message : "Generation failed";
      setStage("error");
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const isLoading = stage === "analyzing" || stage === "building";

  return (
    <div>
      <h3 className="mono-label mb-3">Paste & Format Copy</h3>
      <div className="space-y-3">
        <div>
          <label className="mono-label mb-1.5 block">Sales Copy</label>
          <textarea
            value={rawCopy}
            onChange={(e) => setRawCopy(e.target.value)}
            placeholder="Paste your sales page copy here. Headlines, body text, bullet points, testimonials, pricing — everything. The AI will parse it into structured sections and apply your chosen design system."
            className="w-full min-h-[300px] px-3 py-3 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4] resize-y"
            disabled={isLoading}
          />
          <div className="text-right font-mono text-[10px] text-[#7a7a72] mt-1">
            {rawCopy.length} chars
          </div>
        </div>

        <div>
          <label className="mono-label mb-1.5 block">Language</label>
          <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
            <SelectTrigger className="h-9 text-xs font-mono bg-transparent border-[#e5e4de] focus:border-[#3d7068]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value} className="text-xs font-mono">
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show what's blocking the button */}
        {!isLoading && stage === "input" && (!apiKey || rawCopy.trim().length < 10) && (
          <p className="font-mono text-[10px] text-[#b5a36a]">
            {!apiKey ? "Enter your Anthropic API key above to generate" : `Need at least 10 characters (${rawCopy.trim().length}/10)`}
          </p>
        )}

        {/* Raw HTML import — shown when pasted content looks like HTML */}
        {isHtmlContent && onRawHtmlImport && !isLoading && stage !== "complete" && (
          <button
            onClick={handleRawHtmlImport}
            className="w-full flex items-center justify-center gap-2 h-10 bg-[#1c1c1c] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#3d7068] ed-transition mb-2"
          >
            <Code2 className="size-4" />
            Import as Raw HTML (keep original styles)
          </button>
        )}

        <button
          onClick={generate}
          disabled={isLoading || rawCopy.trim().length < 10 || !apiKey}
          className="w-full flex items-center justify-center gap-2 h-10 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#2f5a53] disabled:opacity-40 disabled:cursor-not-allowed ed-transition"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : stage === "complete" ? (
            <CheckCircle2 className="size-4" />
          ) : stage === "error" ? (
            <AlertCircle className="size-4" />
          ) : (
            <ClipboardPaste className="size-4" />
          )}
          {isLoading ? stageDetail : stage === "complete" ? "Done!" : stage === "error" ? "Retry" : "Generate Page"}
        </button>

        {isLoading && <LoadingBar stage={stage as "analyzing" | "building"} />}

        {stage === "error" && errorMessage && (
          <p className="font-mono text-[10px] text-red-600">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Build PageSection[] from parsed content + design system templates.
 * Loads each template, injects the parsed content, returns sections.
 */
export async function buildSectionsFromParsed(
  parsed: ParsedPage,
  designSystemId: string
): Promise<PageSection[]> {
  // Ensure registry is loaded
  await loadRegistry();

  const sections: PageSection[] = [];
  const skipped: string[] = [];

  for (var i = 0; i < parsed.sections.length; i++) {
    const content = parsed.sections[i]!;
    const sectionType = content.type;

    // Load template for this section type + design system
    var templateHtml = await loadTemplate(designSystemId, sectionType);

    // Fallback to default design system if template not found
    if (!templateHtml && designSystemId !== "default") {
      templateHtml = await loadTemplate("default", sectionType);
    }

    if (!templateHtml) {
      skipped.push(sectionType);
      continue;
    }

    // Inject parsed content into template
    const populatedHtml = injectContent(templateHtml, content);

    sections.push({
      id: `${sectionType}-${Date.now()}-${i}`,
      type: sectionType,
      label: SECTION_LABELS[sectionType] || sectionType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      html: populatedHtml,
      order: i,
    });
  }

  if (skipped.length > 0) {
    toast.warning(`Skipped ${skipped.length} section${skipped.length > 1 ? "s" : ""}: ${skipped.join(", ")} (no template found)`);
  }

  return sections;
}
