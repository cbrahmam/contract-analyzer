import os
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import FileResponse

from backend.models.schemas import AnalysisResult, AnalyzeRequest, CompareRequest, UploadResponse
from backend.services.ai_analyzer import analyze_contract
from backend.services.ai_comparator import compare_contracts
from backend.services.doc_parser import extract_text_from_docx
from backend.services.pdf_parser import extract_text

router = APIRouter()

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

SAMPLE_DIR = Path(__file__).parent.parent / "sample_contracts"

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile) -> UploadResponse:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are accepted.")

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 20 MB limit.")

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        if file.content_type == "application/pdf":
            result = extract_text(contents)
        else:
            result = extract_text_from_docx(contents)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    safe_filename = file.filename.replace(os.sep, "_")
    pdf_path = UPLOAD_DIR / safe_filename
    txt_path = UPLOAD_DIR / f"{safe_filename}.txt"

    pdf_path.write_bytes(contents)
    txt_path.write_text(result["text"], encoding="utf-8")

    word_count = len(result["text"].split())
    reading_time = max(1, round(word_count / 200))

    return UploadResponse(
        filename=safe_filename,
        page_count=result["page_count"],
        text_preview=result["text"][:500],
        word_count=word_count,
        reading_time_minutes=reading_time,
    )


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_document(request: AnalyzeRequest) -> AnalysisResult:
    txt_path = UPLOAD_DIR / f"{request.filename}.txt"

    if not txt_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"No uploaded document found for '{request.filename}'. Please upload the document first.",
        )

    text = txt_path.read_text(encoding="utf-8")

    try:
        return analyze_contract(text)
    except RuntimeError as e:
        status = 503 if "not configured" in str(e) else 502
        raise HTTPException(status_code=status, detail=str(e))


@router.post("/compare")
async def compare_documents(request: CompareRequest):
    txt_a = UPLOAD_DIR / f"{request.filename_a}.txt"
    txt_b = UPLOAD_DIR / f"{request.filename_b}.txt"

    if not txt_a.exists():
        raise HTTPException(status_code=404, detail=f"Document A '{request.filename_a}' not found. Upload it first.")
    if not txt_b.exists():
        raise HTTPException(status_code=404, detail=f"Document B '{request.filename_b}' not found. Upload it first.")

    text_a = txt_a.read_text(encoding="utf-8")
    text_b = txt_b.read_text(encoding="utf-8")

    try:
        return compare_contracts(text_a, text_b)
    except RuntimeError as e:
        status = 503 if "not configured" in str(e) else 502
        raise HTTPException(status_code=status, detail=str(e))


@router.get("/sample")
async def get_sample_document():
    sample_path = SAMPLE_DIR / "sample-nda.pdf"
    if not sample_path.exists():
        raise HTTPException(status_code=404, detail="Sample document not found.")
    return FileResponse(
        sample_path,
        media_type="application/pdf",
        filename="sample-nda.pdf",
    )
