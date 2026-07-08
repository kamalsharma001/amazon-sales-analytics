from fastapi import APIRouter, Query

import analytics
import insights
from data_loader import get_clean_data

router = APIRouter(tags=["overview"])


@router.get("/dashboard")
def dashboard():
    df = get_clean_data()
    return analytics.dashboard_summary(df)


@router.get("/sales-trend")
def sales_trend():
    df = get_clean_data()
    return analytics.sales_trend(df)


@router.get("/cancellation-analysis")
def cancellation_analysis():
    df = get_clean_data()
    return analytics.cancellation_analysis(df)


@router.get("/recommendations")
def recommendations():
    df = get_clean_data()
    return {"recommendations": insights.generate_recommendations(df)}


@router.get("/forecast")
def forecast(days: int = Query(30, ge=7, le=90)):
    df = get_clean_data()
    return insights.forecast_revenue(df, horizon_days=days)
