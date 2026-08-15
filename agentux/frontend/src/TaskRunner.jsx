import { useEffect, useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableActionCard from "./components/SortableActionCard";
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

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch(`http://127.0.0.1:8000/scenario?session_id=${sessionId}&participant_id=${participantId}&condition=${condition}&scenario=${scenarioVariant}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setActions(d.actions);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = actions.findIndex((a) => a.id === active.id);
    const newIndex = actions.findIndex((a) => a.id === over.id);
    setActions(arrayMove(actions, oldIndex, newIndex));
    logEvent(sessionId, participantId, condition, "action_edited", {
      id: active.id, type: "reorder", from_index: oldIndex, to_index: newIndex,
    });
  };

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

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
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
        <h1 className="text-xl font-semibold mb-2">Task complete</h1>
        <p className="text-gray-500 mb-6">Condition: {condition}</p>
        <button
          onClick={onComplete}
          className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-700"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">{data.prompt}</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={actions.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {actions.map((action) => (
            <SortableActionCard
              key={action.id}
              action={action}
              session_id={sessionId}
              participant_id={participantId}
              condition={condition}
              onStatusChange={(status) => handleStatusChange(action.id, status)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">{decidedCount} / {actions.length} decided</span>
        <button
          onClick={handleSubmit}
          disabled={!allDecided}
          className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-40"
        >
          Submit Triage
        </button>
      </div>
    </div>
  );
}

export default TaskRunner;