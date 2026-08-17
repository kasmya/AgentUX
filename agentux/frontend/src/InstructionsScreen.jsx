import { useState } from "react";

function InstructionsScreen({ onAgree }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-display text-2xl font-semibold mb-4 text-ink">Before you begin</h1>

      <div className="text-sm text-slate space-y-3 mb-6 font-body">
        <p>
          You'll be reviewing AI-generated category suggestions for customer
          support tickets, in two short rounds, with a brief survey after each.
        </p>
        <p>
          For each ticket, an AI has suggested a category. Some suggestions may
          be incorrect — your job is to say whether the suggestion is correct,
          or pick the right category yourself if it isn't.
        </p>
        <p>
          Depending on the round, you may or may not see the AI's reasoning
          and confidence behind each suggestion.
        </p>
        <p>
          Your interactions (clicks, edits, timing) will be recorded for
          research purposes, along with your name, which will be kept
          separate from your response data and used only to confirm
          participation.
        </p>
        <p>
          Participation is voluntary. You may stop at any time by closing
          this window.
        </p>
      </div>

      <label className="flex items-start gap-2 mb-6 text-sm text-ink cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 accent-signal cursor-pointer rounded-none"
        />
        I understand what this study involves and agree to take part.
      </label>

      <button
        type="button"
        onClick={onAgree}
        disabled={!agreed}
        className="px-4 py-2 rounded-none bg-signal text-white text-sm hover:opacity-90 disabled:opacity-30 w-full"
      >
        Begin
      </button>
    </div>
  );
}

export default InstructionsScreen;