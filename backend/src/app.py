from flask import Flask, request, jsonify
from flask_cors import CORS

from llm_connect import LLM_Connect
from mongo import Mongo_connect

app = Flask(__name__)
CORS(app) 

_llm = LLM_Connect()
_mongo = Mongo_connect()

@app.route('/text', methods=['POST'])
def text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    text = _llm.processText(data["text"])
    print(f"Received text: {text}")

    return jsonify({'message': 'Text received successfully', 'received_text': text}), 200


@app.route('/review', methods=['POST'])
def review():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    text = data['text']
    print(f"Received text: {text}")

    return jsonify({'message': 'Text received successfully', 'received_text': text}), 200

if __name__ == '__main__':
    app.run(debug=True)