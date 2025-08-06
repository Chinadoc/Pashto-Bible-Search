"""
Builds the audio map by connecting to Google Drive and listing files.
"""
import os
import json
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

# Your Google Drive folder ID from the share link
PARENT_FOLDER_ID = "14c-Zo7AzR3fys3ZRPLhBC8hPMX5IvOWK"

print("Authenticating with Google Drive...")
gauth = GoogleAuth()
gauth.LocalWebserverAuth()
drive = GoogleDrive(gauth)
print("Authentication successful.")

audio_map = {}

print(f"Fetching file list from parent folder: {PARENT_FOLDER_ID}")
top_level_list = drive.ListFile(
    {"q": f"'{PARENT_FOLDER_ID}' in parents and trashed=false"}
).GetList()

# Find the main subfolder
main_subfolder_id = None
for item in top_level_list:
    if item['title'] == 'Pashto Bible split into verses':
        main_subfolder_id = item['id']
        break

if main_subfolder_id:
    print(f"Found main subfolder. Scanning for audio book folders...")
    book_folders = drive.ListFile(
        {"q": f"'{main_subfolder_id}' in parents and trashed=false and mimeType = 'application/vnd.google-apps.folder'"}
    ).GetList()
    
    for book_folder in book_folders:
        print(f"  Scanning book folder: {book_folder['title']}...")
        audio_files = drive.ListFile(
            {"q": f"'{book_folder['id']}' in parents and trashed=false"}
        ).GetList()
        for audio_file in audio_files:
            if audio_file["title"].lower().endswith(".mp3"):
                audio_map[audio_file["title"]] = audio_file["id"]
else:
    print("Could not find the 'Pashto Bible split into verses' subfolder.")

# Inject this map into the main UI script
ui_script_path = 'bible_search_ui.py'
with open(ui_script_path, 'r', encoding='utf-8') as f:
    ui_script_lines = f.readlines()

start_index, end_index = -1, -1
for i, line in enumerate(ui_script_lines):
    if "AUDIO_FILE_MAP = {" in line:
        start_index = i
    if start_index != -1 and "}" in line:
        end_index = i
        break

if start_index != -1 and end_index != -1:
    map_string_lines = [f'    "{key}": "{value}",\n' for key, value in sorted(audio_map.items())]
    new_map_lines = ["AUDIO_FILE_MAP = {\n"] + map_string_lines + ["}\n"]

    del ui_script_lines[start_index : end_index + 1]
    ui_script_lines[start_index:start_index] = new_map_lines

    with open(ui_script_path, 'w', encoding='utf-8') as f:
        f.writelines(ui_script_lines)
    
    print(f"\nSUCCESS: Injected {len(audio_map)} audio file entries into {ui_script_path}")
else:
    print("\nERROR: Could not find AUDIO_FILE_MAP dictionary in UI script.")
