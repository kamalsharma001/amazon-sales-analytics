"""
data_loader.py
--------------
Loads the raw Amazon Sale Report CSV and produces a cleaned, analysis-ready
DataFrame. Optimized for low-memory environments (under 512MB RAM) by:
1. Loading only the required columns (usecols).
2. Specifying memory-efficient datatypes during CSV load.
3. Performing in-place data cleaning to avoid copying datasets.
4. Downcasting numeric fields and using 'category' types for low-cardinality strings.
"""

import os
from functools import lru_cache

import numpy as np
import pandas as pd

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "Amazon_Sale_Report.csv")


@lru_cache(maxsize=1)
def get_clean_data() -> pd.DataFrame:
    """Return the cleaned dataset, optimized for low memory usage and cached."""
    # 1. Define columns actually needed for analytics
    usecols = [
        "Order ID", "Date", "Status", "Fulfilment", "Sales Channel", 
        "ship-service-level", "Category", "Size", "Courier Status", 
        "Qty", "currency", "Amount", "ship-city", "ship-state", 
        "ship-country", "B2B"
    ]
    
    # 2. Map optimal datatypes for initial load
    dtypes = {
        "Order ID": "string",
        "Status": "category",
        "Fulfilment": "category",
        "Sales Channel": "category",
        "ship-service-level": "category",
        "Category": "category",
        "Size": "category",
        "Courier Status": "category",
        "Qty": "float32",
        "Amount": "float32",
        "currency": "category",
        "ship-city": "string",
        "ship-state": "string",
        "ship-country": "category",
        "B2B": "object"
    }
    
    # 3. Read the CSV using memory-efficient settings
    df = pd.read_csv(
        DATA_PATH,
        usecols=usecols,
        dtype=dtypes,
        low_memory=False
    )
    
    # 4. Clean IN-PLACE (do not copy df) to minimize peak RAM usage
    # Normalize column names
    df.columns = [c.strip() for c in df.columns]
    
    # Drop duplicates
    df.drop_duplicates(inplace=True)
    
    # Parse dates (handles mixed format MM-DD-YY and MM-DD-YYYY)
    date_raw = df["Date"].astype(str).str.strip()
    parsed_short = pd.to_datetime(date_raw, format="%m-%d-%y", errors="coerce")
    parsed_long = pd.to_datetime(date_raw, format="%m-%d-%Y", errors="coerce")
    df["Date"] = parsed_short.fillna(parsed_long)
    df.dropna(subset=["Date"], inplace=True)
    
    # Downcast date attributes
    df["Year"] = df["Date"].dt.year.astype("int16")
    df["Month"] = df["Date"].dt.month_name().astype("category")
    df["MonthNum"] = df["Date"].dt.month.astype("int8")
    df["Weekday"] = df["Date"].dt.day_name().astype("category")
    df["Quarter"] = ("Q" + df["Date"].dt.quarter.astype(str)).astype("category")
    
    # Downcast numeric metrics
    df["Qty"] = df["Qty"].fillna(0).astype("int32")
    df["Amount"] = df["Amount"].fillna(0.0).astype("float32")
    
    # Clean text columns
    text_cols = ["Status", "Fulfilment", "Sales Channel", "ship-service-level",
                 "Category", "Size", "Courier Status", "ship-city", "ship-state",
                 "ship-country", "currency"]
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace({"nan": np.nan, "": np.nan})
            df[col] = df[col].astype("category")
            
    # Normalize state and city names, cast to category
    if "ship-state" in df.columns:
        df["ship-state"] = (
            df["ship-state"]
            .str.title()
            .str.replace(r"[^A-Za-z\s&]", "", regex=True)
            .str.strip()
            .astype("category")
        )
    if "ship-city" in df.columns:
        df["ship-city"] = df["ship-city"].str.title().str.strip().astype("category")
        
    # Process B2B and CustomerType
    if "B2B" in df.columns:
        df["B2B"] = df["B2B"].fillna(False).astype(bool)
        df["CustomerType"] = np.where(df["B2B"], "B2B", "B2C")
        df["CustomerType"] = df["CustomerType"].astype("category")
        
    # Cancellation flag
    df["IsCancelled"] = df["Status"].str.contains("Cancel", case=False, na=False).astype(bool)
    
    # Add revenue metrics and unit price
    df["Revenue"] = np.where(df["IsCancelled"], 0.0, df["Amount"]).astype("float32")
    df["UnitPrice"] = np.where(df["Qty"] > 0, df["Amount"] / df["Qty"], 0.0).astype("float32")
    
    # Drop rows missing Category and reset index
    df.dropna(subset=["Category"], inplace=True)
    df.reset_index(drop=True, inplace=True)
    
    # Ensure Category is Category type
    df["Category"] = df["Category"].astype("category")
    
    return df
