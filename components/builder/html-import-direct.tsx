"use client";

import { useState, useRef } from "react";
import { Upload, FileCode } from "lucide-react";
import { toast } from "sonner";

interface HtmlImportDirectProps {
  onImport: (html: string) => void;
}

export function HtmlImportDirect({ onImport }: HtmlImportDirectProps) {
  const [rawHtml, setRawHtml] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var content = ev.target?.result as string;
      // Extract styles from <head> before stripping wrapper
      var headMatch = content.match(/<head[\s\S]*?<\/head>/i);
      var headStyles = "";
      if (headMatch) {
        var styleMatches = headMatch[0].match(/<style[\s\S]*?<\/style>/gi);
        if (styleMatches) headStyles = styleMatches.join("\n");
        // Also grab <link> tags (fonts etc.)
        var linkMatches = headMatch[0].match(/<link[^>]*>/gi);
        if (linkMatches) headStyles = linkMatches.join("\n") + "\n" + headStyles;
      }
      // Strip document wrapper, keep content
      var cleaned = content
        .replace(/<!DOCTYPE[^>]*>/gi, "")
        .replace(/<html[^>]*>/gi, "")
        .replace(/<\/html>/gi, "")
        .replace(/<head[\s\S]*?<\/head>/gi, "")
        .replace(/<body[^>]*>/gi, "")
        .replace(/<\/body>/gi, "")
        .trim();
      if (headStyles) cleaned = headStyles + "\n" + cleaned;
      setRawHtml(cleaned);
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  };

  const doImport = () => {
    if (!rawHtml.trim()) {
      toast.error("Paste or upload HTML first");
      return;
    }
    onImport(rawHtml.trim());
    toast.success("HTML imported — check the preview");
  };

  return (
    <div>
      <h3 className="mono-label mb-3">Import HTML</h3>
      <p className="font-mono text-[10px] text-[#7a7a72] mb-3">
        Paste raw HTML from Lovable, Section Builder export, or any source. Styles, icons, and layout are preserved exactly as-is.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] border border-dashed border-[#e5e4de] text-[#7a7a72] hover:text-[#1c1c1c] hover:border-[#3d7068] ed-transition flex items-center justify-center gap-1.5"
        >
          <Upload className="size-3" />
          Upload .html file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-[#e5e4de]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7a7a72]">or paste</span>
          <div className="flex-1 border-t border-[#e5e4de]" />
        </div>

        <textarea
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          placeholder="Paste your HTML here..."
          rows={rawHtml ? 8 : 4}
          className="w-full px-3 py-2 font-mono text-[11px] leading-relaxed border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none resize-y"
        />

        {rawHtml && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#3d7068]">
              {Math.round(rawHtml.length / 1024)}KB
            </span>
            <button
              onClick={() => setRawHtml("")}
              className="font-mono text-[9px] text-[#7a7a72] hover:text-[#c45040]"
            >
              clear
            </button>
          </div>
        )}

        <button
          onClick={doImport}
          disabled={!rawHtml.trim()}
          className="w-full flex items-center justify-center gap-2 h-10 bg-[#1c1c1c] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#3d7068] disabled:opacity-40 disabled:cursor-not-allowed ed-transition"
        >
          <FileCode className="size-4" />
          Import HTML
        </button>
      </div>
    </div>
  );
}
