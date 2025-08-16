from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai  # legacy SDK usage

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

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
        # Call OpenAI using legacy ChatCompletion
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are EduBridgeAI, an AI tutor."},
                {"role": "user", "content": user_message}
            ],
        )
        # Extract reply
        reply = response.choices[0].message["content"] if "message" in response.choices[0] else response.choices[0].text
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # Bind to all interfaces for Render
    app.run(host="0.0.0.0", port=port)
