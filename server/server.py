from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/process")
def hello():
  return "Thanks"

# dummy method, just to test the file upload
@app.route("/upload", methods=["POST"])
def upload():
  if 'file' not in request.files:
    return jsonify({"error":"No file received"}), 400
  file = request.files['file']
  file.save("uploaded_file")
  return jsonify({"message":"File received"}), 200


if __name__ == "__main__":
  app.run(debug=True)