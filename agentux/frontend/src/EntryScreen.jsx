import { useEffect, useState } from "react";

function EntryScreen({ onStart }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div className="p-6 text-caution">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto p-6 mt-20 text-center">
      <p className="text-sm text-slate">
        {loading ? "Setting up your session..." : ""}
      </p>
    </div>
  );
}

export default EntryScreen;
