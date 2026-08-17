import { useState, useEffect } from "react";
import { BASE } from "./api";

const TRUST_QUESTIONS = [
  { key: "trust_1", text: "I trusted the AI's suggestions." },
  { key: "trust_2", text: "I felt in control of what happened with each suggestion." },
  { key: "trust_3", text: "I understood why the AI made its suggestions." },
];

const SUS_ITEMS = [
  "I would like to use a system like this often.",
  "The system felt unnecessarily complicated.",
  "The system was easy to use.",
  "I would need help from someone to use this system.",
  "The different parts of this system worked well together.",
  "There was too much inconsistency in this system.",
  "Most people would learn to use this system quickly.",
  "The system felt awkward or cumbersome to use.",
  "I felt confident using the system.",
  "I had to learn a lot before I could use this system.",
];

function ScaleInput({ name, value, onChange, max, lowLabel, highLabel }) {
  return (
    <div className="flex items-center justify-between mt-3 max-w-md">
      <span className="text-xs text-gray-400 w-28">{lowLabel}</span>
      <div className="flex gap-4">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <label key={n} className="flex flex-col items-center text-xs text-gray-600 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="w-5 h-5 accent-purple-600 cursor-pointer mb-1"
            />
            {n}
          </label>
        ))}
      </div>
      <span className="text-xs text-gray-400 w-28 text-right">{highLabel}</span>
    </div>
  );
}

function SurveyScreen({ sessionId, participantId, condition, onSubmit }) {
  const [trust, setTrust] = useState({});
  const [sus, setSus] = useState(Array(10).fill(null));
  const [sawReasoning, setSawReasoning] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const trustComplete = TRUST_QUESTIONS.every((q) => trust[q.key]);
  const susComplete = sus.every((v) => v !== null);
  const canSubmit = trustComplete && susComplete && sawReasoning && !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch(`${BASE}/survey`, {
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
          saw_reasoning: sawReasoning,
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
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2">Quick survey</h1>
      <p className="text-sm text-slate mb-8">
        Rate each statement from 1 (strongly disagree) to the highest number (strongly agree).
      </p>

      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          This round
        </h2>
        <p className="text-sm text-gray-800 mb-2">
          Did you see the AI's reasoning and confidence for its suggestions in this round?
        </p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="saw_reasoning"
              value="yes"
              checked={sawReasoning === "yes"}
              onChange={() => setSawReasoning("yes")}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="saw_reasoning"
              value="no"
              checked={sawReasoning === "no"}
              onChange={() => setSawReasoning("no")}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
            No
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Trust & control
        </h2>
        {TRUST_QUESTIONS.map((q) => (
          <div key={q.key} className="mb-5">
            <p className="text-sm text-gray-800 mb-1">{q.text}</p>
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
        <h2 className="text-base font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Usability
        </h2>
        {SUS_ITEMS.map((text, i) => (
          <div key={i} className="mb-5">
            <p className="text-sm text-gray-800 mb-1">{text}</p>
            <ScaleInput
              name={`sus_${i}`}
              value={sus[i]}
              onChange={(v) => setSus((s) => s.map((val, idx) => (idx === i ? v : val)))}
              max={5}
              lowLabel="Strongly disagree"
              highLabel="Strongly agree"
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <label className="text-sm font-semibold text-gray-800 block mb-2">
          Anything else you'd like to share? (optional)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm"
          rows={3}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="px-4 py-3 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-40 w-full"
      >
        {submitting ? "Submitting..." : "Submit survey"}
      </button>
    </div>
  );
}

export default SurveyScreen;