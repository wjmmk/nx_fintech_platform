import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData = require('form-data'); // biblioteca para manipular la image enviada del Backend.
import { OCRResult } from '@fintech-platform/shared-models';

@Injectable()
export class OCRService {
  private readonly pythonOcrUrl = 'http://localhost:3000/api/scan-invoice';

  async scanInvoice(file: Express.Multer.File): Promise<OCRResult> {
    const formData = new FormData();

    // 2. Pasamos el buffer directamente.
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await axios.post<OCRResult>(this.pythonOcrUrl, formData, {
        // 3. ¡IMPORTANTE! Debes pasar los headers del formData
        // Esto le dice a Axios los límites (bounds) del multipart.
        headers: {
          ...formData.getHeaders(),
        },
        // EVITA EL HANG: Si en 30 seg no responde, aborta la petición
        timeout: 30000,
        // EVITA EL ERROR DE TAMAÑO: Permite enviar/recibir archivos grandes
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      return response.data;
    } catch (error) {
      console.error('Error calling Python OCR service:', error);
      throw new Error('Failed to process invoice OCR');
    }
  }
}
