from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Root route / health check
@app.route("/")
def home():
    return jsonify({"ok": True, "service": "EduBridgeAI Backend"})

# Separate health check route
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "EduBridgeAI Backend"})

# Chat route
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Call OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are EduBridgeAI, an AI tutor."},
                {"role": "user", "content": user_message}
            ],
        )
        # Extract reply
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # Bind to all interfaces for Render
    app.run(host="0.0.0.0", port=port)
