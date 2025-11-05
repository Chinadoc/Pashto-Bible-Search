import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

interface ApiKeysRequest {
  elevenlabs?: string;
  assemblyai?: string;
  huggingface?: string;
  deepseek?: string;
}

async function ensureTable(db: ReturnType<typeof getD1ClientOrThrow>) {
  await db.query(
    `CREATE TABLE IF NOT EXISTS api_keys (
      service TEXT PRIMARY KEY,
      api_key TEXT,
      updated_at TEXT
    )`
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: ApiKeysRequest = await request.json();
    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({
        success: true,
        message: 'API keys configured (using request-time keys)',
        stored: false,
      });
    }

    await ensureTable(db);

    const now = new Date().toISOString();
    const entries: Array<{ service: string; key?: string }> = [
      { service: 'elevenlabs', key: body.elevenlabs },
      { service: 'assemblyai', key: body.assemblyai },
      { service: 'huggingface', key: body.huggingface },
      { service: 'deepseek', key: body.deepseek },
    ];

    for (const entry of entries) {
      if (entry.key) {
        await db.query(
          `INSERT OR REPLACE INTO api_keys (service, api_key, updated_at) VALUES (?, ?, ?)`,
          [entry.service, entry.key, now]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API keys stored successfully',
      stored: true,
    });
  } catch (error) {
    console.error('API keys configuration error:', error);
    return NextResponse.json({
      success: true,
      message: 'API keys will be used from request',
      stored: false,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({
        success: true,
        keys: [],
        message: 'No stored keys found',
      });
    }

    await ensureTable(db);

    const rows = await db.query<{ service: string; updated_at: string | null }>(
      `SELECT service, updated_at FROM api_keys ORDER BY service`
    );

    return NextResponse.json({
      success: true,
      keys: rows || [],
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      keys: [],
      message: 'Could not retrieve keys',
    });
  }
}
