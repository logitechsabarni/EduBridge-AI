import React from "react";
import Lesson from "./Lesson.jsx";
import Quiz from "./Quiz.jsx";
import DoubtSolver from "./DoubtSolver.jsx";

export default function StudentDashboard({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name} (Student)</h2>
      <Lesson role={user.role} />
      <Quiz role={user.role} />
      <DoubtSolver />
    </div>
  );
}
