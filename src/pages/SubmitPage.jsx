import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComplaintForm } from "../components/ComplaintForm";
import { createComplaint } from "../services/complaintService";

export function SubmitPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate payload structure one last time
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error("Incomplete transmission packets. Verify all fields.");
      }

      const { trackingId } = await createComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      });

      navigate(`/confirmation/${trackingId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      setError(
        err.message?.includes("Incomplete")
          ? err.message
          : "Failed to transmit signal. Encryption handshake failure or network instability. Please retry.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse" />
            Secure Submission Portal
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 uppercase">
            Expose the <span className="text-red-600">Truth</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Your voice is protected by military-grade anonymity. No metadata, no
            IP logs, no traces. Just the facts.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center shadow-sm animate-shake">
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
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
          <ComplaintForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "No Metadata",
              desc: "EXIF and headers stripped automatically.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              title: "End-to-End",
              desc: "Encrypted at rest and in transit.",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 10a2 2 0 100 4 2 2 0 000-4z",
            },
            {
              title: "Zero Logging",
              desc: "We never store IP addresses or browser info.",
              icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a2 2 0 013.496 1.447 21.437 21.437 0 014.654 1.42 2 2 0 002.332-1.318l2.736-8.122",
            },
          ].map((feature, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-100 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
