import fitz


def extract_text(file_bytes: bytes) -> dict:
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception:
        raise ValueError("Unable to open file. It may be corrupted or not a valid PDF.")

    if doc.is_encrypted:
        doc.close()
        raise ValueError("This PDF is encrypted/password-protected. Please provide an unprotected version.")

    pages: list[str] = []
    total_text = ""

    for i, page in enumerate(doc):
        text = page.get_text()
        pages.append(text)
        total_text += f"\n--- Page {i + 1} ---\n{text}"

    doc.close()

    stripped = total_text.strip()
    if not stripped or len(stripped.replace("-", "").replace("Page", "").strip()) < 10:
        raise ValueError(
            "No readable text found in this PDF. It may contain only images or scanned content."
        )

    return {
        "text": total_text.strip(),
        "page_count": len(pages),
    }
