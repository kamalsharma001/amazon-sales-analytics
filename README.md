# Amazon Sales Performance & Predictive Analytics Dashboard

[![Live Demo](https://img.shields.io/badge/Demo-Live_Dashboard-FF9900?style=for-the-badge&logo=amazon)](https://amazon-sales-analytics.vercel.app/)

A business intelligence and predictive data analytics project designed for analyzing over **128,000 transaction records** from Amazon merchant sales reports. This project translates raw transactional logs into strategic operational intelligence, highlighting revenue drivers, product category concentration risks, logistics performance bottlenecks, and future demand forecasts.

---

## 📈 Executive Summary & Key Insights

Analyzing the dataset reveals several critical trends that impact operational efficiency and revenue stability:

1. **Revenue & Category Concentration Risk**:
   * **Total Revenue**: ₹71.29M across 120,229 orders, with an Average Order Value (AOV) of ₹592.99.
   * **Product Dominance**: **T-shirts** represent **50.0% of total revenue**, indicating a high category concentration risk. A demand shock or supply chain failure in this category would severely impact overall earnings.
2. **Logistics & Fulfillment Channels**:
   * **Performance Gap**: Orders fulfilled directly by **Amazon** exhibit a **12.6% cancellation rate**, whereas **Merchant-fulfilled** orders experience a **17.4% cancellation rate**.
   * **Action Item**: Shifting high-volume or high-value items to Amazon Fulfillment (FBA) could capture significant leakage from canceled merchant transactions.
3. **Geographical Demand Vectors**:
   * **Primary Market**: **Maharashtra** is the top-performing state by revenue.
   * **Growth Vectors**: Emerging regions like **Lakshadweep** show rapid growth (95.9% expansion between the first and second halves of the reporting period), while mature states like **Punjab (Pb)** are declining, indicating rising regional competition.
4. **Order Cancellations**:
   * The store-wide cancellation rate sits at **14.1%**, which falls within a safe operational threshold (<15%).

---

## 🛠️ Data Engineering & Cleaning Methodology

Raw sales records contain inconsistencies, duplicate entries, and missing values. The data cleaning pipeline implements these rules to ensure analytical accuracy:

* **Realized Revenue vs. Gross Order Value**: Cancelled or returned transactions are overridden to zero in the `Revenue` column, ensuring that financial metrics reflect actual realized earnings rather than inflated gross sales.
* **Mixed Date Formats**: Standardized date fields containing mixed formats (`MM-DD-YY` and `MM-DD-YYYY`) and derived secondary dimensions: `Year`, `Month`, `Quarter`, `Weekday`, and `MonthNum`.
* **Deduplication**: Identified and purged exact duplicate transactions.
* **Granular Normalization**: Cleaned categorical variations in states (e.g. standardizing casings and punctuation) and cities to ensure correct geographical aggregation.

---

## 🔮 Predictive Modeling & Analytical Framework

### 1. 90-Day Revenue Forecasting
* **Model Structure**: Combines a **linear trend model** (capturing long-term business trajectories) with **weekday seasonality factors** (correcting for consumer purchasing spikes on weekends vs. weekdays).
* **Confidence Bands**: Projects lower and upper bounds of future revenue using standard deviations of residuals, allowing operations managers to plan stock depth for a 30-day or 90-day horizon with margin for variance.

### 2. Strategic Recommendation Engine
* **Logic**: Implements a rule-based scoring algorithm analyzing:
  * Category concentration metrics (diversification flags).
  * State growth slopes (regional market momentum).
  * Shipping carrier cancellation ratios (logistics QA).
* **Outcome**: Yields trace-level, actionable recommendations directly on the UI based on live figures in the data.

---

## 📁 Repository Structure

```
amazon-sales-dashboard/
├── frontend/           React + Vite (Static BI Dashboard)
│   ├── src/
│   │   ├── components/  Reusable charts, KPI layouts, & sidebar navigation
│   │   ├── pages/       Dashboard, Sales, Products, Geography, Forecasts, etc.
│   │   ├── services/    api.js (Local data resolver) & mockData.js (Pre-calculated dataset)
│   │   └── utils/       Currency and number formatting utilities
│   └── package.json
└── README.md           Data analysis report & project documentation
```

---

## 🚀 Running the Dashboard Locally

The dashboard is built as a static Single Page Application (SPA), loading the pre-calculated dataset instantly. No database or API server setup is required.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)

### Setup Instructions

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser to **`http://localhost:5173`** to interact with the dashboard.
