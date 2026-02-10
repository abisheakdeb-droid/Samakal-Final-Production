import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Optional: Add secret validation for production
  // if (secret !== process.env.REVALIDATE_SECRET) {
  //   return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  // }

  try {
    // Revalidate all pages that use site settings
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now() 
    });
  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
