import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { optimizeImage } from '@/lib/image-optimizer';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // Verify file exists
  if (!request.body || !filename) {
    return NextResponse.json({ error: 'File or filename missing' }, { status: 400 });
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image
    const optimized = await optimizeImage(buffer);
    
    // Change extension to .webp if it's not already
    const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
    const optimizedFilename = `${baseName}.webp`;

    const blob = await put(optimizedFilename, optimized.buffer, {
      access: 'public',
      contentType: 'image/webp',
    });

    return NextResponse.json({
        ...blob,
        width: optimized.width,
        height: optimized.height,
        originalSize: buffer.length,
        optimizedSize: optimized.buffer.length
    });
  } catch (error) {
    console.error("Upload/Optimization error:", error);
    return NextResponse.json({ error: 'Upload or optimization failed' }, { status: 500 });
  }
}
