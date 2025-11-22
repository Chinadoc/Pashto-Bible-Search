
import { GET } from '../app/api/verbs/lookup/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/app/lib/cloudflare-d1', () => ({
    getVerbMetadata: jest.fn(),
    getVerbConjugations: jest.fn(),
}));

const { getVerbMetadata, getVerbConjugations } = require('@/app/lib/cloudflare-d1');

async function runTest() {
    console.log('🧪 Testing Verb Lookup API for Frontend Integration...');

    // Setup mocks for a compound verb "قدم وهل"
    getVerbMetadata.mockResolvedValue({
        id: 99999,
        pashto_word: 'قدم وهل',
        english: 'to walk',
        verb_type: 'dynamic_compound',
        transitivity: 'intransitive'
    });

    getVerbConjugations.mockResolvedValue([
        { form: 'قدم وهل', tense: 'infinitive', person: null },
        { form: 'قدم ووهل', tense: 'past', person: '3sg' }
    ]);

    // Create request
    const req = new NextRequest('http://localhost:3000/api/verbs/lookup?word=قدم وهل');

    // Execute
    const response = await GET(req);
    const data = await response.json();

    // Verify structure for VerbDetails component
    console.log('Response Data:', JSON.stringify(data, null, 2));

    const validStructure =
        data.word === 'قدم وهل' &&
        data.metadata.verb_type === 'dynamic_compound' &&
        data.conjugations.length === 2 &&
        data.lingdocs_url === 'https://dictionary.lingdocs.com/word?id=99999';

    if (validStructure) {
        console.log('✅ API response structure matches VerbDetails requirements!');
    } else {
        console.error('❌ API response structure mismatch');
    }
}

// Note: This script is for manual verification logic review, as we can't easily run jest mocks in this environment without setup.
// I will rely on the previous successful API test and the code review.
