import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({ baseURL: BASE_URL, timeout: 60000 });

export const api = {
  dashboard: () => client.get("/dashboard").then((r) => r.data),
  salesTrend: () => client.get("/sales-trend").then((r) => r.data),
  categoryAnalysis: () => client.get("/category-analysis").then((r) => r.data),
  sizeAnalysis: () => client.get("/size-analysis").then((r) => r.data),
  stateAnalysis: () => client.get("/state-analysis").then((r) => r.data),
  cityAnalysis: (limit = 30) => client.get(`/city-analysis?limit=${limit}`).then((r) => r.data),
  fulfillmentAnalysis: () => client.get("/fulfillment-analysis").then((r) => r.data),
  customerAnalysis: () => client.get("/customer-analysis").then((r) => r.data),
  topProducts: (limit = 20) => client.get(`/top-products?limit=${limit}`).then((r) => r.data),
  cancellationAnalysis: () => client.get("/cancellation-analysis").then((r) => r.data),
  recommendations: () => client.get("/recommendations").then((r) => r.data),
  forecast: (days = 30) => client.get(`/forecast?days=${days}`).then((r) => r.data),
  exportCsvUrl: () => `${BASE_URL}/export/csv`,
  exportExcelUrl: () => `${BASE_URL}/export/excel`,
};

export default api;
