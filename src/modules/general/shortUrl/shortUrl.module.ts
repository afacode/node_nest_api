import { UniqueCode } from '@/entities/general/unique_code.entity';
import { UrlCodeMap } from '@/entities/general/url_code_map.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrlController } from './shortUrl.controller';
import { ShortUrlService } from './shortUrl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        UniqueCode,
        UrlCodeMap,
    ])
  ],
  controllers: [ShortUrlController],
  providers: [ShortUrlService],
  exports: [ShortUrlService],
})
export class ShortUrlModule {}