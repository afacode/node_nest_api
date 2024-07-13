import { Module } from '@nestjs/common';
import { GprcTestController } from './gprc_test.controller';
import { GprcTestService } from './gprc_test.service';
import { LibBaseModule } from '@app/lib_base';

@Module({
  imports: [LibBaseModule],
  controllers: [GprcTestController],
  providers: [GprcTestService],
})
export class GprcTestModule {}
