import { useState } from "react";
import { logEvent } from "../api";

function ActionCard({ action, session_id, participant_id, condition }) {
  const [status, setStatus] = useState(null); // null | "accepted" | "rejected"

  const handleAccept = () => {
    setStatus("accepted");
    logEvent(session_id, participant_id, condition, "action_accepted", { id: action.id });
  };

  const handleReject = () => {
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

      {action.reasoning && (
        <p className="text-sm text-gray-500 mt-2">{action.reasoning}</p>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAccept}
          disabled={status !== null}
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
          disabled={status !== null}
          className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-40"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default ActionCard;