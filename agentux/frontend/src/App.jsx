import { useState } from "react";
import EntryScreen from "./EntryScreen";
import TaskRunner from "./TaskRunner";

function App() {
  const [session, setSession] = useState(null); // { participantId, sessionId, conditionOrder }
  const [phase, setPhase] = useState(0); // 0 = first condition, 1 = second condition
  const [finished, setFinished] = useState(false);

  const handleStart = (s) => setSession(s);

  const handlePhaseComplete = () => {
    if (phase === 0) {
      setPhase(1);
    } else {
      setFinished(true);
    }
  };

  if (!session) return <EntryScreen onStart={handleStart} />;

  if (finished) {
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center">
        <h1 className="text-xl font-semibold mb-2">Study complete</h1>
        <p className="text-gray-500">Thank you for participating.</p>
      </div>
    );
  }

  const condition = session.conditionOrder[phase];
  // alternate scenario variant per phase so it's not the same task twice
  const scenarioVariant = phase === 0 ? "ticket_triage_v1" : "ticket_triage_v2";

  return (
    <TaskRunner
      key={phase} // forces remount between phases
      sessionId={session.sessionId}
      participantId={session.participantId}
      condition={condition}
      scenarioVariant={scenarioVariant}
      onComplete={handlePhaseComplete}
    />
  );
}

export default App;