"use client";

import { useState, useCallback, useEffect } from "react";
import { TemplateGallery } from "./template-gallery";
import { AiGenerator } from "./ai-generator";
import { ApiKeyInput } from "./api-key-input";
import { HtmlEditor } from "./html-editor";
import { PreviewPanel } from "./preview-panel";
import { OutputBar } from "./output-bar";
import { PageGenerator } from "./page-generator";
import { SectionList } from "./section-list";
import { StyleControls } from "./style-controls";
import { PresetPicker } from "./preset-picker";
import { PasteGenerator, buildSectionsFromParsed } from "./paste-generator";
import { LovablePrompt } from "./lovable-prompt";
import { ImageInput } from "./image-input";
import { MediaPanel, type ImageWidth } from "./media-panel";
import { templateMap } from "@/lib/templates";
import { applyStyleOverrides } from "@/lib/style-engine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PageSection, BuilderMode, StyleOverrides } from "@/lib/page-builder/types";
import type { DesignSystem } from "@/lib/design-systems";
import type { ParsedPage } from "@/lib/content-types";

type Device = "desktop" | "tablet" | "mobile";

const defaultStyleOverrides: StyleOverrides = {
  headingColor: "#2B2B2B",
  bodyColor: "#3A3A3A",
  mutedColor: "#6B6B6B",
  accentColor: "#E8B931",
  highlightBg: "#FFF2C2",
  ctaBg: "#2B2B2B",
  fontFamily: "Raleway",
  spacing: "default",
  cardRadius: "18px",
  buttonRadius: "50px",
};

export function BuilderLayout() {
  const [html, setHtml] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showCode, setShowCode] = useState(true);
  const [mode, setMode] = useState<BuilderMode>("section");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [styleOverrides, setStyleOverrides] = useState<StyleOverrides>(defaultStyleOverrides);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [language, setLanguage] = useState("en");
  const [imageDialog, setImageDialog] = useState<{ cssPath: string; role: string } | null>(null);
  const [parsedContent, setParsedContent] = useState<ParsedPage | null>(null);
  const [highlightSelector, setHighlightSelector] = useState<string | null>(null);

  const selectTemplate = useCallback((id: string) => {
    setActiveTemplate(id);
    const t = templateMap[id];
    if (t) setHtml(t.defaultHtml);
  }, []);

  // Handle gallery template selection (pre-built templates)
  const handleGallerySelect = useCallback((templateHtml: string, sectionType: string) => {
    setHtml(templateHtml);
    setActiveTemplate(sectionType);
  }, []);

  const handleAiGenerated = useCallback((generatedHtml: string) => {
    setHtml(generatedHtml);
  }, []);

  const clear = useCallback(() => {
    setHtml("");
    setActiveTemplate(null);
    setSections([]);
    setParsedContent(null);
  }, []);

  // Page generation: receive sections, combine into single html
  const handlePageGenerated = useCallback((newSections: PageSection[]) => {
    setSections(newSections);
    const combined = newSections.map((s) => `<!-- SECTION: ${s.type} -->\n${s.html}`).join("\n\n");
    setHtml(combined);
  }, []);

  // Section management
  const handleSectionReorder = useCallback((fromIndex: number, toIndex: number) => {
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved!);
      const combined = next.map((s) => `<!-- SECTION: ${s.type} -->\n${s.html}`).join("\n\n");
      setHtml(combined);
      return next;
    });
  }, []);

  const handleSectionDelete = useCallback((index: number) => {
    setSections((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const combined = next.map((s) => `<!-- SECTION: ${s.type} -->\n${s.html}`).join("\n\n");
      setHtml(combined);
      return next;
    });
  }, []);

  const handleSectionRegenerated = useCallback((index: number, newHtml: string) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, html: newHtml };
      const combined = next.map((s) => `<!-- SECTION: ${s.type} -->\n${s.html}`).join("\n\n");
      setHtml(combined);
      return next;
    });
  }, []);

  // Handle adding a new section
  const handleSectionAdd = useCallback((section: PageSection) => {
    setSections((prev) => {
      const next = [...prev, section];
      const combined = next.map((s) => `<!-- SECTION: ${s.type} -->\n${s.html}`).join("\n\n");
      setHtml(combined);
      return next;
    });
  }, []);

  // Style overrides — only update the overrides state, no HTML mutation
  // The preview panel receives overrides as a prop and injects the theme block
  const handleStyleChange = useCallback((overrides: StyleOverrides) => {
    setStyleOverrides(overrides);
  }, []);

  // Design system preset
  const handlePresetSelect = useCallback((system: DesignSystem) => {
    setActivePreset(system.id);
    setStyleOverrides(system.styleOverrides);
  }, []);

  // Inline text editing from preview
  const handleHtmlChange = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  // Get the HTML with theme block prepended (for copy/export)
  const getExportHtml = useCallback(() => {
    return applyStyleOverrides(html, styleOverrides);
  }, [html, styleOverrides]);

  // Code → Preview highlight: map cursor line to a CSS selector
  const handleCursorLine = useCallback((lineNumber: number, _lineText: string) => {
    if (!html) { setHighlightSelector(null); return; }
    const lines = html.split("\n");
    // Walk backwards from cursor line to find nearest section class
    var selector: string | null = null;
    for (var i = Math.min(lineNumber - 1, lines.length - 1); i >= 0; i--) {
      const line = lines[i]!;
      // Match section wrapper: <div class="sb-xxx"> or .sb-xxx {
      var sectionMatch = line.match(/class="(sb-[a-z-]+)"/);
      if (!sectionMatch) sectionMatch = line.match(/\.(sb-[a-z][\w-]*)\s*\{/);
      if (sectionMatch) {
        selector = "." + sectionMatch[1];
        break;
      }
      // Match section comment marker
      var markerMatch = line.match(/<!-- SECTION:\s*(\S+)\s*-->/);
      if (markerMatch) {
        selector = ".sb-" + markerMatch[1];
        break;
      }
    }
    setHighlightSelector(selector);
  }, [html]);

  // Image placeholder click handler
  useEffect(() => {
    function handleImageClick(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.cssPath) {
        setImageDialog({ cssPath: detail.cssPath, role: detail.role || "image" });
      }
    }
    window.addEventListener("sb-image-click", handleImageClick);
    return () => window.removeEventListener("sb-image-click", handleImageClick);
  }, []);

  // Instant design system switching in paste mode:
  // When activePreset changes AND we have cached parsedContent,
  // re-inject content into the new design system's templates (no API call)
  const [lastSwitchedPreset, setLastSwitchedPreset] = useState<string | null>(null);
  useEffect(() => {
    if (!parsedContent || !activePreset || mode !== "paste") return;
    // Only trigger on preset changes, not initial load
    if (activePreset === lastSwitchedPreset) return;
    setLastSwitchedPreset(activePreset);

    var cancelled = false;
    (async () => {
      try {
        const newSections = await buildSectionsFromParsed(parsedContent, activePreset);
        if (cancelled) return;
        setSections(newSections);
        const combined = newSections.map((s) => `<!-- SECTION: ${s.type} -->\n${s.html}`).join("\n\n");
        setHtml(combined);
      } catch {
        // Silently fail — user can retry
      }
    })();
    return () => { cancelled = true; };
  }, [activePreset, parsedContent, mode]);

  const handleImageInsert = useCallback((src: string) => {
    if (!imageDialog) return;
    const { cssPath } = imageDialog;

    // Replace the placeholder in HTML with an img tag
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");

    try {
      const el = doc.body.querySelector(cssPath);
      if (el) {
        const img = doc.createElement("img");
        img.src = src;
        img.style.cssText = "width:100%;height:auto;border-radius:var(--sb-card-radius);";
        img.alt = imageDialog.role;
        el.replaceWith(img);
        setHtml(doc.body.innerHTML);
      }
    } catch {
      // CSS path didn't match — skip
    }

    setImageDialog(null);
  }, [html, imageDialog]);

  // Standalone media insert (from sidebar panel or preview drop)
  // Adds as a reorderable section when in page/paste mode, raw HTML otherwise
  const handleMediaImageInsert = useCallback((src: string, alt: string, width: ImageWidth = "50") => {
    const w = width === "100" ? "100%" : `${width}%`;
    const imgHtml = `<div style="text-align:center;padding:40px 20px;max-width:1100px;margin:0 auto;"><img src="${src}" alt="${alt}" style="width:${w};max-width:100%;height:auto;border-radius:var(--sb-card-radius);display:inline-block;" /></div>`;

    if (sections.length > 0) {
      // Add as a proper section — appears in the section list, reorderable
      const imageSection: PageSection = {
        id: `image-${Date.now()}`,
        type: "image",
        label: alt || "Image",
        html: imgHtml,
        order: sections.length,
      };
      handleSectionAdd(imageSection);
      return;
    }

    // No sections — raw HTML mode, just append
    if (!html.trim()) {
      setHtml(imgHtml);
    } else {
      setHtml(html + "\n" + imgHtml);
    }
  }, [html, sections, handleSectionAdd]);

  const handleMediaVideoInsert = useCallback((embedUrl: string) => {
    const videoSection = `\n\n<!-- SECTION: video-embed -->\n<div style="max-width:800px;margin:0 auto;padding:40px 20px;">\n  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--sb-card-radius);">\n    <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>\n  </div>\n</div>`;
    setHtml(html + videoSection);
  }, [html]);

  const modeTab = (
    <div className="flex gap-0.5 mb-4 bg-[#efede8] p-0.5">
      <button
        onClick={() => setMode("section")}
        className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
          mode === "section" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
        }`}
      >
        Section
      </button>
      <button
        onClick={() => setMode("page")}
        className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
          mode === "page" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
        }`}
      >
        Full Page
      </button>
      <button
        onClick={() => setMode("paste")}
        className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
          mode === "paste" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
        }`}
      >
        Paste Copy
      </button>
      <button
        onClick={() => setMode("lovable")}
        className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
          mode === "lovable" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
        }`}
      >
        Lovable
      </button>
    </div>
  );

  const buildModeContent = () => {
    if (mode === "section") {
      return (
        <>
          <TemplateGallery
            activePreset={activePreset}
            onSelect={handleGallerySelect}
            onDesignSystemChange={handlePresetSelect}
          />
          <div className="my-4 border-t border-[#e5e4de]" />
          <AiGenerator
            activeTemplate={activeTemplate}
            onGenerated={handleAiGenerated}
            onTemplateChange={selectTemplate}
            apiKey={apiKey}
            activePreset={activePreset}
          />
        </>
      );
    }
    if (mode === "page") {
      return (
        <>
          <PageGenerator
            apiKey={apiKey}
            onGenerated={handlePageGenerated}
            activePreset={activePreset}
            onProductNameChange={setProductName}
            onLanguageChange={setLanguage}
          />
          {sections.length > 0 && (
            <>
              <div className="my-4 border-t border-[#e5e4de]" />
              <SectionList
                sections={sections}
                onReorder={handleSectionReorder}
                onDelete={handleSectionDelete}
                onRegenerate={handleSectionRegenerated}
                onAdd={handleSectionAdd}
                apiKey={apiKey}
                activePreset={activePreset}
                productName={productName}
                language={language}
              />
            </>
          )}
        </>
      );
    }
    if (mode === "paste") {
      return (
        <>
          <PasteGenerator
            apiKey={apiKey}
            activePreset={activePreset}
            onGenerated={handlePageGenerated}
            onParsedContent={setParsedContent}
          />
          {sections.length > 0 && (
            <>
              <div className="my-4 border-t border-[#e5e4de]" />
              <SectionList
                sections={sections}
                onReorder={handleSectionReorder}
                onDelete={handleSectionDelete}
                onRegenerate={handleSectionRegenerated}
                onAdd={handleSectionAdd}
                apiKey={apiKey}
                activePreset={activePreset}
                productName={productName}
                language={language}
              />
            </>
          )}
        </>
      );
    }
    // lovable mode
    return (
      <LovablePrompt apiKey={apiKey} />
    );
  };

  const sidebar = (
    <>
      <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
      <div className="my-4 border-t border-[#e5e4de]" />
      <PresetPicker activePreset={activePreset} onSelect={handlePresetSelect} />
      <div className="my-4 border-t border-[#e5e4de]" />
      {modeTab}
      {buildModeContent()}
      <div className="my-4 border-t border-[#e5e4de]" />
      <MediaPanel onInsertImage={handleMediaImageInsert} onInsertVideo={handleMediaVideoInsert} />
      <div className="my-4 border-t border-[#e5e4de]" />
      <StyleControls overrides={styleOverrides} onChange={handleStyleChange} />
    </>
  );

  return (
    <div className="h-screen flex flex-col">
      <OutputBar
        html={html}
        sections={sections}
        device={device}
        onDeviceChange={setDevice}
        onClear={clear}
        showCode={showCode}
        onToggleCode={() => setShowCode((v) => !v)}
        styleOverrides={styleOverrides}
        getExportHtml={getExportHtml}
      />

      {/* Desktop */}
      <div
        className="flex-1 hidden lg:grid overflow-hidden"
        style={{
          gridTemplateColumns: showCode ? "280px 1fr 1fr" : "280px 1fr",
        }}
      >
        <div className="overflow-y-auto border-r border-[#e5e4de] bg-[#f7f6f2]">
          <div className="p-4">{sidebar}</div>
        </div>
        {showCode && (
          <div className="border-r border-[#e5e4de] overflow-hidden">
            <HtmlEditor value={html} onChange={setHtml} onCursorLine={handleCursorLine} />
          </div>
        )}
        <PreviewPanel html={html} device={device} onHtmlChange={handleHtmlChange} onDropImage={handleMediaImageInsert} styleOverrides={styleOverrides} highlightSelector={highlightSelector} />
      </div>

      {/* Mobile/Tablet: tabbed layout */}
      <div className="flex-1 lg:hidden overflow-hidden">
        <Tabs defaultValue="build" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-4 bg-[#efede8] rounded-none">
            <TabsTrigger
              value="build"
              className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-none data-[state=active]:bg-[#3d7068] data-[state=active]:text-[#f7f6f2]"
            >
              Build
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-none data-[state=active]:bg-[#3d7068] data-[state=active]:text-[#f7f6f2]"
            >
              Style
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-none data-[state=active]:bg-[#3d7068] data-[state=active]:text-[#f7f6f2]"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="font-mono text-[10px] uppercase tracking-[0.2em] rounded-none data-[state=active]:bg-[#3d7068] data-[state=active]:text-[#f7f6f2]"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="build" className="flex-1 overflow-auto p-4">
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
            <div className="my-4 border-t border-[#e5e4de]" />
            <PresetPicker activePreset={activePreset} onSelect={handlePresetSelect} />
            <div className="my-4 border-t border-[#e5e4de]" />
            {modeTab}
            {buildModeContent()}
          </TabsContent>
          <TabsContent value="style" className="flex-1 overflow-auto p-4">
            <PresetPicker activePreset={activePreset} onSelect={handlePresetSelect} />
            <div className="my-4 border-t border-[#e5e4de]" />
            <StyleControls overrides={styleOverrides} onChange={handleStyleChange} />
          </TabsContent>
          <TabsContent value="editor" className="flex-1 overflow-hidden">
            <HtmlEditor value={html} onChange={setHtml} onCursorLine={handleCursorLine} />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <PreviewPanel html={html} device={device} onHtmlChange={handleHtmlChange} onDropImage={handleMediaImageInsert} styleOverrides={styleOverrides} highlightSelector={highlightSelector} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Image dialog */}
      {imageDialog && (
        <ImageInput
          onImageSelect={handleImageInsert}
          onClose={() => setImageDialog(null)}
        />
      )}
    </div>
  );
}
