import { useEffect, useState } from "react";
import ActionCard from "./components/ActionCard";

const SESSION_ID = "s1";
const PARTICIPANT_ID = "p1";
const CONDITION = "transparency_on";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/scenario?session_id=${SESSION_ID}&participant_id=${PARTICIPANT_ID}&condition=${CONDITION}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">{data.prompt}</h1>
      {data.actions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          session_id={SESSION_ID}
          participant_id={PARTICIPANT_ID}
          condition={CONDITION}
        />
      ))}
    </div>
  );
}

export default App;