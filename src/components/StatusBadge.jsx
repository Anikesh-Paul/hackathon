const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  reviewing: { label: "Reviewing", color: "bg-blue-100 text-blue-800" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800" },
  dismissed: { label: "Dismissed", color: "bg-gray-100 text-gray-800" },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
    >
      {config.label}
    </span>
  );
}
