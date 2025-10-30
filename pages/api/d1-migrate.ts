import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { verses } = req.body;

    if (!verses || !Array.isArray(verses)) {
      return res.status(400).json({ error: 'Invalid verses array' });
    }

    // Insert verses into Supabase (temporary until D1 is ready)
    const { data, error } = await supabase
      .from('verses')
      .insert(verses, { returning: 'minimal' })
      .select('count');

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
      inserted: verses.length,
      message: `Successfully inserted ${verses.length} verses`,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    res.status(500).json({ error: error.message });
  }
}

