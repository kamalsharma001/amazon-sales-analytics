import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiAlertCircle,
  FiDollarSign,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import KPICard from "../components/KPICard.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { CHART_COLORS, formatCurrency, formatNumber } from "../utils/format.js";

export default function Dashboard() {
  const { data: kpi, loading: kpiLoading, error: kpiError } = useFetch(api.dashboard, []);
  const { data: trend, loading: trendLoading } = useFetch(api.salesTrend, []);
  const { data: catData, loading: catLoading } = useFetch(api.categoryAnalysis, []);

  if (kpiLoading) return <PageLoader message="Crunching KPI summary..." />;
  if (kpiError) return <ErrorState message={kpiError} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="Total Revenue" value={formatCurrency(kpi.totalRevenue)} icon={FiDollarSign} accent="gold" />
        <KPICard label="Total Orders" value={formatNumber(kpi.totalOrders)} icon={FiShoppingBag} accent="teal" />
        <KPICard label="Avg Order Value" value={formatCurrency(kpi.averageOrderValue)} icon={FiTag} accent="gold" />
        <KPICard label="Total Quantity" value={formatNumber(kpi.totalQuantity)} icon={FiPackage} accent="teal" />
        <KPICard
          label="Cancellation Rate"
          value={`${kpi.cancellationRate}%`}
          icon={FiAlertCircle}
          accent={kpi.cancellationRate > 15 ? "coral" : "teal"}
        />
        <KPICard label="Top Category" value={kpi.topCategory} icon={FiPackage} accent="gold" />
        <KPICard label="Top State" value={kpi.topState} icon={FiMapPin} accent="teal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <ChartCard
          title="Revenue Trend"
          subtitle="Daily revenue across the reporting period"
          className="xl:col-span-2"
        >
          {trendLoading || !trend ? (
            <div className="h-72 animate-pulse bg-paper-100 dark:bg-ink-800 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trend.daily}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8A83C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#E8A83C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-paper-200 dark:text-ink-700" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} minTickGap={30} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{ borderRadius: 12, fontSize: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E8A83C" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Revenue by Category" subtitle="Share of total revenue">
          {catLoading || !catData ? (
            <div className="h-72 animate-pulse bg-paper-100 dark:bg-ink-800 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={catData.categories}
                  dataKey="revenue"
                  nameKey="Category"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {catData.categories.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {catData?.categories.slice(0, 6).map((c, i) => (
              <div key={c.Category} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-ink-600 dark:text-paper-200/60">{c.Category}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Sales" subtitle="Revenue and order volume by month">
        {trendLoading || !trend ? (
          <div className="h-64 animate-pulse bg-paper-100 dark:bg-ink-800 rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trend.monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-paper-200 dark:text-ink-700" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={60} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#1F8A70" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
