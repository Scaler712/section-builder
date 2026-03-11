"use client";

import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { buildCssVarBlock } from "@/lib/css-vars";
import { processImageFile } from "@/lib/image-utils";
import { toast } from "sonner";
import type { StyleOverrides } from "@/lib/page-builder/types";

type Device = "desktop" | "tablet" | "mobile";

interface PreviewPanelProps {
  html: string;
  device: Device;
  onHtmlChange?: (html: string) => void;
  onDropImage?: (src: string, alt: string) => void;
  styleOverrides?: StyleOverrides;
  highlightSelector?: string | null;
}

const deviceWidths: Record<Device, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
};

const EDITABLE_SCRIPT = `
<script>
(function() {
  var editableSelectors = 'h1, h2, h3, h4, h5, h6, p, span, a, li, button, label';
  var style = document.createElement('style');
  style.textContent = '[contenteditable]:focus { outline: 2px dashed #3d7068; outline-offset: 2px; cursor: text; } [contenteditable]:hover { outline: 1px dashed #3d706840; outline-offset: 2px; cursor: text; } .sb-img-placeholder { cursor: pointer; display: flex; align-items: center; justify-content: center; min-height: 200px; background: #f0f0f0; border: 2px dashed #ccc; color: #999; font-size: 14px; } .sb-img-placeholder:hover { border-color: #3d7068; color: #3d7068; }';
  document.head.appendChild(style);

  function getCssPath(el) {
    var path = [];
    while (el && el.nodeType === 1) {
      var selector = el.tagName.toLowerCase();
      if (el.id) {
        selector += '#' + el.id;
        path.unshift(selector);
        break;
      } else {
        var sib = el;
        var nth = 1;
        while (sib = sib.previousElementSibling) {
          if (sib.tagName === el.tagName) nth++;
        }
        if (nth > 1) selector += ':nth-of-type(' + nth + ')';
      }
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  function makeEditable() {
    var elements = document.querySelectorAll(editableSelectors);
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.getAttribute('contenteditable') === 'true') continue;
      el.setAttribute('contenteditable', 'true');
      el.addEventListener('blur', function() {
        var cssPath = getCssPath(this);
        window.parent.postMessage({
          type: 'sb-text-edit',
          cssPath: cssPath,
          tagName: this.tagName.toLowerCase(),
          newText: this.innerHTML
        }, '*');
      });
    }

    // Image placeholder click handler — detect all photo/image placeholder types
    var phSelectors = '.sb-img-placeholder, .sb-photo-placeholder, .sb-photo, .sb-about-photo, [class*="photo-placeholder"], [class*="sb-photo"]';
    var placeholders = document.querySelectorAll(phSelectors);
    for (var j = 0; j < placeholders.length; j++) {
      var ph = placeholders[j];
      if (ph.getAttribute('data-sb-click') === 'true') continue;
      if (ph.querySelector('img')) continue;
      ph.setAttribute('data-sb-click', 'true');
      ph.style.cursor = 'pointer';
      ph.setAttribute('title', 'Click to add image');
      ph.addEventListener('click', function(evt) {
        evt.stopPropagation();
        var role = this.getAttribute('data-role') || 'photo';
        var cssPath = getCssPath(this);
        window.parent.postMessage({
          type: 'sb-image-click',
          role: role,
          cssPath: cssPath
        }, '*');
      });
    }
  }

  makeEditable();
  var observer = new MutationObserver(function() { makeEditable(); });
  observer.observe(document.body, { childList: true, subtree: true });

  // Code-preview highlight sync
  var highlightOverlay = document.createElement('div');
  highlightOverlay.id = 'sb-highlight-overlay';
  highlightOverlay.style.cssText = 'position:absolute;pointer-events:none;border:2px solid #3d7068;background:rgba(61,112,104,0.08);z-index:99999;transition:all 0.15s ease;display:none;border-radius:2px;';
  document.body.appendChild(highlightOverlay);
  document.body.style.position = 'relative';

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'sb-highlight') {
      var sel = e.data.selector;
      if (!sel) {
        highlightOverlay.style.display = 'none';
        return;
      }
      try {
        var target = document.querySelector(sel);
        if (target) {
          var rect = target.getBoundingClientRect();
          var scrollY = window.scrollY || document.documentElement.scrollTop;
          var scrollX = window.scrollX || document.documentElement.scrollLeft;
          highlightOverlay.style.top = (rect.top + scrollY - 2) + 'px';
          highlightOverlay.style.left = (rect.left + scrollX - 2) + 'px';
          highlightOverlay.style.width = (rect.width + 4) + 'px';
          highlightOverlay.style.height = (rect.height + 4) + 'px';
          highlightOverlay.style.display = 'block';
        } else {
          highlightOverlay.style.display = 'none';
        }
      } catch(err) {
        highlightOverlay.style.display = 'none';
      }
    }
  });
})();
</script>`;

export function PreviewPanel({ html, device, onHtmlChange, onDropImage, styleOverrides, highlightSelector }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) setIsDragOver(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only leave if we actually left the container (not entering a child)
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Drop an image file");
      return;
    }

    if (!onDropImage) return;

    try {
      const dataUri = await processImageFile(file);
      onDropImage(dataUri, "Image");
      toast.success("Image added");
    } catch {
      toast.error("Failed to process image");
    }
  }, [onDropImage]);

  const srcdoc = useMemo(() => {
    if (!html.trim()) {
      return `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Space Mono',monospace;color:#7a7a72;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0;background:#f7f6f2"><p>Select a template or generate with AI</p></body></html>`;
    }

    // Build the theme block from overrides, inject into the iframe
    const themeBlock = styleOverrides ? buildCssVarBlock(styleOverrides) : "";

    // Strip any existing theme block from the html to avoid duplication
    const cleanHtml = html.replace(/<style id="sb-theme">[\s\S]*?<\/style>\s*/g, "");

    // Inject alignment fix in preview so it matches the Systeme.io export exactly.
    // Systeme.io wraps raw HTML in text-align:center — simulate that + override.
    const alignmentFix = `<style id="sb-align-fix">
/* Simulate Systeme.io wrapper (text-align:center) then override back to left */
body { text-align: center; }
body > * { text-align: left; display: block; margin-left: auto; margin-right: auto; }
/* Center only intentionally centered elements */
[class*="hero"], [class*="cta"], [class*="guarantee"], [class*="transition"] { text-align: center; }
[class*="hero"] h1, [class*="hero"] h2, [class*="hero"] p,
[class*="cta"] h1, [class*="cta"] h2, [class*="cta"] p,
[class*="guarantee"] h2, [class*="guarantee"] p,
[class*="transition"] h2, [class*="transition"] p { text-align: center; }
[class*="pricing-card"] { text-align: center; }
[class*="pricing-card"] ul, [class*="pricing-card"] li,
[class*="pricing-card"] .features, [class*="pricing-card"] .features li { text-align: left; }
h2 { text-align: center; }
</style>`;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:0;}</style>${themeBlock}${alignmentFix}</head><body>${cleanHtml}${EDITABLE_SCRIPT}</body></html>`;
  }, [html, styleOverrides]);

  useEffect(() => {
    if (!onHtmlChange) return;

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "sb-image-click") {
        // Bubble up to parent for image handling
        window.dispatchEvent(new CustomEvent("sb-image-click", { detail: e.data }));
        return;
      }

      if (e.data?.type !== "sb-text-edit") return;
      const { cssPath, tagName, newText } = e.data;
      if (!cssPath || !newText || !tagName) return;

      // Update the html string using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        `<body>${html}</body>`,
        "text/html"
      );

      try {
        const el = doc.body.querySelector(cssPath);
        if (el && el.tagName.toLowerCase() === tagName) {
          el.innerHTML = newText;
          // Extract updated html from body
          onHtmlChange!(doc.body.innerHTML);
        }
      } catch {
        // CSS path didn't match — skip
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [html, onHtmlChange]);

  // Send highlight selector to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: "sb-highlight", selector: highlightSelector || null },
      "*"
    );
  }, [highlightSelector]);

  return (
    <div
      className="h-full bg-[#efede8]/50 flex items-start justify-center overflow-auto p-4 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        className="bg-white border border-[#e5e4de]"
        style={{
          width: deviceWidths[device],
          maxWidth: "100%",
          height: "100%",
          minHeight: "500px",
          pointerEvents: isDragOver ? "none" : undefined,
        }}
      />
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#3d7068]/10 border-2 border-dashed border-[#3d7068] z-10">
          <div className="bg-white/90 px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-[#3d7068]">
            Drop image here
          </div>
        </div>
      )}
    </div>
  );
}
