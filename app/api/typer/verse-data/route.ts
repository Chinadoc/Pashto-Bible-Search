import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Simple cache for dictionary
let dictionaryCache: Record<string, any> | null = null;

function getDictionary() {
    if (dictionaryCache) return dictionaryCache;

    try {
        const filePath = path.join(process.cwd(), 'public', 'full_dictionary_enriched.json');
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            // Index by Pashto form for fast lookup
            dictionaryCache = {};
            data.forEach((entry: any) => {
                if (entry.pashto) dictionaryCache![entry.pashto] = entry;
            });
            return dictionaryCache;
        }
    } catch (e) {
        console.error("Failed to load dictionary", e);
    }
    return {};
}

// Basic Pashto to Romanized fallback map
const charMap: Record<string, string> = {
    'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ټ': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ډ': 'd', 'ذ': 'z', 'ر': 'r', 'ړ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'ګ': 'g', 'ل': 'l',
    'م': 'm', 'ن': 'n', 'ڼ': 'n', 'و': 'w', 'ه': 'h', 'ی': 'y', 'ې': 'e', 'ۍ': 'ai', 'ئ': 'ai', ' ': ' '
};

function transliterate(text: string): string {
    return text.split('').map(c => charMap[c] || c).join('');
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (!ref) {
        return NextResponse.json({ error: "Reference required" }, { status: 400 });
    }

    try {
        // Fetch verse from Cloudflare Worker
        const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
        const workerRes = await fetch(`${workerUrl}/api/verse?ref=${encodeURIComponent(ref)}`);
        
        if (!workerRes.ok) {
            console.error('Worker returned error:', workerRes.status);
            return NextResponse.json({ error: "Verse not found" }, { status: 404 });
        }
        
        const data = await workerRes.json();
        const verseData = data.verse; // The worker returns { verse: {...} }
        
        if (!verseData?.text) {
            return NextResponse.json({ error: "Verse not found" }, { status: 404 });
        }

        // 2. Tokenize and enrich
        const dictionary = getDictionary();
        const words = verseData.text.split(/\s+/);

        const enrichedWords = words.map((word: string) => {
            // Clean punctuation
            const cleanWord = word.replace(/[،۔\.]/g, '');
            const entry = dictionary?.[cleanWord];

            return {
                p: word, // Keep original with punctuation for display
                t: entry?.romanization || transliterate(cleanWord),
                e: entry?.english || '?'
            };
        });

        // Structure as Line[] (one line for now)
        const lines = [{ words: enrichedWords }];

        return NextResponse.json({ lines, verse: verseData });
    } catch (error) {
        console.error("Error generating typer data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
