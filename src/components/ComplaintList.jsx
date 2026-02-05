import { ComplaintCard } from './ComplaintCard';

export function ComplaintList({ complaints, onStatusChange, onNoteAdd }) {
  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No complaints found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint.id}
          complaint={complaint}
          onStatusChange={onStatusChange}
          onNoteAdd={onNoteAdd}
        />
      ))}
    </div>
  );
}
