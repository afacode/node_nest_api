import { Injectable } from '@nestjs/common';

@Injectable()
export class GprcTestService {
  getHello(): string {
    return 'Hello World!';
  }
}
