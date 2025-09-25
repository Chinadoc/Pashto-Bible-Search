import { NextRequest, NextResponse } from 'next/server';

import { collectRelatedForms } from '@/app/lib/variants';

export const runtime = 'nodejs';

type Payload = {
  form?: string;
  word?: string;
  lemma?: string;
  root?: string;
  query?: string;
};

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const input = body.form ?? body.word ?? body.lemma ?? body.root ?? body.query ?? '';
    const query = input.trim();

    if (!query) {
      return NextResponse.json({ error: 'form is required' }, { status: 400 });
    }

    const payload = await collectRelatedForms(query, { includeRelated: true });

    return NextResponse.json({
      root: payload.root,
      forms: payload.forms,
      total: payload.total,
      variantDetails: payload.variantDetails,
      ms: Date.now() - startedAt,
    });
  } catch (error) {
    console.error('Related forms error', error);
    return NextResponse.json(
      { error: 'Related forms failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
