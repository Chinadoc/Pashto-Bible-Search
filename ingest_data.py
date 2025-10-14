import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
import re

# --- SETUP ---
# Initialize Firebase Admin SDK
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
batch = db.batch()

# --- 1. Ingest Bible Verses ---
print("Ingesting Bible verses...")
verse_count = 0
# Combine both OT and NT text directories
txt_dirs = ['all_txt_copies', 'ot_txt_copies']

for txt_dir in txt_dirs:
    for filename in os.listdir(txt_dir):
        if filename.endswith(".txt"):
            # Extract book and chapter from filename (e.g., "acts1_pashto.txt")
            match = re.match(r"([a-zA-Z0-9]+)(\d+)_pashto\.txt", filename)
            if match:
                book, chapter = match.groups()
                filepath = os.path.join(txt_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line:
                            verse_match = re.match(r"(\d+)\s+(.+)", line)
                            if verse_match:
                                verse, text = verse_match.groups()
                                # Create a unique ID like "acts-1-1"
                                doc_id = f"{book.upper()}-{chapter}-{verse}"
                                doc_ref = db.collection('verses').document(doc_id)
                                batch.set(doc_ref, {
                                    'book': book.capitalize(),
                                    'chapter': int(chapter),
                                    'verse': int(verse),
                                    'text': text
                                })
                                verse_count += 1
                                # Commit the batch every 500 verses to avoid memory issues
                                if verse_count % 500 == 0:
                                    batch.commit()
                                    batch = db.batch()
                                    print(f"Committed {verse_count} verses...")

# Commit any remaining verses in the last batch
batch.commit()
print(f"✅ Total verses ingested: {verse_count}")


# --- 2. Ingest Lexicon & Dictionaries ---
print("\nIngesting lexicon data...")
lexicon_files = {
    'lexicon': 'full_dictionary_enriched.json',
    'inflections': 'form_to_root_map.json',
    'irregular_verbs': 'irregular_verbs.json',
    'nouns': 'nouns_lexicon.json',
    'verbs': 'verbs_lexicon.json'
}

for collection_name, filename in lexicon_files.items():
    batch = db.batch()
    count = 0
    print(f"--> Ingesting {filename} into {collection_name}...")
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

        # Special handling for the main lexicon file, which has a nested structure
        if collection_name == 'lexicon' and 'entries' in data:
            entries = data['entries']
            for entry in entries:
                # Use the pashto word 'p' as the document ID for easy lookups
                doc_id = entry.get('p')
                if doc_id:
                    doc_ref = db.collection(collection_name).document(doc_id)
                    batch.set(doc_ref, entry)
                    count += 1
                    if count % 500 == 0:
                        batch.commit()
                        batch = db.batch()
        else:
            # Standard handling for flat JSON objects
            for key, value in data.items():
                doc_ref = db.collection(collection_name).document(key)
                # Firestore requires the value to be a dictionary
                if isinstance(value, dict):
                     batch.set(doc_ref, value)
                else:
                     batch.set(doc_ref, {'value': value}) # or {'root': value} etc.
                count += 1
                if count % 500 == 0:
                    batch.commit()
                    batch = db.batch()
    batch.commit()
    print(f"✅ Ingested {count} documents into '{collection_name}' collection.")

# --- 3. Ingest Audio Map ---
print("\nIngesting audio map...")
batch = db.batch()
count = 0
with open('audio_file_map.json', 'r', encoding='utf-8') as f:
    audio_data = json.load(f)
    for key, value in audio_data.items():
        doc_ref = db.collection('audio_map').document(key)
        batch.set(doc_ref, {'fileName': value})
        count += 1
batch.commit()
print(f"✅ Ingested {count} audio mappings.")

print("\n🎉 Data ingestion complete!")
