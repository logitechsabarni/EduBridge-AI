import React, { useEffect, useState } from "react";

export default function TeacherDashboard({ user }) {
  const [stats, setStats] = useState({ students: 32, avgProgress: 67, activeLessons: 2 });

  // You can replace this with real analytics later.
  useEffect(() => {
    // fetch analytics from backend when implemented
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h2>Teacher Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 12 }}>
        <Card title="Active Students" value={stats.students} />
        <Card title="Avg. Progress (%)" value={stats.avgProgress} />
        <Card title="Active Lessons" value={stats.activeLessons} />
      </div>
      <div style={{ marginTop: 24, border: "1px solid #eee", padding: 16, borderRadius: 10 }}>
        <h3>Next Steps</h3>
        <ul>
          <li>Assign Lesson: Fractions Basics to Grade 6</li>
          <li>Review quiz results and recommend remedial content</li>
          <li>Enable doubt review queue (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}
