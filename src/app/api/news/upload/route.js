import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const file = data.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // გადაყვანა ArrayBuffer → Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // ატვირთვა Cloudinary-ში
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "news",
    });

    // ვიბრუნებთ secure_url-ს და public_id-ს
    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
