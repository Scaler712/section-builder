"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { ImageOff, Upload, Link, Check, X } from "lucide-react";
import { toast } from "sonner";
/** Read file as raw base64 data URI — NO resizing, NO compression.
 *  The HTML's own CSS (object-fit, width, height) handles display sizing. */
function readFileAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

interface ImageReplacerProps {
  html: string;
  onHtmlChange: (html: string) => void;
}

interface DetectedImage {
  src: string;
  alt: string;
  isBroken: boolean;
}

/** Extract all images from HTML and flag broken ones */
function detectImages(html: string): DetectedImage[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const seen = new Set<string>();
  const images: DetectedImage[] = [];

  for (const img of Array.from(doc.querySelectorAll("img"))) {
    const src = img.getAttribute("src") || "";
    if (!src || seen.has(src)) continue;
    seen.add(src);

    const alt = img.getAttribute("alt") || "";
    const isBroken =
      src.startsWith("/") ||
      src.startsWith("./") ||
      src.startsWith("../") ||
      src.startsWith("blob:") ||
      (!src.startsWith("http") && !src.startsWith("data:"));

    images.push({ src, alt, isBroken });
  }

  return images;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ImageReplacer({ html, onHtmlChange }: ImageReplacerProps) {
  const images = useMemo(() => detectImages(html), [html]);
  const brokenImages = useMemo(() => images.filter((i) => i.isBroken), [images]);

  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const replaceImage = useCallback(
    (oldSrc: string, newSrc: string) => {
      const escaped = escapeRegex(oldSrc);
      const updated = html.replace(new RegExp(escaped, "g"), newSrc);
      onHtmlChange(updated);
      setReplacingIdx(null);
      setUrlInput("");
      toast.success("Image replaced");
    },
    [html, onHtmlChange]
  );

  const handleFile = useCallback(
    async (file: File, oldSrc: string) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Not an image file");
        return;
      }
      try {
        const dataUri = await readFileAsDataUri(file);
        replaceImage(oldSrc, dataUri);
      } catch {
        toast.error("Failed to process image");
      }
    },
    [replaceImage]
  );

  const handleUrlReplace = useCallback(
    (oldSrc: string) => {
      const url = urlInput.trim();
      if (!url) return;
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("data:")) {
        toast.error("Enter a full URL (https://...)");
        return;
      }
      replaceImage(oldSrc, url);
    },
    [urlInput, replaceImage]
  );

  if (brokenImages.length === 0) return null;

  return (
    <div>
      <h3 className="mono-label mb-2 flex items-center gap-2">
        <ImageOff className="size-3.5 text-[#c45040]" />
        Missing Images ({brokenImages.length})
      </h3>
      <p className="font-mono text-[9px] text-[#7a7a72] mb-3 leading-relaxed">
        These images have local paths that won&apos;t work outside Lovable. Upload or paste a URL to replace each one.
      </p>

      <div className="space-y-2.5">
        {brokenImages.map((img, idx) => (
          <div
            key={img.src}
            className="border border-[#e5e4de] bg-white p-2.5"
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="w-10 h-10 min-w-[40px] bg-[#fef3f2] border border-[#fca5a5] flex items-center justify-center">
                <ImageOff className="size-4 text-[#c45040]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] font-semibold text-[#1c1c1c] truncate">
                  {img.alt || "No alt text"}
                </div>
                <div className="font-mono text-[9px] text-[#7a7a72] truncate" title={img.src}>
                  {img.src}
                </div>
              </div>
            </div>

            {replacingIdx === idx ? (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://... image URL"
                    className="flex-1 h-7 px-2 font-mono text-[10px] bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
                    onKeyDown={(e) => e.key === "Enter" && handleUrlReplace(img.src)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleUrlReplace(img.src)}
                    disabled={!urlInput.trim()}
                    className="h-7 px-2 bg-[#3d7068] text-[#f7f6f2] disabled:opacity-40 ed-transition"
                  >
                    <Check className="size-3" />
                  </button>
                  <button
                    onClick={() => { setReplacingIdx(null); setUrlInput(""); }}
                    className="h-7 px-2 text-[#7a7a72] hover:text-[#c45040] ed-transition"
                  >
                    <X className="size-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#e5e4de]" />
                  <span className="font-mono text-[8px] text-[#7a7a72] uppercase">or</span>
                  <div className="flex-1 h-px bg-[#e5e4de]" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-7 flex items-center justify-center gap-1.5 border border-dashed border-[#e5e4de] hover:border-[#3d7068] text-[#7a7a72] hover:text-[#3d7068] font-mono text-[9px] uppercase tracking-[0.1em] ed-transition"
                >
                  <Upload className="size-3" />
                  Upload file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file, img.src);
                    e.target.value = "";
                  }}
                />
              </div>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => { setReplacingIdx(idx); setUrlInput(""); }}
                  className="flex-1 h-7 flex items-center justify-center gap-1.5 bg-[#efede8] hover:bg-[#3d7068] hover:text-[#f7f6f2] text-[#7a7a72] font-mono text-[9px] uppercase tracking-[0.1em] ed-transition"
                >
                  <Link className="size-3" />
                  URL
                </button>
                <button
                  onClick={() => {
                    setReplacingIdx(idx);
                    setTimeout(() => fileInputRef.current?.click(), 50);
                  }}
                  className="flex-1 h-7 flex items-center justify-center gap-1.5 bg-[#efede8] hover:bg-[#3d7068] hover:text-[#f7f6f2] text-[#7a7a72] font-mono text-[9px] uppercase tracking-[0.1em] ed-transition"
                >
                  <Upload className="size-3" />
                  Upload
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
