import React from "react";

export default function Lesson({ lesson }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <h3>{lesson.title} — <span style={{ fontWeight: 400 }}>{lesson.subject}</span></h3>
      <small>Language: {lesson.language}</small>
      <p style={{ marginTop: 8 }}>{lesson.summary}</p>
      <div style={{ background: "#fafafa", padding: 10, borderRadius: 8, fontSize: 14 }}>
        <strong>Sample Content:</strong> (You can replace with real content)
        <ul>
          <li>Concept explanation</li>
          <li>Worked example</li>
          <li>Practice questions</li>
        </ul>
      </div>
    </div>
  );
}
