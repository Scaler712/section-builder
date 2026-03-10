"use client";

import { designSystems, type DesignSystem } from "@/lib/design-systems";
import { Check } from "lucide-react";

interface PresetPickerProps {
  activePreset: string | null;
  onSelect: (system: DesignSystem) => void;
}

export function PresetPicker({ activePreset, onSelect }: PresetPickerProps) {
  const activeSystem = designSystems.find((s) => s.id === activePreset);

  return (
    <div>
      <h3 className="mono-label mb-1">Design System</h3>
      {activeSystem && (
        <p className="text-[11px] text-[#3d7068] font-mono mb-3 truncate">
          Active: {activeSystem.name}
        </p>
      )}
      {!activeSystem && (
        <p className="text-[11px] text-[#7a7a72] font-mono mb-3">
          Pick a style — AI will match it
        </p>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        {designSystems.map((system) => {
          const isActive = activePreset === system.id;
          return (
            <button
              key={system.id}
              onClick={() => onSelect(system)}
              className={`relative text-left p-2 border ed-transition ${
                isActive
                  ? "border-[#3d7068] bg-[#3d706812]"
                  : "border-[#e5e4de] hover:border-[#3d7068]/40"
              }`}
            >
              {isActive && (
                <div className="absolute top-1 right-1">
                  <Check className="size-3 text-[#3d7068]" />
                </div>
              )}
              <div className="flex gap-[3px] mb-1.5">
                {system.colorPalette.map((color, i) => (
                  <div
                    key={i}
                    className="w-[14px] h-[14px] border border-[#e5e4de]/50"
                    style={{ backgroundColor: color, borderRadius: "2px" }}
                  />
                ))}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#2B2B2B] leading-tight truncate">
                {system.name}
              </div>
              <div className="font-mono text-[8px] text-[#7a7a72] leading-tight truncate mt-0.5">
                {system.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
