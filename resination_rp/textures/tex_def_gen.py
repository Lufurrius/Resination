import os
import json5  # To read JSON with comments
import json   # For strict JSON writing without trailing commas
import random
from datetime import datetime

def find_images_in_texture_dirs(root_dir):
    # Separate image paths for items and blocks based on folder names
    item_paths = []
    block_paths = []
    
    for subdir, _, files in os.walk(root_dir):
        # Check if the current directory is within 'item(s)' or 'block(s)'
        if any(folder in subdir.lower().split(os.sep) for folder in {"item", "items"}):
            for file in files:
                if file.lower().endswith(('.png', '.tga')):
                    item_paths.append(os.path.join(subdir, file))
        elif any(folder in subdir.lower().split(os.sep) for folder in {"block", "blocks"}):
            for file in files:
                if file.lower().endswith(('.png', '.tga')):
                    block_paths.append(os.path.join(subdir, file))
    
    return item_paths, block_paths


def format_texture_definition(image_path, root_dir, prefix):
    relative_path = os.path.relpath(image_path, root_dir)
    
    # Split the path by directory separator to get individual steps
    path_parts = relative_path.split(os.sep)
    
    # Locate the first occurrence of 'item', 'items', 'block', or 'blocks'
    for i, part in enumerate(path_parts):
        if part.lower() in {"item", "items", "block", "blocks"}:
            # Only modify definition name to exclude parts up to and including 'item(s)' or 'block(s)'
            definition_name_parts = path_parts[i + 1:]  # Exclude path steps up to and including this part
            break
    else:
        # If no 'item(s)' or 'block(s)' found, use the entire path for the definition name
        definition_name_parts = path_parts

    # Join the parts for the definition name, using '.' between parts and '_' for the last part
    if len(definition_name_parts) > 1:
        base_name_without_ext = ".".join(definition_name_parts[:-1]) + "_" + definition_name_parts[-1]
    else:
        base_name_without_ext = definition_name_parts[0]

    # Combine prefix and base name for the final texture definition
    prefix_value = f"{prefix}{os.path.splitext(base_name_without_ext)[0]}"

    # The textures path keeps the entire relative path, but without the file extension
    textures = os.path.splitext(relative_path.replace(os.sep, '/'))[0]
    
    return prefix_value, textures




def generate_texture_data(image_paths, root_dir, prefix):
    texture_data = {}
    for image_path in image_paths:
        prefix_value, textures = format_texture_definition(image_path, root_dir, prefix)
        texture_data[prefix_value] = {"textures": "textures/" + textures}
    return texture_data

def merge_texture_data(existing_data, new_data):
    for key, value in new_data.items():
        if key not in existing_data and not any(v['textures'] == value['textures'] for v in existing_data.values()):
            existing_data[key] = value
    return existing_data

def generate_json_file(root_dir, output_file, image_paths, atlas_name, include_padding_mip_levels, prefix, resource_pack_name, padding, num_mip_levels, append_data):
    new_texture_data = generate_texture_data(image_paths, root_dir, prefix)
    
    # Load existing data if appending
    if append_data and os.path.exists(output_file):
        with open(output_file, 'r') as f:
            existing_data = json5.load(f)
        texture_data = merge_texture_data(existing_data.get("texture_data", {}), new_texture_data)
        # Preserve original structure by re-injecting into the existing data
        existing_data["texture_data"] = texture_data
    else:
        existing_data = {
            "resource_pack_name": resource_pack_name,
            "texture_name": atlas_name,
            "texture_data": new_texture_data
        }
        if include_padding_mip_levels:
            existing_data["padding"] = padding
            existing_data["num_mip_levels"] = num_mip_levels
    
    # Save in strict JSON format using json to ensure double quotes and no trailing commas
    with open(output_file, 'w') as f:
        json.dump(existing_data, f, indent=4)

def prompt_overwrite(file_path, fileName):
    if os.path.exists(file_path):
        while True:
            user_input = input("The file " + '\033[93m' + fileName + '\033[0m' + " already exists. Please " + '\033[42m' + 'confirm ' + '\033[0m' +"your decision to overwrite, or " + '\033[41m' + 'deny ' + '\033[0m' + "to cancel: ").strip().lower()
            if user_input in ['confirm', 'c']:
                return True
            elif user_input in ['deny', 'd']:
                return False
            else:
                print("Invalid input. Please " + '\033[42m' + 'confirm ' + '\033[0m' +"or " + '\033[41m' + 'deny ' + '\033[0m' + ".")
    return True

def load_settings(filename):
    settings = {}
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            for line in file:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    settings[key.strip()] = value.strip()
    return settings

if __name__ == "__main__":
    script_directory = os.path.dirname(os.path.abspath(__file__))
    settings_file = os.path.join(script_directory, 'settings.txt')
    
    settings = load_settings(settings_file)
    
    # Default values if not set in settings
    prefix = settings.get("prefix", "")
    resource_pack_name = settings.get("resource_pack_name", "Resources")
    padding = int(settings.get("padding", 8))
    num_mip_levels = int(settings.get("num_mip_levels", 4))
    append_data = settings.get("append_data", "false").lower() == "true"

    print()
    print("Thank you for choosing Luth's magical wonderous texture definition generator for your whimsy needs!")
    print("                                                                                                     >={c'w')")

    # Generate item_texture.json for items
    item_paths, block_paths = find_images_in_texture_dirs(script_directory)
    
    items_output_filename = os.path.join(script_directory, 'item_texture.json')
    if prompt_overwrite(items_output_filename, "item_texture.json"):
        generate_json_file(script_directory, items_output_filename, item_paths, "atlas.items", False, prefix, resource_pack_name, padding, num_mip_levels, append_data)
        print('\033[92m' + "JSON file " + items_output_filename + " has been generated " + '\033[95m' + "<3" + '\033[0m')
    else:
        print('\033[31m' + "Process canceled for 'item_texture.json' ;-;"  + '\033[0m')

    # Generate terrain_texture.json for blocks
    blocks_output_filename = os.path.join(script_directory, 'terrain_texture.json')
    if prompt_overwrite(blocks_output_filename, "terrain_texture.json"):
        generate_json_file(script_directory, blocks_output_filename, block_paths, "atlas.terrain", True, prefix, resource_pack_name, padding, num_mip_levels, append_data)
        print('\033[92m' + "JSON file " + blocks_output_filename + " has been generated " + '\033[95m' + "<3" + '\033[0m')
    else:
        print('\033[31m' + "Process canceled for 'terrain_texture.json' ;-;"  + '\033[0m')

    # Message from hell
    current_day = datetime.now().strftime('%A')
    print(":3")
    print()
    adjectives = ["a wonderful", "a fantastic", "an amazing", "a great", "an awesome", "a fabulous", "an incredible", "a marvelous", "a gnarly", "a skibidi", "a radicle", "an unfathomable", "a fresh", "a not lethal"]
    random_adjective = random.choice(adjectives)
    print(f"Have {random_adjective} {current_day}!")
    print()
