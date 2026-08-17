import { useState } from "react";
import { BASE } from "./api"; // adjust path if needed

function EntryScreen({ onStart }) {
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [aiFamiliarity, setAiFamiliarity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!name.trim() || !ageRange || !aiFamiliarity) {
      alert("Please fill in all fields to continue.");
      return;
    }
    setLoading(true);
    try {
      const url = `${BASE}/register?name=${encodeURIComponent(name.trim())}&age_range=${encodeURIComponent(ageRange)}&ai_familiarity=${aiFamiliarity}`;
      const res = await fetch(url);
      const data = await res.json();
      const sessionId = `sess_${data.participant_number}_${Date.now()}`;
      onStart({
        participantId: `p${data.participant_number}`,
        sessionId,
        conditionOrder: data.order,
      });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (error) return <div className="p-6 text-caution">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 mt-16 text-left">
      <h1 className="font-display text-xl font-semibold mb-4 text-ink text-center">
        Before you begin
      </h1>

      <label className="text-sm text-slate block mb-1">Your name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-line rounded px-3 py-2 w-full mb-4"
        placeholder="Your name"
      />

      <label className="text-sm text-slate block mb-1">Age range</label>
      <select
        value={ageRange}
        onChange={(e) => setAgeRange(e.target.value)}
        className="border border-line rounded px-3 py-2 w-full mb-4"
      >
        <option value="">Select...</option>
        <option value="under_18">Under 18</option>
        <option value="18_24">18–24</option>
        <option value="25_34">25–34</option>
        <option value="35_44">35–44</option>
        <option value="45_plus">45+</option>
      </select>

      <label className="text-sm text-slate block mb-1">
        How familiar are you with AI tools (e.g. ChatGPT)? (1 = not at all, 5 = very familiar)
      </label>
      <select
        value={aiFamiliarity}
        onChange={(e) => setAiFamiliarity(e.target.value)}
        className="border border-line rounded px-3 py-2 w-full mb-6"
      >
        <option value="">Select...</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <button
        onClick={handleStart}
        disabled={loading}
        className="px-4 py-2 bg-signal text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 w-full"
      >
        {loading ? "Starting..." : "Start"}
      </button>
    </div>
  );
}

export default EntryScreen;
