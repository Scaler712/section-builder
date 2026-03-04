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

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="size-3.5" />,
  LayoutGrid: <LayoutGrid className="size-3.5" />,
  AlertTriangle: <AlertTriangle className="size-3.5" />,
  ArrowRightLeft: <ArrowRightLeft className="size-3.5" />,
  Quote: <Quote className="size-3.5" />,
  CreditCard: <CreditCard className="size-3.5" />,
  HelpCircle: <HelpCircle className="size-3.5" />,
  MousePointerClick: <MousePointerClick className="size-3.5" />,
  ShieldCheck: <ShieldCheck className="size-3.5" />,
  User: <User className="size-3.5" />,
  Timer: <Timer className="size-3.5" />,
  PlayCircle: <PlayCircle className="size-3.5" />,
};

interface TemplatePickerProps {
  activeTemplate: string | null;
  onSelect: (id: string) => void;
}

export function TemplatePicker({ activeTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div>
      <h3 className="mono-label mb-3">Templates</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex flex-col items-center gap-1.5 p-3 border text-center ed-transition ${
              activeTemplate === t.id
                ? "border-[#3d7068] bg-[#3d706810] text-[#3d7068]"
                : "border-[#e5e4de] text-[#7a7a72] hover:border-[#3d7068] hover:text-[#1c1c1c]"
            }`}
          >
            {iconMap[t.icon] || <Sparkles className="size-3.5" />}
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] leading-tight">
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
