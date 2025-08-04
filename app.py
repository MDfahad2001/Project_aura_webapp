
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import csv

app = Flask(__name__)
app.secret_key = 'aura_secret'
CORS(app, supports_credentials=True)

def validate_user(username, password):
    with open('users.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['username'] == username and row['password'] == password:
                return True
    return False

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if validate_user(username, password):
        session['user'] = username
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/api/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({'user': session['user']})
    return jsonify({'error': 'Not logged in'}), 403

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
