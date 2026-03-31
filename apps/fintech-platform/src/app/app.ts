import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OCRResult } from '@fintech-platform/shared-models';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'fintech-platform';
  selectedFile: File | null = null;
  scanResult: OCRResult | null = null;
  loading = false;
  error: string | null = null;
  private http = inject(HttpClient);


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.error = null;
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.loading = true;
    this.error = null;
    this.scanResult = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Call the NestJS API
    this.http.post<OCRResult>('http://localhost:3000/api/scan-invoice', formData).subscribe({
      next: (result) => {
        this.scanResult = result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error scanning invoice:', err);
        this.error = 'Ocurrió un error al procesar la factura.';
        this.loading = false;
      },
    });
  }
}
