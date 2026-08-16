import { useState } from "react";
import InstructionsScreen from "./InstructionsScreen";
import EntryScreen from "./EntryScreen";
import TaskRunner from "./TaskRunner";

function App() {
  const [agreed, setAgreed] = useState(false);
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

  if (!agreed) return <InstructionsScreen onAgree={() => setAgreed(true)} />;
  if (!session) return <EntryScreen onStart={handleStart} />;

  if (finished) {
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center">
        <h1 className="font-display text-2xl font-semibold mb-3 text-ink">Thank you</h1>
        <p className="text-slate leading-relaxed">
          Thank you for being part of this research study. Your responses have
          been recorded and will help us understand how AI transparency affects
          decision-making.
        </p>
      </div>
    );
  }

  const condition = session.conditionOrder[phase];
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