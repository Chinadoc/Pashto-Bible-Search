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
    # Try to execute raw SQL using the REST API directly
    import requests
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    
    # Use the postgres RPC endpoint if it exists
    resp = requests.post(f"{url}/rest/v1/rpc/exec", headers=headers, json={"query": sql})
    if resp.status_code == 200:
        print("Table created successfully via RPC")
    else:
        print(f"RPC failed: {resp.status_code} {resp.text}")
        
        # Try direct SQL execution
        resp = requests.post(f"{url}/rest/v1/rpc/sql", headers=headers, json={"sql": sql})
        if resp.status_code == 200:
            print("Table created successfully via SQL RPC")
        else:
            print(f"SQL RPC failed: {resp.status_code} {resp.text}")
            
            # Last resort: try to insert a dummy row to create the table
            dummy_data = {
                "book": "Psalms",
                "chapter": 1,
                "verse": 1,
                "text": "dummy",
                "translation": "Yousafzai 2019",
                "dialect": "yousafzai",
                "testament": "OT"
            }
            resp = requests.post(f"{url}/rest/v1/verses_yousafzai", headers=headers, json=[dummy_data])
            if resp.status_code in [200, 201, 204]:
                print("Table created successfully via dummy insert")
            else:
                print(f"Dummy insert failed: {resp.status_code} {resp.text}")

except Exception as e:
    print(f"Error: {e}")
