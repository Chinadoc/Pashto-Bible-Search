// Debug endpoint to test buildInlineRelatedForms
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const word = url.searchParams.get('word') || 'وهل';
    const translation = (url.searchParams.get('translation') || 'afghan2023') as 'afghan2023' | 'yousafzai2019';

    try {
        // Import the actual function used in search
        const { getVerbVariantsWithD1Fallback } = await import('@/app/api/search/route');

        console.log(`Testing verb variants lookup for: "${word}"`);

        const variants = await getVerbVariantsWithD1Fallback(word, { cap: 20 });

        return NextResponse.json({
            success: true,
            word,
            translation,
            variantsCount: variants.length,
            variants: variants.slice(0, 10).map(v => ({ form: v.form, label: v.label })),
            message: variants.length > 0
                ? `Found ${variants.length} variants (includes algorithmic generation)`
                : 'No variants found - check if function exists'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            word,
        }, { status: 500 });
    }
}
