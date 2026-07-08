import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { formatCurrency, formatNumber } from "../utils/format.js";

export default function SalesAnalysis() {
  const { data: trend, loading, error } = useFetch(api.salesTrend, []);

  if (loading) return <PageLoader message="Loading sales trend..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <ChartCard title="Revenue vs Orders" subtitle="Daily comparison across the full reporting period">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend.daily}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} minTickGap={30} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={50} />
            <Tooltip
              formatter={(v, name) => (name === "revenue" ? formatCurrency(v) : formatNumber(v))}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#E8A83C" strokeWidth={2} dot={false} name="Revenue" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#4C7EFF" strokeWidth={2} dot={false} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Monthly Comparison" subtitle="Total revenue per month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trend.monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#E8A83C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekday Analysis" subtitle="Which days of the week sell best">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trend.weekday}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
              <XAxis dataKey="Weekday" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(0, 3)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#1F8A70" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
