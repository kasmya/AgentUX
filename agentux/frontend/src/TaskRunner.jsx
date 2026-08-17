import { useEffect, useState, useRef } from "react";
import ActionCard from "./components/ActionCard";
import SurveyScreen from "./SurveyScreen";
import { logEvent, BASE } from "./api";

function TaskRunner({ sessionId, participantId, condition, scenarioVariant, onComplete }) {
  const [data, setData] = useState(null);
  const [actions, setActions] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);
  const hasFetched = useRef(false);

  const showsThinking = condition === "transparency_on";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const url = `${BASE}/scenario?session_id=${sessionId}&participant_id=${participantId}&condition=${condition}&scenario=${scenarioVariant}`;

    fetch(url)
      .then((res) => res.json())
      .then((d) => { setData(d); setActions(d.actions); })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [submitted, surveyDone]);

  const handleStatusChange = (id, status) =>
    setStatuses((s) => ({ ...s, [id]: status }));

  const decidedCount = Object.values(statuses).filter(Boolean).length;
  const allDecided = actions.length > 0 && decidedCount === actions.length;

  const handleSubmit = () => {
    logEvent(sessionId, participantId, condition, "task_end", {
      task_id: data.task_id, decided_count: decidedCount, total: actions.length,
    });
    setSubmitted(true);
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center">
        <p className="text-caution">Something went wrong loading this round.</p>
        <p className="text-sm text-slate mt-2">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center text-slate">
        Loading the next round…
      </div>
    );
  }

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
      <div className="max-w-md mx-auto p-6 pt-20 text-center">
        <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-3">
          Round complete
        </p>
        <h1 className="font-display text-3xl text-ink mb-3">Nicely done</h1>
        <p className="text-slate leading-relaxed mb-8">
          That's one round finished. Ready for the next one?
        </p>
        <button
          onClick={onComplete}
          className="w-full bg-confirm text-white text-[15px] font-medium py-3 rounded-[10px] hover:opacity-90"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-10">
      <p className="text-[11px] font-medium tracking-widest uppercase text-mist mb-2">
        {showsThinking ? "Round with the AI's thinking" : "Round without the AI's thinking"}
      </p>
      <h1 className="font-display text-3xl text-ink mb-3 leading-tight">
        Read each message and check the AI's guess
      </h1>
      <p className="text-[15px] text-slate leading-relaxed mb-8">
        {showsThinking
          ? "For this round, you can see why the AI made each guess and how sure it was. Use whatever helps you decide."
          : "For this round, you'll only see the AI's guess — not why it made it. Just go with your gut."}
      </p>

      {actions.map((action, i) => (
        <ActionCard
          key={action.id}
          action={action}
          messageNumber={i + 1}
          session_id={sessionId}
          participant_id={participantId}
          condition={condition}
          onStatusChange={(status) => handleStatusChange(action.id, status)}
        />
      ))}

      <div className="sticky bottom-0 bg-paper border-t border-line pt-4 pb-4 mt-6 flex justify-between items-center">
        <span className="text-sm text-slate">
          You've answered {decidedCount} of {actions.length}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!allDecided}
          className="bg-confirm text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:opacity-90 disabled:opacity-30"
        >
          I'm done with this round
        </button>
      </div>
    </div>
  );
}

export default TaskRunner;