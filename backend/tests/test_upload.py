import io
from pathlib import Path

from starlette.testclient import TestClient

from backend.main import app

client = TestClient(app)

SAMPLE_DIR = Path(__file__).parent.parent / "sample_contracts"


def test_upload_rejects_unsupported_type():
    res = client.post(
        "/api/upload",
        files={"file": ("test.txt", b"hello world", "text/plain")},
    )
    assert res.status_code == 400
    assert "Only PDF and DOCX" in res.json()["detail"]


def test_upload_rejects_empty_file():
    res = client.post(
        "/api/upload",
        files={"file": ("empty.pdf", b"", "application/pdf")},
    )
    assert res.status_code == 400
    assert "empty" in res.json()["detail"].lower()


def test_upload_pdf_success():
    sample = SAMPLE_DIR / "sample-nda.pdf"
    if not sample.exists():
        return
    with open(sample, "rb") as f:
        res = client.post(
            "/api/upload",
            files={"file": ("sample-nda.pdf", f, "application/pdf")},
        )
    assert res.status_code == 200
    data = res.json()
    assert data["filename"] == "sample-nda.pdf"
    assert data["page_count"] >= 1
    assert len(data["text_preview"]) > 0


def test_analyze_missing_file():
    res = client.post("/api/analyze", json={"filename": "nonexistent.pdf"})
    assert res.status_code == 404
