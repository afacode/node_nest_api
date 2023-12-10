import { Module } from '@nestjs/common';
import { BiliDownloadController } from './biliDownload.controller';

@Module({
  imports: [],
  controllers: [BiliDownloadController],
})
export class BiliDownloadModule {}