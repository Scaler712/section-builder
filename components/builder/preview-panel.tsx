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
      return `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#999;font-size:14px;margin:0"><p>Select a template or generate with AI</p></body></html>`;
    }
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:0;}</style></head><body>${html}</body></html>`;
  }, [html]);

  return (
    <div className="h-full bg-muted/30 flex items-start justify-center overflow-auto p-4">
      <iframe
        srcDoc={srcdoc}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        className="bg-white rounded-lg shadow-sm border"
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
