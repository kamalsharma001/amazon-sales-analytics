import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FiBriefcase, FiUser } from "react-icons/fi";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import KPICard from "../components/KPICard.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { formatCurrency, formatNumber } from "../utils/format.js";

export default function CustomerInsights() {
  const { data, loading, error } = useFetch(api.customerAnalysis, []);

  if (loading) return <PageLoader message="Segmenting customers..." />;
  if (error) return <ErrorState message={error} />;

  const b2b = data.breakdown.find((d) => d.type === "B2B") || {};
  const b2c = data.breakdown.find((d) => d.type === "B2C") || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard label="B2C Revenue Share" value={`${b2c.revenueShare ?? 0}%`} icon={FiUser} accent="gold" />
        <KPICard label="B2B Revenue Share" value={`${b2b.revenueShare ?? 0}%`} icon={FiBriefcase} accent="teal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Revenue Share" subtitle="B2B vs B2C contribution to total revenue">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.breakdown}
                dataKey="revenue"
                nameKey="type"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.breakdown.map((d, i) => (
                  <Cell key={d.type} fill={i === 0 ? "#E8A83C" : "#1F8A70"} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Segment Detail" subtitle="Orders, revenue, and average order value">
          <div className="space-y-3">
            {data.breakdown.map((d) => (
              <div key={d.type} className="p-4 rounded-xl bg-paper-100/60 dark:bg-ink-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-semibold text-sm">{d.type}</span>
                  <span className="text-xs text-ink-600 dark:text-paper-200/50">{d.orderShare}% of orders</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[11px] text-ink-600 dark:text-paper-200/40 uppercase">Revenue</p>
                    <p className="stat-mono font-semibold text-sm">{formatCurrency(d.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-600 dark:text-paper-200/40 uppercase">Orders</p>
                    <p className="stat-mono font-semibold text-sm">{formatNumber(d.orders)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-600 dark:text-paper-200/40 uppercase">AOV</p>
                    <p className="stat-mono font-semibold text-sm">{formatCurrency(d.avgOrderValue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
