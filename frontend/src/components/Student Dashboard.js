import React, { useEffect, useState } from "react";
import Lesson from "./Lesson";
import Quiz from "./Quiz";
import DoubtSolver from "./DoubtSolver";

export default function StudentDashboard({ user }) {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/api/lessons")
      .then((r) => r.json())
      .then(setLessons)
      .catch(() => setLessons([]));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {user.name}</h2>
        <div>Role: {user.role}</div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginTop: 12 }}>
        <aside style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <h3>Lessons</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {lessons.map((l) => (
              <li key={l.id} style={{ marginBottom: 8 }}>
                <button onClick={() => setSelectedLesson(l)} style={{ width: "100%" }}>
                  {l.subject}: {l.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main style={{ display: "grid", gap: 16 }}>
          {selectedLesson ? (
            <>
              <Lesson lesson={selectedLesson} />
              <Quiz lessonId={selectedLesson.id} />
            </>
          ) : (
            <div style={{ border: "1px dashed #bbb", padding: 16, borderRadius: 10 }}>
              Select a lesson to view content and quiz.
            </div>
          )}

          <DoubtSolver />
        </main>
      </section>
    </div>
  );
}
