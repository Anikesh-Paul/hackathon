import { useState, useRef } from "react";

const CATEGORIES = ["harassment", "fraud", "safety", "misconduct", "other"];
const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ComplaintForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
  }

  function handleFileChange(e) {
    const incomingFiles = Array.from(e.target.files || []);
    if (localError) setLocalError("");

    const validNewFiles = [];
    const rejectedDetails = [];

    for (const file of incomingFiles) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      const isAudio = file.type === "audio/mpeg";
      const isVideo = file.type === "video/mp4";

      // Type Check
      if (!isImage && !isPdf && !isAudio && !isVideo) {
        rejectedDetails.push(`'${file.name}' (unsupported type)`);
        continue;
      }

      // Size Check
      if (file.size > MAX_FILE_SIZE) {
        rejectedDetails.push(`'${file.name}' exceeds the 5MB limit`);
        continue;
      }

      validNewFiles.push(file);
    }

    // Handle rejections first so the user knows why some files didn't appear
    if (rejectedDetails.length > 0) {
      setLocalError(
        `REJECTED: ${rejectedDetails.join(", ")}. Please upload smaller files (max 5MB) in supported formats.`,
      );
    }

    // Check for total capacity
    const totalPossible = selectedFiles.length + validNewFiles.length;
    if (totalPossible > MAX_FILES) {
      setLocalError(
        `Maximum ${MAX_FILES} files allowed. Some valid items were not added.`,
      );

      const availableSpots = MAX_FILES - selectedFiles.length;
      if (availableSpots > 0) {
        setSelectedFiles((prev) => [
          ...prev,
          ...validNewFiles.slice(0, availableSpots),
        ]);
      }
    } else if (validNewFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validNewFiles]);
    }

    // Clear input so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // UI-side validation
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const selectedCategory = formData.category;

    if (!trimmedTitle || !trimmedDescription || !selectedCategory) {
      setLocalError(
        "All fields are required. Mission protocol must be complete.",
      );
      return;
    }

    if (trimmedTitle.length > 100) {
      setLocalError("Classification tag too long. Max 100 characters.");
      return;
    }

    if (trimmedDescription.length > 5000) {
      setLocalError("Testimony exceeds bandwidth. Max 5000 characters.");
      return;
    }

    // Pass clean, trimmed data to parent (including optional files)
    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      category: selectedCategory,
      files: selectedFiles,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {localError && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-shake flex items-center gap-3">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Protocol Breach: {localError}
        </div>
      )}

      <div className="space-y-3">
        <label
          htmlFor="title"
          className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em]"
        >
          Subject Classification
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={100}
          value={formData.title}
          onChange={handleChange}
          autoComplete="off"
          className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white transition-all duration-300 py-4 px-6 text-slate-900 font-medium placeholder:text-slate-300"
          placeholder="e.g. Integrity breach in regional branch"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label
            htmlFor="category"
            className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em]"
          >
            Sector Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="appearance-none block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white transition-all duration-300 py-4 px-6 text-slate-900 font-medium cursor-pointer"
            >
              <option value="" disabled>
                Choose Domain
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <label
            htmlFor="description"
            className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em]"
          >
            Detailed Testimony
          </label>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${formData.description.length > 4500 ? "text-red-600" : "text-slate-400"}`}
          >
            {formData.description.length} / 5000
          </span>
        </div>
        <textarea
          id="description"
          name="description"
          required
          rows={10}
          maxLength={5000}
          value={formData.description}
          onChange={handleChange}
          className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white transition-all duration-300 py-6 px-6 text-slate-900 font-medium placeholder:text-slate-300 leading-relaxed"
          placeholder="Provide a comprehensive account of the events. Include dates, specific actions, and environmental context. Anonymity is guaranteed."
        />
      </div>

      {/* Optional File Attachments */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
          Evidence Attachments{" "}
          <span className="text-slate-400 normal-case tracking-normal font-medium">
            (Optional — up to {MAX_FILES} images, PDFs, audio, or video)
          </span>
        </label>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,.pdf,audio/mpeg,video/mp4"
            multiple
            onChange={handleFileChange}
            className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6 text-slate-900 font-medium file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-xl file:border-0 file:text-[10px] sm:file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-red-600 file:transition-colors"
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {selectedFiles.map((file, index) => {
              const isPdf = file.type === "application/pdf";
              const isAudio = file.type === "audio/mpeg";
              const isVideo = file.type === "video/mp4";
              let typeLabel = "IMG";
              if (isPdf) typeLabel = "PDF";
              if (isAudio) typeLabel = "MP3";
              if (isVideo) typeLabel = "MP4";

              return (
                <div
                  key={index}
                  className="relative group bg-slate-100 rounded-xl p-2 pr-8 border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    {isPdf || isAudio || isVideo ? (
                      <svg
                        className={`w-4 h-4 ${isPdf ? "text-red-600" : isAudio ? "text-blue-600" : "text-purple-600"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    <span className="text-xs font-black uppercase tracking-widest text-slate-700 max-w-[120px] truncate">
                      {file.name}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                      {typeLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 px-8 py-5 font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[400ms] group-hover:w-full" />
          <span className="relative z-10 flex items-center justify-center">
            {isSubmitting ? (
              <>
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
                Encrypting Payload...
              </>
            ) : (
              "Transmit Signal"
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
