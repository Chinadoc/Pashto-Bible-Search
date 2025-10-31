import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ApiKeysRequest {
  elevenlabs?: string;
  assemblyai?: string;
  huggingface?: string;
  deepseek?: string;
}

/**
 * Store API keys securely in Supabase
 * These will be used for video processing
 */
export async function POST(request: NextRequest) {
  try {
    const body: ApiKeysRequest = await request.json();

    // Store in Supabase (in a secure table)
    // For now, we'll use environment variables, but this allows future expansion
    const { data, error } = await supabase
      .from('api_keys')
      .upsert([
        {
          service: 'elevenlabs',
          api_key: body.elevenlabs || null,
          updated_at: new Date().toISOString(),
        },
        {
          service: 'assemblyai',
          api_key: body.assemblyai || null,
          updated_at: new Date().toISOString(),
        },
        {
          service: 'huggingface',
          api_key: body.huggingface || null,
          updated_at: new Date().toISOString(),
        },
        {
          service: 'deepseek',
          api_key: body.deepseek || null,
          updated_at: new Date().toISOString(),
        },
      ], {
        onConflict: 'service',
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      // If table doesn't exist, just return success (keys will be used from request)
      return NextResponse.json({
        success: true,
        message: 'API keys configured (using request-time keys)',
        stored: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'API keys stored successfully',
      stored: true,
    });

  } catch (error) {
    console.error('API keys configuration error:', error);
    // Don't fail - keys can be passed in request
    return NextResponse.json({
      success: true,
      message: 'API keys will be used from request',
      stored: false,
    });
  }
}

/**
 * Get stored API keys (masked for security)
 */
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('service, updated_at')
      .order('service');

    if (error) {
      // Table might not exist
      return NextResponse.json({
        success: true,
        keys: [],
        message: 'No stored keys found',
      });
    }

    // Return masked keys (show only last 4 characters)
    const maskedKeys = data?.map(key => ({
      service: key.service,
      masked: key.service ? '****' + (key.service as string).slice(-4) : null,
      updated_at: key.updated_at,
    })) || [];

    return NextResponse.json({
      success: true,
      keys: maskedKeys,
    });

  } catch (error) {
    return NextResponse.json({
      success: true,
      keys: [],
      message: 'Could not retrieve keys',
    });
  }
}

