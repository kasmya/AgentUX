import { useState, useEffect } from "react";
import { BASE } from "./api";

const TRUST_QUESTIONS = [
  { key: "trust_1", text: "I felt I could rely on what the AI suggested." },
  { key: "trust_2", text: "It felt like I was the one making the final call — not the AI." },
  { key: "trust_3", text: "I understood why the AI suggested what it did." },
  { key: "trust_4", text: "I'd be comfortable if a real company used something like this." },
  { key: "trust_5", text: "The AI felt like a helpful teammate, not a replacement for me." },
];

const EASE_QUESTIONS = [
  "This was easy to use.",
  "I felt confident while I was doing it.",
  "The buttons and choices made sense to me.",
  "I always knew what to do next.",
  "The words on the screen were easy to understand.",
  "I'd be happy to do something like this again.",
  "This felt more complicated than it needed to be.",
  "There were moments I wasn't sure what to click.",
];

const FEEL_OPTIONS = [
  "It was easy to understand",
  "It was confusing in places",
  "I wanted more from the AI",
  "The AI gave me too much to read",
  "The buttons and choices were clear",
  "Some words weren't clear to me",
  "It felt quick and light",
  "It felt long or repetitive",
  "I liked seeing the AI's thinking",
  "The AI's thinking didn't really help me",
];

const CARD_SHADOW = "0 1px 2px rgba(60, 50, 30, 0.04), 0 4px 12px rgba(60, 50, 30, 0.03)";

function Scale({ value, onChange, lowLabel, highLabel, max = 5 }) {
  return (
    <div className="flex items-center justify-between gap-3 max-w-md mt-3">
      <span className="text-xs text-slate w-24">{lowLabel}</span>
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-full border text-sm transition-colors
              ${value === n
                ? "bg-confirm border-confirm text-white font-medium"
                : "border-line bg-card text-ink hover:bg-sand"}`}
          >
            {n}
          </button>
        ))}
      </div>
      <span className="text-xs text-slate w-24 text-right">{highLabel}</span>
    </div>
  );
}

function Section({ eyebrow, title, subtitle, children }) {
  return (
    <section
      className="mb-6 rounded-2xl border border-line bg-card p-6"
      style={{ boxShadow: CARD_SHADOW }}
    >
      {eyebrow && (
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-xl text-ink mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-slate mb-5">{subtitle}</p>}
      {children}
    </section>
  );
}

function SurveyScreen({ sessionId, participantId, condition, onSubmit }) {
  const [trust, setTrust] = useState({});
  const [ease, setEase] = useState(Array(EASE_QUESTIONS.length).fill(null));
  const [sawThinking, setSawThinking] = useState("");
  const [overall, setOverall] = useState(null);
  const [chosen, setChosen] = useState([]);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const toggle = (t) =>
    setChosen((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const canSubmit =
    TRUST_QUESTIONS.every((q) => trust[q.key]) &&
    ease.every((v) => v !== null) &&
    sawThinking &&
    overall !== null &&
    !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    const packedComments = [
      chosen.length ? `Selected: ${chosen.join(", ")}` : null,
      comments || null,
    ].filter(Boolean).join(" | ");
    try {
      await fetch(`${BASE}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          participant_id: participantId,
          condition,
          trust_1: trust.trust_1, trust_2: trust.trust_2, trust_3: trust.trust_3,
          trust_4: trust.trust_4, trust_5: trust.trust_5,
          sus_scores: ease,
          saw_reasoning: sawThinking,
          overall_rating: overall,
          comments: packedComments || null,
        }),
      });
    } catch (e) { console.error(e); }
    setSubmitting(false);
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-10">
      <div className="mb-8 px-1">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
          After the round
        </p>
        <h1 className="font-display text-3xl text-ink mb-3">
          How was that for you?
        </h1>
        <p className="text-[15px] text-slate leading-relaxed">
          There are no right or wrong answers — just go with what feels true.
          For each statement, pick a number: 1 means you disagree, 5 means you agree.
        </p>
      </div>

      <Section
        eyebrow="Quick check"
        title="Just to make sure"
        subtitle="In the round you just finished, did you get to see the AI's thinking and how sure it was about each guess?"
      >
        <div className="flex flex-col gap-2">
          {[
            { v: "yes", label: "Yes — I could see the AI's thinking" },
            { v: "no", label: "No — I only saw the AI's guess" },
            { v: "unsure", label: "I'm not sure" },
          ].map((opt) => (
            <label key={opt.v}
              className={`flex items-center gap-3 border rounded-[10px] px-4 py-3 cursor-pointer transition-colors
                ${sawThinking === opt.v
                  ? "border-confirm bg-confirm-soft"
                  : "border-line bg-card hover:bg-sand"}`}>
              <input type="radio" name="sawThinking" value={opt.v}
                checked={sawThinking === opt.v}
                onChange={() => setSawThinking(opt.v)}
                className="w-4 h-4 accent-confirm" />
              <span className="text-[15px] text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Part 1"
        title="How you felt about the AI"
        subtitle="Think back to the AI's guesses in the round you just did."
      >
        {TRUST_QUESTIONS.map((q, i) => (
          <div key={q.key} className={`${i < TRUST_QUESTIONS.length - 1 ? "pb-5 mb-5 border-b border-hair" : ""}`}>
            <p className="text-[15px] text-ink">{q.text}</p>
            <Scale
              value={trust[q.key]}
              onChange={(v) => setTrust((t) => ({ ...t, [q.key]: v }))}
              lowLabel="Disagree"
              highLabel="Agree"
            />
          </div>
        ))}
      </Section>

      <Section
        eyebrow="Part 2"
        title="How it felt to use"
        subtitle="Now think about the screens themselves — the buttons, layout, and words."
      >
        {EASE_QUESTIONS.map((text, i) => (
          <div key={i} className={`${i < EASE_QUESTIONS.length - 1 ? "pb-5 mb-5 border-b border-hair" : ""}`}>
            <p className="text-[15px] text-ink">{text}</p>
            <Scale
              value={ease[i]}
              onChange={(v) => setEase((s) => s.map((val, idx) => idx === i ? v : val))}
              lowLabel="Disagree"
              highLabel="Agree"
            />
          </div>
        ))}
      </Section>

      <Section
        eyebrow="Part 3"
        title="Overall"
        subtitle="Taking everything together, how would you rate this round?"
      >
        <Scale
          value={overall}
          onChange={setOverall}
          lowLabel="Not great"
          highLabel="Really good"
        />
      </Section>

      <Section
        eyebrow="Optional"
        title="Anything else?"
        subtitle="Pick any that describe how it felt — as many as you like."
      >
        <div className="flex flex-wrap gap-2 mb-5">
          {FEEL_OPTIONS.map((t) => {
            const on = chosen.includes(t);
            return (
              <button
                key={t} type="button" onClick={() => toggle(t)}
                className={`text-sm px-3.5 py-2 rounded-full border transition-colors
                  ${on
                    ? "bg-confirm text-white border-confirm"
                    : "bg-card text-ink border-line hover:bg-sand"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <label className="block">
          <span className="block text-sm text-slate mb-2">
            Want to add anything in your own words?
          </span>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border border-line bg-sand text-ink placeholder-mist rounded-[10px] p-3.5 text-[15px] focus:outline-none focus:border-confirm focus:bg-card"
            rows={3}
            placeholder="Anything at all — good, bad, or confusing…"
          />
        </label>
      </Section>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full bg-confirm text-white text-[15px] font-medium py-3.5 rounded-[10px] hover:opacity-90 disabled:opacity-30 mt-2"
        style={{ boxShadow: CARD_SHADOW }}
      >
        {submitting ? "Saving your answers…" : "Send my answers"}
      </button>
    </div>
  );
}

export default SurveyScreen;