import React, { useState } from "react";
import api from "./api";

export default function DoubtSolver() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setA("");
    try {
      const { data } = await api.post("/api/doubt", { question: q });
      setA(data.answer || "(No answer)");
    } catch (err) {
      console.error(err);
      setA("(Error) Could not get answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <h3>Doubt Solver (AI)</h3>
      <textarea
        rows={4}
        placeholder="Type your question…"
        style={{ width: "100%", padding: 8 }}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={ask} disabled={loading}>{loading ? "Thinking…" : "Get Answer"}</button>
        <button onClick={() => { setQ(""); setA(""); }} disabled={loading}>Clear</button>
      </div>
      {a && (
        <div style={{ whiteSpace: "pre-wrap", marginTop: 12, background: "#fafafa", padding: 10, borderRadius: 8 }}>
          {a}
        </div>
      )}
    </div>
  );
}
