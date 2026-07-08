import { FiMoon, FiSun } from "react-icons/fi";

import useTheme from "../hooks/useTheme.js";

export default function Topbar({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 px-5 lg:px-8 border-b border-paper-200 dark:border-ink-700 bg-paper-50/80 dark:bg-ink-950/80 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="font-display font-semibold text-lg leading-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-ink-600 dark:text-paper-200/50 truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 hover:border-gold-500/50 transition-colors"
        >
          {theme === "dark" ? <FiSun size={16} className="text-gold-400" /> : <FiMoon size={16} />}
        </button>
      </div>
    </header>
  );
}
