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

ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
]

allow_credentials = True
if "*" in ALLOWED_ORIGINS or "" in ALLOWED_ORIGINS:
    allow_credentials = False

app = FastAPI(
    title="Amazon Sales Analytics API",
    description="Backend for the Amazon Sales BI Dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=allow_credentials,
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
