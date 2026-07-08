"""
main.py
-------
Entry point for the Amazon Sales Analytics API.
Run locally with:
    uvicorn main:app --reload --port 8000
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import customers, export, geography, overview, products

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app = FastAPI(
    title="Amazon Sales Analytics API",
    description="Backend for the Amazon Sales BI Dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(overview.router)
app.include_router(products.router)
app.include_router(geography.router)
app.include_router(customers.router)
app.include_router(export.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "amazon-sales-analytics-api"}


@app.get("/health")
def health():
    return {"status": "healthy"}
