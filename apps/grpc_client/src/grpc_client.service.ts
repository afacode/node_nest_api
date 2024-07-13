import { Injectable } from '@nestjs/common';

@Injectable()
export class GrpcClientService {
  getHello(): string {
    return 'Hello World!';
  }
}
