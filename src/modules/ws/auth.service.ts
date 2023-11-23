import { SocketException } from '@/common/exceptions/socket.exception';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  checkUserAuthToken(token: string | string[] | undefined): {uid: number;} | never {
    if (isEmpty(token)) {
      throw new SocketException(11001);
    }
    try {
      // 挂载对象到当前请求上
      return this.jwtService.verify(Array.isArray(token) ? token[0] : token);
    } catch (error) {
      // 无法通过token校验
      throw new SocketException(11001);
    }
  }
}
