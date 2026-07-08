import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import BusinessInsights from "./pages/BusinessInsights.jsx";
import CustomerInsights from "./pages/CustomerInsights.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Forecast from "./pages/Forecast.jsx";
import Fulfillment from "./pages/Fulfillment.jsx";
import GeographicAnalysis from "./pages/GeographicAnalysis.jsx";
import ProductAnalysis from "./pages/ProductAnalysis.jsx";
import SalesAnalysis from "./pages/SalesAnalysis.jsx";
import Settings from "./pages/Settings.jsx";

const PAGE_META = {
  "/": { title: "Dashboard", subtitle: "Overview of Amazon sales performance" },
  "/sales": { title: "Sales Analysis", subtitle: "Trends, seasonality, and revenue drivers" },
  "/products": { title: "Product Analysis", subtitle: "Category and size performance" },
  "/geography": { title: "Geographical Analysis", subtitle: "Revenue by state and city" },
  "/customers": { title: "Customer Insights", subtitle: "B2B vs B2C behavior" },
  "/fulfillment": { title: "Fulfillment", subtitle: "Amazon vs Merchant performance" },
  "/insights": { title: "Business Insights", subtitle: "Rule-based recommendations" },
  "/forecast": { title: "Forecast", subtitle: "Projected revenue and orders" },
  "/settings": { title: "Settings", subtitle: "Preferences and data source" },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: "Ledger" };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-5 lg:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/sales" element={<AnimatedPage><SalesAnalysis /></AnimatedPage>} />
              <Route path="/products" element={<AnimatedPage><ProductAnalysis /></AnimatedPage>} />
              <Route path="/geography" element={<AnimatedPage><GeographicAnalysis /></AnimatedPage>} />
              <Route path="/customers" element={<AnimatedPage><CustomerInsights /></AnimatedPage>} />
              <Route path="/fulfillment" element={<AnimatedPage><Fulfillment /></AnimatedPage>} />
              <Route path="/insights" element={<AnimatedPage><BusinessInsights /></AnimatedPage>} />
              <Route path="/forecast" element={<AnimatedPage><Forecast /></AnimatedPage>} />
              <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
