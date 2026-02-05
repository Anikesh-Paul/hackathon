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
    const files = Array.from(e.target.files || []);
    if (localError) setLocalError("");

    // Validate number of files
    if (files.length > MAX_FILES) {
      setLocalError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setLocalError("Only image files are allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setLocalError("Each file must be under 5MB.");
        return;
      }
    }

    setSelectedFiles(files);
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
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs font-bold uppercase tracking-widest animate-shake">
          Validation Error: {localError}
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
            (Optional — up to {MAX_FILES} images)
          </span>
        </label>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full rounded-2xl border-slate-100 bg-slate-50 shadow-inner focus:border-red-600 focus:ring-red-600 focus:bg-white transition-all duration-300 py-4 px-6 text-slate-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-red-600 file:transition-colors"
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-slate-100 rounded-xl p-2 pr-8"
              >
                <div className="flex items-center gap-2">
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
                  <span className="text-xs font-medium text-slate-700 max-w-32 truncate">
                    {file.name}
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
            ))}
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
