export const CHART_COLORS = [
  "#E8A83C", // gold
  "#1F8A70", // teal
  "#4C7EFF", // blue
  "#E14F4F", // coral
  "#8B6FE0", // violet
  "#3FC7AE", // light teal
  "#C98A24", // dark gold
  "#7A8AA0", // slate
];

export function formatCurrency(value) {
  if (value === null || value === undefined) return "-";
  if (Math.abs(value) >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
  if (Math.abs(value) >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
  if (Math.abs(value) >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
  return `₹${Math.round(value)}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}
