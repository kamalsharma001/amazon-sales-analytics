from fastapi import APIRouter

import analytics
from data_loader import get_clean_data

router = APIRouter(tags=["customers"])


@router.get("/customer-analysis")
def customer_analysis():
    df = get_clean_data()
    return analytics.customer_analysis(df)


@router.get("/fulfillment-analysis")
def fulfillment_analysis():
    df = get_clean_data()
    return {"methods": analytics.fulfillment_analysis(df)}
