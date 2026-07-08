import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiMap,
  FiPackage,
  FiSettings,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/sales", label: "Sales Analysis", icon: FiBarChart2 },
  { to: "/products", label: "Product Analysis", icon: FiPackage },
  { to: "/geography", label: "Geographical Analysis", icon: FiMap },
  { to: "/customers", label: "Customer Insights", icon: FiUsers },
  { to: "/fulfillment", label: "Fulfillment", icon: FiTruck },
  { to: "/insights", label: "Business Insights", icon: FiZap },
  { to: "/forecast", label: "Forecast", icon: FiTrendingUp },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
      return next;
    });
  };

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-paper-200 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Header */}
      {isCollapsed ? (
        <div className="flex items-center justify-center h-16 border-b border-paper-200 dark:border-ink-700">
          <button
            onClick={toggleCollapse}
            aria-label="Expand sidebar"
            className="w-10 h-10 rounded-xl border border-[#FF7A00] flex items-center justify-center hover:bg-[#FF7A00]/10 transition-colors cursor-pointer"
          >
            <FiChevronRight className="text-[#FF7A00]" size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5 h-16 border-b border-paper-200 dark:border-ink-700 w-full">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF7A00"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7 shrink-0"
            >
              <path d="M5.5 9.5L8.5 5.5H15.5L18.5 9.5" />
              <rect x="5.5" y="9.5" width="13" height="10" rx="1.5" />
              <path d="M9.5 13.5a2.5 2.5 0 0 0 5 0" />
            </svg>
            <span className="font-display font-bold text-base tracking-tight text-ink-950 dark:text-white whitespace-nowrap">
              Sales Analytics
            </span>
          </div>
          <button
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
            className="text-ink-600 dark:text-paper-200/50 hover:text-[#FF7A00] transition-colors p-1 cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center transition-all duration-200 group ${
                isCollapsed
                  ? "justify-center w-11 h-11 mx-auto rounded-xl"
                  : "gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
              } ${
                isActive
                  ? "text-ink-950 dark:text-white"
                  : "text-ink-600 dark:text-paper-200/60 hover:text-ink-900 dark:hover:text-paper-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-paper-100 dark:bg-ink-800 rounded-xl"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <Icon size={17} className="relative z-10" />
                {!isCollapsed && <span className="relative z-10">{label}</span>}
                {isActive && !isCollapsed && (
                  <span className="absolute right-2 z-10 w-1.5 h-1.5 rounded-full bg-gold-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-paper-200 dark:border-ink-700">
        {!isCollapsed && (
          <div className="rounded-xl bg-ink-950 dark:bg-ink-800 text-paper-100 p-3.5">
            <p className="text-xs font-medium text-gold-400 mb-1">Data window</p>
            <p className="text-sm font-display">Mar &ndash; Jun 2022</p>
          </div>
        )}
      </div>
    </aside>
  );
}
