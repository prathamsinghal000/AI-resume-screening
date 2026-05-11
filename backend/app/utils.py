import fitz  # This is the PyMuPDF library

def extract_text_from_pdf(pdf_bytes):
    """Extracts all text from a PDF byte stream."""
    text = ""
    # Open the PDF from memory
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def clean_text(text):
    """Standardizes text for better NLP matching."""
    # Convert to lowercase
    text = text.lower()
    # Replace newlines with spaces
    text = text.replace("\n", " ")
    # Remove extra whitespace
    text = " ".join(text.split())
    return text