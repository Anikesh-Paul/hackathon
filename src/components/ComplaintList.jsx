import { useRef } from "react";
import { ComplaintCard } from "./ComplaintCard";
import { useStaggerReveal } from "../hooks/useAnimations";

export function ComplaintList({
  complaints,
  onStatusChange,
  onNoteAdd,
  onPublicMessageUpdate,
}) {
  const container = useRef();
  useStaggerReveal(container, ".complaint-card-reveal");

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No complaints found.
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={container}>
      {complaints.map((complaint) => (
        <div key={complaint.id} className="complaint-card-reveal">
          <ComplaintCard
            complaint={complaint}
            onStatusChange={onStatusChange}
            onNoteAdd={onNoteAdd}
            onPublicMessageUpdate={onPublicMessageUpdate}
          />
        </div>
      ))}
    </div>
  );
}
