from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .utils import extract_text_from_pdf, clean_text
from .logic import run_semantic_match
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), jd_text: str = Form(...)):
    try:
        print(f"--- New Request Received ---")
        print(f"File Name: {file.filename}")
        
        # 1. Read File
        contents = await file.read()
        print("File read successfully.")

        # 2. Extract Text
        raw_text = extract_text_from_pdf(contents)
        if not raw_text:
            print("Error: PDF text extraction resulted in empty string.")
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        
        cleaned_resume = clean_text(raw_text)
        print("Text extracted and cleaned.")

        # 3. Logic & Matching
        print("Starting semantic match...")
        results = run_semantic_match(cleaned_resume, jd_text)
        print("Match complete.")

        return results

    except Exception as e:
        print("!!! BACKEND CRASH !!!")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))