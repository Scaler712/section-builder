"use client";

import { useState, useRef } from "react";
import { Image, Link, Upload, X } from "lucide-react";

interface ImageInputProps {
  onImageSelect: (src: string) => void;
  onClose: () => void;
}

export function ImageInput({ onImageSelect, onClose }: ImageInputProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (!url.trim()) return;
    setPreview(url.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resize to max 1200px width, 0.8 quality
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 1200;
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUri = canvas.toDataURL("image/jpeg", 0.8);
        setPreview(dataUri);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const confirm = () => {
    if (preview) {
      onImageSelect(preview);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f7f6f2] border border-[#e5e4de] max-w-md w-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e4de]">
          <h3 className="mono-label">Add Image</h3>
          <button onClick={onClose} className="p-1 text-[#7a7a72] hover:text-[#1c1c1c]">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-0.5 bg-[#efede8] p-0.5">
            <button
              onClick={() => setMode("url")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
                mode === "url" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
              }`}
            >
              <Link className="size-3" />
              URL
            </button>
            <button
              onClick={() => setMode("upload")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ed-transition ${
                mode === "upload" ? "bg-[#3d7068] text-[#f7f6f2]" : "text-[#7a7a72] hover:text-[#1c1c1c]"
              }`}
            >
              <Upload className="size-3" />
              Upload
            </button>
          </div>

          {mode === "url" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full h-9 px-3 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!url.trim()}
                className="w-full h-8 bg-[#efede8] text-[#7a7a72] hover:text-[#1c1c1c] font-mono text-[10px] uppercase tracking-[0.15em] disabled:opacity-40 ed-transition"
              >
                Preview
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    // Feed file through the same resize pipeline
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    if (fileRef.current) {
                      fileRef.current.files = dt.files;
                      fileRef.current.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                  }
                }}
                className={`w-full h-24 border-2 border-dashed flex flex-col items-center justify-center gap-2 ed-transition cursor-pointer ${
                  isDragOver
                    ? "border-[#3d7068] bg-[#3d7068]/10 text-[#3d7068]"
                    : "border-[#e5e4de] hover:border-[#3d7068] text-[#7a7a72] hover:text-[#3d7068]"
                }`}
              >
                <Image className="size-6" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  {isDragOver ? "Drop image here" : "Drop image or click to upload"}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#7a7a72] mt-1">
                Max 1200px width, compressed to JPEG 80%
              </p>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="space-y-2">
              <div className="border border-[#e5e4de] bg-white p-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-48 object-contain"
                  onError={() => setPreview(null)}
                />
              </div>
              <button
                onClick={confirm}
                className="w-full h-9 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#2f5a53] ed-transition"
              >
                Insert Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
