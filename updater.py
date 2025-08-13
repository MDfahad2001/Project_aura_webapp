from flask import Flask, request, jsonify
import os, json

app = Flask(__name__)
FILE_PATH = "/home/user/data.json"  # your JSON file

def load_json(path):
    if not os.path.exists(path):
        return {"users": []}
    try:
        with open(path, 'r') as f:
            data = json.load(f)
            if "users" not in data:
                data["users"] = []
            return data
    except:
        return {"users": []}

def save_json(path, obj):
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(obj, f, indent=2)
    os.replace(tmp, path)

@app.route('/update', methods=['POST'])
def update_json():
    data = request.get_json() or {}
    if 'lux' not in data or 'cct' not in data or 'user_id' not in data:
        return jsonify({"error": "Missing lux, cct, or user_id"}), 400

    store = load_json(FILE_PATH)
    users = store["users"]

    # Look for existing user with same ID
    existing = next((u for u in users if u.get("user_id") == data["user_id"]), None)

    # Determine flag value
    flag_value = bool(data.get('flag', False))

    if existing:
        # Update existing user
        existing.update({
            "lux": data['lux'],
            "cct": data['cct'],
            "flag": flag_value
        })
    else:
        # Add new user
        users.append({
            "user_id": data["user_id"],
            "lux": data["lux"],
            "cct": data["cct"],
            "flag": flag_value
        })

    try:
        save_json(FILE_PATH, store)
        return jsonify({"status": "OK", "saved": store})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
