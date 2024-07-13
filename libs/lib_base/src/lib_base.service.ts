import { Injectable } from '@nestjs/common';

@Injectable()
export class LibBaseService {
  getLibDemo(): string {
    return 'getLibDemo';
  }
}
