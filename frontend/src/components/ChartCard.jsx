import { motion } from "framer-motion";

export default function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`card p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm">{title}</h3>
          {subtitle && (
            <p className="text-xs text-ink-600 dark:text-paper-200/50 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
