import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // 1. Authorize user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request JSON payload
    const { base64 } = await request.json();
    if (!base64) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // 3. Decode base64 image data
    const match = base64.match(/^data:(image\/[a-zA-Z0-9\-\+\.]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid base64 image format' }, { status: 400 });
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 4. Determine file extension
    let extension = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      extension = 'jpg';
    } else if (mimeType.includes('webp')) {
      extension = 'webp';
    } else if (mimeType.includes('gif')) {
      extension = 'gif';
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    // 5. Check if running in production with Vercel Blob configuration
    const isProdBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (isProdBlob) {
      // Production: Upload to Vercel Blob cloud folder
      console.log('[API/Upload] Uploading to Vercel Blob:', filename);
      const blob = await put(filename, buffer, {
        contentType: mimeType,
        access: 'public',
      });
      return NextResponse.json({ url: blob.url });
    } else {
      // Local Development: Save to 'public/uploads' local directory
      console.log('[API/Upload] Saving to local folder:', filename);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure the uploads folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      
      // Return relative public path
      const localUrl = `/uploads/${filename}`;
      return NextResponse.json({ url: localUrl });
    }
  } catch (error: any) {
    console.error('[API/Upload] Error processing upload:', error);
    return NextResponse.json({ error: 'Failed to process image upload' }, { status: 500 });
  }
}
