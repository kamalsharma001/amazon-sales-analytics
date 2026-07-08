import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "../components/ChartCard.jsx";
import { ErrorState, PageLoader } from "../components/Feedback.jsx";
import useFetch from "../hooks/useFetch.js";
import api from "../services/api.js";
import { CHART_COLORS, formatCurrency, formatNumber } from "../utils/format.js";

function TreemapCell({ x, y, width, height, index, name, value }) {
  if (width < 2 || height < 2) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        style={{ fill: CHART_COLORS[index % CHART_COLORS.length], stroke: "#fff", strokeWidth: 2 }}
      />
      {width > 70 && height > 30 && (
        <text x={x + 10} y={y + 22} fontSize={12} fill="#fff" fontWeight={600}>
          {name}
        </text>
      )}
    </g>
  );
}

export default function ProductAnalysis() {
  const { data: cat, loading: catLoading, error } = useFetch(api.categoryAnalysis, []);
  const { data: sizes, loading: sizeLoading } = useFetch(api.sizeAnalysis, []);
  const { data: products, loading: prodLoading } = useFetch(() => api.topProducts(20), []);

  if (catLoading) return <PageLoader message="Analyzing product performance..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <ChartCard title="Category Revenue Share" subtitle="Sized by revenue contribution">
        <ResponsiveContainer width="100%" height={260}>
          <Treemap
            data={cat.categories.map((c) => ({ name: c.Category, value: c.revenue }))}
            dataKey="value"
            content={<TreemapCell />}
          />
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Top Sizes" subtitle="Revenue by product size">
          {sizeLoading ? (
            <div className="h-64 animate-pulse bg-paper-100 dark:bg-ink-800 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sizes.sizes} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="text-paper-200 dark:text-ink-700" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
                <YAxis type="category" dataKey="Size" tick={{ fontSize: 11 }} width={40} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#8B6FE0" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Category Performance" subtitle="Revenue, orders, and average order value">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-600 dark:text-paper-200/50 uppercase tracking-wide">
                  <th className="py-2 px-1">Category</th>
                  <th className="py-2 px-1 text-right">Revenue</th>
                  <th className="py-2 px-1 text-right">Orders</th>
                  <th className="py-2 px-1 text-right">Avg Value</th>
                </tr>
              </thead>
              <tbody>
                {cat.categories.map((c) => (
                  <tr key={c.Category} className="border-t border-paper-200 dark:border-ink-700">
                    <td className="py-2 px-1 font-medium">{c.Category}</td>
                    <td className="py-2 px-1 text-right stat-mono">{formatCurrency(c.revenue)}</td>
                    <td className="py-2 px-1 text-right stat-mono">{formatNumber(c.orders)}</td>
                    <td className="py-2 px-1 text-right stat-mono">{formatCurrency(c.avgRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Top 20 Products" subtitle="By category and size combination">
        {prodLoading ? (
          <div className="h-64 animate-pulse bg-paper-100 dark:bg-ink-800 rounded-xl" />
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-600 dark:text-paper-200/50 uppercase tracking-wide">
                  <th className="py-2 px-1">#</th>
                  <th className="py-2 px-1">Product</th>
                  <th className="py-2 px-1 text-right">Revenue</th>
                  <th className="py-2 px-1 text-right">Orders</th>
                  <th className="py-2 px-1 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.products.map((p, i) => (
                  <tr key={p.product} className="border-t border-paper-200 dark:border-ink-700">
                    <td className="py-2 px-1 text-ink-600 dark:text-paper-200/40">{i + 1}</td>
                    <td className="py-2 px-1 font-medium">{p.product}</td>
                    <td className="py-2 px-1 text-right stat-mono">{formatCurrency(p.revenue)}</td>
                    <td className="py-2 px-1 text-right stat-mono">{formatNumber(p.orders)}</td>
                    <td className="py-2 px-1 text-right stat-mono">{formatNumber(p.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
