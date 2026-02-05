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
    <div
      className={`group bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border-2 ${expanded ? "border-slate-900 ring-4 ring-slate-900/5" : "border-transparent"} transition-all duration-500 overflow-hidden`}
    >
      <div
        className={`p-6 sm:p-8 cursor-pointer transition-colors duration-500 ${expanded ? "bg-slate-50" : "hover:bg-slate-50"}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                ID: {complaint.trackingId.slice(0, 8)}...
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center">
                <svg
                  className="w-3 h-3 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase group-hover:text-red-600 transition-colors">
              {complaint.title}
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="scale-110">
              <StatusBadge status={complaint.status} />
            </div>
            <div
              className={`w-10 h-10 rounded-2xl border-2 border-slate-100 flex items-center justify-center transition-transform duration-500 ${expanded ? "rotate-180 bg-slate-900 border-slate-900" : "bg-white"}`}
            >
              <svg
                className={`w-5 h-5 transition-colors duration-500 ${expanded ? "text-white" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-8 sm:p-12 border-t border-slate-100 space-y-12 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-slate-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Full Evidence Transmission
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                  <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  Metadata Analysis
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-4 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                      Source Anonymity
                    </p>
                    <p className="text-xs font-black text-green-600 uppercase">
                      Verified Stealth
                    </p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                      Sector Class
                    </p>
                    <p className="text-xs font-black text-slate-900 uppercase">
                      {complaint.category || "General"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-2">
                  Case Protocol State
                </label>
                <div className="relative">
                  <select
                    value={complaint.status}
                    onChange={handleStatusChange}
                    disabled={saving}
                    className="appearance-none block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white text-xs font-black uppercase tracking-widest py-4 px-6 cursor-pointer transition-all duration-300"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="font-sans font-bold">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-2">
                  Dossier Annotations
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={6}
                  className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-slate-900 focus:ring-slate-900 focus:bg-white text-sm font-medium py-5 px-6 placeholder:text-slate-300 transition-all duration-300"
                  placeholder="Record investigative progress..."
                />
                <button
                  onClick={handleSaveNote}
                  disabled={saving || !note}
                  className="group w-full relative overflow-hidden bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] py-5 px-6 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[400ms] group-hover:w-full" />
                  <span className="relative z-10">
                    {saving ? "Executing Sync..." : "Update Dossier"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
