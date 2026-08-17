import { useState } from "react";

const CARD_SHADOW = "0 1px 2px rgba(60, 50, 30, 0.04), 0 4px 12px rgba(60, 50, 30, 0.03)";

function InstructionsScreen({ onAgree }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 pt-12">
      <div className="mb-6 px-1">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
          A short research study
        </p>
        <h1 className="font-display text-4xl text-ink mb-3 leading-tight">
          How do people feel about AI suggestions?
        </h1>
        <p className="text-[15px] text-slate leading-relaxed">
          Takes about 10 to 15 minutes. No preparation needed.
        </p>
      </div>

      <div
        className="rounded-2xl border border-line bg-card p-6 mb-6"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="space-y-4 text-[15px] leading-relaxed text-ink">
          <p>
            You'll read short customer messages — the kind a company might get
            by email. For each one, an AI has already guessed what the message
            is about (for example, "Billing" or "Technical").
          </p>
          <p>
            Your job is simple: read the message, look at the AI's guess, and
            tell us whether you think the guess is right. If it's wrong, pick
            what you think the message is really about.
          </p>
          <p>
            There are two short rounds with about six messages each. After
            each round, we'll ask you a few quick questions about how it felt.
            In one round, you'll get to see the AI's thinking; in the other,
            you won't.
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-hair bg-sand -mx-6 -mb-6 px-6 py-5 rounded-b-2xl">
          <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
            Good to know
          </p>
          <ul className="space-y-2 text-sm text-slate leading-relaxed">
            <li>Some of the AI's guesses may be wrong — that's on purpose.</li>
            <li>There are no right or wrong answers on your side. Just answer honestly.</li>
            <li>You can stop any time by closing this page.</li>
            <li>
              Your answers are saved for a student research project. Your name
              is kept separate from your answers.
            </li>
          </ul>
        </div>
      </div>

      <div
        className="rounded-2xl border border-line bg-card p-6"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <label className="flex items-start gap-3 mb-5 text-[15px] text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-confirm cursor-pointer flex-shrink-0"
          />
          <span>I've read this and I'm happy to take part.</span>
        </label>

        <button
          onClick={onAgree}
          disabled={!agreed}
          className="w-full bg-confirm text-white text-[15px] font-medium py-3 rounded-[10px] hover:opacity-90 disabled:opacity-30 transition-opacity"
        >
          Let's begin
        </button>
      </div>
    </div>
  );
}

export default InstructionsScreen;