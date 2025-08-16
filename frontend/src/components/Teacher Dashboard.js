import React, { useState } from "react";
import Lesson from "./Lesson";
import Quiz from "./Quiz";

export default function TeacherDashboard({ user, sendMessage, chatMessages, setChatMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: "teacher", content: input };
    setChatMessages([...chatMessages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(input);
      setChatMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "ai", content: "(Error) Could not get reply" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome, {user.name} (Teacher)</h2>

      <div style={{ marginBottom: 24 }}>
        <h3>Lessons</h3>
        <Lesson role="teacher" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3>Quizzes</h3>
        <Quiz role="teacher" />
      </div>

      <div style={{ border: "1px solid #ccc", borderRadius: 10, padding: 16 }}>
        <h3>AI Chat</h3>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            height: 250,
            overflowY: "auto",
            marginBottom: 12,
            background: "#f9f9f9",
          }}
        >
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <strong>{msg.role === "teacher" ? "You: " : "EduBridgeAI: "}</strong>
              {msg.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send"}</button>
        </form>
      </div>
    </div>
  );
}
