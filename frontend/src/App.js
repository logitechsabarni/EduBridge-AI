import React, { useState } from "react";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import api from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Login handler using Axios
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const name = e.target.name.value;
    const role = e.target.role.value;

    try {
      const { data } = await api.post("/api/login", { email, name, role });
      if (!data.error) setUser(data);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your backend.");
    }
  };

  // Chat API call using Axios
  const sendMessage = async (message) => {
    try {
      const { data } = await api.post("/api/chat", { message });
      return data.reply;
    } catch (err) {
      console.error("Chat failed:", err);
      return "Error: Could not reach backend.";
    }
  };

  // If not logged in, show login form
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
          Set <code>VITE_API_BASE</code> in <code>.env</code> (e.g., https://your-backend-url)
        </p>
      </div>
    );
  }

  // Pass sendMessage and chatMessages to dashboards
  return user.role === "teacher" ? (
    <TeacherDashboard
      user={user}
      sendMessage={sendMessage}
      chatMessages={chatMessages}
      setChatMessages={setChatMessages}
    />
  ) : (
    <StudentDashboard
      user={user}
      sendMessage={sendMessage}
      chatMessages={chatMessages}
      setChatMessages={setChatMessages}
    />
  );
}
