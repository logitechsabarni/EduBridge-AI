import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, User, Lesson, Quiz, seed_if_empty

# Load .env file (for OPENAI_API_KEY and DATABASE_URL etc.)
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # SQLite for local prototyping (can be replaced with PostgreSQL etc. on Render/Heroku)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///edubridge.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_if_empty()

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"ok": True, "service": "EduBridgeAI Backend"})

    # Login (simple user creation if not exists)
    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        name = data.get("name", "Student")
        role = data.get("role", "student")  # "student" | "teacher"

        if not email:
            return jsonify({"error": "email required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(name=name, email=email, role=role)
            db.session.add(user)
            db.session.commit()

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        })

    # Lessons
    @app.route("/api/lessons", methods=["GET"])
    def lessons():
        items = Lesson.query.all()
        return jsonify([
            {
                "id": l.id,
                "title": l.title,
                "subject": l.subject,
                "language": l.language,
                "summary": l.summary
            } for l in items
        ])

    # Quizzes by lesson
    @app.route("/api/quizzes/<int:lesson_id>", methods=["GET"])
    def quizzes(lesson_id):
        items = Quiz.query.filter_by(lesson_id=lesson_id).all()
        return jsonify([
            {
                "id": q.id,
                "lesson_id": q.lesson_id,
                "question": q.question,
                "options": q.options.split("|||"),
                "answer_index": q.answer_index
            } for q in items
        ])

    # Doubt solving (AI-powered or fallback)
    @app.route("/api/doubt", methods=["POST"])
    def doubt():
        data = request.get_json() or {}
        question = data.get("question", "").strip()
        if not question:
            return jsonify({"error": "question required"}), 400

        answer = generate_answer(question)
        return jsonify({"answer": answer})

    return app


def generate_answer(question: str) -> str:
    """
    Uses OpenAI if OPENAI_API_KEY is present; otherwise returns a simple fallback.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return (
            f"(Demo answer) For your question: '{question}', "
            "try breaking it into smaller steps and revising the relevant chapter. "
            "In the full version, the AI will provide a step-by-step explanation."
        )

    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "gpt-4o-mini",  # cost-effective, fast
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful tutor for class 6–12 students. "
                               "Explain concepts step-by-step in a simple way."
                },
                {"role": "user", "content": question},
            ],
            "temperature": 0.4,
            "max_tokens": 300,
        }
        r = requests.post(url, json=payload, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"].strip()

    except Exception as e:
        return (
            f"(Fallback) Could not reach AI right now. "
            "Steps to solve: 1) Identify knowns/unknowns 2) Apply relevant formula "
            "3) Substitute values 4) Check units.\nError: {e}"
        )


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
