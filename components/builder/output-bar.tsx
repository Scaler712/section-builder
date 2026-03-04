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
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
      <Button variant="outline" size="sm" onClick={copy} className="gap-2">
        <Copy className="size-3.5" />
        Copy HTML
      </Button>

      <div className="flex items-center gap-1">
        {devices.map((d) => (
          <Button
            key={d.key}
            variant={device === d.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceChange(d.key)}
            title={d.label}
          >
            {d.icon}
          </Button>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={onClear} className="gap-2 text-muted-foreground">
        <Trash2 className="size-3.5" />
        Clear
      </Button>
    </div>
  );
}
