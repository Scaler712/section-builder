"use client";

import { useMemo, useState } from "react";
import { MousePointerClick, Link as LinkIcon, Type } from "lucide-react";

interface ButtonEntry {
  index: number;
  text: string;
  href: string;
  tagName: string;
  /** CSS selector path for identification */
  selector: string;
}

interface ButtonManagerProps {
  html: string;
  onHtmlChange: (html: string) => void;
  checkoutUrl: string;
  onCheckoutUrlChange: (url: string) => void;
}

/**
 * Scans all <a> and <button> elements in the HTML.
 * Returns a list with text, href, and a way to find them again.
 */
function extractButtons(html: string): ButtonEntry[] {
  if (!html.trim()) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
  const elements = doc.body.querySelectorAll("a, button");
  const buttons: ButtonEntry[] = [];
  let index = 0;

  elements.forEach((el) => {
    const text = (el.textContent || "").trim();
    if (!text) return; // skip empty/icon-only elements
    // Skip nav links, skip very long text (probably not a button)
    if (text.length > 80) return;

    const href = el.getAttribute("href") || "";
    const tagName = el.tagName.toLowerCase();

    buttons.push({
      index: index++,
      text,
      href,
      tagName,
      selector: buildNthSelector(el, doc.body),
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
    // Count same-tag siblings before this one
    let nth = 1;
    let sib = current.previousElementSibling;
    while (sib) {
      if (sib.tagName === current.tagName) nth++;
      sib = sib.previousElementSibling;
    }
    // Count total same-tag siblings
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

export function ButtonManager({ html, onHtmlChange, checkoutUrl, onCheckoutUrlChange }: ButtonManagerProps) {
  const buttons = useMemo(() => extractButtons(html), [html]);
  const [expanded, setExpanded] = useState(true);

  if (buttons.length === 0) return null;

  const updateButton = (entry: ButtonEntry, field: "text" | "href", value: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");

    try {
      const el = doc.body.querySelector(entry.selector);
      if (!el) return;

      if (field === "text") {
        // Preserve inner HTML structure (icons, spans) — only update text nodes
        const textNode = findDeepestTextNode(el);
        if (textNode) {
          textNode.textContent = value;
        } else {
          el.textContent = value;
        }
      } else {
        el.setAttribute("href", value);
      }

      onHtmlChange(doc.body.innerHTML);
    } catch {
      // Selector didn't match
    }
  };

  const setAllHrefs = (url: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");

    const elements = doc.body.querySelectorAll("a, button");
    elements.forEach((el) => {
      const href = el.getAttribute("href");
      // Only update empty/placeholder links
      if (href === "#" || href === "#sb-pricing" || href === "") {
        el.setAttribute("href", url);
      }
    });

    onHtmlChange(doc.body.innerHTML);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 w-full"
      >
        <MousePointerClick className="size-3 text-[#7a7a72]" />
        <span className="font-mono text-[10px] font-medium text-[#1c1c1c] uppercase tracking-[0.15em]">
          Buttons ({buttons.length})
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
              <LinkIcon className="size-2.5 text-[#7a7a72]" />
              <span className="font-mono text-[9px] text-[#7a7a72] uppercase tracking-[0.1em]">
                Set all button links
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

          {/* Individual buttons */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {buttons.map((btn) => (
              <div key={btn.index} className="p-2 border border-[#e5e4de] bg-white space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Type className="size-2.5 text-[#7a7a72] shrink-0" />
                  <input
                    type="text"
                    defaultValue={btn.text}
                    onBlur={(e) => updateButton(btn, "text", e.target.value)}
                    className="flex-1 px-1.5 py-1 font-mono text-[11px] border border-transparent hover:border-[#e5e4de] focus:border-[#3d7068] focus:outline-none bg-transparent"
                    title="Button text"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="size-2.5 text-[#7a7a72] shrink-0" />
                  <input
                    type="text"
                    defaultValue={btn.href}
                    onBlur={(e) => updateButton(btn, "href", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-1.5 py-1 font-mono text-[11px] border border-transparent hover:border-[#e5e4de] focus:border-[#3d7068] focus:outline-none bg-transparent text-[#7a7a72]"
                    title="Button link"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Find the deepest text node in an element (to update text without destroying inner HTML structure) */
function findDeepestTextNode(el: Element): ChildNode | null {
  // If element has a direct text node with content, use it
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE && (child.textContent || "").trim()) {
      return child;
    }
  }
  // Otherwise recurse into children
  for (const child of Array.from(el.children)) {
    const found = findDeepestTextNode(child);
    if (found) return found;
  }
  return null;
}
