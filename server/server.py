from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import time
import requests

load_dotenv()

CHUNKR_URL = 'https://api.chunkr.ai/api/v1/task'
CHUNKR_KEY = os.getenv("CHUNKR_KEY")
CHUNK_SIZE = 1500
headers = {
  "Authorization": CHUNKR_KEY,
}

app = Flask(__name__)
CORS(app)


@app.route('/upload,',methods=['POST'])
def upload_file():
  if 'file' not in request.files:
    return jsonify({"error": "No file part"})
  
  file = request.files['file']
  print(send_to_chunkr(file))
  return Response(status=200)

def send_to_chunkr(file):
  data = {
    "model": "Fast",
    "ocr_strategy": "Auto",
    "target_chunk_length": CHUNK_SIZE,
  }
  task_object = requests.request("POST", CHUNKR_URL, data=data, files={"file": (file.filename, file.stream, file.mimetype)}, headers=headers).json()
  
  while True:
    task_result = requests.request("GET", f"{CHUNKR_URL}/{task_object['task_id']}", headers=headers).json()
    if task_result["output"] != None:
      return task_result["output"]
    time.sleep(1)


if __name__ == "__main__":
  app.run(debug=True)