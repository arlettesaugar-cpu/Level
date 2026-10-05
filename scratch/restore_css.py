import json, re

jsonl_path = r"C:\Users\Arlette\.gemini\antigravity-ide\brain\04c54b26-bf7c-4833-8286-3f3f67092800\.system_generated\logs\transcript_full.jsonl"

found_content = []
with open(jsonl_path, "r", encoding="utf-8") as f:
    for line in f:
        if "c:/Users/Arlette/Documents/Canchas/web_admin/styles.css" in line:
            data = json.loads(line)
            content = json.dumps(data)
            if ":root" in content and "--bg-app: #F8FAFC" in content:
                found_content.append(data)

print(f"Found {len(found_content)} occurrences")
for idx, item in enumerate(found_content):
    print(f"Item {idx}: keys = {list(item.keys())}")
    # Extract output text
    text = str(item)
    if ":root {" in text:
        start_idx = text.find(":root {")
        end_idx = text.rfind("}")
        print(f"Length of snippet: {len(text[start_idx:end_idx+1])}")
