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


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Initialize Rate Limiter (Anti-Spam Shield)
limiter = Limiter(key_func=get_remote_address)

# Attach Rate Limiter to the app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://clean-flow-ai.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = 'temp_files'
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit
FILE_EXPIRY_SECONDS = 3600 # 1 hour expiry
os.makedirs(TEMP_DIR, exist_ok=True)

def cleanup_old_files():
    now = time.time()
    for f in os.listdir(TEMP_DIR):
        path = os.path.join(TEMP_DIR, f)
        if os.path.isfile(path) and now - os.path.getmtime(path) > FILE_EXPIRY_SECONDS:
            os.remove(path)

def delete_file(path: str):
    if os.path.exists(path):
        os.remove(path)

# Limit to 5 uploads per minute per user
@app.post('/clean')
@limiter.limit("5/minute")
async def clean_dataset(request: Request, file: UploadFile = File(...)):
    cleanup_old_files()

    filename_lower = file.filename.lower()
    
    if not (filename_lower.endswith('.csv') or filename_lower.endswith('.xlsx')):
        raise HTTPException(status_code=400, detail='Please upload a CSV or Excel (.xlsx) file.')

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail='File too large. Max 10 MB allowed.')

    try:
        # Read data based on file type
        if filename_lower.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents), on_bad_lines='skip')
        else:
            df = pd.read_excel(BytesIO(contents))

        if df.empty:
            raise HTTPException(status_code=400, detail='Dataset is empty.')

        initial_rows = len(df)

        # 🧹 THE COMPLETE CLEANING LOGIC
        df.drop_duplicates(inplace=True)
        df.dropna(how='any', inplace=True)
        
        # Automatically fix and optimize data types
        df = df.convert_dtypes()

        final_rows = len(df)

        file_id = str(uuid.uuid4())
        cleaned_filename = f'cleaned_{file_id}.csv'
        file_path = os.path.join(TEMP_DIR, cleaned_filename)
        
        # Always return as a clean CSV for machine learning
        df.to_csv(file_path, index=False)

        return {
            'filename': file.filename,
            'initial_rows': initial_rows,
            'final_rows': final_rows,
            'rows_cleaned': initial_rows - final_rows,
            'message': 'Dataset cleaned successfully!',
            'download_id': file_id,
            'download_url': f'/download/{file_id}'
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error processing file')

# Limit to 10 downloads per minute per user
@app.get('/download/{file_id}')
@limiter.limit("10/minute")
def download_cleaned_file(request: Request, file_id: str):
    file_path = os.path.join(TEMP_DIR, f'cleaned_{file_id}.csv')

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail='File not found or expired.')

    return FileResponse(
        path=file_path,
        filename='CleanFlow_Result.csv',
        media_type='text/csv',
        background=BackgroundTask(delete_file, file_path)
    )