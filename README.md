# EduBridge AI – 12-hr Prototype

A fast, demo-ready prototype: **React (Vite) frontend** + **Flask** backend + **SQLite** + **OpenAI doubt solver**.

## Prereqs
- Node 18+
- Python 3.11+
- (Optional) OpenAI API key for AI answers

---

## 1) Backend (Flask)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...  # (optional, improves answers)
flask --app app run  # or: python app.py

