
import requests
import json
import re

def download_dictionary():
    """Downloads the dictionary data from the lingdocs repository."""
    url = "https://storage.lingdocs.com/dictionary/dictionary"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error downloading dictionary: {e}")
        return None

def process_dictionary(data):
    """Processes the raw dictionary data into a list of JSON objects."""
    entries = []
    # This regex is based on the structure observed in the dictionary data
    pattern = re.compile(r'\{"p":".*?","ts":\d+\}')
    matches = pattern.findall(data)
    for match in matches:
        try:
            entries.append(json.loads(match))
        except json.JSONDecodeError:
            print(f"Skipping invalid JSON: {match}")
    return entries

def save_dictionary(data, filename="full_dictionary.json"):
    """Saves the processed dictionary data to a JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Dictionary saved to {filename}")

if __name__ == "__main__":
    raw_data = download_dictionary()
    if raw_data:
        processed_data = process_dictionary(raw_data)
        save_dictionary(processed_data)
