"use client";

import { useState, useRef, useCallback } from "react";
import { Image, Video, Link, Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import { processImageFile } from "@/lib/image-utils";

export type ImageWidth = "25" | "50" | "75" | "100";

interface MediaPanelProps {
  onInsertImage: (src: string, alt: string, width: ImageWidth) => void;
  onInsertVideo: (embedUrl: string) => void;
}

/**
 * Convert a YouTube/Vimeo URL to an embeddable URL.
 */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);

    // YouTube: youtube.com/watch?v=ID or youtu.be/ID
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo: vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace(/\//g, "");
      if (/^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }

    // Loom: loom.com/share/ID
    if (u.hostname.includes("loom.com")) {
      const match = u.pathname.match(/\/share\/([a-f0-9]+)/);
      if (match) return `https://www.loom.com/embed/${match[1]}`;
    }

    // Already an embed URL
    if (url.includes("/embed/")) return url;

    return null;
  } catch {
    return null;
  }
}

export function MediaPanel({ onInsertImage, onInsertVideo }: MediaPanelProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState<ImageWidth>("50");
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported");
      return;
    }
    try {
      const dataUri = await processImageFile(file);
      setImagePreview(dataUri);
    } catch {
      toast.error("Failed to process image");
    }
  }, []);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }, [handleFile]);

  const previewUrl = () => {
    if (!imageUrl.trim()) return;
    setImagePreview(imageUrl.trim());
  };

  const insertImage = () => {
    if (!imagePreview) return;
    onInsertImage(imagePreview, imageAlt.trim() || "Image", imageWidth);
    setImagePreview(null);
    setImageAlt("");
    setImageUrl("");
    setImageWidth("50");
    toast.success("Image inserted");
  };

  const clearPreview = () => {
    setImagePreview(null);
    setImageAlt("");
    setImageUrl("");
    setImageWidth("50");
  };

  const insertVideo = () => {
    const embed = toEmbedUrl(videoUrl.trim());
    if (!embed) {
      toast.error("Paste a YouTube, Vimeo, or Loom URL");
      return;
    }
    onInsertVideo(embed);
    setVideoUrl("");
    setShowVideoForm(false);
    toast.success("Video embedded");
  };

  return (
    <div>
      <h3 className="mono-label mb-3">Media</h3>

      <div className="space-y-3">
        {/* Drop zone — always visible */}
        <div
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-20 border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer ed-transition ${
            isDragOver
              ? "border-[#3d7068] bg-[#3d7068]/10 text-[#3d7068]"
              : "border-[#e5e4de] hover:border-[#3d7068] text-[#7a7a72] hover:text-[#3d7068]"
          }`}
        >
          <Upload className="size-5" />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
            {isDragOver ? "Drop image here" : "Drop image or click to browse"}
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />

        {/* URL input */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-px bg-[#e5e4de]" />
            <span className="font-mono text-[9px] text-[#7a7a72] uppercase tracking-[0.15em]">or paste url</span>
            <div className="flex-1 h-px bg-[#e5e4de]" />
          </div>
          <div className="flex gap-1">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 h-8 px-2 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
              onKeyDown={(e) => e.key === "Enter" && previewUrl()}
            />
            <button onClick={previewUrl} disabled={!imageUrl.trim()} className="h-8 px-2 bg-[#efede8] text-[#7a7a72] hover:text-[#1c1c1c] disabled:opacity-40 ed-transition">
              <Link className="size-3" />
            </button>
          </div>
        </div>

        {/* Preview + Width picker + Insert */}
        {imagePreview && (
          <div className="space-y-2">
            <div className="relative border border-[#e5e4de] bg-white p-1">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto max-h-32 object-contain"
                onError={() => { setImagePreview(null); toast.error("Image failed to load"); }}
              />
              <button
                onClick={clearPreview}
                className="absolute top-1 right-1 p-0.5 bg-white/80 text-[#7a7a72] hover:text-[#1c1c1c] ed-transition"
              >
                <X className="size-3" />
              </button>
            </div>

            {/* Width selector */}
            <div>
              <label className="mono-label mb-1 block text-[9px]">Width</label>
              <div className="flex gap-0.5 bg-[#efede8] p-0.5">
                {(["25", "50", "75", "100"] as ImageWidth[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setImageWidth(w)}
                    className={`flex-1 py-1 font-mono text-[10px] ed-transition ${
                      imageWidth === w
                        ? "bg-[#3d7068] text-[#f7f6f2]"
                        : "text-[#7a7a72] hover:text-[#1c1c1c]"
                    }`}
                  >
                    {w}%
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Alt text (optional)"
              className="w-full h-7 px-2 font-mono text-[10px] bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
            />
            <button
              onClick={insertImage}
              className="w-full h-8 flex items-center justify-center gap-1.5 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#2f5a53] ed-transition"
            >
              <Check className="size-3" />
              Insert Image
            </button>
          </div>
        )}

        {/* Video */}
        {showVideoForm ? (
          <div className="p-3 border border-[#e5e4de] bg-[#efede8]/30 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="mono-label">Embed Video</span>
              <button onClick={() => setShowVideoForm(false)} className="p-0.5 text-[#7a7a72] hover:text-[#1c1c1c]">
                <X className="size-3" />
              </button>
            </div>

            <div>
              <label className="mono-label mb-1 block text-[9px]">Video URL</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full h-8 px-2 font-mono text-xs bg-transparent border border-[#e5e4de] focus:border-[#3d7068] focus:outline-none ed-transition placeholder:text-[#cccbc4]"
                onKeyDown={(e) => e.key === "Enter" && insertVideo()}
              />
            </div>

            <button
              onClick={insertVideo}
              disabled={!videoUrl.trim()}
              className="w-full h-8 flex items-center justify-center gap-1.5 bg-[#3d7068] text-[#f7f6f2] font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#2f5a53] disabled:opacity-40 ed-transition"
            >
              <Video className="size-3" />
              Embed Video
            </button>

            <p className="font-mono text-[9px] text-[#7a7a72] leading-relaxed">
              Supports YouTube, Vimeo, and Loom links.
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowVideoForm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 border border-[#e5e4de] text-[#7a7a72] hover:text-[#3d7068] hover:border-[#3d7068] font-mono text-[10px] uppercase tracking-[0.15em] ed-transition"
          >
            <Video className="size-3.5" />
            Add Video
          </button>
        )}
      </div>

      <p className="font-mono text-[9px] text-[#7a7a72] mt-3 leading-relaxed">
        You can also click photo placeholders in the preview to replace them.
      </p>
    </div>
  );
}
