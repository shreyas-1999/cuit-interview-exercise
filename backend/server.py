from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
# Enable CORS to allow all origins.
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load the JSON file
with open('OpenDay.json', 'r') as file:
    open_day_data = json.load(file)

#API endpoint
@app.route('/api/openday', methods=['GET'])
def get_open_day_data():
    return jsonify(open_day_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)