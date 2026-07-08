from fastapi import APIRouter, Query

import analytics
from data_loader import get_clean_data

router = APIRouter(tags=["geography"])


@router.get("/state-analysis")
def state_analysis():
    df = get_clean_data()
    return {"states": analytics.state_analysis(df)}


@router.get("/city-analysis")
def city_analysis(limit: int = Query(30, ge=1, le=200)):
    df = get_clean_data()
    return {"cities": analytics.city_analysis(df, limit=limit)}
