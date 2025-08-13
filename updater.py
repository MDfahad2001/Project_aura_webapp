from flask import Flask, request, jsonify
import os, json

app = Flask(__name__)

FILE_PATH = "/home/user/data.json"  # change to your existing file path

def load_json(path):
    if not os.path.exists(path):
        return {}
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except:
        return {}

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

    current = load_json(FILE_PATH)
    current.update({
        "lux": data['lux'],
        "cct": data['cct'],
        "user_id": data['user_id']
    })

    try:
        save_json(FILE_PATH, current)
        return jsonify({"status": "OK", "saved": current})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)  # Runs on different port
