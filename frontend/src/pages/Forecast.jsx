import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import KPICard from "../components/KPICard.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { formatCurrency, formatNumber } from "../utils/format.js";

export default function Forecast() {
  const [horizon, setHorizon] = useState(30);
  const { data, loading, error } = useFetch(() => api.forecast(horizon), [horizon]);

  if (loading) return <PageLoader message="Fitting the forecast model..." />;
  if (error) return <ErrorState message={error} />;

  const combined = [
    ...data.history.map((h) => ({ date: h.date, actual: h.revenue })),
    ...data.forecast.map((f) => ({
      date: f.date,
      predicted: f.predictedRevenue,
      lowerBound: f.lowerBound,
      band: f.upperBound - f.lowerBound,
    })),
  ];

  const totalPredictedRevenue = data.forecast.reduce((sum, f) => sum + f.predictedRevenue, 0);
  const totalPredictedOrders = data.forecast.reduce((sum, f) => sum + f.predictedOrders, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[30, 90].map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              horizon === h
                ? "bg-gold-gradient text-ink-950"
                : "bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 text-ink-600 dark:text-paper-200/60"
            }`}
          >
            Next {h} days
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard label={`Predicted Revenue (${horizon}d)`} value={formatCurrency(totalPredictedRevenue)} accent="gold" />
        <KPICard label={`Predicted Orders (${horizon}d)`} value={formatNumber(totalPredictedOrders)} accent="teal" />
      </div>

      <ChartCard title="Forecast" subtitle={data.note}>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={combined}>
            <defs>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C7EFF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4C7EFF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} minTickGap={35} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Area dataKey="lowerBound" stackId="band" stroke="none" fill="transparent" />
            <Area dataKey="band" stackId="band" stroke="none" fill="url(#bandGrad)" name="Confidence band" />
            <Line type="monotone" dataKey="actual" stroke="#E8A83C" strokeWidth={2} dot={false} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#4C7EFF" strokeWidth={2} strokeDasharray="5 4" dot={false} name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
