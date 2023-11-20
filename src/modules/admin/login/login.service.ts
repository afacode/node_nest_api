import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';

@Injectable()
export class LoginService {
  constructor() {}

  async getRedisPermsById(id: number) {
    return 1;
  }
}
