// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generatePrompt } from "@/lib/claude";
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const aspectRatio = formData.get("aspectRatio") as string | null;
    const mjVersion = formData.get("mjVersion") as string | null;

    if (!imageFile || !aspectRatio || !mjVersion) {
      return NextResponse.json(
        { error: "Missing required fields: image, aspectRatio, mjVersion" },
        { status: 400 }
      );
    }

    if (!ACCEPTED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }

    const fileSizeMB = imageFile.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const prompt = await generatePrompt(base64, imageFile.type, aspectRatio, mjVersion);

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Generate API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
