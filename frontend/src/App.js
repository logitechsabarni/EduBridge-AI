import React, { useState } from "react";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://<your-backend-url>";

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const name = e.target.name.value;
    const role = e.target.role.value;

    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, role }),
    });
    const data = await res.json();
    if (!data.error) setUser(data);
  };

  // Chat API call
  const sendMessage = async (message) => {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.reply;
  };

  if (!user) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 520, margin: "60px auto" }}>
        <h1>EduBridge AI</h1>
        <p>Sign in (demo, no password):</p>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input name="name" placeholder="Your name" required />
          <input name="email" placeholder="you@example.com" required />
          <select name="role" defaultValue="student">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit">Continue</button>
        </form>
        <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          Set <code>VITE_API_BASE</code> in <code>.env</code> (e.g., {API_BASE})
        </p>
      </div>
    );
  }

  // Pass sendMessage and chatMessages to dashboards
  return user.role === "teacher" ? (
    <TeacherDashboard user={user} sendMessage={sendMessage} chatMessages={chatMessages} setChatMessages={setChatMessages} />
  ) : (
    <StudentDashboard user={user} sendMessage={sendMessage} chatMessages={chatMessages} setChatMessages={setChatMessages} />
  );
}
