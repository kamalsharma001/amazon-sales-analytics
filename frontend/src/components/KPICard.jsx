import { motion } from "framer-motion";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

export default function KPICard({ label, value, delta, icon: Icon, accent = "gold" }) {
  const positive = typeof delta === "number" ? delta >= 0 : null;
  const accentClasses = {
    gold: "text-gold-500 bg-gold-500/10",
    teal: "text-teal-500 bg-teal-500/10",
    coral: "text-coral-500 bg-coral-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-600 dark:text-paper-200/50">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="stat-mono text-2xl font-semibold tracking-tight">{value}</span>
        {delta !== undefined && delta !== null && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              positive ? "text-teal-500" : "text-coral-500"
            }`}
          >
            {positive ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
