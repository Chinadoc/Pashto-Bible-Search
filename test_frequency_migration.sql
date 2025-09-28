-- Simple test migration for word_frequencies_unified
CREATE TABLE IF NOT EXISTS public.word_frequencies_unified (
  id bigserial PRIMARY KEY,
  pashto_word text NOT NULL UNIQUE,
  total_frequency integer NOT NULL DEFAULT 0,
  ot_frequency integer DEFAULT 0,
  nt_frequency integer DEFAULT 0,
  romanization text,
  pos text,
  english_translation text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_word ON public.word_frequencies_unified(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_total_freq ON public.word_frequencies_unified(total_frequency DESC);
CREATE INDEX IF NOT EXISTS idx_word_frequencies_unified_pos ON public.word_frequencies_unified(pos);

-- Insert test data
INSERT INTO public.word_frequencies_unified (pashto_word, total_frequency, ot_frequency, nt_frequency, romanization, pos, english_translation)
VALUES
('وهل', 100, 50, 50, 'wahal', 'verb', 'to take'),
('کور', 200, 100, 100, 'kor', 'noun', 'house'),
('پلار', 150, 75, 75, 'plaar', 'noun', 'father')
ON CONFLICT (pashto_word) DO UPDATE SET
  total_frequency = EXCLUDED.total_frequency,
  ot_frequency = EXCLUDED.ot_frequency,
  nt_frequency = EXCLUDED.nt_frequency,
  updated_at = now();
