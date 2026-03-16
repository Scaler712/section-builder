import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Use nodejs runtime for Buffer support and larger request bodies
export const runtime = "nodejs";

// Allow up to 10MB request bodies (base64 images are large)
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { base64, filename, contentType } = await req.json();

    if (!base64 || !filename) {
      return NextResponse.json(
        { error: "Missing base64 or filename" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64, "base64");

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: contentType || "image/jpeg",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
