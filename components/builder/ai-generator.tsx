"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templates } from "@/lib/templates";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "sonner";

interface AiGeneratorProps {
  activeTemplate: string | null;
  onGenerated: (html: string) => void;
  onTemplateChange: (id: string) => void;
  apiKey: string;
  activePreset: string | null;
}

const languages = [
  { value: "en", label: "English" },
  { value: "lv", label: "Latvian" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ru", label: "Russian" },
];

export function AiGenerator({ activeTemplate, onGenerated, onTemplateChange, apiKey, activePreset }: AiGeneratorProps) {
  const [sectionType, setSectionType] = useState(activeTemplate || "");
  const [language, setLanguage] = useState("en");
  const [productName, setProductName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  if (activeTemplate && activeTemplate !== sectionType) {
    setSectionType(activeTemplate);
  }

  const generate = async () => {
    if (!sectionType) {
      toast.error("Select a section type first");
      return;
    }
    if (!apiKey || !apiKey.startsWith("sk-ant-")) {
      toast.error("Enter a valid Anthropic API key first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          sectionType,
          language,
          productName: productName.trim() || undefined,
          customInstructions: instructions.trim() || undefined,
          designSystemId: activePreset || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(err.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let html = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
        onGenerated(html);
      }

      const sanitized = sanitizeHtml(html);
      if (sanitized !== html) {
        onGenerated(sanitized);
      }

      onTemplateChange(sectionType);
      toast.success("Section generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mono-label mb-3">AI Generate</h3>
      <div className="space-y-3">
        <div>
          <label className="mono-label mb-1.5 block">Section Type</label>
          <Select
            value={sectionType}
            onValueChange={(v) => {
              setSectionType(v);
              onTemplateChange(v);
            }}
          >
            <SelectTrigger className="h-9 text-xs font-mono bg-transparent border-[#e5e4de] focus:border-[#3d7068]">
              <SelectValue placeholder="Choose section..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs font-mono">
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mono-label mb-1.5 block">Language</label>
          <Select value={language} onValueChange={setLanguage}>
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

        <div>
          <label className="mono-label mb-1.5 block">Product / Brand</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. RunAdy"
            className="w-full h-9 px-3 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
          />
        </div>

        <div>
          <label className="mono-label mb-1.5 block">Instructions</label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Target audience is ecommerce brands spending $5K+/mo on ads"
            className="text-xs font-sans min-h-[80px] resize-none bg-transparent border-[#e5e4de] focus:border-[#3d7068] placeholder:text-[#cccbc4]"
          />
        </div>

        <button
          onClick={generate}
          disabled={loading || !sectionType || !apiKey}
          className="w-full flex items-center justify-center gap-2 h-10 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#2f5a53] disabled:opacity-40 disabled:cursor-not-allowed ed-transition"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
