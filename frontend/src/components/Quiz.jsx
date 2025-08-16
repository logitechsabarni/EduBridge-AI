import React from "react";

export default function Quiz({ role }) {
  const quizzes = [
    { id: 1, title: "AI Basics Quiz" },
    { id: 2, title: "ML Fundamentals Quiz" },
    { id: 3, title: "Python Data Quiz" },
  ];

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginTop: 20 }}>
      <h3>Quizzes</h3>
      {quizzes.map((quiz) => (
        <div key={quiz.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          {quiz.title}{" "}
          {role === "teacher" && <button style={{ marginLeft: 8 }}>Edit</button>}
        </div>
      ))}
    </div>
  );
}
