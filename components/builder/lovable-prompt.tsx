"use client";

import { useState, useRef } from "react";
import { Loader2, Copy, CheckCircle2, Globe, Sparkles, Palette } from "lucide-react";
import { toast } from "sonner";

interface LovablePromptProps {
  apiKey: string;
}

type LovableMode = "copy" | "clone";

var LOADING_COPY = [
  "Reading your copy like a conversion therapist.",
  "Picking the perfect design system for this offer.",
  "Matching fonts to your funnel's personality.",
  "Making sure it doesn't look like AI slop.",
  "Architecting sections that actually convert.",
  "Building a prompt that Lovable won't mess up.",
];

var LOADING_CLONE = [
  "Reverse-engineering this page's DNA.",
  "Extracting colors, fonts, and layout secrets.",
  "Mapping every section and visual pattern.",
  "Stealing the design. Legally.",
  "Analyzing shadows, gradients, and animations.",
  "Turning CSS spaghetti into a clean blueprint.",
];

export function LovablePrompt({ apiKey }: LovablePromptProps) {
  var [mode, setMode] = useState<LovableMode>("copy");
  var [salesCopy, setSalesCopy] = useState("");
  var [notes, setNotes] = useState("");
  var [url, setUrl] = useState("");
  var [cloneHtml, setCloneHtml] = useState("");
  var [cloneTitle, setCloneTitle] = useState("");
  var [generatedPrompt, setGeneratedPrompt] = useState("");
  var [designPicked, setDesignPicked] = useState("");
  var [copied, setCopied] = useState(false);
  var [loading, setLoading] = useState(false);
  var [fetching, setFetching] = useState(false);
  var [jokeIndex, setJokeIndex] = useState(0);
  var jokeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  var jokes = mode === "clone" ? LOADING_CLONE : LOADING_COPY;

  var startJokes = () => {
    setJokeIndex(Math.floor(Math.random() * jokes.length));
    jokeRef.current = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % jokes.length);
    }, 3000);
  };

  var stopJokes = () => {
    if (jokeRef.current) clearInterval(jokeRef.current);
  };

  // Fetch URL — fills sales copy (copy mode) or captures HTML (clone mode)
  var fetchUrl = async () => {
    if (!url.trim()) { toast.error("Enter a URL"); return; }
    setFetching(true);
    try {
      var res = await fetch("/api/scrape-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        var err = await res.json().catch(() => ({ error: "Failed to fetch" }));
        throw new Error(err.error || "Failed to fetch URL");
      }
      var data = await res.json();

      if (mode === "clone") {
        // Clone mode: we need the raw HTML for design analysis
        var html = data.html || "";
        if (html.length < 100) {
          toast.warning("Very little HTML found — page may need JS rendering");
        } else {
          toast.success(`Fetched design: ${data.title || url} (${Math.round((data.htmlSize || html.length) / 1024)}KB HTML)`);
        }
        setCloneHtml(html);
        setCloneTitle(data.title || url);
      } else {
        // Copy mode: we need the text content
        var content = data.content || "";
        if (content.length < 30) {
          toast.warning("Very little content found — page may need JS rendering");
        } else {
          toast.success(`Fetched copy: ${data.title || url} (${Math.round((data.size || content.length) / 1024)}KB)`);
        }
        setSalesCopy(content);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch URL");
    } finally {
      setFetching(false);
    }
  };

  // Generate prompt — different endpoint per mode
  var generate = async () => {
    if (!apiKey) {
      toast.error("Enter your Anthropic API key first");
      return;
    }

    if (mode === "copy" && (!salesCopy.trim() || salesCopy.trim().length < 50)) {
      toast.error("Paste at least 50 characters of sales copy");
      return;
    }

    if (mode === "clone" && (!cloneHtml || cloneHtml.length < 100)) {
      toast.error("Fetch a URL first — need the page HTML for design cloning");
      return;
    }

    setLoading(true);
    setGeneratedPrompt("");
    setDesignPicked("");
    startJokes();

    try {
      var endpoint = mode === "clone" ? "/api/clone-page-prompt" : "/api/generate-lovable-prompt";
      var payload = mode === "clone"
        ? { html: cloneHtml, url: url.trim() || undefined, notes: notes.trim() || undefined }
        : { salesCopy: salesCopy.trim(), notes: notes.trim() || undefined };

      var res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        var errBody = await res.text();
        var errObj: { error?: string };
        try { errObj = JSON.parse(errBody); } catch { errObj = { error: `Error (${res.status})` }; }
        throw new Error(errObj.error || `Error (${res.status})`);
      }

      var reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      var decoder = new TextDecoder();
      var fullText = "";
      while (true) {
        var { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      // Extract design system marker if present (from copy mode)
      var designMatch = fullText.match(/<!-- DESIGN_SYSTEM:(\S+) -->\n?/);
      if (designMatch) {
        setDesignPicked(designMatch[1]!);
        fullText = fullText.replace(designMatch[0], "");
      }

      setGeneratedPrompt(fullText.trim());
      stopJokes();
      toast.success(mode === "clone" ? "Clone prompt ready — copy and paste into Lovable" : "Lovable prompt generated — copy and paste it");
    } catch (err: unknown) {
      stopJokes();
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  var copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success("Copied — paste into Lovable");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — select all manually");
    }
  };

  var canGenerate = mode === "copy"
    ? salesCopy.trim().length >= 50 && !!apiKey
    : cloneHtml.length >= 100 && !!apiKey;

  return (
    <div className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a7a72]">
        Lovable Prompt Builder
      </div>

      {/* Mode toggle */}
      <div className="flex gap-0.5 bg-[#efede8] p-0.5">
        <button
          onClick={() => { setMode("copy"); setGeneratedPrompt(""); }}
          className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ed-transition flex items-center justify-center gap-1.5 ${
            mode === "copy" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
          }`}
        >
          <Sparkles className="size-3" />
          From Copy
        </button>
        <button
          onClick={() => { setMode("clone"); setGeneratedPrompt(""); }}
          className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ed-transition flex items-center justify-center gap-1.5 ${
            mode === "clone" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
          }`}
        >
          <Palette className="size-3" />
          Clone Page
        </button>
      </div>

      {/* Mode description */}
      <p className="font-mono text-[9px] text-[#7a7a72] leading-relaxed">
        {mode === "copy"
          ? "Paste sales copy → Claude Opus picks the perfect design system, colors, fonts → generates a Lovable prompt."
          : "Give any URL → Claude Opus reverse-engineers the full design (colors, fonts, layout, animations) → generates a Lovable prompt to recreate it with your own content."
        }
      </p>

      {/* URL fetch — both modes */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Globe className="size-3 text-[#7a7a72]" />
          <span className="font-mono text-[10px] font-medium text-[#1c1c1c]">
            {mode === "clone" ? "Page URL to clone *" : "Fetch from URL (optional)"}
          </span>
        </div>
        <div className="flex gap-1.5">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://the500funnel.com/"
            className="flex-1 px-3 py-2 font-mono text-xs border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none"
            onKeyDown={(e) => { if (e.key === "Enter") fetchUrl(); }}
          />
          <button
            onClick={fetchUrl}
            disabled={fetching || !url.trim()}
            className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2d5650] disabled:opacity-40 disabled:cursor-not-allowed ed-transition shrink-0"
          >
            {fetching ? <Loader2 className="size-3 animate-spin" /> : "Fetch"}
          </button>
        </div>
      </div>

      {/* Clone mode: show captured page status */}
      {mode === "clone" && cloneHtml && (
        <div className="flex items-center gap-2 p-2 bg-[#f0faf4] border border-[#86efac]">
          <CheckCircle2 className="size-3 text-[#16a34a] shrink-0" />
          <span className="font-mono text-[10px] text-[#166534] flex-1 truncate">
            {cloneTitle} — {Math.round(cloneHtml.length / 1024)}KB captured
          </span>
          <button
            onClick={() => { setCloneHtml(""); setCloneTitle(""); }}
            className="font-mono text-[9px] text-[#7a7a72] hover:text-[#c45040] shrink-0"
          >
            clear
          </button>
        </div>
      )}

      {/* Copy mode: sales copy paste */}
      {mode === "copy" && (
        <div>
          <label className="font-mono text-[10px] font-medium text-[#1c1c1c] mb-1 block">
            Sales Page Copy *
          </label>
          <div className="relative">
            <textarea
              value={salesCopy}
              onChange={(e) => setSalesCopy(e.target.value)}
              placeholder="Paste your full sales page copy here — headlines, body, bullets, testimonials, pricing, FAQ, everything. Claude analyzes the tone and picks the perfect design."
              rows={salesCopy ? 8 : 5}
              className="w-full px-3 py-2 font-mono text-[11px] leading-relaxed border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none resize-y"
            />
            {salesCopy && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-[#3d7068] bg-[#f7f6f2] px-1.5 py-0.5">
                  {Math.round(salesCopy.length / 1024)}KB
                </span>
                <button
                  onClick={() => setSalesCopy("")}
                  className="font-mono text-[9px] text-[#7a7a72] hover:text-[#c45040] bg-[#f7f6f2] px-1.5 py-0.5"
                >
                  clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes — both modes */}
      <div>
        <label className="font-mono text-[10px] font-medium text-[#1c1c1c] mb-1 block">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={mode === "clone"
            ? "e.g. \"Use my brand colors: #e94560, make it darker, language: English\""
            : "e.g. \"Brand: KNOX, dark luxury feel, language: English\""
          }
          rows={2}
          className="w-full px-3 py-2 font-mono text-[11px] leading-relaxed border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none resize-none"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={loading || !canGenerate}
        className="w-full py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] bg-[#1c1c1c] text-[#f7f6f2] hover:bg-[#3d7068] disabled:opacity-40 disabled:cursor-not-allowed ed-transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            {mode === "clone" ? "Analyzing design..." : "Building prompt..."}
          </>
        ) : (
          <>
            {mode === "clone" ? <Palette className="size-3" /> : <Sparkles className="size-3" />}
            {mode === "clone" ? "Generate Clone Prompt" : "Generate Lovable Prompt"}
          </>
        )}
      </button>

      {/* Loading */}
      {loading && (
        <p className="font-mono text-[10px] text-[#7a7a72] italic text-center">
          {jokes[jokeIndex]}
        </p>
      )}

      {/* Blocker hint */}
      {!loading && !generatedPrompt && !canGenerate && (
        <p className="font-mono text-[9px] text-[#b5a36a]">
          {!apiKey
            ? "Enter your Anthropic API key above"
            : mode === "copy"
              ? `Need at least 50 characters of copy (${salesCopy.trim().length}/50)`
              : "Fetch a URL first to capture the page design"
          }
        </p>
      )}

      {/* Output */}
      {generatedPrompt && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a7a72]">
                {mode === "clone" ? "Clone Prompt Ready" : "Prompt Ready"}
              </span>
              {designPicked && (
                <span className="font-mono text-[9px] text-[#3d7068] bg-[#f0faf4] px-1.5 py-0.5 border border-[#86efac]">
                  {designPicked}
                </span>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2d5650] ed-transition"
            >
              {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <textarea
            readOnly
            value={generatedPrompt}
            rows={14}
            className="w-full px-3 py-2 font-mono text-[10px] leading-relaxed border border-[#e5e4de] bg-[#f7f6f2] text-[#1c1c1c] resize-y"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />

          <div className="p-2.5 bg-[#f7f6f2] border border-[#e5e4de] space-y-1">
            <p className="font-mono text-[10px] font-medium text-[#1c1c1c]">Next steps:</p>
            <ol className="font-mono text-[9px] text-[#7a7a72] space-y-0.5 list-decimal list-inside">
              <li>Copy the prompt → paste into Lovable</li>
              {mode === "clone" && <li>Replace the [REPLACE] markers with your own copy</li>}
              <li>When Lovable finishes → ask: &quot;Turn this into a single HTML file&quot;</li>
              <li>Copy the page source → Paste Copy tab here → edit → export to Systeme.io</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
