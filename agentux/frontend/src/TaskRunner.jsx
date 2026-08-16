import { useEffect, useState, useRef } from "react";
import ActionCard from "./components/ActionCard";
import SurveyScreen from "./SurveyScreen";
import { logEvent } from "./api";

function TaskRunner({ sessionId, participantId, condition, scenarioVariant, onComplete }) {
  const [data, setData] = useState(null);
  const [actions, setActions] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const url = `http://127.0.0.1:8000/scenario?session_id=${sessionId}&participant_id=${participantId}&condition=${condition}&scenario=${scenarioVariant}`;

    fetch(url)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setActions(d.actions);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleStatusChange = (id, status) => {
    setStatuses((s) => ({ ...s, [id]: status }));
  };

  const decidedCount = Object.keys(statuses).filter((id) => statuses[id]).length;
  const allDecided = actions.length > 0 && decidedCount === actions.length;

  const handleSubmit = () => {
    logEvent(sessionId, participantId, condition, "task_end", {
      task_id: data.task_id, decided_count: decidedCount, total: actions.length,
    });
    setSubmitted(true);
  };

  if (error) return <div className="p-6 text-caution">Error: {error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  if (submitted && !surveyDone) {
    return (
      <SurveyScreen
        sessionId={sessionId}
        participantId={participantId}
        condition={condition}
        onSubmit={() => setSurveyDone(true)}
      />
    );
  }

  if (submitted && surveyDone) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2 text-ink">Round complete</h1>
        <p className="text-slate mb-6">Thanks for completing that round.</p>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-signal text-white text-sm font-medium hover:opacity-90"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-display text-2xl font-semibold mb-1 text-ink">{data.prompt}</h1>
      <p className="text-xs font-mono uppercase tracking-wide text-slate mb-6">
        Explainability: {condition === "transparency_on" ? "ON" : "OFF"}
      </p>
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          session_id={sessionId}
          participant_id={participantId}
          condition={condition}
          onStatusChange={(status) => handleStatusChange(action.id, status)}
        />
      ))}
      <div className="sticky bottom-0 bg-white border-t border-line pt-4 mt-4 flex justify-between items-center">
        <span className="text-sm text-slate">{decidedCount} / {actions.length} decided</span>
        <button
          onClick={handleSubmit}
          disabled={!allDecided}
          className="px-4 py-2 bg-signal text-white text-sm font-medium hover:opacity-90 disabled:opacity-30"
        >
          Submit Triage
        </button>
      </div>
    </div>
  );
}

export default TaskRunner;