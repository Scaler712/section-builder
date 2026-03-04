"use client";

import { templates } from "@/lib/templates";
import {
  Sparkles,
  LayoutGrid,
  AlertTriangle,
  ArrowRightLeft,
  Quote,
  CreditCard,
  HelpCircle,
  MousePointerClick,
  ShieldCheck,
  User,
  Timer,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="size-4" />,
  LayoutGrid: <LayoutGrid className="size-4" />,
  AlertTriangle: <AlertTriangle className="size-4" />,
  ArrowRightLeft: <ArrowRightLeft className="size-4" />,
  Quote: <Quote className="size-4" />,
  CreditCard: <CreditCard className="size-4" />,
  HelpCircle: <HelpCircle className="size-4" />,
  MousePointerClick: <MousePointerClick className="size-4" />,
  ShieldCheck: <ShieldCheck className="size-4" />,
  User: <User className="size-4" />,
  Timer: <Timer className="size-4" />,
  PlayCircle: <PlayCircle className="size-4" />,
};

interface TemplatePickerProps {
  activeTemplate: string | null;
  onSelect: (id: string) => void;
}

export function TemplatePicker({ activeTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Templates
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all text-xs",
              activeTemplate === t.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {iconMap[t.icon] || <Sparkles className="size-4" />}
            <span className="font-medium leading-tight">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
