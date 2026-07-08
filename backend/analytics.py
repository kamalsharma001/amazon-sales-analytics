"""
analytics.py
------------
Pure functions that turn the cleaned DataFrame into the JSON-friendly
aggregates each API route needs. Kept separate from routing/HTTP concerns
so the logic is easy to unit test and reuse.
"""

import numpy as np
import pandas as pd


def _round(x, n=2):
    if pd.isna(x):
        return 0
    return round(float(x), n)


def dashboard_summary(df: pd.DataFrame) -> dict:
    total_revenue = df["Revenue"].sum()
    total_orders = df["Order ID"].nunique()
    total_qty = df["Qty"].sum()
    cancelled = df["IsCancelled"].sum()
    cancellation_rate = (cancelled / len(df) * 100) if len(df) else 0
    aov = total_revenue / total_orders if total_orders else 0

    top_category = (
        df.groupby("Category", observed=True)["Revenue"].sum().sort_values(ascending=False).index[0]
        if not df.empty else None
    )
    top_state = (
        df.groupby("ship-state", observed=True)["Revenue"].sum().sort_values(ascending=False).index[0]
        if "ship-state" in df.columns and df["ship-state"].notna().any() else None
    )

    return {
        "totalRevenue": _round(total_revenue),
        "totalOrders": int(total_orders),
        "averageOrderValue": _round(aov),
        "totalQuantity": int(total_qty),
        "cancellationRate": _round(cancellation_rate),
        "topCategory": top_category,
        "topState": top_state,
    }


def sales_trend(df: pd.DataFrame) -> dict:
    daily = (
        df.groupby(df["Date"].dt.date)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"))
        .reset_index()
        .rename(columns={"Date": "date"})
    )
    daily["date"] = daily["date"].astype(str)

    monthly = (
        df.groupby(["Year", "MonthNum", "Month"], observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"))
        .reset_index()
        .sort_values(["Year", "MonthNum"])
    )
    monthly["label"] = monthly["Month"].str[:3] + " " + monthly["Year"].astype(str)

    weekday = (
        df.groupby("Weekday", observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"))
        .reindex(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        .reset_index()
    )

    return {
        "daily": daily.to_dict(orient="records"),
        "monthly": monthly[["label", "revenue", "orders"]].to_dict(orient="records"),
        "weekday": weekday.to_dict(orient="records"),
    }


def category_analysis(df: pd.DataFrame) -> list:
    g = (
        df.groupby("Category", observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"), quantity=("Qty", "sum"))
        .reset_index()
    )
    g["avgRevenue"] = g["revenue"] / g["orders"].replace(0, np.nan)
    g["avgRevenue"] = g["avgRevenue"].fillna(0)
    g = g.sort_values("revenue", ascending=False)
    total = g["revenue"].sum()
    g["revenueShare"] = (g["revenue"] / total * 100) if total else 0
    return g.round(2).to_dict(orient="records")


def size_analysis(df: pd.DataFrame) -> list:
    g = (
        df.groupby("Size", observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"), quantity=("Qty", "sum"))
        .reset_index()
        .sort_values("revenue", ascending=False)
    )
    return g.round(2).to_dict(orient="records")


def state_analysis(df: pd.DataFrame) -> list:
    g = (
        df.dropna(subset=["ship-state"])
        .groupby("ship-state", observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"), quantity=("Qty", "sum"))
        .reset_index()
        .rename(columns={"ship-state": "state"})
        .sort_values("revenue", ascending=False)
    )
    return g.round(2).to_dict(orient="records")


def city_analysis(df: pd.DataFrame, limit: int = 30) -> list:
    g = (
        df.dropna(subset=["ship-city"])
        .groupby("ship-city", observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"), quantity=("Qty", "sum"))
        .reset_index()
        .rename(columns={"ship-city": "city"})
        .sort_values("revenue", ascending=False)
        .head(limit)
    )
    return g.round(2).to_dict(orient="records")


def fulfillment_analysis(df: pd.DataFrame) -> list:
    out = []
    for method, sub in df.groupby("Fulfilment", observed=True):
        orders = sub["Order ID"].nunique()
        cancelled = sub["IsCancelled"].sum()
        out.append({
            "method": method,
            "revenue": _round(sub["Revenue"].sum()),
            "orders": int(orders),
            "quantity": int(sub["Qty"].sum()),
            "cancellationRate": _round(cancelled / len(sub) * 100 if len(sub) else 0),
            "successRate": _round(100 - (cancelled / len(sub) * 100 if len(sub) else 0)),
        })
    return sorted(out, key=lambda r: r["revenue"], reverse=True)


def customer_analysis(df: pd.DataFrame) -> dict:
    total_revenue = df["Revenue"].sum()
    total_orders = df["Order ID"].nunique()
    rows = []
    for ctype, sub in df.groupby("CustomerType", observed=True):
        orders = sub["Order ID"].nunique()
        rev = sub["Revenue"].sum()
        rows.append({
            "type": ctype,
            "revenue": _round(rev),
            "orders": int(orders),
            "revenueShare": _round(rev / total_revenue * 100 if total_revenue else 0),
            "orderShare": _round(orders / total_orders * 100 if total_orders else 0),
            "avgOrderValue": _round(rev / orders if orders else 0),
        })
    return {"breakdown": rows}


def top_products(df: pd.DataFrame, limit: int = 20) -> list:
    g = (
        df.groupby(["Category", "Size"], observed=True)
        .agg(revenue=("Revenue", "sum"), orders=("Order ID", "nunique"), quantity=("Qty", "sum"))
        .reset_index()
        .sort_values("revenue", ascending=False)
        .head(limit)
    )
    g["product"] = g["Category"].astype(str) + " - " + g["Size"].astype(str)
    return g[["product", "Category", "Size", "revenue", "orders", "quantity"]].round(2).to_dict(orient="records")


def cancellation_analysis(df: pd.DataFrame) -> dict:
    total = len(df)
    cancelled = df[df["IsCancelled"]]
    rate = len(cancelled) / total * 100 if total else 0

    by_category = (
        cancelled.groupby("Category", observed=True).size().sort_values(ascending=False)
        .rename("count").reset_index()
    )
    by_state = (
        cancelled.dropna(subset=["ship-state"]).groupby("ship-state", observed=True).size()
        .sort_values(ascending=False).rename("count").reset_index()
        .rename(columns={"ship-state": "state"}).head(10)
    )

    return {
        "overallRate": _round(rate),
        "totalCancelled": int(len(cancelled)),
        "byCategory": by_category.to_dict(orient="records"),
        "topStatesByCancellation": by_state.to_dict(orient="records"),
    }
