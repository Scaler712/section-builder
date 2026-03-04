"use client";

import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "sb-anthropic-key";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && !apiKey) {
      onApiKeyChange(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (val: string) => {
    onApiKeyChange(val);
    if (val) {
      sessionStorage.setItem(STORAGE_KEY, val);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const isValid = apiKey.startsWith("sk-ant-");

  return (
    <div>
      <Label className="text-xs mb-1.5 flex items-center gap-1.5">
        <Key className="size-3" />
        API Key
      </Label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full h-9 px-3 pr-16 text-sm rounded-md border border-input bg-background font-mono"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {apiKey && isValid && (
            <Check className="size-3.5 text-emerald-500" />
          )}
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">
        Stored in browser session only. Never sent to our servers.
      </p>
    </div>
  );
}
