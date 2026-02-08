import { useState, useEffect, useRef } from "react";
import {
  getComplaintByTrackingId,
  getStatusHistoryByTrackingId,
  getFollowUpsByTrackingId,
  sendFollowUp,
  recoverByPhrase,
} from "../services/complaintService";
import { getFilePreviewUrl, getFileViewUrl } from "../services/storageService";
import { StatusBadge } from "../components/StatusBadge";

export function TrackStatusPage() {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recovery mode
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState(null);
  const [recoveredId, setRecoveredId] = useState(null);
  const [vaultCopied, setVaultCopied] = useState(false);

  // Follow-up state
  const [followUps, setFollowUps] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [replyCooldown, setReplyCooldown] = useState(0);
  const cooldownRef = useRef(null);

  // Cooldown timer for rate limiting (60 seconds)
  useEffect(() => {
    if (replyCooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setReplyCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(cooldownRef.current);
    }
  }, [replyCooldown]);

  async function handleTrack(e) {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);
    setComplaint(null);
    setFollowUps([]);
    setReplyError(null);
    setRecoveredId(null);

    try {
      const result = await getComplaintByTrackingId(trackingId.trim());
      if (result) {
        // Fetch status history and follow-ups in parallel
        const [history, msgs] = await Promise.all([
          getStatusHistoryByTrackingId(trackingId.trim()),
          getFollowUpsByTrackingId(trackingId.trim()),
        ]);
        result.statusHistory = history;
        setFollowUps(msgs);
        setComplaint(result);
      } else {
        setError("No complaint found with this Tracking ID.");
      }
    } catch (err) {
      console.error("Tracking failed:", err);
      setError(
        "An error occurred while fetching the status. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRecover(e) {
    e.preventDefault();
    if (!recoveryPhrase.trim()) return;

    setRecoveryLoading(true);
    setRecoveryError(null);
    setRecoveredId(null);

    try {
      const result = await recoverByPhrase(recoveryPhrase.trim());
      if (result) {
        setRecoveredId(result.trackingId);
      } else {
        setRecoveryError(
          "No complaint found with this recovery phrase. Please check and try again.",
        );
      }
    } catch (err) {
      console.error("Recovery failed:", err);
      setRecoveryError("An error occurred during recovery. Please try again.");
    } finally {
      setRecoveryLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Case Retrieval System
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase sm:text-6xl mb-6">
            Consult <span className="text-red-600">Status</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Authorized oversight only. Input your unique tracking identifier to
            view the current standing of the investigation.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg
              className="w-32 h-32 text-slate-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>

          <form
            onSubmit={handleTrack}
            className="flex flex-col md:flex-row gap-4 relative z-10"
          >
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-slate-900 focus:ring-slate-900 focus:bg-white transition-all duration-300 py-5 pl-14 pr-6 font-mono text-sm tracking-wider placeholder:text-slate-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-slate-900/20 flex items-center justify-center min-w-[160px] cursor-pointer"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Retrieve"
              )}
            </button>
          </form>
        </div>

        {/* Recovery Phrase Toggle & Form */}
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={() => {
              setRecoveryMode((prev) => !prev);
              setRecoveryError(null);
              setRecoveredId(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors duration-300 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            {recoveryMode
              ? "Back to Tracking ID"
              : "Forgot Tracking ID? Recover using Recovery Phrase"}
          </button>
        </div>

        {recoveryMode && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 mb-12 relative overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Identity <span className="text-red-600">Recovery</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                Enter Secure 4-Word Managed Phrase
              </p>
            </div>

            <form
              onSubmit={handleRecover}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="e.g. falcon-mesa-glacier-torch"
                  value={recoveryPhrase}
                  onChange={(e) => setRecoveryPhrase(e.target.value)}
                  className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-slate-900 focus:ring-slate-900 transition-all duration-300 py-5 px-6 font-mono text-sm tracking-wider placeholder:text-slate-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={recoveryLoading}
                className="group relative bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-slate-900/20 flex items-center justify-center min-w-[140px] cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[400ms] group-hover:w-full" />
                <span className="relative z-10">
                  {recoveryLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    "Authorize"
                  )}
                </span>
              </button>
            </form>

            {recoveryError && (
              <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center shadow-sm animate-shake">
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="font-bold text-xs uppercase tracking-wider">
                  {recoveryError}
                </p>
              </div>
            )}

            {recoveredId && (
              <div className="mt-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    Record Decrypted
                  </p>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
                  Associated Tracking Key
                </p>
                <code className="text-xl sm:text-2xl font-mono font-black text-slate-900 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm inline-block mb-8 break-all max-w-full">
                  {recoveredId}
                </code>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (recoveredId) {
                        navigator.clipboard.writeText(recoveredId);
                        setVaultCopied(true);
                        setTimeout(() => setVaultCopied(false), 2000);
                      }
                    }}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-sm border ${
                      vaultCopied
                        ? "bg-green-500 text-white border-green-500 shadow-green-500/20"
                        : "bg-white text-slate-900 border-slate-200 hover:border-slate-900"
                    }`}
                  >
                    {vaultCopied ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Secured to Vault
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Secure to Vault
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingId(recoveredId);
                      setRecoveryMode(false);
                      setRecoveredId(null);
                      setRecoveryPhrase("");
                    }}
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[400ms] group-hover:w-full" />
                    <svg
                      className="w-4 h-4 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="relative z-10">Track Signal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 text-red-700 rounded-3xl flex items-center shadow-sm animate-shake max-w-2xl mx-auto">
            <svg
              className="w-6 h-6 mr-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {complaint && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl mx-auto mb-20">
            <div className="bg-slate-900 p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">
                  Investigation Active
                </p>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                  {complaint.title}
                </h2>
              </div>
              <div className="sm:scale-125 sm:origin-right">
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <div className="p-6 sm:p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Operational Sector
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-slate-900 border-l-4 border-red-600 pl-4 py-1 bg-slate-50 rounded-r-lg">
                      {complaint.category || "General Intelligence"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      My Evidence Submission
                    </h3>
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 sm:p-6">
                      <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  {complaint.attachments &&
                    complaint.attachments.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                          Attachments ({complaint.attachments.length})
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          {complaint.attachments.map((fileId, index) => {
                            const viewUrl = getFileViewUrl(fileId);
                            const previewUrl = getFilePreviewUrl(fileId);
                            return (
                              <a
                                key={fileId}
                                href={viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-20 h-20 bg-white rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-red-600 transition-all duration-300 shadow-sm flex items-center justify-center p-1"
                              >
                                <svg
                                  className="w-8 h-8 text-slate-200"
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
                                <img
                                  src={previewUrl}
                                  alt={`Attachment ${index + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
                                  onLoad={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                  }}
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Status Timeline
                    </h3>
                    {complaint.statusHistory &&
                    complaint.statusHistory.length > 0 ? (
                      <div className="relative pl-6">
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
                        {complaint.statusHistory.map((entry, idx) => {
                          const isLatest =
                            idx === complaint.statusHistory.length - 1;
                          const colors = {
                            pending: "bg-amber-500",
                            reviewing: "bg-blue-500",
                            resolved: "bg-emerald-500",
                            dismissed: "bg-slate-400",
                          };
                          const iconColors = {
                            pending: "bg-amber-50 text-amber-600",
                            reviewing: "bg-blue-50 text-blue-600",
                            resolved: "bg-green-50 text-green-600",
                            dismissed: "bg-red-50 text-red-600",
                          };
                          return (
                            <div key={idx} className="relative mb-6 last:mb-0">
                              <div
                                className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${colors[entry.status] || "bg-slate-400"} ${isLatest ? "ring-4 ring-slate-100" : ""}`}
                              />
                              <div className="flex flex-col gap-1">
                                <p
                                  className={`text-xs font-black uppercase tracking-widest ${isLatest ? "text-slate-900" : "text-slate-400"}`}
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
                    ) : (
                      /* Fallback for old complaints without statusHistory */
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              Submitted
                            </p>
                            <p className="text-sm text-slate-900 font-bold">
                              {new Date(complaint.createdAt).toLocaleString(
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
                        {complaint.updatedAt && (
                          <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Last Updated
                              </p>
                              <p className="text-sm text-slate-900 font-bold">
                                {new Date(complaint.updatedAt).toLocaleString(
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
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative group">
                    <div className="absolute top-4 right-4 text-slate-200 group-hover:text-red-600 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Reviewer Message
                    </h3>
                    {complaint.publicMessage ? (
                      <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                        {complaint.publicMessage}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                        No message from the reviewer yet. Check back later for
                        updates.
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Investigator Protocol
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                      "Status 'Pending' indicates the report is undergoing
                      initial vetting. 'Reviewing' signifies active validation
                      of evidence. 'Resolved' denotes conclusion of protocol."
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-normal">
                        Confidential data is never displayed publicly. Your
                        tracking ID is the sole key to this summary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow-up Thread — anonymous view */}
              <div className="border-t border-slate-100 p-6 sm:p-12">
                <div className="flex items-center gap-3 mb-6">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Internal Comms Protocol
                  </h3>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 sm:p-6 space-y-4 max-h-80 overflow-y-auto mb-6">
                  {followUps.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-6 font-bold uppercase tracking-wider opacity-60">
                      Standard standby mode. Awaiting investigator signal.
                    </p>
                  ) : (
                    followUps.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "anonymous" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                            msg.sender === "anonymous"
                              ? "bg-slate-900 text-white rounded-br-sm"
                              : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                          }`}
                        >
                          <p
                            className={`text-[9px] font-black uppercase tracking-widest mb-1 ${msg.sender === "anonymous" ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {msg.sender === "anonymous"
                              ? "Authenticated User"
                              : "Officer in Charge"}
                          </p>
                          <p className="text-sm font-medium leading-relaxed whitespace-pre-line">
                            {msg.message}
                          </p>
                          <p
                            className={`text-[9px] mt-2 tabular-nums ${msg.sender === "anonymous" ? "text-slate-500" : "text-slate-400"}`}
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

                {/* Anonymous reply form with rate limiting */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      maxLength={2000}
                      disabled={replyCooldown > 0}
                      className="w-full sm:flex-1 rounded-2xl border-slate-100 bg-white shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white text-sm font-medium py-3 px-5 placeholder:text-slate-300 transition-all duration-300 resize-none disabled:opacity-50 disabled:bg-slate-50"
                      placeholder={
                        replyCooldown > 0
                          ? `Protocol cooldown: ${replyCooldown}s remaining...`
                          : "Transmit reply (text only, verify no leaks)..."
                      }
                    />
                    <button
                      onClick={async () => {
                        if (
                          !replyText.trim() ||
                          replySending ||
                          replyCooldown > 0
                        )
                          return;
                        setReplySending(true);
                        setReplyError(null);
                        try {
                          const newMsg = await sendFollowUp({
                            trackingId: trackingId.trim(),
                            sender: "anonymous",
                            message: replyText.trim(),
                          });
                          setFollowUps((prev) => [...prev, newMsg]);
                          setReplyText("");
                          setReplyCooldown(60); // 60-second rate limit
                        } catch (err) {
                          console.error("Failed to send reply:", err);
                          setReplyError(
                            "Signal transmission failed. Integrity breach suspected.",
                          );
                        } finally {
                          setReplySending(false);
                        }
                      }}
                      disabled={
                        replySending || !replyText.trim() || replyCooldown > 0
                      }
                      className="group relative w-full sm:w-auto sm:self-end bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg shadow-slate-900/20 sm:min-w-[100px] flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[400ms] group-hover:w-full" />
                      <span className="relative z-10">
                        {replySending ? (
                          <svg
                            className="animate-spin h-4 w-4"
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
                        ) : replyCooldown > 0 ? (
                          `${replyCooldown}s`
                        ) : (
                          "Transmit"
                        )}
                      </span>
                    </button>
                  </div>
                  {replyError && (
                    <p className="text-[10px] text-red-600 font-black uppercase tracking-widest pl-2 animate-shake">
                      {replyError}
                    </p>
                  )}
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] pl-2 opacity-60">
                    Mandatory: No personal metadata. Zero logs active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
