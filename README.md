# Ledger — Amazon Sales Analytics Dashboard

A full-stack business intelligence platform for the Amazon Sale Report dataset:
a FastAPI backend that cleans and aggregates ~129k order rows, and a React
dashboard (Vite + Tailwind + Recharts + Framer Motion) styled like an internal
BI tool.

```
amazon-sales-dashboard/
├── backend/            FastAPI app
│   ├── main.py          entry point, CORS, router registration
│   ├── data_loader.py   loads + cleans the CSV once (cached)
│   ├── analytics.py     all aggregation functions
│   ├── insights.py      recommendation engine + forecast model
│   ├── routes/          one router module per domain area
│   ├── data/            Amazon_Sale_Report.csv (source data, untouched)
│   └── requirements.txt
│
└── frontend/           React + Vite app
    ├── src/
    │   ├── components/  Sidebar, Topbar, KPICard, ChartCard, etc.
    │   ├── pages/        Dashboard, Sales, Products, Geography, ...
    │   ├── hooks/        useFetch, useTheme
    │   ├── services/     api.js (single axios client)
    │   └── utils/        formatting helpers
    └── package.json
```

## 1. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # adjust ALLOWED_ORIGINS if needed
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs (Swagger)
are auto-generated at `http://localhost:8000/docs`.

The dataset already lives at `backend/data/Amazon_Sale_Report.csv`, so no
extra setup is required — `data_loader.py` reads and cleans it into memory
on first request and caches the result for the life of the process.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env             # VITE_API_BASE_URL, defaults to localhost:8000
npm run dev
```

Visit `http://localhost:5173`. The sidebar covers every page in the brief:
Dashboard, Sales Analysis, Product Analysis, Geographical Analysis, Customer
Insights, Fulfillment, Business Insights, Forecast, and Settings (theme +
export).

## API Reference

| Endpoint                  | Description                                   |
|----------------------------|------------------------------------------------|
| `GET /dashboard`           | Top-line KPIs                                  |
| `GET /sales-trend`         | Daily, monthly, and weekday revenue/orders     |
| `GET /category-analysis`   | Revenue, orders, quantity per category         |
| `GET /size-analysis`       | Revenue, orders, quantity per size             |
| `GET /state-analysis`      | Revenue, orders, quantity per shipping state    |
| `GET /city-analysis`       | Same, per shipping city (`?limit=`)             |
| `GET /fulfillment-analysis`| Amazon vs Merchant comparison                   |
| `GET /customer-analysis`   | B2B vs B2C revenue/order share                  |
| `GET /top-products`        | Top N category+size combinations (`?limit=`)    |
| `GET /cancellation-analysis`| Cancellation rate, by category and state        |
| `GET /recommendations`     | Rule-based business insight cards               |
| `GET /forecast`            | Linear-trend + weekday-seasonality forecast (`?days=30\|90`) |
| `GET /export/csv`          | Category summary as CSV                         |
| `GET /export/excel`        | Multi-sheet workbook (summary, category, state)  |

## Data cleaning notes

`data_loader.py` handles the two date formats present in the raw file
(`MM-DD-YY` and `MM-DD-YYYY`), drops exact duplicates, coerces `Qty`/`Amount`
to numeric, derives `Year`, `Month`, `Quarter`, `Weekday`, and computes a
`Revenue` column that zeroes out cancelled orders so KPI totals reflect
realized revenue rather than gross order value. The original CSV on disk is
never modified — all cleaning happens on an in-memory copy.

## Deployment

- **Backend (Render, or any ASGI host):** set `ALLOWED_ORIGINS` to your
  deployed frontend URL, then run `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- **Frontend (Vercel, or any static host):** set `VITE_API_BASE_URL` to your
  deployed backend URL as a build-time environment variable, then
  `npm run build` and deploy the `dist/` folder.

## What's deliberately kept simple

The forecast model is a transparent linear-trend + weekday-seasonality fit —
good for directional planning, not a substitute for a dedicated demand
forecasting pipeline. The recommendation engine is rule-based (thresholds
mirror the ones in the original project brief) rather than a black-box model,
so every insight's "why" is traceable to a specific number in the data.
