# from fastapi import FastAPI, UploadFile, File, HTTPException, Request
# from fastapi.responses import FileResponse
# from fastapi.middleware.cors import CORSMiddleware
# from starlette.background import BackgroundTask
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
# import pandas as pd
# import uuid
# import os
# import time
# from io import BytesIO


# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Initialize Rate Limiter (Anti-Spam Shield)
# limiter = Limiter(key_func=get_remote_address)

# # Attach Rate Limiter to the app
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://clean-flow-ai.vercel.app",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# TEMP_DIR = 'temp_files'
# MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit
# FILE_EXPIRY_SECONDS = 3600 # 1 hour expiry
# os.makedirs(TEMP_DIR, exist_ok=True)

# def cleanup_old_files():
#     now = time.time()
#     for f in os.listdir(TEMP_DIR):
#         path = os.path.join(TEMP_DIR, f)
#         if os.path.isfile(path) and now - os.path.getmtime(path) > FILE_EXPIRY_SECONDS:
#             os.remove(path)

# def delete_file(path: str):
#     if os.path.exists(path):
#         os.remove(path)

# # Limit to 5 uploads per minute per user
# @app.post('/clean')
# @limiter.limit("5/minute")
# async def clean_dataset(request: Request, file: UploadFile = File(...)):
#     cleanup_old_files()

#     filename_lower = file.filename.lower()
    
#     if not (filename_lower.endswith('.csv') or filename_lower.endswith('.xlsx')):
#         raise HTTPException(status_code=400, detail='Please upload a CSV or Excel (.xlsx) file.')

#     contents = await file.read()
#     if len(contents) > MAX_FILE_SIZE:
#         raise HTTPException(status_code=413, detail='File too large. Max 10 MB allowed.')

#     try:
#         # Read data based on file type
#         if filename_lower.endswith('.csv'):
#             df = pd.read_csv(BytesIO(contents), on_bad_lines='skip')
#         else:
#             df = pd.read_excel(BytesIO(contents))

#         if df.empty:
#             raise HTTPException(status_code=400, detail='Dataset is empty.')

#         initial_rows = len(df)

#         # 🧹 THE COMPLETE CLEANING LOGIC
#         df.drop_duplicates(inplace=True)
#         df.dropna(how='any', inplace=True)
        
#         # Automatically fix and optimize data types
#         df = df.convert_dtypes()

#         final_rows = len(df)

#         file_id = str(uuid.uuid4())
#         cleaned_filename = f'cleaned_{file_id}.csv'
#         file_path = os.path.join(TEMP_DIR, cleaned_filename)
        
#         # Always return as a clean CSV for machine learning
#         df.to_csv(file_path, index=False)

#         return {
#             'filename': file.filename,
#             'initial_rows': initial_rows,
#             'final_rows': final_rows,
#             'rows_cleaned': initial_rows - final_rows,
#             'message': 'Dataset cleaned successfully!',
#             'download_id': file_id,
#             'download_url': f'/download/{file_id}'
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f'Error processing file')

# # Limit to 10 downloads per minute per user
# @app.get('/download/{file_id}')
# @limiter.limit("10/minute")
# def download_cleaned_file(request: Request, file_id: str):
#     file_path = os.path.join(TEMP_DIR, f'cleaned_{file_id}.csv')

#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail='File not found or expired.')

#     return FileResponse(
#         path=file_path,
#         filename='CleanFlow_Result.csv',
#         media_type='text/csv',
#         background=BackgroundTask(delete_file, file_path)
#     )



from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTask
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import pandas as pd
import uuid
import os
import time

from io import BytesIO
from dotenv import load_dotenv
from groq import Groq

# ==================================================
# Load Environment Variables
# ==================================================
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
try:
    client = Groq(api_key=groq_api_key) if groq_api_key else None
except Exception as e:
    print("Groq init error:", e)
    client = None

# ==================================================
# App Init
# ==================================================
app = FastAPI()

# ==================================================
# Rate Limiter
# ==================================================
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ==================================================
# CORS
# ==================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://clean-flow-ai.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# Config
# ==================================================
TEMP_DIR = "temp_files"
MAX_FILE_SIZE = 10 * 1024 * 1024
FILE_EXPIRY_SECONDS = 3600

os.makedirs(TEMP_DIR, exist_ok=True)

# ==================================================
# Helpers
# ==================================================
def cleanup_old_files():
    now = time.time()

    for f in os.listdir(TEMP_DIR):
        path = os.path.join(TEMP_DIR, f)

        if (
            os.path.isfile(path)
            and now - os.path.getmtime(path) > FILE_EXPIRY_SECONDS
        ):
            os.remove(path)


def delete_file(path: str):
    if os.path.exists(path):
        os.remove(path)


# ==================================================
# Root Route
# ==================================================
@app.get("/")
def home():
    return {"message": "CleanFlow AI API is running!"}


# ==================================================
# Clean Route
# ==================================================
@app.post("/clean")
@limiter.limit("5/minute")
def clean_dataset(request: Request, file: UploadFile = File(...)):
    cleanup_old_files()

    filename_lower = file.filename.lower()

    # File type validation
    if not (
        filename_lower.endswith(".csv")
        or filename_lower.endswith(".xlsx")
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV or Excel (.xlsx) file."
        )

    # Read uploaded file
    contents = file.file.read()

    # File size validation
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Max 10 MB allowed."
        )

    try:
        # Load dataset
        if filename_lower.endswith(".csv"):
            df = pd.read_csv(
                BytesIO(contents),
                on_bad_lines="skip"
            )
        else:
            df = pd.read_excel(BytesIO(contents))

        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="Dataset is empty."
            )
        initial_rows = len(df)

        df = df.replace(r'^\s*$', pd.NA, regex=True)

        # ==========================================
        # 🧹 REFINED CLEANING LOGIC
        # ==========================================

        # 1. Standardize column names
        df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace(r'[^\w\s]', '', regex=True)

        # 2. Remove duplicates
        df.drop_duplicates(inplace=True)

        # 3. Remove columns with very high missingness
        COL_MISSING_THRESHOLD = 0.7
        df = df.loc[:, df.isnull().mean() < COL_MISSING_THRESHOLD]

        # 4. Remove only rows that are almost entirely empty
        ROW_MISSING_THRESHOLD = 0.8
        df = df[df.isnull().mean(axis=1) <= ROW_MISSING_THRESHOLD]

        if df.empty:
            raise HTTPException(status_code=400, detail="Dataset is empty after removing sparse rows/columns.")

        # 5. Numeric columns: fill median, clip outliers
        num_cols = df.select_dtypes(include="number").columns
        for col in num_cols:
            median_val = df[col].median()
            if pd.isna(median_val):
                median_val = 0
            df[col] = df[col].fillna(median_val)

            if df[col].nunique() > 1:
                Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
                df[col] = df[col].clip(lower=lower, upper=upper)

        # 6. Categorical columns: fill mode or 'MISSING'
        cat_cols = df.select_dtypes(exclude="number").columns
        for col in cat_cols:
            mode_vals = df[col].mode()
            if not mode_vals.empty:
                df[col] = df[col].fillna(mode_vals[0])
            else:
                df[col] = df[col].fillna("MISSING")

        # 7. Drop rows that are completely empty
        df.dropna(how="all", inplace=True)

        # 8. Optimize dtypes
        for col in df.columns:
            if pd.api.types.is_float_dtype(df[col]):
                df[col] = pd.to_numeric(df[col], downcast='float')
            elif pd.api.types.is_integer_dtype(df[col]):
                df[col] = pd.to_numeric(df[col], downcast='integer')
            elif (pd.api.types.is_object_dtype(df[col]) or pd.api.types.is_string_dtype(df[col])):
                if df[col].nunique() < 100:
                    df[col] = df[col].astype('category')

        df = df.convert_dtypes()

        final_rows = len(df)
        rows_cleaned = initial_rows - final_rows

        # ==========================================
        # 🧾 Lightweight Data Profile
        # ==========================================
        profile = {
            "total_columns": len(df.columns),
            "numeric_columns": len(num_cols),
            "categorical_columns": len(cat_cols),
            "memory_usage_mb": round(df.memory_usage(deep=True).sum() / 1024**2, 2),
            "remaining_missing_cells": int(df.isnull().sum().sum())
        }

        # ==========================================
        # ⚠️ Generate Warnings for AI Report
        # ==========================================
        warnings = []

        high_missing = df.columns[df.isnull().mean() > 0.3].tolist()
        if high_missing:
            warnings.append(f"Columns with >30% missing values (kept): {', '.join(high_missing)}")

        high_card_cols = []
        for col in df.select_dtypes(include=['object', 'category']).columns:
            if df[col].nunique() > 50:
                high_card_cols.append(col)
        if high_card_cols:
            warnings.append(f"High‑cardinality columns (>50 unique values): {', '.join(high_card_cols)}")

        constant_cols = df.columns[df.nunique() <= 1].tolist()
        if constant_cols:
            warnings.append(f"Constant columns (only one value): {', '.join(constant_cols)}")

        warnings_text = "\n".join([f"- {w}" for w in warnings]) if warnings else "No major warnings detected."

        # ==========================================
        # AI Insights (Groq)
        # ==========================================
        column_names = ", ".join(df.columns.tolist()[:20])

        prompt = f"""
        You are an expert data science assistant for CleanFlow AI.

        A dataset has been pre-cleaned automatically. Below are the details:

        - Columns: {column_names}
        - Initial rows: {initial_rows}
        - Final rows after cleaning: {final_rows}
        - Rows removed: {rows_cleaned}
        - Profile: {profile['total_columns']} columns ({profile['numeric_columns']} numeric, {profile['categorical_columns']} categorical), memory: {profile['memory_usage_mb']} MB.

        Cleaning steps applied:
        - Standardized column names
        - Removed duplicates
        - Dropped columns with >70% missing values
        - Dropped rows with >80% missing values
        - Filled numeric missing with median; outliers clipped via IQR
        - Filled categorical missing with mode (or 'MISSING')
        - Optimized data types

        ⚠️ Warnings generated during cleaning:
        {warnings_text}

        Provide a **very concise, professional** response (3-4 bullet points) that includes:
        1. A brief confirmation that the dataset is now clean and ready for initial modeling.
        2. **One or two specific, actionable next steps** the user should take to make the data fully ML-ready (e.g., scaling numeric features, encoding categoricals, handling remaining missing values, addressing high cardinality or skewness).
        3. (Optional) Any data quality issue from the warnings that deserves immediate attention.

        Keep it friendly and helpful.
        IMPORTANT: Do NOT use Markdown formatting. Use plain text only. No asterisks, no hyphens. Use simple line breaks.
        """

        # Default fallback
        ai_report = "Dataset cleaned successfully."

        if client:
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    model="llama-3.1-8b-instant",
                )

                ai_report = chat_completion.choices[0].message.content.strip()

            except Exception as e:
                print("GROQ ERROR:", repr(e))
                ai_report = (
                    "Dataset cleaned successfully. "
                    "AI insights are temporarily unavailable."
                )
        else:
            ai_report = (
                "Dataset cleaned successfully. "
                "AI engine is not configured."
            )

        # ==========================================
        # Save Clean File
        # ==========================================
        file_id = str(uuid.uuid4())
        cleaned_filename = f"cleaned_{file_id}.csv"
        file_path = os.path.join(TEMP_DIR, cleaned_filename)

        df.to_csv(file_path, index=False)

        # ==========================================
        # Response
        # ==========================================
        return {
            "filename": file.filename,
            "initial_rows": initial_rows,
            "final_rows": final_rows,
            "profile": profile,
            "rows_cleaned": rows_cleaned,
            "ai_report": ai_report,
            "download_id": file_id,
            "download_url": f"/download/{file_id}",
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


# ==================================================
# Download Route
# ==================================================
@app.get("/download/{file_id}")
@limiter.limit("10/minute")
def download_cleaned_file(request: Request, file_id: str):
    file_path = os.path.join(
        TEMP_DIR,
        f"cleaned_{file_id}.csv"
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found or expired."
        )

    return FileResponse(
        path=file_path,
        filename="CleanFlow_Result.csv",
        media_type="text/csv",
        background=BackgroundTask(delete_file, file_path),
    )