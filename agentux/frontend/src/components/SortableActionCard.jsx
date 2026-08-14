import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ActionCard from "./ActionCard";

function SortableActionCard({ action, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 mt-4 px-1"
          title="Drag to reorder"
        >
          ⠿
        </div>
        <div className="flex-1">
          <ActionCard action={action} {...props} />
        </div>
      </div>
    </div>
  );
}

export default SortableActionCard;