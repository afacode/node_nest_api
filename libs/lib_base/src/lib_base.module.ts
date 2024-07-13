import { Module } from '@nestjs/common';
import { LibBaseService } from './lib_base.service';

@Module({
  providers: [LibBaseService],
  exports: [LibBaseService],
})
export class LibBaseModule {}
