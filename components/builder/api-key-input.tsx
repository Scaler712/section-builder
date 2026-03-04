"use client";

import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, Check } from "lucide-react";

const STORAGE_KEY = "sb-anthropic-key";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false);

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
      <label className="mono-label flex items-center gap-1.5 mb-2">
        <Key className="size-3" />
        API Key
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full h-9 px-3 pr-16 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {apiKey && isValid && (
            <Check className="size-3.5 text-[#3d7068]" />
          )}
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="p-1 text-[#7a7a72] hover:text-[#1c1c1c] ed-transition"
          >
            {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
        </div>
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#7a7a72] mt-1.5">
        Session only. Never stored server-side.
      </p>
    </div>
  );
}
