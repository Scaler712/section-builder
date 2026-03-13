"use client";

import { useMemo, useState } from "react";
import { Scissors, Copy, ChevronDown, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { optimizeForSystemeio } from "@/lib/export";
import type { StyleOverrides } from "@/lib/page-builder/types";

interface DetectedSection {
  index: number;
  label: string;
  html: string;
}

interface SectionSplitterProps {
  html: string;
  onHtmlChange: (html: string) => void;
  styleOverrides?: StyleOverrides;
  checkoutUrl?: string;
}

/** Detect section boundaries in HTML */
function detectSections(html: string): DetectedSection[] {
  if (!html.trim()) return [];

  // Try splitting by <section> tags first
  const sectionRegex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
  const sections: DetectedSection[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = sectionRegex.exec(html)) !== null) {
    const fullMatch = match[0]!;
    const opening = fullMatch.match(/<section[^>]*>/i)?.[0] || "<section>";

    // Extract label from id, class, or comment
    let label = `Section ${index + 1}`;
    const idMatch = opening.match(/id="([^"]+)"/);
    const classMatch = opening.match(/class="([^"]+)"/);

    if (idMatch) {
      label = idMatch[1]!.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    } else if (classMatch) {
      // Use the most descriptive class
      const cls = classMatch[1]!;
      const descriptive = cls.match(/(section-\w+|[\w]+-\w+)/);
      if (descriptive) {
        label = descriptive[1]!.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    // Extract first heading text for a more descriptive label
    const headingMatch = fullMatch.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    if (headingMatch) {
      const headingText = headingMatch[1]!.replace(/<[^>]*>/g, "").trim();
      if (headingText && headingText.length <= 50) {
        label = headingText;
      } else if (headingText) {
        label = headingText.slice(0, 47) + "...";
      }
    }

    sections.push({ index: index++, label, html: fullMatch });
  }

  // If no <section> tags found, try splitting by <!-- SECTION: --> comments
  if (sections.length === 0) {
    const commentRegex = /<!-- SECTION:\s*(\S+)\s*-->/g;
    const parts = html.split(commentRegex);
    // parts: [before, name1, html1, name2, html2, ...]
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i += 2) {
        const name = parts[i]!;
        const content = parts[i + 1] || "";
        const label = name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        sections.push({
          index: index++,
          label,
          html: `<!-- SECTION: ${name} -->\n${content}`,
        });
      }
    }
  }

  // If still nothing, treat entire HTML as one section
  if (sections.length === 0) {
    sections.push({ index: 0, label: "Full Page", html });
  }

  return sections;
}

/** Extract shared CSS from the HTML (styles that should be included in every chunk) */
function extractSharedCss(html: string): string {
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const styles: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = styleRegex.exec(html)) !== null) {
    styles.push(match[0]!);
  }

  // Also extract <link> tags (fonts etc.)
  const linkRegex = /<link[^>]*>/gi;
  const links: string[] = [];
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[0]!);
  }

  return [...links, ...styles].join("\n");
}

/** Detect the root wrapper element that wraps all <section> tags.
 *  e.g. <div class="lp-root"> or <div class="sb-root"> or <main class="page">
 *  Returns opening + closing tags so chunks can be re-wrapped. */
function detectRootWrapper(html: string): { open: string; close: string } | null {
  // Strip <style>, <link>, and HTML comments to find the first real content element
  const stripped = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  // Check if content starts with a wrapper div/main that contains <section> children
  const wrapperMatch = stripped.match(/^<(div|main)\s+([^>]*)>/i);
  if (wrapperMatch) {
    const tag = wrapperMatch[1]!.toLowerCase();
    const attrs = wrapperMatch[2]!;
    return {
      open: `<${tag} ${attrs}>`,
      close: `</${tag}>`,
    };
  }

  return null;
}

export function SectionSplitter({ html, onHtmlChange, styleOverrides, checkoutUrl }: SectionSplitterProps) {
  const [expanded, setExpanded] = useState(false);
  const [splitPoints, setSplitPoints] = useState<Set<number>>(new Set());
  const [deletedIndices, setDeletedIndices] = useState<Set<number>>(new Set());

  const allSections = useMemo(() => detectSections(html), [html]);

  // Filter out deleted sections for display and chunking
  const sections = useMemo(
    () => allSections.filter((_, i) => !deletedIndices.has(i)),
    [allSections, deletedIndices]
  );

  if (allSections.length <= 1) return null;

  const deleteSection = (originalIndex: number) => {
    // Remove the section's HTML from the page
    const section = allSections[originalIndex];
    if (!section) return;

    const newHtml = html.replace(section.html, "").replace(/\n{3,}/g, "\n\n").trim();
    onHtmlChange(newHtml);

    // Track deletion and clean up split points
    setDeletedIndices((prev) => {
      const next = new Set(prev);
      next.add(originalIndex);
      return next;
    });

    toast.success(`Deleted: ${section.label}`);
  };

  const toggleSplit = (afterIndex: number) => {
    setSplitPoints((prev) => {
      const next = new Set(prev);
      if (next.has(afterIndex)) {
        next.delete(afterIndex);
      } else {
        next.add(afterIndex);
      }
      return next;
    });
  };

  // Build chunks based on split points
  const chunks = useMemo(() => {
    if (splitPoints.size === 0) return [];

    const sortedSplits = Array.from(splitPoints).sort((a, b) => a - b);
    const result: { label: string; sections: DetectedSection[] }[] = [];
    let start = 0;

    for (const splitAfter of sortedSplits) {
      const chunkSections = sections.slice(start, splitAfter + 1);
      if (chunkSections.length > 0) {
        const label = chunkSections.length === 1
          ? chunkSections[0]!.label
          : `${chunkSections[0]!.label} → ${chunkSections[chunkSections.length - 1]!.label}`;
        result.push({ label, sections: chunkSections });
      }
      start = splitAfter + 1;
    }

    // Remaining sections after last split
    if (start < sections.length) {
      const chunkSections = sections.slice(start);
      const label = chunkSections.length === 1
        ? chunkSections[0]!.label
        : `${chunkSections[0]!.label} → ${chunkSections[chunkSections.length - 1]!.label}`;
      result.push({ label, sections: chunkSections });
    }

    return result;
  }, [sections, splitPoints]);

  const rootWrapper = useMemo(() => detectRootWrapper(html), [html]);

  const copyChunk = async (chunkIndex: number) => {
    const chunk = chunks[chunkIndex];
    if (!chunk) return;

    // Combine the chunk's section HTML
    let chunkHtml = chunk.sections.map((s) => s.html).join("\n\n");

    // Re-wrap in the root wrapper element (e.g. <div class="lp-root">)
    // so CSS selectors like .lp-root .hero-check svg still match
    if (rootWrapper) {
      chunkHtml = `${rootWrapper.open}\n${chunkHtml}\n${rootWrapper.close}`;
    }

    // Get the shared CSS and prepend it
    const sharedCss = extractSharedCss(html);
    const fullChunk = sharedCss + "\n\n" + chunkHtml;

    // Run through Systeme.io optimizer if we have style overrides
    if (styleOverrides) {
      const optimized = await optimizeForSystemeio(fullChunk, styleOverrides, checkoutUrl);
      await navigator.clipboard.writeText(optimized);
    } else {
      await navigator.clipboard.writeText(fullChunk);
    }

    toast.success(`Chunk ${chunkIndex + 1} copied`);
  };

  return (
    <div className="border-t border-[#e5e4de]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-5 py-2 text-left hover:bg-[#efede8]/50 ed-transition"
      >
        <Scissors className="size-3.5 text-[#7a7a72]" />
        <span className="font-mono text-[10px] font-medium text-[#1c1c1c] uppercase tracking-[0.15em]">
          Split for Systeme.io
        </span>
        <span className="font-mono text-[9px] text-[#7a7a72]">
          ({sections.length} sections)
        </span>
        {expanded ? (
          <ChevronDown className="size-3 text-[#7a7a72] ml-auto" />
        ) : (
          <ChevronRight className="size-3 text-[#7a7a72] ml-auto" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-3 space-y-1">
          <p className="font-mono text-[9px] text-[#7a7a72] leading-relaxed mb-2">
            Add split points between sections. Each chunk gets its own copy button with shared CSS included.
            Paste chunks into separate Raw HTML blocks in Systeme.io with your native blocks in between.
          </p>

          {/* Section list with split point toggles */}
          <div className="space-y-0">
            {sections.map((section, i) => (
              <div key={section.index}>
                {/* Section row */}
                <div className="flex items-center gap-2 py-1.5 px-2 bg-white border border-[#e5e4de] border-b-0 last:border-b group">
                  <span className="font-mono text-[9px] text-[#7a7a72] w-4 text-right shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-mono text-[11px] text-[#1c1c1c] truncate flex-1">
                    {section.label}
                  </span>
                  <button
                    onClick={() => deleteSection(section.index)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-[#7a7a72] hover:text-[#c45040] ed-transition shrink-0"
                    title={`Delete ${section.label}`}
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>

                {/* Split point toggle (between sections, not after last) */}
                {i < sections.length - 1 && (
                  <button
                    onClick={() => toggleSplit(i)}
                    className={`flex items-center gap-1.5 w-full py-1 px-2 ed-transition ${
                      splitPoints.has(i)
                        ? "bg-[#c45040]/10 border border-[#c45040]/30 border-y-0"
                        : "bg-[#efede8]/50 border border-[#e5e4de] border-y-0 hover:bg-[#efede8]"
                    }`}
                  >
                    {splitPoints.has(i) ? (
                      <>
                        <Scissors className="size-2.5 text-[#c45040]" />
                        <span className="font-mono text-[9px] text-[#c45040] uppercase tracking-[0.1em]">
                          Split here
                        </span>
                        <X className="size-2.5 text-[#c45040] ml-auto" />
                      </>
                    ) : (
                      <>
                        <Plus className="size-2.5 text-[#7a7a72]" />
                        <span className="font-mono text-[9px] text-[#7a7a72] uppercase tracking-[0.1em]">
                          Add split
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
            {/* Close last border */}
            <div className="border-b border-[#e5e4de]" />
          </div>

          {/* Chunk copy buttons */}
          {chunks.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <span className="font-mono text-[9px] text-[#7a7a72] uppercase tracking-[0.1em]">
                Copy chunks for Systeme.io:
              </span>
              <div className="space-y-1">
                {chunks.map((chunk, i) => (
                  <button
                    key={i}
                    onClick={() => copyChunk(i)}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2c5550] ed-transition"
                  >
                    <Copy className="size-3" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                      Chunk {i + 1}
                    </span>
                    <span className="font-mono text-[9px] text-[#f7f6f2]/60 truncate ml-1">
                      {chunk.label}
                    </span>
                    <span className="font-mono text-[9px] text-[#f7f6f2]/40 ml-auto">
                      {chunk.sections.length} {chunk.sections.length === 1 ? "section" : "sections"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="font-mono text-[9px] text-[#7a7a72] leading-relaxed">
                Paste each chunk into a separate Raw HTML block in Systeme.io.
                Add your native Systeme.io blocks between them.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
