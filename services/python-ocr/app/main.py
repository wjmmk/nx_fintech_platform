from fastapi import FastAPI, UploadFile, HTTPException
import pytesseract
from PIL import Image
import io
import logging
import os

# Configure tesseract path for Windows
tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(tesseract_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

app = FastAPI()

@app.post("/scan-invoice")
async def scan_invoice(file: UploadFile):
    # 1. Validación básica de tipo
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo no es una imagen")

    try:
        # 2. Leer los bytes primero para no bloquear el puntero del archivo
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # 3. Opcional: Redimensionar o convertir a escala de grises para mejorar velocidad
        image = image.convert('L')

        # 4. Ejecutar OCR (Tesseract es pesado, esto toma tiempo)
        text = pytesseract.image_to_string(image)

        return {
            "raw_text": text,
        }
    except Exception as e:
        logging.error(f"Error en OCR: {str(e)}")
        raise HTTPException(status_code=500, detail="Error procesando la imagen")
    finally:
        # 5. SIEMPRE cerrar el archivo para liberar RAM
        await file.close()
