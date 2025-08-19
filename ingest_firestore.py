# ingest_firestore.py
#
# This script populates the Firestore database with data from the local text
# and JSON files. It is a prerequisite for running the backend service
# in `functions/main.py`.
#
# To run this script, you need to have a Firebase project and have the
# `firebase-admin` library installed. You also need to set up your
# Firebase credentials.
#
# Instructions:
# 1. Install dependencies: pip install firebase-admin tqdm
# 2. Set up Firebase credentials by setting the GOOGLE_APPLICATION_CREDENTIALS
#    environment variable to point to your service account key file.
#    See: https://firebase.google.com/docs/admin/setup#initialize-sdk
# 3. Run the script: python ingest_firestore.py

import os
import json
import re
import firebase_admin
from firebase_admin import credentials, firestore
from tqdm import tqdm

# --- Configuration ---
# The directories where the Bible text files are located.
NT_DIR = 'all_txt_copies'
OT_DIR = 'ot_txt_copies'

# The JSON files containing lexicon and index data.
VERBS_LEXICON_FILE = 'verbs_lexicon.json'
NOUNS_LEXICON_FILE = 'nouns_lexicon.json'
FORM_TO_ROOT_MAP_FILE = 'form_to_root_map.json'


def parse_book_ref(filename):
    """
    Parses a filename like '1kings2_pashto.txt' into ('1 Kings', '2').
    Handles book names that start with a digit and multi-word names.
    """
    ref_part = filename.replace('_pashto.txt', '')

    # Use regex to find the chapter number at the end of the string
    match = re.search(r'(\d+)$', ref_part)
    if not match:
        return None, None

    chapter_str = match.group(1)
    book_name_raw = ref_part[:match.start()]

    # Capitalize book name and handle numbered books
    if book_name_raw and book_name_raw[0].isdigit() and len(book_name_raw) > 1:
        # e.g. "1kings" -> "1 Kings"
        book_name = book_name_raw[0] + ' ' + book_name_raw[1:].capitalize()
    else:
        # e.g. "acts" -> "Acts", "songofsolomon" -> "Songofsolomon"
        # A more sophisticated mapping could be used here if needed.
        book_name = book_name_raw.capitalize()

    return book_name, chapter_str


def ingest_verses(db, directory):
    """
    Ingests all verses from a given directory into the 'verses' collection.
    """
    print(f"Ingesting verses from '{directory}'...")
    if not os.path.isdir(directory):
        print(f"Warning: Directory '{directory}' not found. Skipping.")
        return

    batch = db.batch()
    total_verses = 0

    filenames = [f for f in os.listdir(directory) if f.endswith('_pashto.txt')]

    for filename in tqdm(filenames, desc=f"Processing files in {directory}"):
        book_name, chapter = parse_book_ref(filename)
        if not book_name or not chapter:
            print(f"Could not parse reference from filename: {filename}")
            continue

        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue

                parts = line.split('\t', 1)
                if len(parts) != 2 or not parts[0].isdigit():
                    continue

                verse_num, text = parts
                ref_str = f"{book_name} {chapter}:{verse_num}"

                doc_ref = db.collection('verses').document(ref_str)
                batch.set(doc_ref, {'ref': ref_str, 'text': text})
                total_verses += 1

                if total_verses > 0 and total_verses % 499 == 0:
                    batch.commit()
                    batch = db.batch()

    if total_verses % 499 != 0:
        batch.commit()

    print(f"Finished ingesting {total_verses} verses from '{directory}'.")


def ingest_json_to_collection(db, filepath, collection_name, data_field_name=None):
    """
    Generic function to ingest a JSON file into a Firestore collection.
    """
    print(f"Ingesting '{filepath}' into '{collection_name}' collection...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        batch = db.batch()
        count = 0
        for key, value in tqdm(data.items(), desc=f"Ingesting {collection_name}"):
            doc_ref = db.collection(collection_name).document(key)
            doc_data = {data_field_name: value} if data_field_name else value
            batch.set(doc_ref, doc_data)
            count += 1
            if count > 0 and count % 499 == 0:
                batch.commit()
                batch = db.batch()
        if count % 499 != 0:
            batch.commit()
        print(f"Ingested {count} documents into '{collection_name}'.")
    except FileNotFoundError:
        print(f"Warning: {filepath} not found. Skipping ingestion for '{collection_name}'.")
    except Exception as e:
        print(f"An error occurred during ingestion for '{collection_name}': {e}")


def main():
    """
    Main function to ingest all data into Firestore.
    """
    print("Starting Firestore data ingestion...")

    try:
        # Use Application Default Credentials. This will automatically use the
        # credentials from the GOOGLE_APPLICATION_CREDENTIALS env var.
        firebase_admin.initialize_app()
        print("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
        print("Please ensure your GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly.")
        return

    db = firestore.client()

    # Ingest verses from NT and OT
    ingest_verses(db, NT_DIR)
    ingest_verses(db, OT_DIR)

    # Ingest lexicon data
    ingest_json_to_collection(db, VERBS_LEXICON_FILE, 'verbs')
    ingest_json_to_collection(db, NOUNS_LEXICON_FILE, 'nouns')

    # Ingest inflection data
    ingest_json_to_collection(db, FORM_TO_ROOT_MAP_FILE, 'inflections', data_field_name='value')

    print("\nData ingestion script finished.")
    print("Please check the Firestore console to verify the data.")


if __name__ == '__main__':
    main()
