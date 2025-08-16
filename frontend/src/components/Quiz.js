import React, { useEffect, useState } from "react";

export default function Quiz({ lessonId }) {
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/api/quizzes/" + lessonId)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
    setAnswers({});
    setScore(null);
  }, [lessonId]);

  const submit = () => {
    let s = 0;
    items.forEach((q, i) => {
      if (Number(answers[i]) === q.answer_index) s += 1;
    });
    setScore(`${s} / ${items.length}`);
  };

  if (!items.length) return null;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <h3>Quick Quiz</h3>
      {items.map((q, i) => (
        <div key={q.id} style={{ margin: "12px 0" }}>
          <div style={{ fontWeight: 600 }}>{i + 1}. {q.question}</div>
          <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
            {q.options.map((opt, idx) => (
              <label key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name={`q${i}`}
                  value={idx}
                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={submit}>Submit Answers</button>
      {score && <div style={{ marginTop: 8 }}><strong>Your Score:</strong> {score}</div>}
    </div>
  );
}
