import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const file = data.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), 'public', 'img', 'news', fileName);

    fs.writeFileSync(uploadPath, buffer);

    return NextResponse.json({ url: `/img/news/${fileName}` });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
};