import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary, { isCloudinaryConfigured } from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Image uploads are not configured." },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  if (files.length > 6) {
    return NextResponse.json(
      { error: "Maximum 6 photos allowed." },
      { status: 400 }
    );
  }

  // Validate all files before uploading
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File "${file.name}" exceeds the 5MB limit.` },
        { status: 400 }
      );
    }
  }

  const urls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "inklink/listings",
            quality: "auto",
            transformation: [{ width: 1200, crop: "limit" }],
          },
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload failed"));
            else resolve(result);
          }
        )
        .end(buffer);
    });

    urls.push(result.secure_url);
  }

  return NextResponse.json({ urls });
}
