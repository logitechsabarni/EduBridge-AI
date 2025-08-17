// src/api.js

const API_BASE = "https://edubridgeai-backend.onrender.com"; // <-- Replace with your Render backend URL

// -------- AUTH ----------
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// -------- CHAT ----------
export async function chat(message) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json();
}

// -------- DOUBT ----------
export async function askDoubt(doubt) {
  const res = await fetch(`${API_BASE}/api/doubt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doubt }),
  });
  if (!res.ok) throw new Error("Doubt request failed");
  return res.json();
}

// -------- LESSONS ----------
export async function getLessons() {
  const res = await fetch(`${API_BASE}/api/lessons`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return res.json();
}

// -------- QUIZZES ----------
export async function getQuizzes() {
  const res = await fetch(`${API_BASE}/api/quizzes`);
  if (!res.ok) throw new Error("Failed to fetch quizzes");
  return res.json();
}
