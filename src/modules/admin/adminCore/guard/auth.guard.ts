import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import {
  ADMIN_PREFIX,
  ADMIN_USER,
  PERMISSION_OPTIONAL_KEY_METADATA,
  AUTHORIZE_KEY_METADATA,
} from 'src/modules/admin/admin.constants';
import { ApiException } from '@/common/exceptions/api.exception';
import { LoginService } from '../../login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
    const authorize = this.reflector.get<boolean>(AUTHORIZE_KEY_METADATA, context.getHandler());

    if (authorize) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const url = request.url;
    const path = url.split('?')[0];
    const token = request.headers['authorization'] as string;

    if (isEmpty(token)) {
      // 登录无效或无权限访问
      throw new ApiException(11001);
    }

    try {
      const user = await this.jwtService.verifyAsync(token);
      request[ADMIN_USER] = user;
    } catch (error) {
      // token失效
      throw new ApiException(11001);
    }

    if (isEmpty(request[ADMIN_USER])) {
      throw new ApiException(11001);
    }

    // 注册该注解，Api则放行检测
    const notNeedPerm = this.reflector.get<boolean>(
      PERMISSION_OPTIONAL_KEY_METADATA,
      context.getHandler(),
    );
    // Token校验身份通过，判断是否需要权限的url，不需要权限则pass
    if (notNeedPerm) {
      return true;
    }

    const perms: string = await this.loginService.getRedisPermsById(request[ADMIN_USER].uid);
    // 安全判空
    if (isEmpty(perms)) {
      throw new ApiException(11001);
    }

    const array = JSON.parse(perms) as string[];
    // 将sys:admin:user等转换成sys/admin/user
    const permArray: string[] = (JSON.parse(perms) as string[]).map((e) => {
      return e.replace(/:/g, '/');
    });
    console.log('perms[0]: ', array[0], 'permArray:', permArray[0]); // "sys:user:add"
    console.log('path: ', path, path.replace(`/${ADMIN_PREFIX}/`, '/')); // /api/admin/sys/user/page /apisys/user/page  admin
    // 遍历权限是否包含该url，不包含则无访问权限
    const replaceUrl = `/api/${ADMIN_PREFIX}/`;
    if (!permArray.includes(path.replace(`${replaceUrl}`, ''))) {
      throw new ApiException(11003);
    }

    return true;
  }
}
