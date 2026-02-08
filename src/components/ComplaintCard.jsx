import { useState, useEffect } from "react";
import { StatusBadge } from "./StatusBadge";
import { getFilePreviewUrl, getFileViewUrl } from "../services/storageService";
import {
  getStatusHistory,
  getFollowUps,
  sendFollowUp,
} from "../services/complaintService";

const STATUS_OPTIONS = ["pending", "reviewing", "resolved", "dismissed"];

export function ComplaintCard({
  complaint,
  onStatusChange,
  onNoteAdd,
  onPublicMessageUpdate,
}) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState(complaint.adminNotes || "");
  const [publicMsg, setPublicMsg] = useState(complaint.publicMessage || "");
  const [statusHistory, setStatusHistory] = useState(
    complaint.statusHistory || [],
  );
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [followUpsLoaded, setFollowUpsLoaded] = useState(false);
  const [adminReply, setAdminReply] = useState("");

  // Independent saving states
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingPublic, setIsSavingPublic] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isSavingFollowUp, setIsSavingFollowUp] = useState(false);

  // Focus tracking for specialized animations
  const [activeSection, setActiveSection] = useState(null); // 'public', 'note', 'followup'

  // Lazy-load status history when card is expanded
  useEffect(() => {
    if (expanded && !historyLoaded) {
      getStatusHistory(complaint.id)
        .then((history) => {
          setStatusHistory(history);
          setHistoryLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load status history:", err);
          setHistoryLoaded(true);
        });
    }
  }, [expanded, historyLoaded, complaint.id]);

  // Lazy-load follow-ups when card is expanded
  useEffect(() => {
    if (expanded && !followUpsLoaded) {
      getFollowUps(complaint.id)
        .then((msgs) => {
          setFollowUps(msgs);
          setFollowUpsLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load follow-ups:", err);
          setFollowUpsLoaded(true);
        });
    }
  }, [expanded, followUpsLoaded, complaint.id]);

  async function handleStatusChange(e) {
    setIsSavingStatus(true);
    try {
      const result = await onStatusChange(complaint.id, e.target.value);
      // Update local history if returned
      if (result && result.statusHistory) {
        setStatusHistory(result.statusHistory);
      }
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleSaveNote() {
    setIsSavingNote(true);
    setActiveSection("note");
    try {
      await onNoteAdd(complaint.id, note);
    } finally {
      setIsSavingNote(false);
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
                {new Date(complaint.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase group-hover:text-red-600 transition-colors">
              {complaint.title}
            </h3>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <div className="scale-100 sm:scale-110">
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
        <div className="p-6 sm:p-12 border-t border-slate-100 space-y-12 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12">
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
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 sm:p-8">
                  <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {complaint.description}
                  </p>
                </div>
              </div>

              {/* Attachments Section - Admin Only */}
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                      Classified Evidence ({complaint.attachments.length})
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {complaint.attachments.map((fileId, index) => {
                      const viewUrl = getFileViewUrl(fileId);
                      const previewUrl = getFilePreviewUrl(fileId);

                      return (
                        <a
                          key={fileId}
                          href={viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <svg
                              className="w-8 h-8 text-slate-300 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                              Intelligence_{index + 1}
                            </span>
                          </div>

                          {/* Try to show image preview, hidden if it fails (not an image) */}
                          <img
                            src={previewUrl}
                            alt={`Attachment ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            onLoad={(e) => {
                              // If it loads successfully, make it visible by default
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.classList.remove(
                                "group-hover:opacity-10",
                              );
                            }}
                          />

                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors flex flex-col items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            <span className="text-[8px] font-black text-white opacity-0 group-hover:opacity-100 uppercase tracking-widest mt-2">
                              Open Intelligence
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                  Metadata Analysis
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-4 rounded-2xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                      Signal Integrity
                    </p>
                    <p className="text-xs font-black text-slate-900 uppercase">
                      100% Secure
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

              {/* Status Timeline — admin full view */}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Log Audit trail
                  </p>
                </div>
                {statusHistory && statusHistory.length > 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                    <div className="relative pl-6">
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
                      {statusHistory.map((entry, idx) => {
                        const isLatest = idx === statusHistory.length - 1;
                        const colors = {
                          pending: "bg-amber-500",
                          reviewing: "bg-blue-500",
                          resolved: "bg-emerald-500",
                          dismissed: "bg-slate-400",
                        };
                        return (
                          <div key={idx} className="relative mb-5 last:mb-0">
                            <div
                              className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${colors[entry.status] || "bg-slate-400"} ${isLatest ? "ring-4 ring-slate-100" : ""}`}
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <p
                                className={`text-[10px] font-black uppercase tracking-widest ${isLatest ? "text-slate-900" : "text-slate-400"}`}
                              >
                                {entry.status}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold tabular-nums">
                                {new Date(entry.timestamp).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                    <p className="text-xs text-slate-400 italic">
                      No history recorded. Current status:{" "}
                      <span className="font-black uppercase">
                        {complaint.status}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Internal Comms Protocol — admin view */}
              <div
                className={`space-y-4 transition-all duration-500 ${activeSection === "followup" ? "scale-[1.01]" : "opacity-90"}`}
                onMouseEnter={() => setActiveSection("followup")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 ${activeSection === "followup" ? "bg-red-600" : "bg-slate-100"}`}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-300 ${activeSection === "followup" ? "text-white" : "text-slate-900"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 ${activeSection === "followup" ? "text-slate-900" : "text-slate-400"}`}
                  >
                    Internal Comms Protocol ({followUps.length})
                  </p>
                </div>

                <div
                  className={`bg-slate-50 border transition-all duration-300 rounded-[2rem] p-6 space-y-4 max-h-80 overflow-y-auto ${activeSection === "followup" ? "border-red-200 shadow-lg shadow-red-900/5" : "border-slate-100"}`}
                >
                  {followUps.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4 uppercase tracking-widest font-bold">
                      No active communications
                    </p>
                  ) : (
                    followUps.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                            msg.sender === "admin"
                              ? "bg-slate-900 text-white rounded-br-sm shadow-lg shadow-slate-200"
                              : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                          }`}
                        >
                          <p
                            className={`text-[9px] font-black uppercase tracking-widest mb-1 ${msg.sender === "admin" ? "text-slate-400" : "text-red-600"}`}
                          >
                            {msg.sender === "admin"
                              ? "Operator-Admin"
                              : "Anonymous Source"}
                          </p>
                          <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
                            {msg.message}
                          </p>
                          <p
                            className={`text-[9px] mt-2 tabular-nums opacity-60 ${msg.sender === "admin" ? "text-slate-400" : "text-slate-400"}`}
                          >
                            {new Date(msg.timestamp).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Admin reply input */}
                <div className="flex gap-3">
                  <textarea
                    value={adminReply}
                    onFocus={() => setActiveSection("followup")}
                    onChange={(e) => setAdminReply(e.target.value)}
                    rows={2}
                    maxLength={2000}
                    className="flex-1 rounded-2xl border-slate-100 bg-white shadow-inner focus:border-red-600 focus:ring-red-600 text-sm font-medium py-3 px-5 placeholder:text-slate-300 transition-all duration-300 resize-none"
                    placeholder="Request additional intelligence..."
                  />
                  <button
                    onClick={async () => {
                      if (!adminReply.trim() || isSavingFollowUp) return;
                      setIsSavingFollowUp(true);
                      try {
                        const newMsg = await sendFollowUp({
                          complaintId: complaint.id,
                          trackingId: complaint.trackingId,
                          sender: "admin",
                          message: adminReply.trim(),
                        });
                        setFollowUps((prev) => [...prev, newMsg]);
                        setAdminReply("");
                      } catch (err) {
                        console.error("Failed to send follow-up:", err);
                      } finally {
                        setIsSavingFollowUp(false);
                      }
                    }}
                    disabled={isSavingFollowUp || !adminReply.trim()}
                    className="self-end bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-xl shadow-slate-900/10 min-w-[100px] flex items-center justify-center"
                  >
                    {isSavingFollowUp ? (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      "Dispatch"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div
                className={`space-y-4 transition-all duration-500 ${activeSection === "status" ? "opacity-100" : "opacity-90"}`}
                onMouseEnter={() => setActiveSection("status")}
              >
                <label
                  className={`block text-[10px] font-black uppercase tracking-[0.3em] pl-2 transition-colors duration-300 ${activeSection === "status" ? "text-slate-900 border-l-2 border-red-600" : "text-slate-400"}`}
                >
                  Case Protocol State
                </label>
                <div className="relative">
                  <select
                    value={complaint.status}
                    onChange={handleStatusChange}
                    onFocus={() => setActiveSection("status")}
                    disabled={isSavingStatus}
                    className="appearance-none block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white text-xs font-black uppercase tracking-widest py-4 px-6 cursor-pointer transition-all duration-300"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="font-sans font-bold">
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    {isSavingStatus ? (
                      <svg
                        className="animate-spin h-4 w-4 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>

              {/* Public Message — visible to anonymous users */}
              <div
                className={`space-y-4 transition-all duration-500 p-4 rounded-3xl border-2 ${activeSection === "public" ? "border-red-600/20 bg-red-50/10" : "border-transparent"}`}
                onMouseEnter={() => setActiveSection("public")}
              >
                <label
                  className={`block text-[10px] font-black uppercase tracking-[0.3em] pl-2 flex items-center gap-2 transition-colors duration-300 ${activeSection === "public" ? "text-red-600" : "text-slate-900"}`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Public Intelligence Feed
                </label>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-2 -mt-2">
                  Broadcast to Tracking ID terminal.
                </p>
                <textarea
                  value={publicMsg}
                  onFocus={() => setActiveSection("public")}
                  onChange={(e) => setPublicMsg(e.target.value)}
                  rows={4}
                  className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white text-sm font-medium py-5 px-6 placeholder:text-slate-300 transition-all duration-300"
                  placeholder="Draft transmission for the anonymous reporter..."
                />
                <button
                  onClick={async () => {
                    setIsSavingPublic(true);
                    try {
                      await onPublicMessageUpdate(complaint.id, publicMsg);
                    } finally {
                      setIsSavingPublic(false);
                    }
                  }}
                  disabled={isSavingPublic}
                  className="group w-full relative overflow-hidden bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] py-4 px-6 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <div
                    className={`absolute inset-0 bg-red-600 transition-all duration-[400ms] ${isSavingPublic ? "w-full opacity-50" : "w-0 group-hover:w-full"}`}
                  />
                  <span className="relative z-10 font-black">
                    {isSavingPublic
                      ? "Transmitting..."
                      : "Update Intelligence Feed"}
                  </span>
                </button>
              </div>

              {/* Internal Notes — admin-only, never shown to reporters */}
              <div
                className={`space-y-4 transition-all duration-500 p-4 rounded-3xl border-2 ${activeSection === "note" ? "border-slate-900/20 bg-slate-50" : "border-transparent"}`}
                onMouseEnter={() => setActiveSection("note")}
              >
                <label
                  className={`block text-[10px] font-black uppercase tracking-[0.3em] pl-2 flex items-center gap-2 transition-colors duration-300 ${activeSection === "note" ? "text-slate-900" : "text-slate-400"}`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                  Internal Notes
                </label>
                <p className="text-[9px] text-slate-400 font-medium pl-2 -mt-2">
                  Private — only visible to administrators.
                </p>
                <textarea
                  value={note}
                  onFocus={() => setActiveSection("note")}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-slate-900 focus:ring-slate-900 focus:bg-white text-sm font-medium py-5 px-6 placeholder:text-slate-300 transition-all duration-300"
                  placeholder="Record investigative progress (internal only)..."
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote || !note}
                  className="group w-full relative overflow-hidden bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] py-4 px-6 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <div
                    className={`absolute inset-0 bg-red-600 transition-all duration-[400ms] ${isSavingNote ? "w-full opacity-50" : "w-0 group-hover:w-full"}`}
                  />
                  <span className="relative z-10">
                    {isSavingNote
                      ? "Executing Sync..."
                      : "Update Internal Notes"}
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
