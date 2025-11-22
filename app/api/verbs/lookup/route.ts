import { NextRequest, NextResponse } from 'next/server';
import { getVerbMetadata, getVerbConjugations } from '@/app/lib/cloudflare-d1';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');

    if (!word) {
        return NextResponse.json(
            { error: 'Missing word parameter' },
            { status: 400 }
        );
    }

    try {
        // Fetch metadata and conjugations in parallel
        const [metadata, conjugations] = await Promise.all([
            getVerbMetadata(word),
            getVerbConjugations(word)
        ]);

        if (!metadata && conjugations.length === 0) {
            return NextResponse.json(
                { error: 'Verb not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            word,
            metadata: metadata || null,
            conjugations: conjugations,
            lingdocs_url: metadata?.id
                ? `https://dictionary.lingdocs.com/word?id=${metadata.id}`
                : null
        });
    } catch (error) {
        console.error('Verb lookup failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
