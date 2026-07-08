import { FiAlertTriangle } from "react-icons/fi";

export function PageLoader({ message = "Loading data..." }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-5 h-28 animate-pulse">
          <div className="h-3 w-20 bg-paper-200 dark:bg-ink-700 rounded mb-4" />
          <div className="h-6 w-28 bg-paper-200 dark:bg-ink-700 rounded" />
        </div>
      ))}
      <p className="col-span-full text-xs text-ink-600 dark:text-paper-200/40 mt-1">{message}</p>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="card p-8 flex flex-col items-center text-center gap-3">
      <div className="w-10 h-10 rounded-full bg-coral-500/10 text-coral-500 flex items-center justify-center">
        <FiAlertTriangle size={18} />
      </div>
      <div>
        <p className="font-medium text-sm">Couldn&apos;t load this data</p>
        <p className="text-xs text-ink-600 dark:text-paper-200/50 mt-1">
          {message || "Check that the backend API is running on the configured URL."}
        </p>
      </div>
    </div>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-coral-500/10 text-coral-500",
    Medium: "bg-gold-500/10 text-gold-600",
    Low: "bg-teal-500/10 text-teal-500",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
        styles[priority] || styles.Low
      }`}
    >
      {priority}
    </span>
  );
}
