import { Module } from '@nestjs/common';
import { ShortUrlModule } from './shortUrl/shortUrl.module';

@Module({
  imports: [
    ShortUrlModule,
  ],
  providers: [],
  exports: [ShortUrlModule],
})
export class GeneralModule {}
