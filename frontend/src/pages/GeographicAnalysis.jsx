import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiMapPin } from "react-icons/fi";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { formatCurrency, formatNumber } from "../utils/format.js";

export default function GeographicAnalysis() {
  const { data: states, loading: stateLoading, error } = useFetch(api.stateAnalysis, []);
  const { data: cities, loading: cityLoading } = useFetch(() => api.cityAnalysis(15), []);
  const [selectedState, setSelectedState] = useState(null);

  if (stateLoading) return <PageLoader message="Mapping regional performance..." />;
  if (error) return <ErrorState message={error} />;

  const top10 = states.states.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Top 10 States" subtitle="Revenue by shipping state — click a bar to focus">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={top10} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="text-paper-200 dark:text-ink-700" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
              <YAxis type="category" dataKey="state" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar
                dataKey="revenue"
                fill="#E8A83C"
                radius={[0, 6, 6, 0]}
                onClick={(d) => setSelectedState(d.state)}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Cities" subtitle="Highest-revenue shipping cities">
          {cityLoading ? (
            <div className="h-72 animate-pulse bg-paper-100 dark:bg-ink-800 rounded-xl" />
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {cities.cities.map((c, i) => (
                <div
                  key={c.city}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-paper-100/60 dark:bg-ink-800/60"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-ink-600 dark:text-paper-200/40 w-5">{i + 1}</span>
                    <FiMapPin size={13} className="text-gold-500" />
                    <span className="text-sm font-medium">{c.city}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm stat-mono font-semibold">{formatCurrency(c.revenue)}</p>
                    <p className="text-[11px] text-ink-600 dark:text-paper-200/40">{formatNumber(c.orders)} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard
        title={selectedState ? `${selectedState} — full state breakdown` : "All States"}
        subtitle="Revenue, orders, and quantity by shipping state"
        action={
          selectedState && (
            <button
              onClick={() => setSelectedState(null)}
              className="text-xs px-2.5 py-1 rounded-lg bg-paper-100 dark:bg-ink-800 hover:bg-paper-200 dark:hover:bg-ink-700 transition-colors"
            >
              Clear selection
            </button>
          )
        }
      >
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-600 dark:text-paper-200/50 uppercase tracking-wide">
                <th className="py-2 px-1">State</th>
                <th className="py-2 px-1 text-right">Revenue</th>
                <th className="py-2 px-1 text-right">Orders</th>
                <th className="py-2 px-1 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {(selectedState ? states.states.filter((s) => s.state === selectedState) : states.states).map((s) => (
                <tr key={s.state} className="border-t border-paper-200 dark:border-ink-700">
                  <td className="py-2 px-1 font-medium">{s.state}</td>
                  <td className="py-2 px-1 text-right stat-mono">{formatCurrency(s.revenue)}</td>
                  <td className="py-2 px-1 text-right stat-mono">{formatNumber(s.orders)}</td>
                  <td className="py-2 px-1 text-right stat-mono">{formatNumber(s.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
