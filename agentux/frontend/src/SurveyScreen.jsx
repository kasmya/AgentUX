import { useState } from "react";

const TRUST_QUESTIONS = [
  { key: "trust_1", text: "I trusted the agent's suggestions." },
  { key: "trust_2", text: "I felt in control of the agent's actions." },
  { key: "trust_3", text: "I understood why the agent made its suggestions." },
];

const SUS_ITEMS = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need support to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
];

function ScaleInput({ name, value, onChange, max, lowLabel, highLabel }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-xs text-gray-400 w-24">{lowLabel}</span>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <label key={n} className="flex flex-col items-center text-xs text-gray-600 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="w-5 h-5 accent-purple-600 cursor-pointer"
          />
          {n}
        </label>
      ))}
      <span className="text-xs text-gray-400 w-24 text-right">{highLabel}</span>
    </div>
  );
}

function SurveyScreen({ sessionId, participantId, condition, onSubmit }) {
  const [trust, setTrust] = useState({});
  const [sus, setSus] = useState(Array(10).fill(null));
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trustComplete = TRUST_QUESTIONS.every((q) => trust[q.key]);
  const susComplete = sus.every((v) => v !== null);
  const canSubmit = trustComplete && susComplete && !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("http://127.0.0.1:8000/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          participant_id: participantId,
          condition,
          trust_1: trust.trust_1,
          trust_2: trust.trust_2,
          trust_3: trust.trust_3,
          sus_scores: sus,
          comments: comments || null,
        }),
      });
    } catch (err) {
      console.error("survey submit failed:", err);
    }
    setSubmitting(false);
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-1">Quick survey</h1>
      <p className="text-sm text-gray-500 mb-6">
        Rate your experience with this version of the task.
      </p>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Trust & control</h2>
        {TRUST_QUESTIONS.map((q) => (
          <div key={q.key} className="mb-4">
            <p className="text-sm text-gray-800">{q.text}</p>
            <ScaleInput
              name={q.key}
              value={trust[q.key]}
              onChange={(v) => setTrust((t) => ({ ...t, [q.key]: v }))}
              max={7}
              lowLabel="Strongly disagree"
              highLabel="Strongly agree"
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          Usability (System Usability Scale)
        </h2>
        {SUS_ITEMS.map((text, i) => (
          <div key={i} className="mb-4">
            <p className="text-sm text-gray-800">{text}</p>
            <ScaleInput
              name={`sus_${i}`}
              value={sus[i]}
              onChange={(v) =>
                setSus((s) => s.map((val, idx) => (idx === i ? v : val)))
              }
              max={5}
              lowLabel="Strongly disagree"
              highLabel="Strongly agree"
            />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Any other comments? (optional)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-sm"
          rows={3}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-40 w-full"
      >
        {submitting ? "Submitting..." : "Submit survey"}
      </button>
    </div>
  );
}

export default SurveyScreen;