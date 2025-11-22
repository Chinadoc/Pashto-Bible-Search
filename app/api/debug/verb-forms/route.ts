// Debug endpoint to test buildInlineRelatedForms
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const word = url.searchParams.get('word') || 'وهل';
    const translation = (url.searchParams.get('translation') || 'afghan2023') as 'afghan2023' | 'yousafzai2019';

    try {
        // Import the function
        const { fetchVerbFormsFromD1 } = await import('@/app/lib/cloudflare-d1');

        console.log(`Testing verb forms lookup for: "${word}"`);

        const forms = await fetchVerbFormsFromD1(word, { cap: 20 });

        return NextResponse.json({
            success: true,
            word,
            translation,
            formsCount: forms.length,
            forms: forms.slice(0, 10),
            message: forms.length > 0
                ? `Found ${forms.length} forms`
                : 'No forms found - check if lemma exists in verb_forms table'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            word,
        }, { status: 500 });
    }
}
