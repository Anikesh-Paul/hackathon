import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ComplaintList } from "../components/ComplaintList";
import {
  useEntranceAnimation,
  animateFilterSwitch,
} from "../hooks/useAnimations";
import { useGSAP } from "@gsap/react";
import {
  listComplaints,
  updateComplaintStatus,
  addAdminNote,
  updatePublicMessage,
} from "../services/complaintService";

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const { user, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const container = useRef();
  const listRef = useRef();

  useEntranceAnimation(container);

  useGSAP(
    () => {
      if (!loading && listRef.current) {
        animateFilterSwitch(listRef);
      }
    },
    { dependencies: [statusFilter, loading], scope: container },
  );

  // Compute filtered complaints based on status
  const filteredComplaints = useMemo(() => {
    if (statusFilter === "all") return complaints;
    return complaints.filter((c) => c.status === statusFilter);
  }, [complaints, statusFilter]);

  useEffect(() => {
    // Only fetch complaints after auth session is confirmed
    if (authLoading) {
      console.log("[Dashboard] Waiting for auth...");
      return;
    }

    if (!user) {
      console.log("[Dashboard] No user session");
      setLoading(false);
      return;
    }

    console.log("[Dashboard] Auth confirmed for:", user.email);
    loadComplaints();
  }, [user, authLoading]);

  async function loadComplaints() {
    try {
      console.log("[Dashboard] Fetching complaints...");
      const data = await listComplaints();
      console.log("[Dashboard] Loaded", data.length, "complaints");
      setComplaints(data);
    } catch (err) {
      console.error("[Dashboard] Failed to load complaints:", err);
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    const result = await updateComplaintStatus(id, status);
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    return result;
  }

  async function handleNoteAdd(id, note) {
    await addAdminNote(id, note);
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adminNotes: note } : c)),
    );
  }

  async function handlePublicMessageUpdate(id, message) {
    await updatePublicMessage(id, message);
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, publicMessage: message } : c)),
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8" ref={container}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 animate-entrance">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-2 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />
              Real-time Oversight Active
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase sm:text-6xl">
              Admin <span className="text-red-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-bold tracking-tight uppercase text-xs">
              Investigation & Case Management
            </p>
            <p className="text-slate-500 font-bold tracking-tight uppercase text-xs">
              System Administrator:{" "}
              <span className="text-slate-900 underline underline-offset-4">
                {user?.email}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Reports",
                value: complaints.length,
                color: "slate-900",
                bg: "bg-slate-50",
              },
              {
                label: "Pending Vetting",
                value: complaints.filter((c) => c.status === "pending").length,
                color: "amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Active Review",
                value: complaints.filter((c) => c.status === "reviewing")
                  .length,
                color: "blue-600",
                bg: "bg-blue-50",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${stat.bg} rounded-[2rem] border border-slate-100 p-5 sm:p-8 flex flex-col justify-center items-center text-center group hover:scale-[1.02] transition-all duration-300 animate-entrance`}
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-4">
                  {stat.label}
                </p>
                <p
                  className={`text-3xl sm:text-5xl font-black text-${stat.color} leading-none tracking-tighter`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-700 rounded-3xl flex items-center shadow-sm animate-shake animate-entrance">
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
            <p className="font-black text-sm uppercase tracking-wider">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-6 pb-20 animate-entrance">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
              <div className="space-y-6 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-[2rem] border-4 border-slate-50" />
                  <div className="absolute inset-0 rounded-[2rem] border-4 border-slate-900 border-t-transparent animate-spin" />
                </div>
                <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-[10px]">
                  Accessing Secure Database...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8" ref={listRef}>
              <ComplaintList
                complaints={filteredComplaints}
                onStatusChange={handleStatusChange}
                onNoteAdd={handleNoteAdd}
                onPublicMessageUpdate={handlePublicMessageUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
