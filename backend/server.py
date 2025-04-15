from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder="../frontend")
# Enable CORS to allow all origins.
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load the JSON file
with open('OpenDay.json', 'r') as file:
    open_day_data = json.load(file)

#API endpoint
@app.route('/api/openday', methods=['GET'])
def get_open_day_data():
    return jsonify(open_day_data)

# Serve index.html from the frontend directory
@app.route('/openday')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files (e.g., styles.css, script.js)
@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)