import { useState } from "react";

function EntryScreen({ onStart }) {
  const [participantNumber, setParticipantNumber] = useState("");

  const handleStart = async () => {
    const num = parseInt(participantNumber, 10);
    if (!num || num < 1) {
      alert("Enter a valid participant number (e.g. 1, 2, 3...)");
      return;
    }
    const res = await fetch(`http://127.0.0.1:8000/assign?participant_number=${num}`);
    const data = await res.json();
    const sessionId = `sess_${num}_${Date.now()}`;
    onStart({
      participantId: `p${num}`,
      sessionId,
      conditionOrder: data.order, // e.g. ["transparency_off", "transparency_on"]
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-20 text-center">
      <h1 className="text-xl font-semibold mb-4">AgentUX Study</h1>
      <p className="text-sm text-gray-500 mb-4">Enter your participant number to begin.</p>
      <input
        type="number"
        min="1"
        value={participantNumber}
        onChange={(e) => setParticipantNumber(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        placeholder="Participant number"
      />
      <button
        onClick={handleStart}
        className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-700 w-full"
      >
        Start
      </button>
    </div>
  );
}

export default EntryScreen;