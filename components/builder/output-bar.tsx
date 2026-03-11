"use client";

import { useState } from "react";
import { Copy, Trash2, Monitor, Tablet, Smartphone, Code, CheckCircle, AlertTriangle, Download, ExternalLink, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { optimizeForSystemeio, validateSystemeioHtml } from "@/lib/export";
import { inlineExternalImages, hasLovableUploads } from "@/lib/image-inliner";
import type { StyleOverrides, PageSection } from "@/lib/page-builder/types";

type Device = "desktop" | "tablet" | "mobile";

interface OutputBarProps {
  html: string;
  sections?: PageSection[];
  device: Device;
  onDeviceChange: (d: Device) => void;
  onClear: () => void;
  showCode: boolean;
  onToggleCode: () => void;
  styleOverrides?: StyleOverrides;
  getExportHtml?: () => string;
  checkoutUrl?: string;
  onHtmlChange?: (html: string) => void;
  lovableUrl?: string;
  onLovableUrlChange?: (url: string) => void;
}

/**
 * Strip data URIs from HTML to reduce size (replace with placeholder).
 * Also compress whitespace.
 */
function compressHtml(html: string): string {
  return html
    // Replace base64 data URIs with placeholder
    .replace(/src="data:image\/[^"]+"/g, 'src="https://placehold.co/800x500/1c1c1c/ffffff?text=Image"')
    // Compress whitespace
    .replace(/\n\s*\n/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Build a Lovable prompt from page data.
 * Sends the actual HTML so Lovable replicates the exact design.
 */
function buildLovablePrompt(html: string, _sections: PageSection[], overrides?: StyleOverrides, exportHtml?: string): string {
  const lines: string[] = [];

  lines.push("IMPORTANT: Replicate this landing page EXACTLY as a React + Tailwind app. Do NOT redesign or reinterpret — match the original pixel-for-pixel.\n");

  lines.push("## Critical Rules");
  lines.push("- Copy ALL text content word-for-word, no rewording");
  lines.push("- Match the EXACT layout structure (flexbox directions, grid columns, element positioning)");
  lines.push("- Match ALL colors exactly using the hex values from the HTML");
  lines.push("- Match font sizes, weights, and families exactly");
  lines.push("- Match spacing, padding, margins, and border-radius exactly");
  lines.push("- Match background colors (dark sections stay dark, light stay light)");
  lines.push("- Keep the same visual hierarchy and component arrangement");
  lines.push("- Do NOT add a navbar/header unless one exists in the HTML");
  lines.push("- Do NOT center layouts that are left-aligned in the original");
  lines.push("- Make it fully responsive\n");

  // Design tokens for reference
  if (overrides) {
    lines.push("## Design Tokens (use these exact values)");
    lines.push(`Headings: ${overrides.headingColor} | Body: ${overrides.bodyColor} | Muted: ${overrides.mutedColor}`);
    lines.push(`Accent: ${overrides.accentColor} | Highlight BG: ${overrides.highlightBg} | CTA BG: ${overrides.ctaBg}`);
    lines.push(`Font: ${overrides.fontFamily} | Spacing: ${overrides.spacing} | Card radius: ${overrides.cardRadius} | Button radius: ${overrides.buttonRadius}\n`);
  }

  // The actual HTML — this is the source of truth
  const sourceHtml = exportHtml || html;
  const compressed = compressHtml(sourceHtml);

  // Lovable allows up to 50k chars — keep HTML under 40k to leave room for instructions
  const maxHtmlChars = 40000;
  const trimmedHtml = compressed.length > maxHtmlChars
    ? compressed.slice(0, maxHtmlChars) + "\n<!-- truncated -->"
    : compressed;

  lines.push("## Source HTML (replicate this exactly)\n");
  lines.push("```html");
  lines.push(trimmedHtml);
  lines.push("```");

  return lines.join("\n");
}

export function OutputBar({ html, sections = [], device, onDeviceChange, onClear, showCode, onToggleCode, styleOverrides, getExportHtml, checkoutUrl, onHtmlChange, lovableUrl = "", onLovableUrlChange }: OutputBarProps) {
  const [showValidation, setShowValidation] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; warnings: string[] } | null>(null);
  const [baking, setBaking] = useState(false);
  const [videoWarnings, setVideoWarnings] = useState<string[]>([]);
  const [showLovableInput, setShowLovableInput] = useState(false);

  const setLovableUrl = (url: string) => onLovableUrlChange?.(url);

  const needsLovableUrl = html.trim() && hasLovableUploads(html);

  const bakeImages = async () => {
    if (!html.trim() || !onHtmlChange) {
      toast.error("Nothing to bake");
      return;
    }
    // If there are /lovable-uploads/ paths and no URL provided, prompt
    if (needsLovableUrl && !lovableUrl.trim()) {
      setShowLovableInput(true);
      toast.error("Paste your Lovable preview URL first — needed to resolve /lovable-uploads/ images");
      return;
    }
    setBaking(true);
    setVideoWarnings([]);
    const toastId = toast.loading("Baking images... 0/?");
    try {
      const result = await inlineExternalImages(
        html,
        (done, total) => {
          toast.loading(`Baking images... ${done}/${total}`, { id: toastId });
        },
        lovableUrl.trim() || undefined
      );
      if (result.total === 0 && result.externalVideos.length === 0) {
        toast.dismiss(toastId);
        toast.info("No external images found to bake");
      } else {
        onHtmlChange(result.html);
        toast.dismiss(toastId);
        const parts: string[] = [];
        if (result.total > 0) parts.push(`Baked ${result.success}/${result.total} images`);
        if (result.failed > 0) parts.push(`${result.failed} failed`);
        if (result.externalVideos.length > 0) parts.push(`${result.externalVideos.length} video(s) need attention`);
        toast.success(parts.join(" · "));

        // Surface video warnings
        if (result.externalVideos.length > 0) {
          setVideoWarnings(
            result.externalVideos.map((v) => `<${v.tag}> → ${v.url}`)
          );
        }
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to bake images");
    }
    setBaking(false);
  };

  const copy = async () => {
    if (!html.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    const exportHtml = getExportHtml ? getExportHtml() : html;
    await navigator.clipboard.writeText(exportHtml);
    toast.success("HTML copied to clipboard");
  };

  const copyForSystemeio = async () => {
    if (!html.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    if (!styleOverrides) {
      await copy();
      return;
    }

    const optimized = await optimizeForSystemeio(html, styleOverrides, checkoutUrl);
    const result = validateSystemeioHtml(optimized);
    setValidation(result);

    await navigator.clipboard.writeText(optimized);

    if (result.valid) {
      toast.success("Optimized HTML copied for Systeme.io");
      setShowValidation(false);
    } else {
      setShowValidation(true);
      toast.warning(`Copied with ${result.warnings.length} warning(s)`);
    }
  };

  const devices: { key: Device; icon: React.ReactNode; label: string }[] = [
    { key: "mobile", icon: <Smartphone className="size-4" />, label: "Mobile (375px)" },
    { key: "tablet", icon: <Tablet className="size-4" />, label: "Tablet (768px)" },
    { key: "desktop", icon: <Monitor className="size-4" />, label: "Desktop (100%)" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e5e4de] bg-[#f7f6f2]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copy}
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border-[#e5e4de] bg-transparent hover:bg-[#3d7068] hover:text-[#f7f6f2] hover:border-[#3d7068] ed-transition"
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">Copy HTML</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyForSystemeio}
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border-[#e5e4de] bg-transparent hover:bg-[#3d7068] hover:text-[#f7f6f2] hover:border-[#3d7068] ed-transition"
          >
            <CheckCircle className="size-3.5" />
            <span className="hidden sm:inline">Systeme.io</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!html.trim()) { toast.error("Nothing to download"); return; }
              const exportHtml = getExportHtml ? getExportHtml() : html;
              const fullPage = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Landing Page</title>\n</head>\n<body style="margin:0;padding:0">\n${exportHtml}\n</body>\n</html>`;
              const blob = new Blob([fullPage], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `landing-page-${new Date().toISOString().slice(0, 10)}.html`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("HTML file downloaded");
            }}
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border-[#e5e4de] bg-transparent hover:bg-[#3d7068] hover:text-[#f7f6f2] hover:border-[#3d7068] ed-transition"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!html.trim()) {
                toast.error("Nothing to send — build a page first");
                return;
              }
              const exportHtml = getExportHtml ? getExportHtml() : undefined;
              const prompt = buildLovablePrompt(html, sections, styleOverrides, exportHtml);
              const encoded = encodeURIComponent(prompt);
              // Check URL fragment length — browsers handle fragments client-side
              // but very long URLs can still fail in some browsers
              if (encoded.length > 100000) {
                toast.error("Page too large for Lovable URL — try with fewer sections");
                return;
              }
              const url = `https://lovable.dev/?autosubmit=true#prompt=${encoded}`;
              window.open(url, "_blank");
              toast.success("Opening Lovable...");
            }}
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border-[#e5e4de] bg-transparent hover:bg-[#ec4899] hover:text-white hover:border-[#ec4899] ed-transition"
          >
            <ExternalLink className="size-3.5" />
            <span className="hidden sm:inline">Lovable</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={bakeImages}
            disabled={baking || !html.trim()}
            title="Download external images and embed them as base64 — fixes Lovable CDN images that break on export"
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border-[#e5e4de] bg-transparent hover:bg-[#f59e0b] hover:text-white hover:border-[#f59e0b] ed-transition disabled:opacity-40"
          >
            <ImageDown className="size-3.5" />
            <span className="hidden sm:inline">{baking ? "Baking..." : "Bake Images"}</span>
          </Button>
          <button
            onClick={onToggleCode}
            title={showCode ? "Hide code editor" : "Show code editor"}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
              showCode
                ? "bg-[#3d7068] text-[#f7f6f2]"
                : "text-[#7a7a72] hover:text-[#1c1c1c] hover:bg-[#efede8]"
            }`}
          >
            <Code className="size-3.5" />
            Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline font-mono text-[9px] uppercase tracking-[0.2em] text-[#7a7a72]">
            Infoverse Funnel Designs
          </span>
          <div className="flex items-center gap-0.5">
            {devices.map((d) => (
              <button
                key={d.key}
                onClick={() => onDeviceChange(d.key)}
                title={d.label}
                className={`p-2 rounded-sm ed-transition ${
                  device === d.key
                    ? "bg-[#3d7068] text-[#f7f6f2]"
                    : "text-[#7a7a72] hover:text-[#1c1c1c] hover:bg-[#efede8]"
                }`}
              >
                {d.icon}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a7a72] hover:text-[#c45040] ed-transition"
        >
          <Trash2 className="size-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Lovable URL input — shown when /lovable-uploads/ paths detected */}
      {(needsLovableUrl || showLovableInput) && (
        <div className="px-5 py-2 border-b border-[#e5e4de] bg-[#fdf4ff]">
          <div className="flex items-center gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a7a72] whitespace-nowrap">
              Lovable URL
            </div>
            <input
              type="text"
              value={lovableUrl}
              onChange={(e) => setLovableUrl(e.target.value)}
              placeholder="https://your-project.lovable.app"
              className="flex-1 h-7 px-2 font-mono text-[11px] bg-white border border-[#e5e4de] focus:border-[#ec4899] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
            />
            <span className="font-mono text-[9px] text-[#7a7a72] whitespace-nowrap">
              needed for /lovable-uploads/ images
            </span>
          </div>
        </div>
      )}

      {/* Validation warnings */}
      {showValidation && validation && !validation.valid && (
        <div className="px-5 py-2 border-b border-[#e5e4de] bg-[#fff8e1]">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-[#E8B931] mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a7a72] mb-1">
                Systeme.io Warnings
              </div>
              <ul className="space-y-0.5">
                {validation.warnings.map((w, i) => (
                  <li key={i} className="font-mono text-[11px] text-[#3A3A3A]">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowValidation(false)}
              className="font-mono text-[10px] text-[#7a7a72] hover:text-[#1c1c1c]"
            >
              dismiss
            </button>
          </div>
        </div>
      )}

      {/* Video warnings from bake */}
      {videoWarnings.length > 0 && (
        <div className="px-5 py-2 border-b border-[#e5e4de] bg-[#fef3f2]">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-[#c45040] mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a7a72] mb-1">
                External Videos Detected — re-host or replace these manually
              </div>
              <ul className="space-y-0.5">
                {videoWarnings.map((w, i) => (
                  <li key={i} className="font-mono text-[11px] text-[#3A3A3A] break-all">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setVideoWarnings([])}
              className="font-mono text-[10px] text-[#7a7a72] hover:text-[#1c1c1c]"
            >
              dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
