import { useState } from "react";
import { getComplaintByTrackingId } from "../services/complaintService";
import { StatusBadge } from "../components/StatusBadge";

export function TrackStatusPage() {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleTrack(e) {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const result = await getComplaintByTrackingId(trackingId.trim());
      if (result) {
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
          <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase sm:text-6xl mb-6">
            Consult <span className="text-red-600">Status</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Authorized oversight only. Input your unique tracking identifier to
            view the current standing of the investigation.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 mb-12 relative overflow-hidden">
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
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl mx-auto">
            <div className="bg-slate-900 p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">
                  Investigation Active
                </p>
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                  {complaint.title}
                </h2>
              </div>
              <div className="scale-125 origin-right">
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Operational Sector
                    </h3>
                    <p className="text-lg font-bold text-slate-900 border-l-4 border-red-600 pl-4 py-1 bg-slate-50 rounded-r-lg">
                      {complaint.category || "General Intelligence"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Temporal Logs
                    </h3>
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
                            Initial Transmission
                          </p>
                          <p className="text-sm text-slate-900 font-bold">
                            {new Date(complaint.createdAt).toLocaleString()}
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
                              Latest Oversight Update
                            </p>
                            <p className="text-sm text-slate-900 font-bold">
                              {new Date(complaint.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative group">
                    <div className="absolute top-4 right-4 text-slate-200 group-hover:text-red-600 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13 3l-2 3H8V3H2v18h6v-3h2l2 3h6V3h-5zm-2 15H4V5h2v11h5v2zm7 0h-4l-2-3H9v-3h3l2 3h4V5h2v13z" />
                      </svg>
                    </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
