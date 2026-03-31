import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { OCRService } from './ocr.service';
import { OCRResult } from '@fintech-platform/shared-models';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly ocrService: OCRService
  ) {}

  @Get('/')
  getData() {
    return this.appService.getData();
  }

  @Post('scan-invoice')
  @UseInterceptors(FileInterceptor('file'))
  async scanInvoice(@UploadedFile() file: Express.Multer.File): Promise<OCRResult> {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo o la clave no es "file"');
    }
    return this.ocrService.scanInvoice(file);
  }
}

