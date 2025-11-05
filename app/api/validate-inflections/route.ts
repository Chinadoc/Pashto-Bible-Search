/**
 * API endpoint to validate inflection entries and compare with word frequency list
 * GET /api/validate-inflections?base_word=رسېدل
 * 
 * Returns:
 * - Total entries in inflections table for base_word
 * - Total entries in word_frequencies table for those forms
 * - Breakdown by part of speech
 * - Missing frequency entries
 */

import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const baseWord = searchParams.get('base_word');

    if (!baseWord) {
      return NextResponse.json(
        { error: 'Missing base_word parameter' },
        { status: 400 }
      );
    }

    const db = getD1ClientOrThrow();

    // Get all inflections for this base word with frequency data
    const inflections = await db.query<{
      id: number;
      inflected_form: string;
      grammatical_info: string | null;
      pos: string | null;
      frequency: number;
      frequency_count: number | null;
      word_freq_pos: string | null;
      frequency_status: 'found' | 'missing';
    }>(`
      SELECT 
        i.id,
        i.inflected_form,
        i.grammatical_info,
        COALESCE(i.pos, '') as pos,
        i.frequency as inflection_frequency,
        wf.frequency_count,
        '' as word_freq_pos,
        CASE WHEN wf.pashto_word IS NULL THEN 'missing' ELSE 'found' END as frequency_status
      FROM inflections i
      LEFT JOIN word_frequencies wf ON i.inflected_form = wf.pashto_word
      WHERE i.base_word = ?
      ORDER BY COALESCE(wf.frequency_count, i.frequency, 0) DESC
    `, [baseWord]);

    // Count by part of speech
    const posCounts = new Map<string, {
      inflection_count: number;
      word_freq_count: number;
      total_frequency: number;
      forms: string[];
    }>();

    for (const row of inflections) {
      const pos = row.pos || row.word_freq_pos || 'unknown';
      const current = posCounts.get(pos) || {
        inflection_count: 0,
        word_freq_count: 0,
        total_frequency: 0,
        forms: [],
      };

      current.inflection_count++;
      if (row.frequency_status === 'found') {
        current.word_freq_count++;
      }
      current.total_frequency += row.frequency_count || row.frequency || 0;
      if (!current.forms.includes(row.inflected_form)) {
        current.forms.push(row.inflected_form);
      }

      posCounts.set(pos, current);
    }

    // Parse inflected_form to get actual forms
    const actualForms: string[] = [];
    for (const row of inflections) {
      const raw = row.inflected_form;
      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            for (const entry of parsed) {
              if (typeof entry === 'string') actualForms.push(entry);
              else if (entry?.form) actualForms.push(entry.form);
            }
          } else if (parsed?.form) {
            actualForms.push(parsed.form);
          } else {
            actualForms.push(raw);
          }
        } catch {
          actualForms.push(raw);
        }
      }
    }

    const uniqueForms = Array.from(new Set(actualForms));

    return NextResponse.json({
      base_word: baseWord,
      total_inflections: inflections.length,
      unique_forms: uniqueForms.length,
      pos_breakdown: Object.fromEntries(posCounts),
      frequency_coverage: {
        with_frequency: inflections.filter(r => r.frequency_status === 'found').length,
        missing_frequency: inflections.filter(r => r.frequency_status === 'missing').length,
        coverage_percent: inflections.length > 0 
          ? Math.round((inflections.filter(r => r.frequency_status === 'found').length / inflections.length) * 100)
          : 0,
      },
      sample_entries: inflections.slice(0, 10).map(row => ({
        inflected_form: row.inflected_form,
        pos: row.pos || row.word_freq_pos || 'unknown',
        inflection_frequency: row.frequency,
        word_freq_count: row.frequency_count,
        frequency_status: row.frequency_status,
      })),
    });
  } catch (error: any) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: error.message || 'Validation failed' },
      { status: 500 }
    );
  }
}

