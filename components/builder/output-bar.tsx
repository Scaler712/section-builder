"use client";

import { Copy, Trash2, Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Device = "desktop" | "tablet" | "mobile";

interface OutputBarProps {
  html: string;
  device: Device;
  onDeviceChange: (d: Device) => void;
  onClear: () => void;
}

export function OutputBar({ html, device, onDeviceChange, onClear }: OutputBarProps) {
  const copy = async () => {
    if (!html.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    await navigator.clipboard.writeText(html);
    toast.success("HTML copied to clipboard");
  };

  const devices: { key: Device; icon: React.ReactNode; label: string }[] = [
    { key: "mobile", icon: <Smartphone className="size-4" />, label: "Mobile (375px)" },
    { key: "tablet", icon: <Tablet className="size-4" />, label: "Tablet (768px)" },
    { key: "desktop", icon: <Monitor className="size-4" />, label: "Desktop (100%)" },
  ];

  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#e5e4de] bg-[#f7f6f2]">
      <Button
        variant="outline"
        size="sm"
        onClick={copy}
        className="gap-2 font-mono text-[10px] uppercase tracking-[0.2em] border-[#e5e4de] bg-transparent hover:bg-[#3d7068] hover:text-[#f7f6f2] hover:border-[#3d7068] ed-transition"
      >
        <Copy className="size-3.5" />
        Copy HTML
      </Button>

      <div className="flex items-center gap-0.5">
        {devices.map((d) => (
          <button
            key={d.key}
            onClick={() => onDeviceChange(d.key)}
            title={d.label}
            className={`p-2 rounded-sm ed-transition ${
              device === d.key
                ? "bg-[#3d7068] text-[#f7f6f2]"
                : "text-[#7a7a72] hover:text-[#1c1c1c] hover:bg-[#efede8]"
            }`}
          >
            {d.icon}
          </button>
        ))}
      </div>

      <button
        onClick={onClear}
        className="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a7a72] hover:text-[#c45040] ed-transition"
      >
        <Trash2 className="size-3.5" />
        Clear
      </button>
    </div>
  );
}
