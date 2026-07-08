"""
insights.py
-----------
Rule-based business insight engine + a lightweight time-series forecast.
No black-box ML is needed for the recommendation engine - the rules mirror
the exact thresholds requested in the project brief so the "why" behind
every insight is transparent to a business stakeholder.
"""

import numpy as np
import pandas as pd


def _priority(score: float) -> str:
    if score >= 0.66:
        return "High"
    if score >= 0.33:
        return "Medium"
    return "Low"


def generate_recommendations(df: pd.DataFrame) -> list:
    insights = []

    # --- Cancellation rate ------------------------------------------------
    cancel_rate = df["IsCancelled"].mean() * 100
    if cancel_rate > 15:
        insights.append({
            "title": "High Cancellation Rate",
            "description": f"Cancellations sit at {cancel_rate:.1f}% of all orders, above the 15% health threshold.",
            "businessImpact": "Lost revenue, wasted fulfillment capacity, and lower marketplace ranking from order defect rate.",
            "recommendation": "Audit fulfillment/logistics for the affected categories and shipping regions; tighten inventory sync to reduce oversell-driven cancellations.",
            "priority": _priority(min(cancel_rate / 25, 1)),
            "category": "Operations",
        })
    else:
        insights.append({
            "title": "Cancellation Rate Under Control",
            "description": f"Cancellations are at {cancel_rate:.1f}%, within a healthy range.",
            "businessImpact": "Stable fulfillment reliability supports customer trust.",
            "recommendation": "Maintain current logistics QA checks; monitor weekly for drift.",
            "priority": "Low",
            "category": "Operations",
        })

    # --- Category concentration --------------------------------------------
    cat_rev = df.groupby("Category")["Revenue"].sum()
    total_rev = cat_rev.sum()
    if total_rev > 0:
        top_cat = cat_rev.idxmax()
        top_share = cat_rev.max() / total_rev * 100
        if top_share > 40:
            insights.append({
                "title": f"Revenue Concentration in {top_cat}",
                "description": f"{top_cat} contributes {top_share:.1f}% of total revenue.",
                "businessImpact": "Over-reliance on one category increases exposure to demand shocks or seasonality in that line.",
                "recommendation": f"Expand inventory depth and marketing spend in {top_cat} to capture more of proven demand, while incubating a second category as a hedge.",
                "priority": _priority(min(top_share / 60, 1)),
                "category": "Inventory",
            })

        weak_cat = cat_rev.idxmin()
        weak_share = cat_rev.min() / total_rev * 100
        insights.append({
            "title": f"Underperforming Category: {weak_cat}",
            "description": f"{weak_cat} contributes only {weak_share:.2f}% of total revenue.",
            "businessImpact": "Tied-up inventory and catalog space with low return.",
            "recommendation": f"Evaluate whether to discount, bundle, or discontinue {weak_cat}; reallocate ad spend to higher performers.",
            "priority": _priority(min((5 - weak_share) / 5, 1)) if weak_share < 5 else "Low",
            "category": "Inventory",
        })

    # --- State-level trend (first half of period vs second half) -----------
    if "ship-state" in df.columns and df["ship-state"].notna().any():
        mid_date = df["Date"].median()
        first = df[df["Date"] <= mid_date].groupby("ship-state")["Revenue"].sum()
        second = df[df["Date"] > mid_date].groupby("ship-state")["Revenue"].sum()
        common = first.index.intersection(second.index)
        if len(common) > 0:
            change = ((second[common] - first[common]) / first[common].replace(0, np.nan)) * 100
            change = change.dropna()
            if not change.empty:
                growing_state = change.idxmax()
                declining_state = change.idxmin()
                insights.append({
                    "title": f"Fast-Growing Region: {growing_state}",
                    "description": f"Revenue in {growing_state} grew {change.max():.1f}% from the first half to the second half of the period.",
                    "businessImpact": "Signals emerging regional demand worth capturing early.",
                    "recommendation": f"Increase regional marketing and stock allocation for {growing_state} to capitalize on momentum.",
                    "priority": "Medium",
                    "category": "Growth",
                })
                if change.min() < 0:
                    insights.append({
                        "title": f"Declining Region: {declining_state}",
                        "description": f"Revenue in {declining_state} fell {abs(change.min()):.1f}% from the first half to the second half of the period.",
                        "businessImpact": "Region is losing share of overall revenue; may indicate local competition or fulfillment issues.",
                        "recommendation": f"Launch a targeted regional marketing push and review fulfillment SLAs for {declining_state}.",
                        "priority": _priority(min(abs(change.min()) / 50, 1)),
                        "category": "Growth",
                    })

    # --- Fulfillment comparison ---------------------------------------------
    if "Fulfilment" in df.columns and df["Fulfilment"].notna().any():
        fulfil_cancel = df.groupby("Fulfilment")["IsCancelled"].mean() * 100
        if len(fulfil_cancel) > 1:
            best = fulfil_cancel.idxmin()
            worst = fulfil_cancel.idxmax()
            insights.append({
                "title": f"Best Fulfillment Method: {best}",
                "description": f"{best} has the lowest cancellation rate at {fulfil_cancel[best]:.1f}%, versus {fulfil_cancel[worst]:.1f}% for {worst}.",
                "businessImpact": "Fulfillment method choice materially affects order reliability.",
                "recommendation": f"Where feasible, shift more volume toward {best} fulfillment, especially for high-value or high-risk-of-cancellation categories.",
                "priority": "Medium",
                "category": "Fulfillment",
            })

    return insights


def forecast_revenue(df: pd.DataFrame, horizon_days: int = 30) -> dict:
    """
    Simple, transparent forecast: linear trend + weekday seasonality index,
    fit on daily revenue. Good enough for directional planning; not a
    substitute for a proper demand-planning model.
    """
    daily = df.groupby(df["Date"].dt.date)["Revenue"].sum().reset_index()
    daily.columns = ["date", "revenue"]
    daily["date"] = pd.to_datetime(daily["date"])
    daily = daily.sort_values("date")

    if len(daily) < 5:
        return {"history": [], "forecast": [], "note": "Not enough data to forecast."}

    daily["t"] = np.arange(len(daily))
    daily["weekday"] = daily["date"].dt.day_name()

    # Linear trend
    coeffs = np.polyfit(daily["t"], daily["revenue"], 1)
    trend = np.poly1d(coeffs)

    # Weekday seasonality index relative to trend
    daily["trend_val"] = trend(daily["t"])
    daily["residual_ratio"] = np.where(daily["trend_val"] != 0, daily["revenue"] / daily["trend_val"], 1)
    weekday_index = daily.groupby("weekday")["residual_ratio"].mean().to_dict()
    default_index = 1.0

    last_t = daily["t"].max()
    last_date = daily["date"].max()
    resid_std = (daily["revenue"] - daily["trend_val"]).std()

    forecast_rows = []
    for i in range(1, horizon_days + 1):
        future_date = last_date + pd.Timedelta(days=i)
        t = last_t + i
        base = max(trend(t), 0)
        weekday = future_date.day_name()
        seasonal = weekday_index.get(weekday, default_index)
        predicted = max(base * seasonal, 0)
        forecast_rows.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "predictedRevenue": round(float(predicted), 2),
            "lowerBound": round(max(float(predicted - 1.28 * (resid_std or 0)), 0), 2),
            "upperBound": round(float(predicted + 1.28 * (resid_std or 0)), 2),
        })

    history_rows = daily.tail(60)[["date", "revenue"]].copy()
    history_rows["date"] = history_rows["date"].dt.strftime("%Y-%m-%d")

    # Rough order forecast: scale by historical avg order value
    total_rev = df["Revenue"].sum()
    total_orders = df["Order ID"].nunique()
    aov = total_rev / total_orders if total_orders else 1
    for row in forecast_rows:
        row["predictedOrders"] = round(row["predictedRevenue"] / aov, 1) if aov else 0

    return {
        "history": history_rows.rename(columns={"revenue": "revenue"}).to_dict(orient="records"),
        "forecast": forecast_rows,
        "note": "Linear trend + weekday seasonality index fit on daily revenue history.",
    }
