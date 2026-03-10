"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText, Zap, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SECTIONS } from "@/lib/page-builder/page-sections";
import { loadRegistry, loadTemplate, type Registry } from "@/lib/template-registry";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "sonner";
import type { PageSection } from "@/lib/page-builder/types";

interface PageGeneratorProps {
  apiKey: string;
  onGenerated: (sections: PageSection[]) => void;
  activePreset: string | null;
  onProductNameChange?: (name: string) => void;
  onLanguageChange?: (lang: string) => void;
}

const languages = [
  { value: "en", label: "English" },
  { value: "lv", label: "Latvian" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ru", label: "Russian" },
];

export function PageGenerator({ apiKey, onGenerated, activePreset, onProductNameChange, onLanguageChange }: PageGeneratorProps) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [registry, setRegistry] = useState<Registry>({});
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(DEFAULT_PAGE_SECTIONS.map((s) => s.type))
  );

  // Load registry on mount
  useEffect(() => {
    loadRegistry().then(setRegistry);
  }, []);

  const designSystemId = activePreset || "default";
  const hasPrebuiltTemplates = !!registry[designSystemId] && Object.keys(registry[designSystemId]!).length > 0;

  const toggleSection = (type: string) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Instant page assembly from pre-built templates
  const assembleInstant = async () => {
    if (selectedSections.size === 0) {
      toast.error("Select at least one section");
      return;
    }

    setLoading(true);
    setProgress("Assembling page...");

    try {
      const sections: PageSection[] = [];
      const orderedTypes = DEFAULT_PAGE_SECTIONS.filter((s) =>
        selectedSections.has(s.type)
      );

      for (let i = 0; i < orderedTypes.length; i++) {
        const config = orderedTypes[i]!;
        const html = await loadTemplate(designSystemId, config.type);

        if (html) {
          sections.push({
            id: `${config.type}-${Date.now()}-${i}`,
            type: config.type,
            label: config.label,
            html,
            order: i,
          });
        }
      }

      if (sections.length === 0) {
        toast.error("No templates found for selected sections");
        return;
      }

      onGenerated(sections);
      toast.success(`Page assembled: ${sections.length} sections`);
    } catch {
      toast.error("Failed to assemble page");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  // AI generation fallback (original behavior)
  const generateWithAi = async () => {
    if (!productName.trim()) {
      toast.error("Enter a product name");
      return;
    }
    if (!apiKey || !apiKey.startsWith("sk-ant-")) {
      toast.error("Enter a valid Anthropic API key first");
      return;
    }

    setLoading(true);
    const generatedSections: PageSection[] = [];

    try {
      const orderedTypes = DEFAULT_PAGE_SECTIONS.filter((s) =>
        selectedSections.has(s.type)
      );

      for (let i = 0; i < orderedTypes.length; i++) {
        const sectionConfig = orderedTypes[i]!;
        setProgress(`Generating ${sectionConfig.label}... (${i + 1}/${orderedTypes.length})`);

        const previousSections = generatedSections.map((s) => s.type);

        const res = await fetch("/api/generate-page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            sectionType: sectionConfig.type,
            sectionIndex: i,
            totalSections: orderedTypes.length,
            previousSections,
            productName: productName.trim(),
            description: description.trim() || undefined,
            audience: audience.trim() || undefined,
            price: price.trim() || undefined,
            language,
            designSystemId: activePreset || undefined,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Generation failed" }));
          throw new Error(err.error || `Failed to generate ${sectionConfig.label}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let sectionHtml = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          sectionHtml += decoder.decode(value, { stream: true });
        }

        sectionHtml = sanitizeHtml(sectionHtml);

        const section: PageSection = {
          id: `${sectionConfig.type}-${Date.now()}`,
          type: sectionConfig.type,
          label: sectionConfig.label,
          html: sectionHtml,
          order: i,
        };

        generatedSections.push(section);
        onGenerated([...generatedSections]);
      }

      toast.success("Full page generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
      if (generatedSections.length > 0) {
        onGenerated(generatedSections);
      }
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div>
      <h3 className="mono-label mb-3">Full Page Builder</h3>
      <div className="space-y-3">
        {/* Section picker */}
        <div>
          <label className="mono-label mb-1.5 block">Sections</label>
          <div className="flex flex-wrap gap-1">
            {DEFAULT_PAGE_SECTIONS.map((s) => {
              const isSelected = selectedSections.has(s.type);
              const hasTemplate = !!registry[designSystemId]?.[s.type];
              return (
                <button
                  key={s.type}
                  onClick={() => toggleSection(s.type)}
                  title={s.description}
                  className={`px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] border ed-transition ${
                    isSelected
                      ? "border-[#3d7068] bg-[#3d706812] text-[#3d7068]"
                      : "border-[#e5e4de] text-[#7a7a72] hover:border-[#3d7068]/40"
                  } ${!hasTemplate && hasPrebuiltTemplates ? "opacity-50" : ""}`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <div className="text-[9px] font-mono text-[#7a7a72] mt-1">
            {selectedSections.size} sections selected
          </div>
        </div>

        {/* Instant assembly button (primary) */}
        {hasPrebuiltTemplates && (
          <button
            onClick={assembleInstant}
            disabled={loading || selectedSections.size === 0}
            className="w-full flex items-center justify-center gap-2 h-10 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#2f5a53] disabled:opacity-40 disabled:cursor-not-allowed ed-transition"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Zap className="size-4" />
            )}
            {loading ? progress || "Assembling..." : "Instant Page"}
          </button>
        )}

        {/* Divider */}
        {hasPrebuiltTemplates && (
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-[#e5e4de]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#cccbc4]">
              or customize with AI
            </span>
            <div className="flex-1 border-t border-[#e5e4de]" />
          </div>
        )}

        {/* AI generation fields */}
        <div>
          <label className="mono-label mb-1.5 block">Product Name {!hasPrebuiltTemplates && "*"}</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => { setProductName(e.target.value); onProductNameChange?.(e.target.value); }}
            placeholder="e.g. AI UGC Blueprint"
            className="w-full h-9 px-3 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
          />
        </div>

        <div>
          <label className="mono-label mb-1.5 block">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this product do?"
            className="text-xs font-sans min-h-[60px] resize-none bg-transparent border-[#e5e4de] focus:border-[#3d7068] placeholder:text-[#cccbc4]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mono-label mb-1.5 block">Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Coaches"
              className="w-full h-9 px-3 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
            />
          </div>
          <div>
            <label className="mono-label mb-1.5 block">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. $297"
              className="w-full h-9 px-3 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
            />
          </div>
        </div>

        <div>
          <label className="mono-label mb-1.5 block">Language</label>
          <Select value={language} onValueChange={(v) => { setLanguage(v); onLanguageChange?.(v); }}>
            <SelectTrigger className="h-9 text-xs font-mono bg-transparent border-[#e5e4de] focus:border-[#3d7068]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value} className="text-xs font-mono">
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={generateWithAi}
          disabled={loading || !productName.trim() || !apiKey}
          className={`w-full flex items-center justify-center gap-2 h-10 font-mono text-[10px] uppercase tracking-[0.25em] disabled:opacity-40 disabled:cursor-not-allowed ed-transition ${
            hasPrebuiltTemplates
              ? "border border-[#3d7068] text-[#3d7068] hover:bg-[#3d706808]"
              : "bg-[#3d7068] text-[#f7f6f2] hover:bg-[#2f5a53]"
          }`}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          {loading ? progress || "Generating..." : "Generate with AI"}
        </button>
      </div>
    </div>
  );
}
