import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

function isVideoAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.VIDEO_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to process videos' }, { status: 401 });
  }
  if (!isVideoAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Your account is not allowed to process videos' }, { status: 403 });
  }

  const { youtubeUrl } = await request.json();
  const response = await fetch(`${WORKER_URL}/api/videos/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': process.env.ADMIN_API_SECRET || '' },
    body: JSON.stringify({ youtubeUrl }),
  });
  return NextResponse.json(await response.json(), { status: response.status });
}
