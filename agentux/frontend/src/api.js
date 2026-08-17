export const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function logEvent(session_id, participant_id, condition, event_type, payload) {
  try {
    await fetch(`${BASE}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, participant_id, condition, event_type, payload }),
    });
  } catch (err) {
    console.error("log failed:", err);
  }
}