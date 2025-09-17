import os
from supabase import create_client, Client

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Missing environment variables")
    exit(1)

supabase: Client = create_client(url, key)

sql = """
CREATE TABLE IF NOT EXISTS public.verses_yousafzai (
  id            bigserial PRIMARY KEY,
  book          text NOT NULL,
  chapter       integer NOT NULL,
  verse         integer NOT NULL,
  text          text NOT NULL,
  text_html     text,
  tags          jsonb,
  translation   text DEFAULT 'Yousafzai 2019',
  dialect       text DEFAULT 'yousafzai',
  testament     text DEFAULT 'OT',
  audio_chapter_url text,
  source_url    text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS verses_yousafzai_unique_idx
  ON public.verses_yousafzai (book, chapter, verse);
CREATE INDEX IF NOT EXISTS verses_yousafzai_text_idx
  ON public.verses_yousafzai USING gin (to_tsvector('simple', coalesce(text, '')));
CREATE INDEX IF NOT EXISTS verses_yousafzai_book_idx
  ON public.verses_yousafzai (book, chapter);
COMMENT ON TABLE public.verses_yousafzai IS 'Pashto Yousafzai (2019) Psalms & Proverbs sourced from AfghanBibles.org';
"""

try:
    result = supabase.rpc('exec_sql', {'sql': sql})
    print("Table created successfully")
except Exception as e:
    print(f"Error: {e}")
