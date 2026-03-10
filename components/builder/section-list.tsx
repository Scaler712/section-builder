"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, RefreshCw, Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SECTIONS } from "@/lib/page-builder/page-sections";
import { sanitizeHtml } from "@/lib/sanitize";
import { loadTemplate } from "@/lib/template-registry";
import { toast } from "sonner";
import type { PageSection } from "@/lib/page-builder/types";

interface SectionListProps {
  sections: PageSection[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (index: number) => void;
  onRegenerate: (index: number, newHtml: string) => void;
  onAdd: (section: PageSection) => void;
  apiKey: string;
  activePreset?: string | null;
  productName?: string;
  language?: string;
}

export function SectionList({
  sections,
  onReorder,
  onDelete,
  onRegenerate,
  onAdd,
  apiKey,
  activePreset,
  productName,
  language,
}: SectionListProps) {
  const [regenerating, setRegenerating] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState("benefits-grid");
  const [addInstructions, setAddInstructions] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMode, setAddMode] = useState<"template" | "ai">("template");

  const regenerateSection = async (index: number) => {
    const section = sections[index];
    if (!section || !apiKey) return;

    setRegenerating(index);
    try {
      const res = await fetch("/api/generate-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          sectionType: section.type,
          sectionIndex: index,
          totalSections: sections.length,
          previousSections: sections.filter((_, i) => i !== index).map((s) => s.type),
          productName: productName || "Product",
          language: language || "en",
          designSystemId: activePreset || undefined,
        }),
      });

      if (!res.ok) throw new Error("Regeneration failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let html = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
      }

      onRegenerate(index, sanitizeHtml(html));
      toast.success(`${section.label} regenerated`);
    } catch {
      toast.error("Regeneration failed");
    } finally {
      setRegenerating(null);
    }
  };

  const addSectionFromTemplate = async () => {
    if (!addType) return;

    setAdding(true);
    try {
      const designSystemId = activePreset || "default";
      var templateHtml = await loadTemplate(designSystemId, addType);

      // Fallback to default if template not found for this design system
      if (!templateHtml && designSystemId !== "default") {
        templateHtml = await loadTemplate("default", addType);
      }

      if (!templateHtml) {
        toast.error(`No template found for ${addType}`);
        return;
      }

      const sectionConfig = DEFAULT_PAGE_SECTIONS.find((s) => s.type === addType);
      const label = sectionConfig?.label || addType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      const newSection: PageSection = {
        id: `${addType}-${Date.now()}`,
        type: addType,
        label,
        html: templateHtml,
        order: sections.length,
      };

      onAdd(newSection);
      setShowAddForm(false);
      toast.success(`${label} added (template)`);
    } catch {
      toast.error("Failed to add section");
    } finally {
      setAdding(false);
    }
  };

  const addSectionWithAi = async () => {
    if (!apiKey || !addType) return;

    setAdding(true);
    try {
      const sectionConfig = DEFAULT_PAGE_SECTIONS.find((s) => s.type === addType);
      const label = sectionConfig?.label || addType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      const bodyPayload: Record<string, unknown> = {
        sectionType: addType,
        sectionIndex: sections.length,
        totalSections: sections.length + 1,
        previousSections: sections.map((s) => s.type),
        productName: productName || "Product",
        language: language || "en",
        designSystemId: activePreset || undefined,
      };

      if (addInstructions.trim()) {
        bodyPayload.description = addInstructions.trim();
      }

      const res = await fetch("/api/generate-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let html = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
      }

      const newSection: PageSection = {
        id: `${addType}-${Date.now()}`,
        type: addType,
        label,
        html: sanitizeHtml(html),
        order: sections.length,
      };

      onAdd(newSection);
      setShowAddForm(false);
      setAddInstructions("");
      toast.success(`${label} added`);
    } catch {
      toast.error("Failed to add section");
    } finally {
      setAdding(false);
    }
  };

  const addSection = () => {
    if (addMode === "template") {
      addSectionFromTemplate();
    } else {
      addSectionWithAi();
    }
  };

  return (
    <div>
      <h3 className="mono-label mb-3">Sections ({sections.length})</h3>
      <div className="space-y-1.5">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-[#efede8]/60 border border-[#e5e4de] group"
          >
            <span className="font-mono text-[10px] text-[#7a7a72] w-4 text-center">
              {index + 1}
            </span>
            <span className="flex-1 font-mono text-xs text-[#2B2B2B] truncate">
              {section.label}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 ed-transition">
              <button
                onClick={() => onReorder(index, index - 1)}
                disabled={index === 0}
                className="p-1 text-[#7a7a72] hover:text-[#3d7068] disabled:opacity-20"
                title="Move up"
              >
                <ArrowUp className="size-3" />
              </button>
              <button
                onClick={() => onReorder(index, index + 1)}
                disabled={index === sections.length - 1}
                className="p-1 text-[#7a7a72] hover:text-[#3d7068] disabled:opacity-20"
                title="Move down"
              >
                <ArrowDown className="size-3" />
              </button>
              <button
                onClick={() => regenerateSection(index)}
                disabled={regenerating !== null}
                className="p-1 text-[#7a7a72] hover:text-[#3d7068] disabled:opacity-40"
                title="Regenerate"
              >
                {regenerating === index ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <RefreshCw className="size-3" />
                )}
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-1 text-[#7a7a72] hover:text-[#c45040]"
                title="Delete"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section */}
      {showAddForm ? (
        <div className="mt-3 p-3 border border-[#e5e4de] bg-[#efede8]/30 space-y-2">
          {/* Mode toggle: Template (instant) vs AI (custom) */}
          <div className="flex gap-0.5 bg-[#efede8] p-0.5">
            <button
              onClick={() => setAddMode("template")}
              className={`flex-1 py-1 font-mono text-[9px] uppercase tracking-[0.15em] ed-transition ${
                addMode === "template" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
              }`}
            >
              Template (Instant)
            </button>
            <button
              onClick={() => setAddMode("ai")}
              className={`flex-1 py-1 font-mono text-[9px] uppercase tracking-[0.15em] ed-transition ${
                addMode === "ai" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
              }`}
            >
              AI Generate
            </button>
          </div>

          <div>
            <label className="mono-label mb-1 block">Section Type</label>
            <Select value={addType} onValueChange={setAddType}>
              <SelectTrigger className="h-8 text-xs font-mono bg-transparent border-[#e5e4de] focus:border-[#3d7068]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_PAGE_SECTIONS.map((s) => (
                  <SelectItem key={s.type} value={s.type} className="text-xs font-mono">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instructions only for AI mode */}
          {addMode === "ai" && (
            <div>
              <label className="mono-label mb-1 block">Instructions (optional)</label>
              <textarea
                value={addInstructions}
                onChange={(e) => setAddInstructions(e.target.value)}
                placeholder="Custom instructions for this section..."
                className="w-full min-h-[60px] px-2 py-2 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4] resize-y"
              />
            </div>
          )}

          {/* AI mode needs API key */}
          {addMode === "ai" && !apiKey && (
            <p className="font-mono text-[10px] text-[#b5a36a]">
              Enter your Anthropic API key to use AI generation
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={addSection}
              disabled={adding || (addMode === "ai" && !apiKey)}
              className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#2f5a53] disabled:opacity-40 ed-transition"
            >
              {adding ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
              {adding ? "Adding..." : addMode === "template" ? "Add Template" : "Generate & Add"}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setAddInstructions(""); }}
              className="px-3 h-8 font-mono text-[10px] uppercase tracking-[0.15em] text-[#7a7a72] hover:text-[#1c1c1c] border border-[#e5e4de] ed-transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 h-8 border border-dashed border-[#e5e4de] text-[#7a7a72] hover:text-[#3d7068] hover:border-[#3d7068] font-mono text-[10px] uppercase tracking-[0.15em] ed-transition"
        >
          <Plus className="size-3" />
          Add Section
        </button>
      )}
    </div>
  );
}
