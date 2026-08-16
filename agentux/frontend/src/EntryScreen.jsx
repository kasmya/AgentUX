import { useEffect, useState, useRef } from "react";

function EntryScreen({ onStart }) {
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("http://127.0.0.1:8000/next_participant")
      .then((res) => res.json())
      .then((data) => {
        const sessionId = `sess_${data.participant_number}_${Date.now()}`;
        onStart({
          participantId: `p${data.participant_number}`,
          sessionId,
          conditionOrder: data.order,
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="p-6 text-caution">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 mt-20 text-center">
      <p className="text-sm text-slate">Setting up your session...</p>
    </div>
  );
}

export default EntryScreen;