import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
      setIsOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex-shrink-0 flex items-center group"
            >
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-600 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-slate-900">
                WHISTLE<span className="text-red-600">BLOWER</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${currentStatus === "all" ? "text-slate-900 bg-slate-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Complaints & Cases
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                Case Filters:
              </span>
              <Link
                to="/dashboard?status=pending"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentStatus === "pending" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Pending
              </Link>
              <Link
                to="/dashboard?status=reviewing"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentStatus === "reviewing" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Reviewing
              </Link>
              <Link
                to="/dashboard?status=resolved"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentStatus === "resolved" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Resolved
              </Link>
              <Link
                to="/dashboard?status=dismissed"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentStatus === "dismissed" ? "bg-slate-500 text-white shadow-lg shadow-slate-500/20" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Dismissed
              </Link>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <div className="flex items-center space-x-3 ml-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                  Active Operator
                </span>
                <span className="text-[10px] font-bold text-slate-900">
                  {user?.email?.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-900/20 cursor-pointer"
                title="Secure Logout"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-6 pt-2 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              >
                Complaints & Cases
              </Link>
              <div className="grid grid-cols-2 gap-2 px-2 py-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`text-center text-[10px] font-black uppercase py-2 rounded-lg ${currentStatus === "all" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400"}`}
                >
                  All
                </Link>
                <Link
                  to="/dashboard?status=pending"
                  onClick={() => setIsOpen(false)}
                  className={`text-center text-[10px] font-black uppercase py-2 rounded-lg ${currentStatus === "pending" ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-400"}`}
                >
                  Pending
                </Link>
                <Link
                  to="/dashboard?status=reviewing"
                  onClick={() => setIsOpen(false)}
                  className={`text-center text-[10px] font-black uppercase py-2 rounded-lg ${currentStatus === "reviewing" ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-400"}`}
                >
                  Review
                </Link>
                <Link
                  to="/dashboard?status=resolved"
                  onClick={() => setIsOpen(false)}
                  className={`text-center text-[10px] font-black uppercase py-2 rounded-lg ${currentStatus === "resolved" ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400"}`}
                >
                  Resolved Cases
                </Link>
                <Link
                  to="/dashboard?status=dismissed"
                  onClick={() => setIsOpen(false)}
                  className={`text-center text-[10px] font-black uppercase py-2 rounded-lg ${currentStatus === "dismissed" ? "bg-slate-500 text-white" : "bg-slate-50 text-slate-400"}`}
                >
                  Dismissed
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-900/10"
              >
                Secure Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
