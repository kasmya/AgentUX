import { useState, useEffect, useRef } from "react";
import { BASE } from "./api";

const CARD_SHADOW = "0 1px 2px rgba(60, 50, 30, 0.04), 0 4px 12px rgba(60, 50, 30, 0.03)";

function EntryScreen({ onStart }) {
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [aiFamiliarity, setAiFamiliarity] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSlow, setLoadingSlow] = useState(false);
  const [error, setError] = useState(null);
  const slowTimerRef = useRef(null);

  const canStart = name.trim() && ageRange && aiFamiliarity;

  // Second warm-up ping in case the user paused on the instructions screen
  // long enough for the backend to have gone back to sleep between screens.
  useEffect(() => {
    fetch(`${BASE}/health`).catch(() => {});
  }, []);

  const handleStart = async () => {
    if (!canStart) return;
    setLoading(true);
    setLoadingSlow(false);
    setError(null);

    // If /register takes more than 3 seconds, swap the button text to the
    // "waking up server" message so participants know nothing is broken.
    slowTimerRef.current = setTimeout(() => setLoadingSlow(true), 3000);

    try {
      const url = `${BASE}/register?name=${encodeURIComponent(name.trim())}&age_range=${encodeURIComponent(ageRange)}&ai_familiarity=${aiFamiliarity}`;
      const res = await fetch(url);
      const data = await res.json();
      onStart({
        participantId: `p${data.participant_number}`,
        sessionId: `sess_${data.participant_number}_${Date.now()}`,
        conditionOrder: data.order,
      });
    } catch (err) {
      setError("Something went wrong. Please try again in a few seconds.");
      console.error(err);
    } finally {
      clearTimeout(slowTimerRef.current);
      setLoading(false);
      setLoadingSlow(false);
    }
  };

  const buttonText = !loading
    ? "Start the study"
    : loadingSlow
      ? "Waking up the server, this can take up to a minute…"
      : "Starting…";

  return (
    <div className="max-w-md mx-auto p-6 pt-16">
      <div className="mb-6 px-1">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
          Step 1 of 3
        </p>
        <h1 className="font-display text-3xl text-ink mb-2 leading-tight">
          A little about you
        </h1>
        <p className="text-sm text-slate">
          Just three quick things before we start.
        </p>
      </div>

      <div
        className="rounded-2xl border border-line bg-card p-6"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <label className="block mb-5">
          <span className="block text-sm font-medium text-ink mb-1.5">
            What should we call you?
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line bg-sand text-ink placeholder-mist rounded-[10px] px-3.5 py-2.5 focus:outline-none focus:border-confirm focus:bg-card transition-colors"
            placeholder="First name is fine"
          />
        </label>

        <label className="block mb-5">
          <span className="block text-sm font-medium text-ink mb-1.5">
            Roughly, how old are you?
          </span>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="w-full border border-line bg-sand text-ink rounded-[10px] px-3.5 py-2.5 focus:outline-none focus:border-confirm focus:bg-card transition-colors"
          >
            <option value="">Pick one…</option>
            <option value="under_18">Under 18</option>
            <option value="18_24">18 to 24</option>
            <option value="25_34">25 to 34</option>
            <option value="35_44">35 to 44</option>
            <option value="45_plus">45 or older</option>
          </select>
        </label>

        <label className="block mb-6">
          <span className="block text-sm font-medium text-ink mb-1.5">
            How often do you use AI tools like ChatGPT?
          </span>
          <select
            value={aiFamiliarity}
            onChange={(e) => setAiFamiliarity(e.target.value)}
            className="w-full border border-line bg-sand text-ink rounded-[10px] px-3.5 py-2.5 focus:outline-none focus:border-confirm focus:bg-card transition-colors"
          >
            <option value="">Pick one…</option>
            <option value="1">I've never really used them</option>
            <option value="2">I've tried them once or twice</option>
            <option value="3">I use them now and then</option>
            <option value="4">I use them most weeks</option>
            <option value="5">I use them nearly every day</option>
          </select>
        </label>

        {error && (
          <p className="text-sm text-caution mb-4">{error}</p>
        )}

        <button
          onClick={handleStart}
          disabled={!canStart || loading}
          className="w-full bg-confirm text-white text-[15px] font-medium py-3 rounded-[10px] hover:opacity-90 disabled:opacity-30 transition-opacity"
        >
          {buttonText}
        </button>
      </div>

      <p className="text-xs text-mist text-center mt-6 px-4 leading-relaxed">
        Your name is stored separately from your answers, only so we know who took part.
      </p>
    </div>
  );
}

export default EntryScreen;