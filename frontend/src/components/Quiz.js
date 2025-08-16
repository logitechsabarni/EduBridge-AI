import React from "react";

export default function Quiz({ role }) {
  // Dummy quizzes
  const quizzes = [
    { id: 1, title: "AI Basics Quiz" },
    { id: 2, title: "Python Fundamentals" },
  ];

  return (
    <div>
      {quizzes.map((quiz) => (
        <div key={quiz.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          {quiz.title} {role === "teacher" && <button style={{ marginLeft: 8 }}>Edit</button>}
        </div>
      ))}
    </div>
  );
}

