"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Check, Eye, Columns } from "lucide-react";
import { designSystems, type DesignSystem } from "@/lib/design-systems";
import { templates } from "@/lib/templates";
import { buildCssVarBlock } from "@/lib/css-vars";
import {
  loadRegistry,
  loadTemplate,
  type Registry,
} from "@/lib/template-registry";
import { toast } from "sonner";

interface TemplateGalleryProps {
  activePreset: string | null;
  onSelect: (html: string, sectionType: string) => void;
  onDesignSystemChange?: (system: DesignSystem) => void;
}

type ViewMode = "single" | "browse";

export function TemplateGallery({
  activePreset,
  onSelect,
  onDesignSystemChange,
}: TemplateGalleryProps) {
  const [registry, setRegistry] = useState<Registry>({});
  const [registryLoaded, setRegistryLoaded] = useState(false);
  const [activeSectionType, setActiveSectionType] = useState("hero");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);

  // Load registry on mount
  useEffect(() => {
    loadRegistry().then((r) => {
      setRegistry(r);
      setRegistryLoaded(true);
    });
  }, []);

  const selectedDesignSystem = activePreset || "default";

  // Use template handler
  const handleUseTemplate = useCallback(
    async (designSystemId: string, sectionType: string) => {
      const key = `${designSystemId}/${sectionType}`;
      setLoadingTemplate(key);

      try {
        const html = await loadTemplate(designSystemId, sectionType);
        if (!html) {
          toast.error("Template not found");
          return;
        }

        // If user picks a template from a different design system, update the design system
        if (designSystemId !== activePreset) {
          const ds = designSystems.find((d) => d.id === designSystemId);
          if (ds) onDesignSystemChange?.(ds);
        }

        onSelect(html, sectionType);
        toast.success(`Loaded ${sectionType} template`);
      } catch {
        toast.error("Failed to load template");
      } finally {
        setLoadingTemplate(null);
      }
    },
    [activePreset, onSelect, onDesignSystemChange]
  );

  const hasTemplatesForSystem = (dsId: string) => {
    return !!registry[dsId] && Object.keys(registry[dsId]!).length > 0;
  };

  if (!registryLoaded) {
    return (
      <div className="flex items-center justify-center py-8 text-[#7a7a72]">
        <Loader2 className="size-4 animate-spin mr-2" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]">Loading templates...</span>
      </div>
    );
  }

  const noTemplates = Object.keys(registry).length === 0;
  if (noTemplates) {
    return (
      <div className="py-6 text-center">
        <p className="font-mono text-[10px] text-[#7a7a72] uppercase tracking-[0.1em] mb-2">
          No pre-built templates found
        </p>
        <p className="font-mono text-[9px] text-[#7a7a72]">
          Run: npm run generate-templates
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="mono-label">Template Gallery</h3>
        <div className="flex gap-0.5 bg-[#efede8] p-0.5">
          <button
            onClick={() => setViewMode("single")}
            title="Single design system"
            className={`p-1.5 ed-transition ${
              viewMode === "single"
                ? "bg-[#3d7068] text-[#f7f6f2]"
                : "text-[#7a7a72] hover:text-[#1c1c1c]"
            }`}
          >
            <Eye className="size-3" />
          </button>
          <button
            onClick={() => setViewMode("browse")}
            title="Browse all design systems"
            className={`p-1.5 ed-transition ${
              viewMode === "browse"
                ? "bg-[#3d7068] text-[#f7f6f2]"
                : "text-[#7a7a72] hover:text-[#1c1c1c]"
            }`}
          >
            <Columns className="size-3" />
          </button>
        </div>
      </div>

      {/* Section type tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setActiveSectionType(tpl.id)}
            className={`px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] border ed-transition ${
              activeSectionType === tpl.id
                ? "border-[#3d7068] bg-[#3d706812] text-[#3d7068]"
                : "border-[#e5e4de] text-[#7a7a72] hover:border-[#3d7068]/40 hover:text-[#1c1c1c]"
            }`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Template cards */}
      {viewMode === "single" ? (
        <SingleView
          designSystemId={selectedDesignSystem}
          sectionType={activeSectionType}
          registry={registry}
          loadingTemplate={loadingTemplate}
          onUseTemplate={handleUseTemplate}
        />
      ) : (
        <BrowseAllView
          sectionType={activeSectionType}
          registry={registry}
          activePreset={activePreset}
          loadingTemplate={loadingTemplate}
          onUseTemplate={handleUseTemplate}
        />
      )}
    </div>
  );
}

// --- Single Design System View ---
function SingleView({
  designSystemId,
  sectionType,
  registry,
  loadingTemplate,
  onUseTemplate,
}: {
  designSystemId: string;
  sectionType: string;
  registry: Registry;
  loadingTemplate: string | null;
  onUseTemplate: (dsId: string, sectionType: string) => void;
}) {
  const hasTemplate = !!registry[designSystemId]?.[sectionType];
  const ds = designSystems.find((d) => d.id === designSystemId);
  const loadingKey = `${designSystemId}/${sectionType}`;

  if (!hasTemplate) {
    return (
      <div className="border border-dashed border-[#e5e4de] p-6 text-center">
        <p className="font-mono text-[10px] text-[#7a7a72] uppercase tracking-[0.1em]">
          No template for {ds?.name || designSystemId} / {sectionType}
        </p>
      </div>
    );
  }

  return (
    <div>
      <TemplateCard
        designSystemId={designSystemId}
        sectionType={sectionType}
        designSystem={ds}
        isLoading={loadingTemplate === loadingKey}
        onUse={() => onUseTemplate(designSystemId, sectionType)}
        size="large"
      />
    </div>
  );
}

// --- Browse All Design Systems View ---
function BrowseAllView({
  sectionType,
  registry,
  activePreset,
  loadingTemplate,
  onUseTemplate,
}: {
  sectionType: string;
  registry: Registry;
  activePreset: string | null;
  loadingTemplate: string | null;
  onUseTemplate: (dsId: string, sectionType: string) => void;
}) {
  // Show all design systems that have this section type
  const availableSystems = designSystems.filter(
    (ds) => !!registry[ds.id]?.[sectionType]
  );

  if (availableSystems.length === 0) {
    return (
      <div className="border border-dashed border-[#e5e4de] p-6 text-center">
        <p className="font-mono text-[10px] text-[#7a7a72] uppercase tracking-[0.1em]">
          No templates available for {sectionType}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
      {availableSystems.map((ds) => {
        const loadingKey = `${ds.id}/${sectionType}`;
        return (
          <TemplateCard
            key={ds.id}
            designSystemId={ds.id}
            sectionType={sectionType}
            designSystem={ds}
            isActive={activePreset === ds.id}
            isLoading={loadingTemplate === loadingKey}
            onUse={() => onUseTemplate(ds.id, sectionType)}
            size="small"
          />
        );
      })}
    </div>
  );
}

// --- Template Card with iframe preview ---
function TemplateCard({
  designSystemId,
  sectionType,
  designSystem,
  isActive = false,
  isLoading = false,
  onUse,
  size = "small",
}: {
  designSystemId: string;
  sectionType: string;
  designSystem?: DesignSystem;
  isActive?: boolean;
  isLoading?: boolean;
  onUse: () => void;
  size?: "small" | "large";
}) {
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lazy load: only fetch template when card becomes visible
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    loadTemplate(designSystemId, sectionType).then(setTemplateHtml);
  }, [isVisible, designSystemId, sectionType]);

  const containerHeight = size === "large" ? "200px" : "140px";
  const themeBlock = designSystem ? buildCssVarBlock(designSystem.styleOverrides) : "";

  return (
    <div
      ref={cardRef}
      className={`border ed-transition group ${
        isActive
          ? "border-[#3d7068] bg-[#3d706808]"
          : "border-[#e5e4de] hover:border-[#3d7068]/40"
      }`}
    >
      {/* Preview thumbnail */}
      <div
        className="relative overflow-hidden bg-white"
        style={{ height: containerHeight }}
      >
        {templateHtml ? (
          <iframe
            srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${themeBlock}<style>body{margin:0;overflow:hidden;pointer-events:none;}</style></head><body>${templateHtml}</body></html>`}
            className="absolute top-0 left-0 border-0"
            style={{
              width: "1200px",
              height: "800px",
              transform: `scale(${size === "large" ? 0.22 : 0.18})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
            sandbox="allow-same-origin"
            loading="lazy"
            title={`${designSystemId} ${sectionType} preview`}
          />
        ) : isVisible ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-3 animate-spin text-[#cccbc4]" />
          </div>
        ) : (
          <div className="h-full bg-[#f7f6f2]" />
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between px-2 py-1.5 border-t border-[#e5e4de] bg-[#f7f6f2]">
        <div className="flex items-center gap-1.5 min-w-0">
          {isActive && <Check className="size-3 text-[#3d7068] shrink-0" />}
          {designSystem && (
            <div className="flex gap-[2px] shrink-0">
              {designSystem.colorPalette.slice(0, 3).map((color, i) => (
                <div
                  key={i}
                  className="w-[8px] h-[8px] border border-[#e5e4de]/50"
                  style={{ backgroundColor: color, borderRadius: "1px" }}
                />
              ))}
            </div>
          )}
          <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-[#2B2B2B] truncate">
            {designSystem?.name || designSystemId}
          </span>
        </div>
        <button
          onClick={onUse}
          disabled={isLoading}
          className="shrink-0 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2f5a53] disabled:opacity-40 ed-transition"
        >
          {isLoading ? "..." : "Use"}
        </button>
      </div>
    </div>
  );
}
