import { Controller, Get, Inject } from '@nestjs/common';
import { GprcTestService } from './gprc_test.service';
import { LibBaseService } from '@app/lib_base';

@Controller()
export class GprcTestController {
  constructor(private readonly gprcTestService: GprcTestService) {}

  @Get()
  getHello(): string {
    return this.gprcTestService.getHello();
  }

  @Inject(LibBaseService) libBaseService: LibBaseService;
  @Get('test')
  test(): string {
    return this.libBaseService.getLibDemo();
  }
}
