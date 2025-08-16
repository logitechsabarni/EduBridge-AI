from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), default="student")  # student | teacher | admin
    name = db.Column(db.String(120))
    email = db.Column(db.String(200), unique=True, index=True)

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    subject = db.Column(db.String(100))
    language = db.Column(db.String(50), default="English")
    summary = db.Column(db.Text)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lesson.id"))
    question = db.Column(db.Text)
    options = db.Column(db.Text)  # "optA|||optB|||optC|||optD"
    answer_index = db.Column(db.Integer)

def seed_if_empty():
    if Lesson.query.first():
        return
    # Seed 2 demo lessons
    l1 = Lesson(title="Fractions Basics", subject="Mathematics", language="English", summary="Understanding numerators, denominators, and equivalent fractions.")
    l2 = Lesson(title="Photosynthesis 101", subject="Science", language="English", summary="How plants convert light into chemical energy.")
    db.session.add_all([l1, l2])
    db.session.commit()

    # Seed a few quizzes
    q1 = Quiz(lesson_id=l1.id, question="What is 1/2 + 1/3?", options="5/6|||2/5|||1/5|||1", answer_index=0)
    q2 = Quiz(lesson_id=l1.id, question="Which are equivalent to 2/4?", options="1/2|||3/4|||4/8|||Both 1/2 and 4/8", answer_index=3)
    q3 = Quiz(lesson_id=l2.id, question="Where does photosynthesis occur?", options="Mitochondria|||Chloroplasts|||Nucleus|||Ribosomes", answer_index=1)
    db.session.add_all([q1, q2, q3])
    db.session.commit()
