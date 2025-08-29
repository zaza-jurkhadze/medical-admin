import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + "-" + file.name.replace(/\s+/g, "-");
    const filePath = path.join(process.cwd(), "public/img/doctors", filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      imagePath: `/img/doctors/${filename}`
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}