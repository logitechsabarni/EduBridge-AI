import React from "react";

export default function Lesson({ role }) {
  // Dummy lessons
  const lessons = [
    { id: 1, title: "Introduction to AI" },
    { id: 2, title: "Machine Learning Basics" },
    { id: 3, title: "Data Analysis with Python" },
  ];

  return (
    <div>
      {lessons.map((lesson) => (
        <div key={lesson.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
          {lesson.title} {role === "teacher" && <button style={{ marginLeft: 8 }}>Edit</button>}
        </div>
      ))}
    </div>
  );
}
