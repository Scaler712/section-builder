"use client";

import { useMemo } from "react";

type Device = "desktop" | "tablet" | "mobile";

interface PreviewPanelProps {
  html: string;
  device: Device;
}

const deviceWidths: Record<Device, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
};

export function PreviewPanel({ html, device }: PreviewPanelProps) {
  const srcdoc = useMemo(() => {
    if (!html.trim()) {
      return `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Space Mono',monospace;color:#7a7a72;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0;background:#f7f6f2"><p>Select a template or generate with AI</p></body></html>`;
    }
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:0;}</style></head><body>${html}</body></html>`;
  }, [html]);

  return (
    <div className="h-full bg-[#efede8]/50 flex items-start justify-center overflow-auto p-4">
      <iframe
        srcDoc={srcdoc}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        className="bg-white border border-[#e5e4de]"
        style={{
          width: deviceWidths[device],
          maxWidth: "100%",
          height: "100%",
          minHeight: "500px",
        }}
      />
    </div>
  );
}
