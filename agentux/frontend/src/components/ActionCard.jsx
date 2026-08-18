import { useState, useEffect } from "react";
import { logEvent } from "../api";

const CATEGORIES = ["Billing", "Technical", "Account", "Other"];

const confidenceWord = (c) => {
  if (c >= 0.85) return "Very sure";
  if (c >= 0.65) return "Fairly sure";
  if (c >= 0.45) return "Somewhat unsure";
  return "Not very sure";
};

// Highlights the AI's cited phrases inside the customer's message.
function HighlightedMessage({ text, highlights = [] }) {
  if (!highlights.length) return <>"{text}"</>;

  const escaped = highlights
    .filter(Boolean)
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      "
      {parts.map((part, i) =>
        highlights.some((h) => h && part.toLowerCase() === h.toLowerCase()) ? (
          <mark
            key={i}
            className="bg-pending-soft text-ink px-1 rounded"
            style={{ boxShadow: "inset 0 -2px 0 rgba(184, 134, 11, 0.35)" }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
      "
    </>
  );
}

function ActionCard({ action, session_id, participant_id, condition, onStatusChange, messageNumber }) {
  const [status, setStatus] = useState(null);
  const [picking, setPicking] = useState(false);
  const [corrected, setCorrected] = useState(null);
  const [showAlternative, setShowAlternative] = useState(false);

  const current = action.label.split(" as ")[1];
  const showsReasoning = !!action.reasoning;

  // Log when this card first appears — used for time-per-decision analysis.
  useEffect(() => {
    logEvent(session_id, participant_id, condition, "card_viewed", {
      id: action.id,
      ts_client: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = () => {
    setStatus("accepted"); setPicking(false);
    onStatusChange?.("accepted");
    logEvent(session_id, participant_id, condition, "action_accepted", { id: action.id });
  };
  const pick = (cat) => {
    setStatus("corrected"); setCorrected(cat); setPicking(false);
    onStatusChange?.("corrected");
    logEvent(session_id, participant_id, condition, "action_edited",
      { id: action.id, old_label: action.label, new_category: cat });
  };
  const undo = () => {
    setStatus(null); setCorrected(null);
    onStatusChange?.(null);
    logEvent(session_id, participant_id, condition, "undo", { id: action.id });
  };
  const toggleAlt = () => {
    const next = !showAlternative;
    setShowAlternative(next);
    if (next) {
      logEvent(session_id, participant_id, condition, "alternative_viewed", { id: action.id });
    }
  };

  const cardTone =
    status === "accepted"  ? "border-confirm/40 bg-confirm-soft"
    : status === "corrected" ? "border-pending/50 bg-pending-soft"
    : "border-line bg-card";

  return (
    <div
      className={`rounded-2xl border ${cardTone} p-6 mb-5 transition-colors`}
      style={{ boxShadow: "0 1px 2px rgba(60, 50, 30, 0.04), 0 4px 12px rgba(60, 50, 30, 0.03)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist">
          Message {messageNumber ?? action.id.replace(/\D/g, "")}
        </p>
        {status && (
          <span className={`text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full
            ${status === "accepted" ? "bg-confirm/10 text-confirm" : "bg-pending/15 text-pending"}`}>
            {status === "accepted" ? "You agreed" : "You changed it"}
          </span>
        )}
      </div>

      <div className="bg-sand border border-hair rounded-xl px-5 py-4 mb-5">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-1.5">
          A customer wrote
        </p>
        <p className="font-display text-lg leading-relaxed text-ink">
          <HighlightedMessage
            text={action.ticket_text}
            highlights={showsReasoning ? action.highlights || [] : []}
          />
        </p>
        {showsReasoning && (action.highlights?.length > 0) && (
          <p className="text-[11px] text-mist mt-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-pending/40 mr-1.5 align-middle"></span>
            Highlighted parts are what the AI focused on.
          </p>
        )}
      </div>

      <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-1.5">
        The AI thinks this message is about
      </p>
      <p className="font-display text-2xl text-ink mb-4">
        {status === "corrected" ? (
          <>
            <span className="line-through text-mist mr-2">{current}</span>
            <span className="text-pending">{corrected}</span>
          </>
        ) : current}
      </p>

      {action.confidence !== undefined && (
        <p className="text-sm mb-4">
          <span className="text-mist">How sure the AI is: </span>
          <span className="font-medium text-ink">
            {confidenceWord(action.confidence)}
          </span>
          <span className="text-mist"> ({Math.round(action.confidence * 100)}%)</span>
        </p>
      )}

      {showsReasoning && (
        <div className="border border-hair rounded-xl overflow-hidden mb-5">
          <div className="bg-sand px-4 py-3 border-b border-hair">
            <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-1">
              How the AI decided
            </p>
            <p className="text-sm leading-relaxed text-ink">
              {action.reasoning}
            </p>
          </div>

          {action.alternative && (
            <div className="bg-card">
              <button
                type="button"
                onClick={toggleAlt}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-sand transition-colors"
              >
                <span className="text-sm text-slate">
                  What else did the AI consider?
                </span>
                <span className="text-xs text-mist">
                  {showAlternative ? "Hide" : "Show"}
                </span>
              </button>
              {showAlternative && (
                <div className="px-4 pb-4 pt-1 border-t border-hair">
                  <p className="text-sm text-ink mb-1">
                    <span className="text-slate">It also thought about </span>
                    <span className="font-medium">{action.alternative.category}</span>
                    <span className="text-slate"> — but went with {current} because:</span>
                  </p>
                  <p className="text-sm text-slate leading-relaxed">
                    {action.alternative.why_not}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-hair pt-4">
        <p className="text-sm font-medium text-ink mb-3">
          Does that look right to you?
        </p>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button onClick={accept} disabled={status === "accepted"}
            className="bg-confirm text-white text-sm font-medium px-4 py-2.5 rounded-[10px] hover:opacity-90 disabled:opacity-40">
            Yes, that's right
          </button>

          {!picking ? (
            <button onClick={() => setPicking(true)}
              className="border border-line bg-card text-ink text-sm font-medium px-4 py-2.5 rounded-[10px] hover:bg-sand">
              No, it should be…
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] border border-line bg-sand">
              <span className="text-sm text-slate">It should be:</span>
              <select autoFocus defaultValue="" onChange={(e) => pick(e.target.value)}
                className="text-sm border border-line rounded px-2 py-1 bg-card text-ink">
                <option value="" disabled>Choose…</option>
                {CATEGORIES.filter((c) => c !== current).map((c) =>
                  <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => setPicking(false)}
                className="text-xs text-mist hover:text-slate">Cancel</button>
            </div>
          )}

          {status !== null && (
            <button onClick={undo}
              className="ml-auto border border-pending/60 text-pending text-sm font-medium px-3.5 py-2 rounded-[10px] hover:bg-pending-soft">
              Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionCard;