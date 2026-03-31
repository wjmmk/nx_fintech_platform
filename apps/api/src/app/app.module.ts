import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OCRService } from './ocr.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, OCRService],
})
export class AppModule {}
