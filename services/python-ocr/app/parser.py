import re

def extract_total(text: str) -> str:
    # Basic regex for total (common patterns)
    match = re.search(r"(?i)total[:\s]*\$?\s*([\d.,]+)", text)
    return match.group(1) if match else "0.00"

def extract_nit(text: str) -> str:
    # Basic regex for NIT (often found in Colombian/Latin invoices)
    match = re.search(r"(?i)NIT[:\s]*([\d-]+)", text)
    return match.group(1) if match else "Not found"
