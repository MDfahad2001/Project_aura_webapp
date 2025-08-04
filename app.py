from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import csv
import json
import os

app = Flask(__name__)
app.secret_key = 'aura_secret'  # You can use os.urandom(24) for stronger key
CORS(app, supports_credentials=True)

# ===== User Authentication =====
def validate_user(username, password):
    with open('users.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['username'] == username and row['password'] == password:
                return row  # Return full row including user ID
    return None

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = validate_user(username, password)

    if user:
        session['user'] = user['username']
        session['user_id'] = user['id']
        return jsonify({
            'message': 'Login successful',
            'id': user['id'],
            'username': user['username']
        }), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/api/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({
            'user': session['user'],
            'id': session['user_id']
        })
    return jsonify({'error': 'Not logged in'}), 403

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200

# ===== Save Sensor Values =====
@app.route('/api/save-values', methods=['POST'])
def save_values():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authorized'}), 403

    data = request.get_json()
    user_id = session['user_id']
    
    os.makedirs('user_data', exist_ok=True)
    filename = f"user_{user_id}_settings.json"
    filepath = os.path.join('user_data', filename)

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    return jsonify({'message': f'Values saved for user {user_id}'}), 200

# ===== Load Sensor Values =====
@app.route('/api/load-values', methods=['GET'])
def load_values():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authorized'}), 403

    user_id = session['user_id']
    filename = f"user_{user_id}_settings.json"
    filepath = os.path.join('user_data', filename)

    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            data = json.load(f)
        return jsonify(data), 200
    else:
        return jsonify({'message': 'No saved settings found'}), 404

# ===== Serve Login Page (optional) =====
@app.route('/')
def index():
    return render_template('index.html')

# ===== Run Server =====
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
