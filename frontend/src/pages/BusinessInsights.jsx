import { motion } from "framer-motion";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

import { ErrorState, PageLoader, PriorityBadge } from "../components/Feedback.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";

export default function BusinessInsights() {
  const { data, loading, error } = useFetch(api.recommendations, []);

  if (loading) return <PageLoader message="Generating business insights..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {data?.recommendations?.map((rec, i) => (
        <motion.div
          key={rec.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="card p-5 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-500 flex items-center justify-center shrink-0">
                {rec.priority === "Low" ? <FiTrendingUp size={15} /> : <FiTrendingDown size={15} />}
              </div>
              <h3 className="font-display font-semibold text-sm leading-snug">{rec.title}</h3>
            </div>
            <PriorityBadge priority={rec.priority} />
          </div>

          <p className="text-sm text-ink-700 dark:text-paper-200/70">{rec.description}</p>

          <div className="grid grid-cols-1 gap-2 text-xs mt-1">
            <div className="p-2.5 rounded-lg bg-paper-100/60 dark:bg-ink-800/60">
              <span className="font-medium text-ink-600 dark:text-paper-200/50 uppercase tracking-wide">
                Business Impact
              </span>
              <p className="mt-0.5">{rec.businessImpact}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-500/5 border border-teal-500/10">
              <span className="font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                Recommendation
              </span>
              <p className="mt-0.5">{rec.recommendation}</p>
            </div>
          </div>

          <span className="text-[11px] text-ink-600 dark:text-paper-200/40 mt-auto">{rec.category}</span>
        </motion.div>
      ))}
    </div>
  );
}
