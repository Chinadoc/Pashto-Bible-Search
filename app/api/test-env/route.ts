import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAssemblyAIKey: !!process.env.ASSEMBLYAI_API_KEY,
      hasElevenLabsKey: !!process.env.ELEVENLABS_API_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      assemblyAIKey: process.env.ASSEMBLYAI_API_KEY?.substring(0, 10) + '...',
    }
  });
}

