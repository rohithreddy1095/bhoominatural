import json
import os

# Load the existing data
json_path = 'refs/youtube/analysis/locations.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define the merging logic
def merge_locations(source_key, target_key):
    if source_key in data and target_key in data:
        print(f"Merging {source_key} into {target_key}...")
        # Add videos
        data[target_key]['videos'].extend(data[source_key]['videos'])
        # Add unique crops
        current_crops = set(data[target_key].get('key_crops', []))
        new_crops = set(data[source_key].get('key_crops', []))
        data[target_key]['key_crops'] = sorted(list(current_crops.union(new_crops)))
        # Add unique techniques
        current_tech = set(data[target_key].get('key_techniques', []))
        new_tech = set(data[source_key].get('key_techniques', []))
        data[target_key]['key_techniques'] = sorted(list(current_tech.union(new_tech)))
        # Update count
        data[target_key]['video_count'] = len(data[target_key]['videos'])
        # Remove source
        del data[source_key]

# Execute Merges
merge_locations("Shamli", "Main Farm (Shamli)")
merge_locations("Maharashtra", "Main Farm (Shamli)")

# Update Summaries with human-friendly descriptions
summaries = {
    "Mumbai": "A hillside food forest transformation project. Features a journey from scratch to sustainability over 1+ years, highlighting avocado and papaya companion planting.",
    "Kolkata": "Transformation of waste land into a productive ecosystem featuring a pond and food forest structure.",
    "Main Farm (Shamli)": "The primary 10-acre headquarters in Shamli, UP. A mature multilayer food forest showcasing diverse crops (Mango, Litchi, Flowers), no-till techniques, and extensive natural farming tutorials.",
    "Noida": "A 2-acre transformation project turning standard farmland into a food forest, noted for rapid growth and biodiversity within 8 months.",
    "Delhi": "Urban food forest initiative established to bring sustainable agriculture to the capital region.",
    "Konkan": "Permaculture and food forest initiative located in the biodiversity-rich Konkan Western Ghats.",
    "Dehradun": "Collaborative initiative featuring natural farming practices at the Forest Research Institute (FRI)."
}

for location, summary in summaries.items():
    if location in data:
        data[location]['project_summary'] = summary

# Save updated data
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Data refined successfully.")
