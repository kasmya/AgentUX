import { useState } from "react";
import { logEvent } from "../api";

function ActionCard({ action, session_id, participant_id, condition }) {
  const [status, setStatus] = useState(null); // null | "accepted" | "rejected"
  const [traceOpen, setTraceOpen] = useState(false);
  const [history, setHistory] = useState([]); // for undo

  const pushHistory = (prevStatus) => {
    setHistory((h) => [...h, prevStatus]);
  };

  const handleAccept = () => {
    pushHistory(status);
    setStatus("accepted");
    logEvent(session_id, participant_id, condition, "action_accepted", { id: action.id });
  };

  const handleReject = () => {
    pushHistory(status);
    setStatus("rejected");
    logEvent(session_id, participant_id, condition, "action_rejected", { id: action.id });
  };

  const handleEdit = () => {
    const newLabel = prompt("Edit action label:", action.label);
    if (newLabel && newLabel !== action.label) {
      logEvent(session_id, participant_id, condition, "action_edited", {
        id: action.id,
        old_label: action.label,
        new_label: newLabel,
      });
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setStatus(prev);
    logEvent(session_id, participant_id, condition, "undo", { id: action.id, reverted_to: prev });
  };

  const toggleTrace = () => {
    const opening = !traceOpen;
    setTraceOpen(opening);
    if (opening) {
      logEvent(session_id, participant_id, condition, "trace_opened", { id: action.id });
    }
  };

  const hasTraceData = action.reasoning || action.confidence !== undefined || (action.citations && action.citations.length > 0);

  return (
    <div
      className={`border rounded-lg p-4 mb-3 shadow-sm ${
        status === "accepted"
          ? "border-green-300 bg-green-50"
          : status === "rejected"
          ? "border-red-300 bg-red-50 opacity-60"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium text-gray-900">{action.label}</span>
        {action.confidence !== undefined && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              action.confidence >= 0.9
                ? "bg-green-100 text-green-800"
                : action.confidence >= 0.75
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {Math.round(action.confidence * 100)}%
          </span>
        )}
      </div>

      {hasTraceData && (
        <div className="mt-2">
          <button
            onClick={toggleTrace}
            className="text-xs text-purple-700 hover:underline"
          >
            {traceOpen ? "Hide reasoning ▲" : "Show reasoning ▼"}
          </button>
          {traceOpen && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
              {action.reasoning && <p>{action.reasoning}</p>}
              {action.citations && action.citations.length > 0 && (
                <ul className="mt-1 list-disc list-inside text-xs text-gray-500">
                  {action.citations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAccept}
          disabled={status === "accepted"}
          className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
        >
          Accept
        </button>
        <button
          onClick={handleEdit}
          className="text-sm px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Edit
        </button>
        <button
          onClick={handleReject}
          disabled={status === "rejected"}
          className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-40"
        >
          Reject
        </button>
        {history.length > 0 && (
          <button
            onClick={handleUndo}
            className="text-sm px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
}

export default ActionCard;