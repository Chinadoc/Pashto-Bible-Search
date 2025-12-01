import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '300');
        const pos = searchParams.get('pos') || 'any';
        const scope = searchParams.get('scope') || 'all';

        // Read the static JSON file
        const filePath = path.join(process.cwd(), 'public', 'word_frequency_list.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ items: [] });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        let data;
        try {
            data = JSON.parse(fileContent);
        } catch (e) {
            console.error('Failed to parse word_frequency_list.json', e);
            return NextResponse.json({ items: [] });
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ items: [] });
        }

        // Filter and map data
        let filteredItems = data.map((item: any) => ({
            form: item.pashto,
            frequency: item.frequency,
            pos: item.pos === 'verb' ? 'verb' : item.pos === 'noun' ? 'noun' : undefined,
            dictionary: item.romanization || item.definition ? {
                romanized: item.romanization || '',
                definition: item.definition || '',
                pos: item.pos || '',
                english: item.english || '',
            } : undefined,
        }));

        // Apply POS filter
        if (pos !== 'any') {
            filteredItems = filteredItems.filter((item: any) => item.pos === pos);
        }

        // Apply limit
        const slicedItems = filteredItems.slice(0, limit);

        return NextResponse.json({ items: slicedItems });
    } catch (error) {
        console.error('Error in lexicon_frequency API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
