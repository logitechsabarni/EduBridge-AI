import React from "react";

export default function Lesson({ role }) {
  const lessons = [
    { id: 1, title: "Introduction to AI" },
    { id: 2, title: "Machine Learning Basics" },
    { id: 3, title: "Data Analysis with Python" },
  ];

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginTop: 20 }}>
      <h3>Lessons</h3>
      {lessons.map((lesson) => (
        <div key={lesson.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          {lesson.title} {role === "teacher" && <button style={{ marginLeft: 8 }}>Edit</button>}
        </div>
      ))}
    </div>
  );
}
