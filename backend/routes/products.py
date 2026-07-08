from fastapi import APIRouter, Query

import analytics
from data_loader import get_clean_data

router = APIRouter(tags=["products"])


@router.get("/category-analysis")
def category_analysis():
    df = get_clean_data()
    return {"categories": analytics.category_analysis(df)}


@router.get("/size-analysis")
def size_analysis():
    df = get_clean_data()
    return {"sizes": analytics.size_analysis(df)}


@router.get("/top-products")
def top_products(limit: int = Query(20, ge=1, le=100)):
    df = get_clean_data()
    return {"products": analytics.top_products(df, limit=limit)}
