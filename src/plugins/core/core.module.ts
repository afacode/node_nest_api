import { Module } from '@nestjs/common';
import { CoreService } from './core.service';

@Module({
  controllers: [],
  providers: [CoreService],
})
export class CoreModule {}
