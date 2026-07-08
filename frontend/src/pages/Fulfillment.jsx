import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import KPICard from "../components/KPICard.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { formatCurrency, formatNumber } from "../utils/format.js";

export default function Fulfillment() {
  const { data, loading, error } = useFetch(api.fulfillmentAnalysis, []);

  if (loading) return <PageLoader message="Comparing fulfillment methods..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.methods.map((m) => (
          <KPICard
            key={m.method}
            label={`${m.method} Success Rate`}
            value={`${m.successRate}%`}
            delta={m.successRate - 85}
            accent={m.successRate >= 85 ? "teal" : "coral"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Revenue by Method" subtitle="Amazon vs Merchant fulfillment">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.methods}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
              <XAxis dataKey="method" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#E8A83C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Success vs Cancellation Rate" subtitle="Reliability comparison">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.methods}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
              <XAxis dataKey="method" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="successRate" name="Success %" fill="#1F8A70" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cancellationRate" name="Cancellation %" fill="#E14F4F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Method Detail" subtitle="Full breakdown">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-600 dark:text-paper-200/50 uppercase tracking-wide">
                <th className="py-2 px-1">Method</th>
                <th className="py-2 px-1 text-right">Revenue</th>
                <th className="py-2 px-1 text-right">Orders</th>
                <th className="py-2 px-1 text-right">Quantity</th>
                <th className="py-2 px-1 text-right">Success Rate</th>
                <th className="py-2 px-1 text-right">Cancellation Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.methods.map((m) => (
                <tr key={m.method} className="border-t border-paper-200 dark:border-ink-700">
                  <td className="py-2 px-1 font-medium">{m.method}</td>
                  <td className="py-2 px-1 text-right stat-mono">{formatCurrency(m.revenue)}</td>
                  <td className="py-2 px-1 text-right stat-mono">{formatNumber(m.orders)}</td>
                  <td className="py-2 px-1 text-right stat-mono">{formatNumber(m.quantity)}</td>
                  <td className="py-2 px-1 text-right stat-mono text-teal-500">{m.successRate}%</td>
                  <td className="py-2 px-1 text-right stat-mono text-coral-500">{m.cancellationRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
