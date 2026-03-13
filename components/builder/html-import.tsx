"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, CheckCircle2, AlertCircle, Globe, FileCode } from "lucide-react";
import { toast } from "sonner";
import { buildSectionsFromParsed } from "./paste-generator";
import type { PageSection } from "@/lib/page-builder/types";
import type { ParsedPage } from "@/lib/content-types";

interface HtmlImportProps {
  apiKey: string;
  activePreset: string | null;
  onGenerated: (sections: PageSection[]) => void;
  onParsedContent: (parsed: ParsedPage) => void;
}

type Stage = "input" | "fetching" | "parsing" | "complete" | "error";

const LOADING_MESSAGES = [
  "Dissecting this page like a design surgeon.",
  "Extracting the good parts. Ignoring the cookie banner.",
  "Mapping sections. Your funnel is showing.",
  "Teaching AI to reverse-engineer a sales page.",
  "Separating hero from hero worship.",
  "Reading between the div tags.",
  "Analyzing layout. Judging font choices (silently).",
];

export function HtmlImport({ apiKey, activePreset, onGenerated, onParsedContent }: HtmlImportProps) {
  const [rawContent, setRawContent] = useState("");
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [jokeIndex, setJokeIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startJokes = () => {
    setJokeIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));
    intervalRef.current = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
  };

  const stopJokes = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      toast.error("Please upload an .html file");
      return;
    }
    var reader = new FileReader();
    reader.onload = (ev) => {
      var content = ev.target?.result as string;
      // Extract <style> tags from <head> before stripping it
      var headMatch = content.match(/<head[\s\S]*?<\/head>/i);
      var headStyles = "";
      if (headMatch) {
        var styleMatches = headMatch[0].match(/<style[\s\S]*?<\/style>/gi);
        if (styleMatches) {
          headStyles = styleMatches.join("\n");
        }
      }
      // Strip HTML wrapper, keep body content
      var cleaned = content
        .replace(/<!DOCTYPE[^>]*>/gi, "")
        .replace(/<html[^>]*>/gi, "")
        .replace(/<\/html>/gi, "")
        .replace(/<head[\s\S]*?<\/head>/gi, "")
        .replace(/<body[^>]*>/gi, "")
        .replace(/<\/body>/gi, "")
        .trim();
      // Prepend preserved styles so icons and layout survive
      if (headStyles) {
        cleaned = headStyles + "\n" + cleaned;
      }
      setRawContent(cleaned);
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  };

  const fetchUrl = async () => {
    if (!url.trim()) { toast.error("Enter a URL"); return; }

    setStage("fetching");
    startJokes();
    setErrorMsg("");

    try {
      var res = await fetch("/api/scrape-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        var errData = await res.json().catch(() => ({ error: "Failed to fetch URL" }));
        throw new Error(errData.error || "Failed to fetch URL");
      }

      var data = await res.json();
      // Scrape endpoint returns markdown in `content` field
      setRawContent(data.content || "");
      setStage("input");
      stopJokes();
      if (data.warning) {
        toast.warning(data.warning);
      } else {
        toast.success(`Page fetched — ${data.title || url} (${Math.round((data.size || 0) / 1024)}KB)`);
      }
    } catch (err: unknown) {
      stopJokes();
      setStage("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to fetch URL");
    }
  };

  /**
   * Parse content using the same pipeline as Paste Copy mode:
   * /api/parse-copy → structured JSON → buildSectionsFromParsed()
   */
  const parseContent = async () => {
    if (!rawContent.trim()) { toast.error("No content to parse"); return; }
    if (!apiKey) { toast.error("Enter your Anthropic API key first"); return; }

    setStage("parsing");
    startJokes();
    setErrorMsg("");

    try {
      var res = await fetch("/api/parse-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({ rawCopy: rawContent.trim(), language: "en" }),
      });

      if (!res.ok) {
        var errBody = await res.text();
        var errObj: { error?: string };
        try { errObj = JSON.parse(errBody); } catch { errObj = { error: `Server error (${res.status})` }; }
        throw new Error(errObj.error || `Server error (${res.status})`);
      }

      // Stream-collect the response
      var reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      var decoder = new TextDecoder();
      var fullText = "";
      while (true) {
        var { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      // Strip markdown code fences
      var jsonText = fullText.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
      }

      var parsed: ParsedPage | null = null;
      try {
        parsed = JSON.parse(jsonText) as ParsedPage;
      } catch {
        // Try to recover truncated JSON
        var lastBracket = jsonText.lastIndexOf("}");
        while (lastBracket > 0 && !parsed) {
          var attempt = jsonText.slice(0, lastBracket + 1);
          var openBraces = (attempt.match(/\{/g) || []).length - (attempt.match(/\}/g) || []).length;
          var openBrackets = (attempt.match(/\[/g) || []).length - (attempt.match(/\]/g) || []).length;
          attempt += "]".repeat(Math.max(0, openBrackets)) + "}".repeat(Math.max(0, openBraces));
          try {
            parsed = JSON.parse(attempt) as ParsedPage;
            toast.warning("Response was truncated — some sections may be missing");
          } catch {
            lastBracket = jsonText.lastIndexOf("}", lastBracket - 1);
          }
        }
        if (!parsed) throw new Error("AI returned invalid JSON. Try again.");
      }

      if (!parsed.sections || parsed.sections.length === 0) {
        throw new Error("No sections detected in the content");
      }

      // Cache parsed content for design system switching
      onParsedContent(parsed);

      // Build sections from templates using active design system
      var designSystemId = activePreset || "default";
      var sections = await buildSectionsFromParsed(parsed, designSystemId);

      stopJokes();
      setStage("complete");
      onGenerated(sections);
      toast.success(`Imported ${sections.length} sections from page`);
    } catch (err: unknown) {
      stopJokes();
      setStage("error");
      setErrorMsg(err instanceof Error ? err.message : "Parse failed");
    }
  };

  const reset = () => {
    setStage("input");
    setRawContent("");
    setUrl("");
    setErrorMsg("");
    stopJokes();
  };

  return (
    <div className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a7a72]">
        Import Page
      </div>

      {/* URL input — visible when no content loaded */}
      {!rawContent && stage !== "complete" && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Globe className="size-3 text-[#7a7a72]" />
            <span className="font-mono text-[10px] font-medium text-[#1c1c1c]">
              Paste a page URL
            </span>
          </div>
          <div className="flex gap-1.5">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/sales-page"
              className="flex-1 px-3 py-2 font-mono text-xs border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none"
              onKeyDown={(e) => { if (e.key === "Enter") fetchUrl(); }}
            />
            <button
              onClick={fetchUrl}
              disabled={stage === "fetching" || !url.trim()}
              className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2d5650] disabled:opacity-40 disabled:cursor-not-allowed ed-transition shrink-0"
            >
              {stage === "fetching" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Fetch"
              )}
            </button>
          </div>

          <p className="font-mono text-[9px] text-[#7a7a72]">
            Works best with static pages. For JS-heavy pages (Systeme.io, ClickFunnels), add FIRECRAWL_API_KEY to .env.local or paste content below.
          </p>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 border-t border-[#e5e4de]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7a7a72]">or</span>
            <div className="flex-1 border-t border-[#e5e4de]" />
          </div>

          {/* Upload file */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 font-mono text-[10px] uppercase tracking-[0.1em] border border-dashed border-[#e5e4de] text-[#7a7a72] hover:text-[#1c1c1c] hover:border-[#3d7068] ed-transition flex items-center justify-center gap-1.5"
          >
            <Upload className="size-3" />
            Upload .html file
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 border-t border-[#e5e4de]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7a7a72]">or</span>
            <div className="flex-1 border-t border-[#e5e4de]" />
          </div>

          {/* Paste directly */}
          <div className="flex items-center gap-1.5 mb-1">
            <FileCode className="size-3 text-[#7a7a72]" />
            <span className="font-mono text-[10px] font-medium text-[#1c1c1c]">
              Paste page content or HTML directly
            </span>
          </div>
        </div>
      )}

      {/* Paste textarea — always visible */}
      <div className="relative">
        <textarea
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          placeholder="Paste page content, HTML, or markdown here..."
          rows={rawContent ? 6 : 3}
          className="w-full px-3 py-2 font-mono text-[11px] leading-relaxed border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none resize-none"
        />
        {rawContent && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-[#3d7068] bg-[#f7f6f2] px-1.5 py-0.5">
              {Math.round(rawContent.length / 1024)}KB
            </span>
            <button
              onClick={() => { setRawContent(""); setStage("input"); }}
              className="font-mono text-[9px] text-[#7a7a72] hover:text-[#c45040] bg-[#f7f6f2] px-1.5 py-0.5"
            >
              clear
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Parse button */}
      {rawContent && stage !== "complete" && (
        <button
          onClick={parseContent}
          disabled={stage === "parsing" || !apiKey}
          className="w-full py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] bg-[#1c1c1c] text-[#f7f6f2] hover:bg-[#3d7068] disabled:opacity-40 disabled:cursor-not-allowed ed-transition"
        >
          {stage === "parsing" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-3 animate-spin" />
              Building sections...
            </span>
          ) : (
            "Build Sections"
          )}
        </button>
      )}

      {/* Loading */}
      {(stage === "fetching" || stage === "parsing") && (
        <p className="font-mono text-[10px] text-[#7a7a72] italic text-center">
          {LOADING_MESSAGES[jokeIndex]}
        </p>
      )}

      {/* Success */}
      {stage === "complete" && (
        <div className="flex items-start gap-2 p-3 bg-[#f0faf4] border border-[#86efac]">
          <CheckCircle2 className="size-4 text-[#16a34a] mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-[11px] text-[#166534]">
              Sections imported. Edit below, swap design systems, then export.
            </p>
            <button
              onClick={reset}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#3d7068] hover:underline mt-1"
            >
              Import another
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {stage === "error" && (
        <>
          <div className="flex items-start gap-2 p-3 bg-[#fef2f2] border border-[#fca5a5]">
            <AlertCircle className="size-4 text-[#dc2626] mt-0.5 shrink-0" />
            <div>
              <p className="font-mono text-[11px] text-[#991b1b]">{errorMsg}</p>
              <button
                onClick={() => setStage("input")}
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#3d7068] hover:underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>

          {/* Bookmarklet fallback — shown after fetch errors */}
          <details className="group">
            <summary className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7a7a72] cursor-pointer hover:text-[#3d7068]">
              Page behind login? Use the bookmarklet instead
            </summary>
            <div className="mt-2 p-3 bg-[#f7f6f2] border border-[#e5e4de] space-y-2">
              <p className="font-mono text-[9px] text-[#7a7a72]">
                1. Drag this button to your bookmarks bar:
              </p>
              <a
                href={`javascript:void((function(){var c=document.body.cloneNode(true);c.querySelectorAll('script,iframe,.cookie-banner,[data-radix-portal],noscript').forEach(function(e){e.remove()});var s=[];document.querySelectorAll('style').forEach(function(e){s.push(e.outerHTML)});var h=s.join('\\n')+'\\n'+c.innerHTML;navigator.clipboard.writeText(h).then(function(){alert('HTML copied! Go to Section Builder and paste it.')})})())`}
                onClick={(e) => e.preventDefault()}
                className="inline-block px-3 py-1.5 font-mono text-[10px] bg-[#3d7068] text-[#f7f6f2] cursor-grab"
                draggable
              >
                Copy Page HTML
              </a>
              <p className="font-mono text-[9px] text-[#7a7a72]">
                2. Open the page you want to import<br />
                3. Click the bookmarklet in your bookmarks bar<br />
                4. Come back here and paste
              </p>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
