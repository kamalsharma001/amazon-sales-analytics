import { FiDownload, FiFileText, FiMoon, FiSun } from "react-icons/fi";

import ChartCard from "../components/ChartCard.jsx";
import useTheme from "../hooks/useTheme.js";
import api from "../services/api.js";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <ChartCard title="Appearance" subtitle="Choose how Ledger looks on this device">
        <div className="flex items-center justify-between p-4 rounded-xl bg-paper-100/60 dark:bg-ink-800/60">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <FiMoon size={16} /> : <FiSun size={16} className="text-gold-500" />}
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-ink-600 dark:text-paper-200/50">Currently {theme} mode</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl text-sm font-medium bg-gold-gradient text-ink-950"
          >
            Switch to {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </ChartCard>

      <ChartCard title="Export Data" subtitle="Download analysis summaries for offline reporting">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={api.exportCsvUrl()}
            download="category_summary.csv"
            className="flex items-center gap-3 p-4 rounded-xl bg-paper-100/60 dark:bg-ink-800/60 hover:bg-paper-200/60 dark:hover:bg-ink-700/60 transition-colors"
          >
            <FiFileText className="text-gold-500" size={18} />
            <div>
              <p className="text-sm font-medium">Category Summary (CSV)</p>
              <p className="text-xs text-ink-600 dark:text-paper-200/50">Revenue, orders, quantity by category</p>
            </div>
          </a>
          <a
            href={api.exportExcelUrl()}
            download="state_summary.csv"
            className="flex items-center gap-3 p-4 rounded-xl bg-paper-100/60 dark:bg-ink-800/60 hover:bg-paper-200/60 dark:hover:bg-ink-700/60 transition-colors"
          >
            <FiDownload className="text-teal-500" size={18} />
            <div>
              <p className="text-sm font-medium">State Summary (CSV)</p>
              <p className="text-xs text-ink-600 dark:text-paper-200/50">Revenue, orders, quantity by state</p>
            </div>
          </a>
        </div>
      </ChartCard>

      <ChartCard title="Data Source" subtitle="About this dashboard">
        <p className="text-sm text-ink-700 dark:text-paper-200/70 leading-relaxed">
          This dashboard analyzes the Amazon Sale Report dataset. For maximum speed and offline-first
          reliability, all analytical metrics, visualizations, and forecasts are pre-computed directly
          from the real dataset and loaded instantly, eliminating external server latency.
        </p>
      </ChartCard>
    </div>
  );
}
