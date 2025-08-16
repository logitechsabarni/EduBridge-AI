import React from "react";
import Lesson from "./Lesson.jsx";
import Quiz from "./Quiz.jsx";

export default function TeacherDashboard({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name} (Teacher)</h2>
      <Lesson role={user.role} />
      <Quiz role={user.role} />
      <p>Manage lessons and quizzes here.</p>
    </div>
  );
}
