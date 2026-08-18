import { useState, useEffect } from "react";
import { BASE } from "./api";

const CARD_SHADOW = "0 1px 2px rgba(60, 50, 30, 0.04), 0 4px 12px rgba(60, 50, 30, 0.03)";

const OPTIONS = [
  {
    value: "transparency_on",
    label: "The round where you saw the AI's thinking",
  },
  {
    value: "transparency_off",
    label: "The round where you only saw the AI's guess",
  },
];

function PreferenceScreen({ sessionId, participantId, onSubmit }) {
  const [preferred, setPreferred] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const canSubmit = preferred && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const chosen = OPTIONS.find((o) => o.value === preferred);
    try {
      const res = await fetch(`${BASE}/preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          participant_id: participantId,
          preferred_condition: preferred,
          preferred_label: chosen.label,
          comment: comment.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("network");
    } catch (e) {
      console.error(e);
      setError("Couldn't save your answer. Please try once more.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-10">
      <div className="mb-8 px-1">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
          One last thing
        </p>
        <h1 className="font-display text-3xl text-ink mb-3 leading-tight">
          Which interface did you prefer for completing the tasks?
        </h1>
        <p className="text-[15px] text-slate leading-relaxed">
          You just did two rounds with slightly different screens. Pick the one
          that felt better to you overall.
        </p>
      </div>

      <div
        className="rounded-2xl border border-line bg-card p-6 mb-6"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="flex flex-col gap-2 mb-6">
          {OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 border rounded-[10px] px-4 py-3 cursor-pointer transition-colors
                ${preferred === opt.value
                  ? "border-confirm bg-confirm-soft"
                  : "border-line bg-card hover:bg-sand"}`}
            >
              <input
                type="radio"
                name="preferred"
                value={opt.value}
                checked={preferred === opt.value}
                onChange={() => setPreferred(opt.value)}
                className="w-4 h-4 accent-confirm"
              />
              <span className="text-[15px] text-ink">{opt.label}</span>
            </label>
          ))}
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-ink mb-2">
            Why did you prefer this one? <span className="text-mist font-normal">(optional)</span>
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-line bg-sand text-ink placeholder-mist rounded-[10px] p-3.5 text-[15px] focus:outline-none focus:border-confirm focus:bg-card transition-colors"
            rows={4}
            placeholder="A sentence or two is plenty — skip if you'd rather not."
          />
        </label>

        {error && <p className="text-sm text-caution mt-4">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full bg-confirm text-white text-[15px] font-medium py-3.5 rounded-[10px] hover:opacity-90 disabled:opacity-30"
        style={{ boxShadow: CARD_SHADOW }}
      >
        {submitting ? "Saving…" : "Finish"}
      </button>
    </div>
  );
}

export default PreferenceScreen;