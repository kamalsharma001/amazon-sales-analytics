"""
data_loader.py
--------------
Loads the raw Amazon Sale Report CSV and produces a cleaned, analysis-ready
DataFrame. The original CSV on disk is never modified - all cleaning happens
in-memory on a copy, and the result is cached (module-level singleton) so the
~129k row file is only parsed and cleaned once per process lifetime.
"""

import os
from functools import lru_cache

import numpy as np
import pandas as pd

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "Amazon_Sale_Report.csv")


def _clean(df_raw: pd.DataFrame) -> pd.DataFrame:
    """Apply all preprocessing steps to a raw copy of the dataset."""
    df = df_raw.copy()

    # --- Column name normalization -----------------------------------
    df.columns = [c.strip() for c in df.columns]

    # --- Drop fully-empty / unneeded helper columns from the source file
    for junk_col in ["Unnamed: 22", "New", "PendingS", "index"]:
        if junk_col in df.columns:
            df = df.drop(columns=[junk_col])

    # --- Duplicates -----------------------------------------------------
    df = df.drop_duplicates()

    # --- Dates ------------------------------------------------------------
    # Source file mixes two date formats (MM-DD-YY and MM-DD-YYYY) - parse
    # each row against whichever format matches rather than dropping the rest.
    date_raw = df["Date"].astype(str).str.strip()
    parsed_short = pd.to_datetime(date_raw, format="%m-%d-%y", errors="coerce")
    parsed_long = pd.to_datetime(date_raw, format="%m-%d-%Y", errors="coerce")
    df["Date"] = parsed_short.fillna(parsed_long)
    df = df.dropna(subset=["Date"])

    df["Year"] = df["Date"].dt.year
    df["Month"] = df["Date"].dt.month_name()
    df["MonthNum"] = df["Date"].dt.month
    df["Weekday"] = df["Date"].dt.day_name()
    df["Quarter"] = "Q" + df["Date"].dt.quarter.astype(str)

    # --- Numeric fields ---------------------------------------------------
    df["Qty"] = pd.to_numeric(df["Qty"], errors="coerce").fillna(0)
    df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce")

    # Rows with no amount are typically cancelled orders w/ no charge -> treat as 0 revenue
    df["Amount"] = df["Amount"].fillna(0)

    # --- Categorical cleanup ------------------------------------------------
    text_cols = ["Status", "Fulfilment", "Sales Channel", "ship-service-level",
                 "Category", "Size", "Courier Status", "ship-city", "ship-state",
                 "ship-country", "currency"]
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace({"nan": np.nan, "": np.nan})

    # Normalize state names (title case, strip stray punctuation)
    if "ship-state" in df.columns:
        df["ship-state"] = (
            df["ship-state"].str.title().str.replace(r"[^A-Za-z\s&]", "", regex=True).str.strip()
        )
    if "ship-city" in df.columns:
        df["ship-city"] = df["ship-city"].str.title().str.strip()

    # --- B2B flag -----------------------------------------------------------
    if "B2B" in df.columns:
        df["B2B"] = df["B2B"].astype(bool)
        df["CustomerType"] = np.where(df["B2B"], "B2B", "B2C")

    # --- Cancellation flag ----------------------------------------------------
    df["IsCancelled"] = df["Status"].str.contains("Cancel", case=False, na=False)

    # --- Revenue metrics --------------------------------------------------
    df["Revenue"] = np.where(df["IsCancelled"], 0, df["Amount"])
    df["UnitPrice"] = np.where(df["Qty"] > 0, df["Amount"] / df["Qty"], 0)

    # Drop rows missing essential dimensions for analysis
    df = df.dropna(subset=["Category"])

    return df.reset_index(drop=True)


@lru_cache(maxsize=1)
def get_clean_data() -> pd.DataFrame:
    """Return the cleaned dataset, computed once and cached for the process."""
    raw = pd.read_csv(DATA_PATH, low_memory=False)
    return _clean(raw)
