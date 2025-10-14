
import json
import ast

try:
    with open('bible_search_ui.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the dictionary
    start_marker = 'AUDIO_FILE_MAP = {'
    start_index = content.find(start_marker)

    if start_index == -1:
        print("Error: Could not find the start of the AUDIO_FILE_MAP dictionary.")
    else:
        # Find the opening brace
        open_brace_index = content.find('{', start_index)
        
        # Find the matching closing brace
        brace_level = 1
        current_index = open_brace_index + 1
        end_brace_index = -1
        while current_index < len(content):
            if content[current_index] == '{':
                brace_level += 1
            elif content[current_index] == '}':
                brace_level -= 1
                if brace_level == 0:
                    end_brace_index = current_index
                    break
            current_index += 1

        if end_brace_index != -1:
            dict_string = content[open_brace_index : end_brace_index + 1]
            
            try:
                # Use ast.literal_eval for safe evaluation of the dictionary string
                audio_map_dict = ast.literal_eval(dict_string)
                
                # Now, dump it as JSON
                with open('audio_file_map.json', 'w', encoding='utf-8') as json_f:
                    json.dump(audio_map_dict, json_f, ensure_ascii=False, indent=4)
                print("Successfully created audio_file_map.json")

            except Exception as e:
                print(f"Error processing dictionary: {e}")
        else:
            print("Error: Could not find the closing brace for AUDIO_FILE_MAP.")

except FileNotFoundError:
    print("Error: bible_search_ui.py not found.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
