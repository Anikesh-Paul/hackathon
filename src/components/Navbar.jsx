import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef();

  useGSAP(
    () => {
      if (isOpen && mobileMenuRef.current) {
        gsap.from(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [isOpen] },
  );

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
              <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-slate-900">
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

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200"
              aria-label="Toggle menu"
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

        {/* Mobile Menu Content */}
        {isOpen && (
          <div
            ref={mobileMenuRef}
            className="sm:hidden pb-6 pt-2 overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              <Link
                to="/submit"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              >
                Submit Report
              </Link>
              <Link
                to="/track"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200"
              >
                Track Status
              </Link>

              <div className="h-px bg-slate-100 mx-4 my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200"
                  >
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all duration-200 text-center"
                >
                  Investigator Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
