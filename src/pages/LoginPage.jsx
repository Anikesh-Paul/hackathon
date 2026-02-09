import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useEntranceAnimation,
  animateButtonPress,
} from "../hooks/useAnimations";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef();

  useEntranceAnimation(container);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center px-4 py-20"
      ref={container}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-10 animate-entrance">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-slate-900/40 relative group overflow-hidden">
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <svg
              className="w-10 h-10 text-white relative z-10"
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
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase mb-2">
            Secure <span className="text-red-600">Access</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Investigative Protocol v4.2
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-12 relative overflow-hidden animate-entrance">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent opacity-20" />

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center shadow-sm animate-shake animate-entrance">
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
              <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
              >
                Access ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-slate-900 focus:ring-slate-900 focus:bg-white transition-all duration-300 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="agent@agency.secure"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
              >
                Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-300"
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
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-slate-900 focus:ring-slate-900 focus:bg-white transition-all duration-300 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              onMouseDown={(e) => animateButtonPress(e.currentTarget)}
              className="w-full bg-slate-900 text-white py-5 px-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-slate-900/20 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Authorizing...
                </span>
              ) : (
                "Establish Session"
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center space-y-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto">
            Unauthorized access is strictly prohibited and carries maximum legal
            penalties.
          </p>
        </div>
      </div>
    </div>
  );
}
