from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app)

# SQLite DB (optional for login persistence)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
db = SQLAlchemy(app)

# OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# User Model (SQLAlchemy)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)

# Create tables (only if not exist)
with app.app_context():
    db.create_all()
    # Add a test user if not exists
    if not User.query.filter_by(email="test@example.com").first():
        db.session.add(User(email="test@example.com", password="password123", name="Test User"))
        db.session.commit()

@app.route("/")
def home():
    return {"ok": True, "service": "EduBridgeAI Backend"}

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "EduBridgeAI Backend"})

# ✅ Login with DB
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        return jsonify({"name": user.name, "email": email})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# ✅ Chat
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

# ✅ Doubt solver
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
