from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from openai import OpenAI

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Database setup (SQLite locally, PostgreSQL in Render via DATABASE_URL)
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///users.db")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

# Initialize OpenAI client (reads from OPENAI_API_KEY env var)
client = OpenAI()

# Root route
@app.route("/")
def home():
    return {"ok": True, "service": "EduBridgeAI Backend"}

# Health check route
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "EduBridgeAI Backend"})

# Login route
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        user = User.query.filter_by(username=username, password=password).first()

        if user:
            return jsonify({"success": True, "message": "Login successful!"})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Chat route
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

# Doubt Solver route
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

# Run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create users table if it doesn’t exist
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
