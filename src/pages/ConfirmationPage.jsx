import { useParams, Link } from "react-router-dom";
import { useState } from "react";

export function ConfirmationPage() {
  const { trackingId } = useParams();
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-4xl h-96 bg-red-500/5 blur-[120px] rounded-full" />

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 py-4 px-6 text-center">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
              Signal Confirmed • Transmission Complete
            </span>
          </div>

          <div className="p-10 sm:p-20 text-center">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-28 h-28 bg-white border-4 border-green-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase italic">
              Report <span className="text-red-600">Logged</span>
            </h1>
            <p className="text-slate-500 mb-14 leading-relaxed font-medium max-w-md mx-auto">
              Your anonymous report has been successfully ingested into our
              encrypted investigation core.
            </p>

            <div className="relative group mb-14">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-slate-900 to-red-600 rounded-[2.5rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
              <div className="relative bg-slate-50 border-2 border-slate-900 rounded-[2rem] p-10 overflow-hidden">
                {/* ID Background text decoy */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] text-[8px] font-mono leading-none break-all pointer-events-none select-none">
                  {Array(100).fill(trackingId).join("")}
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-6 font-black">
                    Private Tracking Key
                  </p>
                  <div className="flex flex-col items-center justify-center gap-6">
                    <code className="text-2xl sm:text-4xl font-mono font-black tracking-tight text-slate-900 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                      {trackingId}
                    </code>

                    <button
                      onClick={copyToClipboard}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        copied
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                          : "bg-white text-slate-900 border border-slate-200 hover:border-slate-900 shadow-sm"
                      }`}
                    >
                      {copied ? (
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
                          Copied to Vault
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
                          Secure to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-8 mb-12">
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mb-1">
                    Critical Protocol Information
                  </p>
                  <p className="text-sm text-red-900/70 font-medium">
                    This key is your{" "}
                    <span className="font-bold text-red-900">only</span> method
                    of retrieval. Store it in a physical vault or secure
                    manager. It cannot be recovered.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/track"
                className="group relative bg-slate-900 text-white py-5 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/40 transition-all duration-300"
              >
                <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-500 group-hover:w-full rounded-2xl" />
                <span className="relative z-10">Track Status</span>
              </Link>
              <Link
                to="/submit"
                className="bg-white border-2 border-slate-900 text-slate-900 py-5 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all duration-300"
              >
                Log New Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
