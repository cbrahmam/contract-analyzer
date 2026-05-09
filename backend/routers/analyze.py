import os
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile

from backend.models.schemas import UploadResponse
from backend.services.pdf_parser import extract_text

router = APIRouter()

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"application/pdf"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile) -> UploadResponse:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 20 MB limit.")

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        result = extract_text(contents)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    safe_filename = file.filename.replace(os.sep, "_")
    pdf_path = UPLOAD_DIR / safe_filename
    txt_path = UPLOAD_DIR / f"{safe_filename}.txt"

    pdf_path.write_bytes(contents)
    txt_path.write_text(result["text"], encoding="utf-8")

    return UploadResponse(
        filename=safe_filename,
        page_count=result["page_count"],
        text_preview=result["text"][:500],
    )
