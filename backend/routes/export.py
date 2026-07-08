import io

import pandas as pd
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

import analytics
from data_loader import get_clean_data

router = APIRouter(tags=["export"])


@router.get("/export/csv")
def export_csv():
    df = get_clean_data()
    summary = pd.DataFrame(analytics.category_analysis(df))
    buf = io.StringIO()
    summary.to_csv(buf, index=False)
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=category_summary.csv"},
    )


@router.get("/export/excel")
def export_excel():
    df = get_clean_data()
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        pd.DataFrame(analytics.category_analysis(df)).to_excel(writer, sheet_name="Category", index=False)
        pd.DataFrame(analytics.state_analysis(df)).to_excel(writer, sheet_name="State", index=False)
        pd.DataFrame([analytics.dashboard_summary(df)]).to_excel(writer, sheet_name="Summary", index=False)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sales_report.xlsx"},
    )
