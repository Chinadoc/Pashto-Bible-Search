
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const streamPipeline = promisify(pipeline);

// Helper to download audio from YouTube
async function downloadAudio(url: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
        const writeStream = fs.createWriteStream(outputPath);
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

// Helper to split audio using ffmpeg
async function splitAudio(inputPath: string, outputDir: string, segmentDuration: number = 300): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const segmentPattern = path.join(outputDir, 'segment_%03d.mp3');
        ffmpeg(inputPath)
            .outputOptions([
                '-f segment',
                `-segment_time ${segmentDuration}`,
                '-c copy'
            ])
            .output(segmentPattern)
            .on('end', () => {
                fs.readdir(outputDir, (err, files) => {
                    if (err) reject(err);
                    else resolve(files.filter(f => f.startsWith('segment_') && f.endsWith('.mp3')).map(f => path.join(outputDir, f)));
                });
            })
            .on('error', reject)
            .run();
    });
}

export async function POST(request: NextRequest) {
    try {
        const { youtubeUrl } = await request.json();

        if (!youtubeUrl) {
            return NextResponse.json({ success: false, error: 'YouTube URL is required' }, { status: 400 });
        }

        if (!ytdl.validateURL(youtubeUrl)) {
            return NextResponse.json({ success: false, error: 'Invalid YouTube URL' }, { status: 400 });
        }

        const videoId = ytdl.getVideoID(youtubeUrl);
        const tempDir = path.join('/tmp', `video_${videoId}`);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const audioPath = path.join(tempDir, 'audio.mp3');

        // 1. Download Audio
        console.log(`Downloading audio for ${videoId}...`);
        await downloadAudio(youtubeUrl, audioPath);

        // 2. Split Audio
        console.log(`Splitting audio for ${videoId}...`);
        const segments = await splitAudio(audioPath, tempDir);

        // 3. Transcribe Segments (Sequentially to avoid rate limits)
        const transcripts: string[] = [];
        for (const segmentPath of segments) {
            console.log(`Transcribing segment: ${segmentPath}`);
            const audioBuffer = fs.readFileSync(segmentPath);
            const audioBlob = new Blob([audioBuffer]);

            const formData = new FormData();
            formData.append('audio', audioBlob, path.basename(segmentPath));
            formData.append('service', 'elevenlabs');

            // Call our own transcribe API (or direct function call if refactored)
            // For now, let's simulate a fetch to our own API or direct logic
            // Since we are in the same server, we can't easily fetch our own API if it's not running.
            // Better to import the logic or call external.
            // But we can reuse the logic from transcribe-audio if we extract it.
            // For simplicity in this step, let's assume we call the external endpoint or duplicate logic.
            // Actually, calling localhost might fail in some envs.
            // Let's duplicate the ElevenLabs call logic here for robustness.

            const apiKey = process.env.ELEVENLABS_API_KEY;
            if (!apiKey) throw new Error('ElevenLabs API key missing');

            const elevenLabsFormData = new FormData();
            elevenLabsFormData.append('file', audioBlob, path.basename(segmentPath));
            elevenLabsFormData.append('model_id', 'scribe_v1');
            elevenLabsFormData.append('language_code', 'ps');

            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
                method: 'POST',
                headers: { 'xi-api-key': apiKey },
                body: elevenLabsFormData,
            });

            if (response.ok) {
                const data = await response.json();
                transcripts.push(data.text);
            } else {
                console.error(`Failed to transcribe segment ${segmentPath}`);
                transcripts.push('[Transcription Failed]');
            }
        }

        // Cleanup
        fs.rmSync(tempDir, { recursive: true, force: true });

        return NextResponse.json({
            success: true,
            videoId,
            transcript: transcripts.join('\n\n'),
            clipsCreated: segments.length
        });

    } catch (error) {
        console.error('Process video complete error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
