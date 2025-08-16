from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize OpenAI client (requires OPENAI_API_KEY in environment)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Dummy user database (for testing login)
USERS = {
    "test@example.com": {
        "password": "password123",
        "name": "Test User"
    }
}

# Root route (check if server is alive)
@app.route("/")
def home():
    return {"ok": True, "service": "EduBridgeAI Backend"}

# Health check route
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "EduBridgeAI Backend"})

# ✅ Login route
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = USERS.get(email)
    if user and user["password"] == password:
        return jsonify({"name": user["name"], "email": email})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# ✅ Chat route
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are EduBridgeAI, an AI tutor."},
                {"role": "user", "content": user_message}
            ],
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Doubt solver route
@app.route("/api/doubt", methods=["POST"])
def doubt():
    try:
        data = request.json
        question = data.get("question", "")

        if not question:
            return jsonify({"answer": "(No question provided)"}), 400

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are EduBridgeAI, an AI tutor."},
                {"role": "user", "content": question}
            ],
        )

        answer = response.choices[0].message.content
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"answer": f"(Error) {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
