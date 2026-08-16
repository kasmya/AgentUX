import { useState } from "react";
import { logEvent } from "../api";

const CATEGORIES = ["Billing", "Technical", "Account"];

function ActionCard({ action, session_id, participant_id, condition, onStatusChange }) {
  const [status, setStatus] = useState(null); // null | "accepted" | "rejected"
  const [traceOpen, setTraceOpen] = useState(false);
  const [history, setHistory] = useState([]); // for undo
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const pushHistory = (prevStatus) => {
    if (prevStatus !== null) {
      setHistory((h) => [...h, prevStatus]);
    }
  };

  const handleAccept = () => {
    pushHistory(status);
    setStatus("accepted");
    onStatusChange && onStatusChange("accepted");
    logEvent(session_id, participant_id, condition, "action_accepted", { id: action.id });
  };

  const handleReject = () => {
    pushHistory(status);
    setStatus("rejected");
    onStatusChange && onStatusChange("rejected");
    logEvent(session_id, participant_id, condition, "action_rejected", { id: action.id });
  };

  const handleEditSelect = (newCategory) => {
    setShowCategoryPicker(false);
    logEvent(session_id, participant_id, condition, "action_edited", {
      id: action.id,
      old_label: action.label,
      new_category: newCategory,
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStatus(prev);
    onStatusChange && onStatusChange(prev);
    logEvent(session_id, participant_id, condition, "undo", { id: action.id, reverted_to: prev });
  };

  const toggleTrace = () => {
    const opening = !traceOpen;
    setTraceOpen(opening);
    if (opening) {
      logEvent(session_id, participant_id, condition, "trace_opened", { id: action.id });
    }
  };

  const hasTraceData =
    action.reasoning ||
    action.confidence !== undefined ||
    (action.citations && action.citations.length > 0);

  return (
    <div
      className={`relative border rounded-none pl-6 pr-5 py-5 mb-4 transition-colors ${
        status === "accepted"
          ? "border-confirm bg-confirm-soft"
          : status === "rejected"
          ? "border-caution bg-caution-soft opacity-70"
          : "border-line bg-white"
      }`}
    >
      {/* vertical status bar */}
      <span
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{
          background:
            status === "accepted"
              ? "var(--color-confirm)"
              : status === "rejected"
              ? "var(--color-caution)"
              : "var(--color-line)",
        }}
      />
      {/* ticket ID label */}
      <span className="font-mono text-[11px] text-slate tracking-wide">
        TICKET #{action.id.replace("t", "")}
      </span>

      <p className="text-xs uppercase tracking-wide text-slate mt-2 mb-1">Customer message</p>
      <p className="font-display text-lg text-ink mb-4 leading-snug">"{action.ticket_text}"</p>

      <div className="flex justify-between items-center mb-3 pt-3 border-t border-line">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate mb-1">AI suggests</p>
          <span className="text-base font-semibold text-ink">{action.label}</span>
        </div>
        {action.confidence !== undefined && (
          <span className="font-mono text-xs font-medium px-2.5 py-1 border border-line text-slate">
            {Math.round(action.confidence * 100)}% confidence
          </span>
        )}
      </div>

      {hasTraceData && (
        <div className="mb-3">
          <button
            onClick={toggleTrace}
            className="text-sm text-signal hover:underline font-medium"
          >
            {traceOpen ? "Hide AI's reasoning ▲" : "Why did the AI suggest this? ▼"}
          </button>
          {traceOpen && (
            <div className="mt-2 text-sm text-ink bg-signal-soft p-3 leading-relaxed border-l-2 border-signal">
              {action.reasoning && <p>{action.reasoning}</p>}
              {action.citations?.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-xs text-slate">
                  {action.citations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-slate mb-2">Is this suggestion correct?</p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAccept}
          disabled={status === "accepted"}
          className="text-sm font-medium px-4 py-2 bg-confirm text-white hover:opacity-90 disabled:opacity-30"
        >
          Accept
        </button>
        <button
          onClick={() => setShowCategoryPicker((v) => !v)}
          className="text-sm font-medium px-4 py-2 border border-line text-ink hover:bg-paper"
        >
          Change category
        </button>
        <button
          onClick={handleReject}
          disabled={status === "rejected"}
          className="text-sm font-medium px-4 py-2 border border-caution text-caution hover:bg-caution-soft disabled:opacity-30"
        >
          Reject
        </button>
        {history.length > 0 && (
          <button
            onClick={handleUndo}
            className="text-sm font-medium px-4 py-2 border border-pending text-pending hover:bg-pending-soft"
          >
            Undo
          </button>
        )}
      </div>

      {showCategoryPicker && (
        <div className="mt-3 flex gap-2 items-center bg-paper p-3 border border-line">
          <span className="text-sm text-slate">Correct category:</span>
          <select
            onChange={(e) => handleEditSelect(e.target.value)}
            defaultValue=""
            className="text-sm border border-line px-2 py-1 bg-white"
          >
            <option value="" disabled>
              Choose one
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default ActionCard;
