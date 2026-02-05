import { useState } from "react";
import { StatusBadge } from "./StatusBadge";

const STATUS_OPTIONS = ["pending", "reviewing", "resolved", "dismissed"];

export function ComplaintCard({ complaint, onStatusChange, onNoteAdd }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState(complaint.adminNotes || "");
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(e) {
    setSaving(true);
    try {
      await onStatusChange(complaint.id, e.target.value);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNote() {
    setSaving(true);
    try {
      await onNoteAdd(complaint.id, note);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{complaint.title}</h3>
          <p className="text-sm text-gray-500">
            {complaint.category && (
              <span className="mr-2">{complaint.category}</span>
            )}
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tracking ID</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {complaint.trackingId}
            </code>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Status</label>
            <select
              value={complaint.status}
              onChange={handleStatusChange}
              disabled={saving}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Admin Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm"
              placeholder="Internal notes..."
            />
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="mt-2 bg-gray-900 text-white text-sm py-1 px-3 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
