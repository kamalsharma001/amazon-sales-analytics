import MOCK_DATA from "./mockData.js";

// Simulate a small network delay (300ms) for natural loading state animations
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  dashboard: async () => {
    await delay(300);
    return MOCK_DATA.dashboard;
  },
  salesTrend: async () => {
    await delay(300);
    return MOCK_DATA.salesTrend;
  },
  categoryAnalysis: async () => {
    await delay(300);
    return MOCK_DATA.categoryAnalysis;
  },
  sizeAnalysis: async () => {
    await delay(300);
    return MOCK_DATA.sizeAnalysis;
  },
  stateAnalysis: async () => {
    await delay(300);
    return MOCK_DATA.stateAnalysis;
  },
  cityAnalysis: async (limit = 30) => {
    await delay(300);
    const cities = MOCK_DATA.cityAnalysis.cities.slice(0, limit);
    return { cities };
  },
  fulfillmentAnalysis: async () => {
    await delay(300);
    return MOCK_DATA.fulfillmentAnalysis;
  },
  customerAnalysis: async () => {
    await delay(300);
    return MOCK_DATA.customerAnalysis;
  },
  topProducts: async (limit = 20) => {
    await delay(300);
    const products = MOCK_DATA.topProducts.products.slice(0, limit);
    return { products };
  },
  cancellationAnalysis: async () => {
    await delay(300);
    return MOCK_DATA.cancellationAnalysis;
  },
  recommendations: async () => {
    await delay(300);
    return MOCK_DATA.recommendations;
  },
  forecast: async (days = 30) => {
    await delay(300);
    const allForecast = MOCK_DATA.forecast.forecast;
    const filteredForecast = allForecast.slice(0, days);
    return {
      metrics: MOCK_DATA.forecast.metrics,
      forecast: filteredForecast
    };
  },
  exportCsvUrl: () => {
    const categories = MOCK_DATA.categoryAnalysis.categories;
    const headers = "Category,revenue,orders,quantity,avgRevenue,revenueShare\n";
    const rows = categories.map(c => 
      `"${c.Category}",${c.revenue},${c.orders},${c.quantity},${c.avgRevenue},${c.revenueShare}`
    ).join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
  },
  exportExcelUrl: () => {
    const states = MOCK_DATA.stateAnalysis.states;
    const headers = "State,revenue,orders,quantity\n";
    const rows = states.map(s => 
      `"${s.state}",${s.revenue},${s.orders},${s.quantity}`
    ).join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
  }
};

export default api;
