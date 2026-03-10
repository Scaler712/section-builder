"use client";

import { AVAILABLE_FONTS } from "@/lib/style-engine";
import type { StyleOverrides } from "@/lib/page-builder/types";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface StyleControlsProps {
  overrides: StyleOverrides;
  onChange: (overrides: StyleOverrides) => void;
}

const radiusOptions = [
  { label: "None", value: "0px" },
  { label: "Sm", value: "8px" },
  { label: "Md", value: "18px" },
  { label: "Lg", value: "24px" },
  { label: "Full", value: "50px" },
];

const spacingOptions: { label: string; value: "compact" | "default" | "spacious" }[] = [
  { label: "Compact", value: "compact" },
  { label: "Default", value: "default" },
  { label: "Spacious", value: "spacious" },
];

export function StyleControls({ overrides, onChange }: StyleControlsProps) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof StyleOverrides, value: string) => {
    onChange({ ...overrides, [key]: value });
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full mono-label mb-3"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        Style Controls
      </button>

      {open && (
        <div className="space-y-4">
          {/* Colors */}
          <div>
            <label className="mono-label mb-2 block">Colors</label>
            <div className="grid grid-cols-2 gap-2">
              <ColorInput label="Headings" value={overrides.headingColor} onChange={(v) => update("headingColor", v)} />
              <ColorInput label="Body" value={overrides.bodyColor} onChange={(v) => update("bodyColor", v)} />
              <ColorInput label="Muted" value={overrides.mutedColor} onChange={(v) => update("mutedColor", v)} />
              <ColorInput label="Accent" value={overrides.accentColor} onChange={(v) => update("accentColor", v)} />
              <ColorInput label="Highlight" value={overrides.highlightBg} onChange={(v) => update("highlightBg", v)} />
              <ColorInput label="CTA Bg" value={overrides.ctaBg} onChange={(v) => update("ctaBg", v)} />
            </div>
          </div>

          {/* Font */}
          <div>
            <label className="mono-label mb-1.5 block">Font</label>
            <select
              value={overrides.fontFamily}
              onChange={(e) => update("fontFamily", e.target.value)}
              className="w-full h-9 px-2 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none"
            >
              {AVAILABLE_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Spacing */}
          <div>
            <label className="mono-label mb-1.5 block">Spacing</label>
            <div className="flex gap-1">
              {spacingOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => update("spacing", s.value)}
                  className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] border ed-transition ${
                    overrides.spacing === s.value
                      ? "border-[#3d7068] bg-[#3d7068] text-[#f7f6f2]"
                      : "border-[#e5e4de] text-[#7a7a72] hover:border-[#3d7068]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Radius */}
          <div>
            <label className="mono-label mb-1.5 block">Card Radius</label>
            <div className="flex gap-1">
              {radiusOptions.map((r) => (
                <button
                  key={r.value}
                  onClick={() => update("cardRadius", r.value)}
                  className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] border ed-transition ${
                    overrides.cardRadius === r.value
                      ? "border-[#3d7068] bg-[#3d7068] text-[#f7f6f2]"
                      : "border-[#e5e4de] text-[#7a7a72] hover:border-[#3d7068]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Button Radius */}
          <div>
            <label className="mono-label mb-1.5 block">Button Radius</label>
            <div className="flex gap-1">
              {radiusOptions.map((r) => (
                <button
                  key={r.value}
                  onClick={() => update("buttonRadius", r.value)}
                  className={`flex-1 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] border ed-transition ${
                    overrides.buttonRadius === r.value
                      ? "border-[#3d7068] bg-[#3d7068] text-[#f7f6f2]"
                      : "border-[#e5e4de] text-[#7a7a72] hover:border-[#3d7068]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 border border-[#e5e4de] cursor-pointer bg-transparent p-0"
        style={{ WebkitAppearance: "none" }}
      />
      <span className="font-mono text-[10px] text-[#7a7a72] uppercase tracking-[0.1em]">
        {label}
      </span>
    </div>
  );
}
