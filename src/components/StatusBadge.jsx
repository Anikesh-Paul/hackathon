import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateStatusChange } from "../hooks/useAnimations";

const STATUS_CONFIG = {
  pending: {
    label: "Under Review",
    color: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-200/20",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  reviewing: {
    label: "Active Investigation",
    color: "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-200/20",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  resolved: {
    label: "Case Closed",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-200/20",
    icon: "M5 13l4 4L19 7",
  },
  dismissed: {
    label: "Voided",
    color: "bg-slate-50 text-slate-500 border-slate-200 shadow-slate-200/20",
    icon: "M6 18L18 6M6 6l12 12",
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const badgeRef = useRef();

  useGSAP(
    () => {
      if (badgeRef.current) {
        animateStatusChange(badgeRef.current);
      }
    },
    { dependencies: [status] },
  );

  return (
    <div
      ref={badgeRef}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] shadow-sm transition-all duration-300 ${config.color}`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d={config.icon}
        />
      </svg>
      {config.label}
    </div>
  );
}
