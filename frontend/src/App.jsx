import React, { useState } from "react";
import StudentDashboard from "./components/StudentDashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const name = e.target.name.value;
    const role = e.target.role.value;

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      });

      console.log("Login response status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
        alert("Backend did not return valid JSON");
        return;
      }

      console.log("Login response data:", data);

      if (data.error) {
        alert("Backend error: " + data.error);
      } else {
        setUser(data);
      }
    } catch (err) {
      console.error("Network or fetch error:", err);
      alert("Failed to login. Check backend connection.");
    }
  };

  if (!user) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 520,
          margin: "60px auto",
        }}
      >
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
          Set <code>VITE_API_BASE</code> in <code>.env</code>
        </p>
      </div>
    );
  }

  return user.role === "teacher" ? (
    <TeacherDashboard user={user} />
  ) : (
    <StudentDashboard user={user} />
  );
}
