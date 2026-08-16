import { useState } from "react";
import { logEvent } from "../api";

const CATEGORIES = ["Billing", "Technical", "Account"];

function ActionCard({ action, session_id, participant_id, condition, onStatusChange }) {
  const [status, setStatus] = useState(null);
  const [traceOpen, setTraceOpen] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [correctedCategory, setCorrectedCategory] = useState(null);

  const handleAccept = () => {
    setStatus("accepted");
    setShowCategoryPicker(false);
    onStatusChange && onStatusChange("accepted");
    logEvent(session_id, participant_id, condition, "action_accepted", { id: action.id });
  };

  const handleEditSelect = (newCategory) => {
    setStatus("corrected");
    setCorrectedCategory(newCategory);
    setShowCategoryPicker(false);
    onStatusChange && onStatusChange("corrected");
    logEvent(session_id, participant_id, condition, "action_edited", {
      id: action.id,
      old_label: action.label,
      new_category: newCategory,
    });
  };

  const handleUndo = () => {
    setStatus(null);
    setCorrectedCategory(null);
    onStatusChange && onStatusChange(null);
    logEvent(session_id, participant_id, condition, "undo", { id: action.id });
  };

  const toggleTrace = () => {
    const opening = !traceOpen;
    setTraceOpen(opening);
    if (opening) logEvent(session_id, participant_id, condition, "trace_opened", { id: action.id });
  };

  const cardStyle = {
    border:
      status === "accepted"
        ? "2px solid #1F8A5A"
        : status === "corrected"
        ? "2px solid #B8860B"
        : "1px solid #ccc",
    background:
      status === "accepted" ? "#e9f5ef" : status === "corrected" ? "#fbf3e1" : "#fff",
    padding: "16px",
    marginBottom: "16px",
    transition: "background-color 0.2s, border-color 0.2s",
  };

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: "12px", color: "#888" }}>Ticket #{action.id.replace("t", "")}</p>

      <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>Customer message:</p>
      <p style={{ fontSize: "16px", marginBottom: "12px" }}>"{action.ticket_text}"</p>

      <p style={{ fontSize: "12px", color: "#888" }}>AI suggests:</p>
      <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
        {status === "corrected" ? (
          <>
            <span style={{ textDecoration: "line-through", color: "#888" }}>{action.label}</span>
            {" → "}
            {correctedCategory}
          </>
        ) : (
          action.label
        )}
      </p>

      {action.confidence !== undefined && (
        <p style={{ fontSize: "14px", color: "#333" }}>
          AI confidence: {Math.round(action.confidence * 100)}%
        </p>
      )}

      {action.reasoning && (
        <div style={{ marginTop: "8px" }}>
          <button
            onClick={toggleTrace}
            style={{
              fontSize: "14px",
              color: "#2B5FE2",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {traceOpen ? "Hide AI's reasoning" : "Why did the AI suggest this?"}
          </button>
          {traceOpen && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "14px",
                background: "#f5f5f5",
                padding: "12px",
              }}
            >
              <p>{action.reasoning}</p>
              {action.citations?.length > 0 && (
                <ul style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                  {action.citations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <p style={{ fontSize: "14px", marginTop: "16px", marginBottom: "8px" }}>
        Is the AI's category correct?
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={handleAccept}
          disabled={status === "accepted"}
          style={{
            padding: "8px 16px",
            background: "#1F8A5A",
            color: "white",
            border: "none",
            cursor: "pointer",
            opacity: status === "accepted" ? 0.5 : 1,
          }}
        >
          Yes, correct
        </button>
        <button
          onClick={() => setShowCategoryPicker((v) => !v)}
          style={{
            padding: "8px 16px",
            background: "#eee",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          No, it should be...
        </button>
        {status !== null && (
          <button
            onClick={handleUndo}
            style={{
              padding: "8px 16px",
              background: "#fff3cd",
              border: "1px solid #B8860B",
              cursor: "pointer",
            }}
          >
            Undo
          </button>
        )}
      </div>

      {showCategoryPicker && (
        <div style={{ marginTop: "12px" }}>
          <span style={{ fontSize: "14px", marginRight: "8px" }}>Correct category:</span>
          <select onChange={(e) => handleEditSelect(e.target.value)} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {CATEGORIES.filter((c) => c !== action.label.split(" as ")[1]).map((c) => (
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