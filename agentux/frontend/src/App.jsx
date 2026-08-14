import { useEffect, useState } from "react";
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
import { logEvent } from "./api";

const SESSION_ID = "s1";
const PARTICIPANT_ID = "p1";
const CONDITION = "transparency_on";

function App() {
  const [data, setData] = useState(null);
  const [actions, setActions] = useState([]);
  const [error, setError] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/scenario?session_id=${SESSION_ID}&participant_id=${PARTICIPANT_ID}&condition=${CONDITION}`)
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
    const reordered = arrayMove(actions, oldIndex, newIndex);
    setActions(reordered);

    logEvent(SESSION_ID, PARTICIPANT_ID, CONDITION, "action_edited", {
      id: active.id,
      type: "reorder",
      from_index: oldIndex,
      to_index: newIndex,
    });
  };

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">{data.prompt}</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={actions.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {actions.map((action) => (
            <SortableActionCard
              key={action.id}
              action={action}
              session_id={SESSION_ID}
              participant_id={PARTICIPANT_ID}
              condition={CONDITION}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default App;