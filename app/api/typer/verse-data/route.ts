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

// Comprehensive Pashto to Romanized fallback map
// Using LingDocs-style romanization: https://dictionary.lingdocs.com
const charMap: Record<string, string> = {
    // Basic Arabic/Pashto consonants
    'ا': 'a', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'ل': 'l',
    'م': 'm', 'ن': 'n', 'ه': 'h', 'ی': 'y', 'ې': 'e', 'ۍ': 'uy', 'ئ': 'ey',
    'ء': '', 'ے': 'e', 'ى': 'a',
    
    // PASHTO-SPECIFIC LETTERS (retroflex consonants) - LingDocs uses capitals
    'ټ': 'T',   // retroflex t
    'ډ': 'D',   // retroflex d
    'ړ': 'R',   // retroflex r (like American r)
    'ڼ': 'N',   // retroflex n
    'ږ': 'G',   // retroflex voiced fricative (CRITICAL - was missing!)
    'ښ': 'x',   // voiceless retroflex fricative (like German ch)
    'ګ': 'g',   // Pashto g
    'ۀ': 'u',   // schwa/short u
    
    // و can be 'w' consonant or 'o/oo' vowel - default to 'oo' for common cases
    'و': 'oo',
    
    // Diacritics (short vowels) - map to their sound
    'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ْ': '', 'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
    'ّ': '', // Shadda (gemination) - doubled consonant, ignore in simple transliteration
    
    // Common combinations
    'ؤ': 'o', 'إ': 'i', 'أ': 'a',
    
    // Space and punctuation
    ' ': ' ', '،': ',', '۔': '.', '؟': '?', '؛': ';', ':': ':', '«': '"', '»': '"',
    
    // Numbers
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

function transliterate(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        // Only include mapped characters - skip any unmapped Pashto/Arabic chars
        if (charMap[char] !== undefined) {
            result += charMap[char];
        }
        // Skip unmapped characters entirely (don't keep Pashto chars in romanization)
    }
    // Clean up double spaces and trim
    return result.replace(/\s+/g, ' ').trim();
}

// Clean a word for dictionary lookup (remove diacritics and punctuation)
function cleanForLookup(word: string): string {
    return word
        .replace(/[َُِْـًٌٍّ،۔\.؟؛\-]/g, '') // Remove diacritics and punctuation
        .trim();
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
            // Clean for dictionary lookup (remove punctuation and diacritics)
            const cleanWord = cleanForLookup(word);
            
            // Try multiple lookup strategies
            let entry = dictionary?.[cleanWord];
            
            // Try without final ی/ې/ه (common endings)
            if (!entry && cleanWord.length > 2) {
                const withoutEnding = cleanWord.replace(/[یېه]$/, '');
                entry = dictionary?.[withoutEnding];
            }
            
            // Try base form for common prefixes
            if (!entry && cleanWord.startsWith('و')) {
                entry = dictionary?.[cleanWord.slice(1)];
            }

            // Get transliteration - prefer dictionary, fallback to computed
            let romanized = entry?.romanization || transliterate(cleanWord);
            
            // CRITICAL: Strip any non-ASCII/non-roman characters from romanization
            // This ensures we never display Pashto characters in the hint
            romanized = romanized.replace(/[^\x00-\x7F]/g, '').trim();
            
            // If romanized is empty after cleaning, compute it fresh
            if (!romanized) {
                romanized = transliterate(cleanWord);
            }
            
            // Make sure we have a valid first character for typing
            const firstChar = romanized.charAt(0).toLowerCase();
            const validFirstChar = /[a-z]/.test(firstChar) ? firstChar : transliterate(cleanWord.charAt(0)).charAt(0).toLowerCase() || 'a';

            return {
                p: word, // Keep original with punctuation for display
                t: romanized || validFirstChar, // Romanization for hint (guaranteed Roman characters only)
                e: entry?.english || '', // English definition (empty instead of '?')
                firstKey: validFirstChar // Explicit first key to type (guaranteed a-z)
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
