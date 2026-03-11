"use client";

import { useMemo, useState } from "react";
import { MousePointerClick, Link as LinkIcon, Type, Hash, ExternalLink } from "lucide-react";

interface SectionAnchor {
  id: string;
  label: string;
}

interface ButtonEntry {
  index: number;
  text: string;
  href: string;
  tagName: string;
  selector: string;
  linkType: "scroll" | "url";
}

interface ButtonManagerProps {
  html: string;
  onHtmlChange: (html: string) => void;
  checkoutUrl: string;
  onCheckoutUrlChange: (url: string) => void;
}

/** Parse HTML into a DOM body, handling both full docs and fragments */
function parseHtml(html: string): { doc: Document; isFullDoc: boolean } {
  const isFullDoc = /<!DOCTYPE|<html[\s>]/i.test(html);
  const parser = new DOMParser();
  const doc = parser.parseFromString(isFullDoc ? html : `<body>${html}</body>`, "text/html");
  return { doc, isFullDoc };
}

/** Serialize DOM back to HTML string */
function serializeHtml(doc: Document, isFullDoc: boolean): string {
  if (isFullDoc) {
    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  }
  return doc.body.innerHTML;
}

/** Detect all sections with IDs or class-based anchors */
function extractSections(html: string): SectionAnchor[] {
  const { doc } = parseHtml(html);
  const sections: SectionAnchor[] = [];
  const seen = new Set<string>();

  // Elements with id attributes
  doc.body.querySelectorAll("[id]").forEach((el) => {
    const id = el.getAttribute("id")!;
    if (!id || seen.has(id)) return;
    if (id.startsWith("sb-") || id === "sticky-cta") return; // skip utility IDs
    seen.add(id);

    // Build a readable label from the id
    const label = id
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    sections.push({ id, label });
  });

  // Also detect section/div elements with descriptive class names
  doc.body.querySelectorAll("section[class], div[class*='section'], div[class*='wrap']").forEach((el) => {
    const cls = el.getAttribute("class") || "";
    // Extract the most descriptive class name
    const match = cls.match(/(section-\w+|[\w]+-wrap|[\w]+-section)/);
    if (!match) return;
    const name = match[1]!;
    if (seen.has(name)) return;
    seen.add(name);

    // If element doesn't have an id, suggest one
    const existingId = el.getAttribute("id");
    if (existingId && !seen.has(existingId)) {
      return; // already captured above
    }

    const label = name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    // Use class as anchor (will need to add id)
    const anchorId = name.replace(/\s+/g, "-").toLowerCase();
    if (!seen.has(anchorId)) {
      seen.add(anchorId);
      sections.push({ id: anchorId, label: label + " (will add id)" });
    }
  });

  return sections;
}

/** Extract buttons from HTML */
function extractButtons(html: string): ButtonEntry[] {
  if (!html.trim()) return [];
  const { doc } = parseHtml(html);
  const elements = doc.body.querySelectorAll("a, button");
  const buttons: ButtonEntry[] = [];
  let index = 0;

  elements.forEach((el) => {
    const text = (el.textContent || "").trim();
    if (!text || text.length > 80) return;

    const href = el.getAttribute("href") || "";
    const tagName = el.tagName.toLowerCase();
    const linkType: "scroll" | "url" = href.startsWith("#") || href === "" ? "scroll" : "url";

    buttons.push({
      index: index++,
      text,
      href,
      tagName,
      selector: buildNthSelector(el, doc.body),
      linkType,
    });
  });

  return buttons;
}

/** Build a unique nth-of-type selector path */
function buildNthSelector(el: Element, root: Element): string {
  const path: string[] = [];
  let current: Element | null = el;
  while (current && current !== root) {
    let tag = current.tagName.toLowerCase();
    let nth = 1;
    let sib = current.previousElementSibling;
    while (sib) {
      if (sib.tagName === current.tagName) nth++;
      sib = sib.previousElementSibling;
    }
    let total = nth;
    let nextSib = current.nextElementSibling;
    while (nextSib) {
      if (nextSib.tagName === current.tagName) total++;
      nextSib = nextSib.nextElementSibling;
    }
    if (total > 1) tag += `:nth-of-type(${nth})`;
    path.unshift(tag);
    current = current.parentElement;
  }
  return path.join(" > ");
}

/** Find the deepest text node in an element */
function findDeepestTextNode(el: Element): ChildNode | null {
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE && (child.textContent || "").trim()) {
      return child;
    }
  }
  for (const child of Array.from(el.children)) {
    const found = findDeepestTextNode(child);
    if (found) return found;
  }
  return null;
}

export function ButtonManager({ html, onHtmlChange, checkoutUrl, onCheckoutUrlChange }: ButtonManagerProps) {
  const buttons = useMemo(() => extractButtons(html), [html]);
  const sections = useMemo(() => extractSections(html), [html]);
  const [expanded, setExpanded] = useState(true);

  if (buttons.length === 0) return null;

  const updateButtonField = (entry: ButtonEntry, field: "text" | "href", value: string) => {
    const { doc, isFullDoc } = parseHtml(html);

    try {
      const el = doc.body.querySelector(entry.selector);
      if (!el) return;

      if (field === "text") {
        const textNode = findDeepestTextNode(el);
        if (textNode) {
          textNode.textContent = value;
        } else {
          el.textContent = value;
        }
      } else {
        el.setAttribute("href", value);
      }

      onHtmlChange(serializeHtml(doc, isFullDoc));
    } catch {
      // Selector didn't match
    }
  };

  /** Ensure a section ID exists in the HTML, add it if missing */
  const ensureSectionId = (sectionId: string): string => {
    const { doc, isFullDoc } = parseHtml(html);

    // Check if id already exists
    if (doc.body.querySelector(`#${CSS.escape(sectionId)}`)) {
      return html; // already has the id
    }

    // Try to find by class name and add the id
    const candidates = [
      `[class*="${sectionId}"]`,
      `[class*="${sectionId.replace(/-/g, "_")}"]`,
    ];

    for (const sel of candidates) {
      try {
        const el = doc.body.querySelector(sel);
        if (el) {
          el.setAttribute("id", sectionId);
          return serializeHtml(doc, isFullDoc);
        }
      } catch {
        // Invalid selector
      }
    }

    return html; // couldn't find matching element
  };

  const setButtonLink = (entry: ButtonEntry, type: "scroll" | "url", value: string) => {
    let updatedHtml = html;

    if (type === "scroll") {
      // Ensure the target section has the id
      updatedHtml = ensureSectionId(value.replace("#", ""));
    }

    const { doc, isFullDoc } = parseHtml(updatedHtml);
    try {
      const el = doc.body.querySelector(entry.selector);
      if (!el) return;
      const href = type === "scroll" ? (value.startsWith("#") ? value : `#${value}`) : value;
      el.setAttribute("href", href);
      onHtmlChange(serializeHtml(doc, isFullDoc));
    } catch {
      // Selector didn't match
    }
  };

  const setAllHrefs = (url: string) => {
    const { doc, isFullDoc } = parseHtml(html);
    doc.body.querySelectorAll("a, button").forEach((el) => {
      const href = el.getAttribute("href");
      if (href === "#" || href === "#sb-pricing" || href === "" || href === "#pricing") {
        el.setAttribute("href", url);
      }
    });
    onHtmlChange(serializeHtml(doc, isFullDoc));
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 w-full"
      >
        <MousePointerClick className="size-3 text-[#7a7a72]" />
        <span className="font-mono text-[10px] font-medium text-[#1c1c1c] uppercase tracking-[0.15em]">
          Buttons & Links ({buttons.length})
        </span>
        <span className="font-mono text-[9px] text-[#7a7a72] ml-auto">
          {expanded ? "▾" : "▸"}
        </span>
      </button>

      {expanded && (
        <div className="space-y-3">
          {/* Bulk URL */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <ExternalLink className="size-2.5 text-[#7a7a72]" />
              <span className="font-mono text-[9px] text-[#7a7a72] uppercase tracking-[0.1em]">
                Set all CTA buttons to
              </span>
            </div>
            <div className="flex gap-1">
              <input
                type="url"
                value={checkoutUrl}
                onChange={(e) => onCheckoutUrlChange(e.target.value)}
                placeholder="https://checkout-url.com"
                className="flex-1 px-2 py-1.5 font-mono text-[11px] border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none"
              />
              <button
                onClick={() => { if (checkoutUrl.trim()) setAllHrefs(checkoutUrl.trim()); }}
                disabled={!checkoutUrl.trim()}
                className="px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2c5550] disabled:opacity-40 disabled:cursor-not-allowed ed-transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Detected sections */}
          {sections.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Hash className="size-2.5 text-[#7a7a72]" />
                <span className="font-mono text-[9px] text-[#7a7a72] uppercase tracking-[0.1em]">
                  Page sections ({sections.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sections.map((s) => (
                  <span
                    key={s.id}
                    className="px-1.5 py-0.5 font-mono text-[9px] bg-[#efede8] text-[#7a7a72] border border-[#e5e4de]"
                    title={`#${s.id}`}
                  >
                    #{s.id}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Individual buttons */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {buttons.map((btn) => (
              <ButtonRow
                key={btn.index}
                btn={btn}
                sections={sections}
                onTextChange={(val) => updateButtonField(btn, "text", val)}
                onLinkChange={(type, val) => setButtonLink(btn, type, val)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Individual button row with link type selector */
function ButtonRow({
  btn,
  sections,
  onTextChange,
  onLinkChange,
}: {
  btn: ButtonEntry;
  sections: SectionAnchor[];
  onTextChange: (val: string) => void;
  onLinkChange: (type: "scroll" | "url", val: string) => void;
}) {
  const [linkType, setLinkType] = useState<"scroll" | "url">(btn.linkType);

  const handleTypeChange = (newType: "scroll" | "url") => {
    setLinkType(newType);
    if (newType === "scroll" && sections.length > 0) {
      // Default to first section
      const current = btn.href.replace("#", "");
      const match = sections.find((s) => s.id === current);
      if (!match) {
        onLinkChange("scroll", sections[0]!.id);
      }
    }
  };

  return (
    <div className="p-2 border border-[#e5e4de] bg-white space-y-1.5">
      {/* Button text */}
      <div className="flex items-center gap-1.5">
        <Type className="size-2.5 text-[#7a7a72] shrink-0" />
        <input
          type="text"
          defaultValue={btn.text}
          onBlur={(e) => onTextChange(e.target.value)}
          className="flex-1 px-1.5 py-1 font-mono text-[11px] border border-transparent hover:border-[#e5e4de] focus:border-[#3d7068] focus:outline-none bg-transparent"
          title="Button text"
        />
      </div>

      {/* Link type toggle */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleTypeChange("scroll")}
          className={`flex items-center gap-1 px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ed-transition ${
            linkType === "scroll"
              ? "bg-[#3d7068] text-[#f7f6f2]"
              : "bg-[#efede8] text-[#7a7a72] hover:text-[#1c1c1c]"
          }`}
        >
          <Hash className="size-2.5" />
          Scroll
        </button>
        <button
          onClick={() => handleTypeChange("url")}
          className={`flex items-center gap-1 px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ed-transition ${
            linkType === "url"
              ? "bg-[#3d7068] text-[#f7f6f2]"
              : "bg-[#efede8] text-[#7a7a72] hover:text-[#1c1c1c]"
          }`}
        >
          <ExternalLink className="size-2.5" />
          URL
        </button>
      </div>

      {/* Link value */}
      {linkType === "scroll" ? (
        <div className="space-y-1">
          {sections.length > 0 && (
            <select
              defaultValue={btn.href.replace("#", "")}
              onChange={(e) => { if (e.target.value) onLinkChange("scroll", e.target.value); }}
              className="w-full px-1.5 py-1.5 font-mono text-[11px] border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none text-[#7a7a72]"
            >
              <option value="">— Page sections —</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} — {s.label}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            defaultValue={btn.href.startsWith("#") ? btn.href.replace("#", "") : ""}
            onBlur={(e) => { if (e.target.value.trim()) onLinkChange("scroll", e.target.value.trim()); }}
            placeholder="section-9f186c44 (Systeme.io section ID)"
            className="w-full px-1.5 py-1.5 font-mono text-[11px] border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none text-[#7a7a72]"
            title="Paste any section ID — works with Systeme.io native section IDs"
          />
        </div>
      ) : (
        <input
          type="url"
          defaultValue={btn.href.startsWith("#") ? "" : btn.href}
          onBlur={(e) => onLinkChange("url", e.target.value)}
          placeholder="https://checkout-url.com"
          className="w-full px-1.5 py-1.5 font-mono text-[11px] border border-[#e5e4de] bg-white focus:border-[#3d7068] focus:outline-none text-[#7a7a72]"
          title="External URL"
        />
      )}
    </div>
  );
}
