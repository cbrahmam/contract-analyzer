import pytest

from backend.services.pdf_parser import extract_text
from backend.services.doc_parser import extract_text_from_docx


def test_pdf_parser_rejects_invalid_bytes():
    with pytest.raises(ValueError, match="Unable to open"):
        extract_text(b"not a pdf")


def test_pdf_parser_rejects_empty():
    with pytest.raises(ValueError):
        extract_text(b"")


def test_docx_parser_rejects_invalid_bytes():
    with pytest.raises(ValueError, match="Unable to open"):
        extract_text_from_docx(b"not a docx")
