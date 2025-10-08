/**
 * Webhook endpoint for external content updates
 *
 * This endpoint receives notifications from n8n workflows or other external
 * services when content changes are detected on the Afghan Bibles website.
 *
 * Integration Points:
 * - n8n workflow triggers
 * - Content synchronization
 * - Automated deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Configuration
const WEBHOOK_SECRET = process.env.EXTERNAL_UPDATE_WEBHOOK_SECRET;
const ALLOWED_SOURCES = ['n8n', 'afghan_bibles_monitor', 'content_sync'];

interface ContentUpdate {
  url: string;
  content_type: 'text' | 'audio' | 'metadata';
  change_type: 'new' | 'modified' | 'deleted';
  metadata: {
    book_slug?: string;
    chapter?: number;
    last_modified?: string;
    [key: string]: any;
  };
}

interface WebhookPayload {
  timestamp: string;
  source: string;
  updates: ContentUpdate[];
  trigger_type?: 'manual' | 'scheduled' | 'real-time';
}

/**
 * Verify webhook authenticity
 */
function verifyWebhook(request: NextRequest, payload: any): boolean {
  if (!WEBHOOK_SECRET) {
    // If no secret configured, allow all requests (development mode)
    return true;
  }

  const signature = request.headers.get('x-webhook-signature');
  const source = payload.source;

  if (!signature || !ALLOWED_SOURCES.includes(source)) {
    return false;
  }

  // In production, implement proper HMAC verification
  // For now, just check if the source is allowed
  return true;
}

/**
 * Process content updates and trigger rebuilds
 */
async function processContentUpdates(updates: ContentUpdate[]): Promise<{
  success: boolean;
  processed: number;
  errors: string[];
  rebuildTriggered: boolean;
}> {
  const results = {
    success: true,
    processed: 0,
    errors: [] as string[],
    rebuildTriggered: false
  };

  try {
    // Group updates by content type
    const textUpdates = updates.filter(u => u.content_type === 'text');
    const audioUpdates = updates.filter(u => u.content_type === 'audio');

    // Process text updates
    if (textUpdates.length > 0) {
      await processTextUpdates(textUpdates);
      results.processed += textUpdates.length;
    }

    // Process audio updates
    if (audioUpdates.length > 0) {
      await processAudioUpdates(audioUpdates);
      results.processed += audioUpdates.length;
    }

    // Trigger rebuild if any content was updated
    if (results.processed > 0) {
      await triggerDataRebuild();
      results.rebuildTriggered = true;
    }

  } catch (error) {
    results.success = false;
    results.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return results;
}

/**
 * Process text content updates
 */
async function processTextUpdates(updates: ContentUpdate[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'app', 'data');

  for (const update of updates) {
    try {
      if (!update.metadata.book_slug || !update.metadata.chapter) {
        continue;
      }

      const { book_slug, chapter } = update.metadata;
      const filename = `${book_slug.replace('-', '')}${chapter}_pashto.txt`;
      const filePath = path.join(dataDir, filename);

      // Check if file exists and if it needs updating
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      if (update.change_type === 'deleted' && fileExists) {
        await fs.unlink(filePath);
        console.log(`Deleted text file: ${filename}`);
      } else if (update.change_type === 'new' || update.change_type === 'modified') {
        // For new/modified files, we'd typically fetch the content here
        // For now, just log that an update is needed
        console.log(`Text update needed for: ${filename}`);
      }

    } catch (error) {
      console.error(`Error processing text update ${update.url}:`, error);
      throw error;
    }
  }
}

/**
 * Process audio content updates
 */
async function processAudioUpdates(updates: ContentUpdate[]): Promise<void> {
  // Audio processing would involve downloading new audio files
  // and updating the audio_file_map.json

  for (const update of updates) {
    try {
      console.log(`Audio update needed for: ${update.url}`);

      // Implementation would:
      // 1. Download new audio file
      // 2. Update audio_file_map.json
      // 3. Trigger audio processing pipeline

    } catch (error) {
      console.error(`Error processing audio update ${update.url}:`, error);
      throw error;
    }
  }
}

/**
 * Trigger data rebuild process
 */
async function triggerDataRebuild(): Promise<void> {
  try {
    // Trigger the data loading and indexing process
    // This could be done by running Python scripts or triggering other processes

    console.log('Triggering data rebuild...');

    // Example: Run a Python script to rebuild indexes
    const scriptPath = path.join(process.cwd(), 'rebuild_data_indexes.py');

    try {
      await execAsync(`python3 ${scriptPath}`);
      console.log('Data rebuild completed successfully');
    } catch (execError) {
      console.error('Data rebuild failed:', execError);
      throw new Error(`Data rebuild failed: ${execError}`);
    }

  } catch (error) {
    console.error('Error triggering data rebuild:', error);
    throw error;
  }
}

/**
 * Main webhook handler
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: WebhookPayload = await request.json();

    // Verify webhook authenticity
    if (!verifyWebhook(request, payload)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate payload structure
    if (!payload.updates || !Array.isArray(payload.updates)) {
      return NextResponse.json(
        { error: 'Invalid payload: missing or invalid updates array' },
        { status: 400 }
      );
    }

    console.log(`Received webhook from ${payload.source} with ${payload.updates.length} updates`);

    // Process the updates
    const results = await processContentUpdates(payload.updates);

    // Return success response
    return NextResponse.json({
      success: results.success,
      processed: results.processed,
      rebuildTriggered: results.rebuildTriggered,
      errors: results.errors,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint for webhook monitoring
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/api/external-updates',
      health: '/api/external-updates (GET)'
    },
    features: [
      'Content update processing',
      'Data rebuild triggering',
      'Authentication verification'
    ]
  });
}




