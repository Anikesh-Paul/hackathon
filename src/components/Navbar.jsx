import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-600 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
                Whistle<span className="text-red-600">Blower</span>
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/submit"
              className="text-slate-600 hover:text-black hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              Submit Report
            </Link>
            <Link
              to="/track"
              className="text-slate-600 hover:text-black hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              Track Status
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/10 cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
                  title="Logout"
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
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/10 cursor-pointer"
              >
                Investigator Login
              </Link>
            )}
          </div>

          {/* Mobile menu button (Simplified) */}
          <div className="flex items-center sm:hidden">
            <Link to="/login" className="p-2 text-slate-400">
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
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a2 2 0 013.496 1.447 21.437 21.437 0 014.654 1.42 2 2 0 002.332-1.318l2.736-8.122m-1.238-1.128L18.13 4.89a2 2 0 00-1.814-1.391l-3.091-.181a2 2 0 01-1.722-1.144l-1.171-2.341a2 2 0 00-3.666 1.137l.643 3.19a2 2 0 001.21 1.488A8.482 8.482 0 0110 11V11z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
