"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
}

const languages = [
  { value: "en", label: "English" },
  { value: "lv", label: "Latvian" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ru", label: "Russian" },
];

export function AiGenerator({ activeTemplate, onGenerated, onTemplateChange, apiKey }: AiGeneratorProps) {
  const [sectionType, setSectionType] = useState(activeTemplate || "");
  const [language, setLanguage] = useState("en");
  const [productName, setProductName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync section type when template changes externally
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

      // Sanitize final output
      const sanitized = sanitizeHtml(html);
      if (sanitized !== html) {
        onGenerated(sanitized);
      }

      // Also select the template in the picker
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
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        AI Generate
      </h3>
      <div className="space-y-3">
        <div>
          <Label className="text-xs mb-1.5">Section Type</Label>
          <Select
            value={sectionType}
            onValueChange={(v) => {
              setSectionType(v);
              onTemplateChange(v);
            }}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Choose section..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs mb-1.5">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs mb-1.5">Product / Brand Name</Label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. RunAdy"
            className="w-full h-9 px-3 text-sm rounded-md border border-input bg-background"
          />
        </div>

        <div>
          <Label className="text-xs mb-1.5">Custom Instructions</Label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Target audience is ecommerce brands spending $5K+/mo on ads"
            className="text-sm min-h-[80px] resize-none"
          />
        </div>

        <Button onClick={generate} disabled={loading || !sectionType || !apiKey} className="w-full gap-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
