import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request['user']) {
      // 公共接口
      return true;
    }
    // 一用户多角色
    const roles = await this.userService.findRoleById(request['user'].roles.map((item) => item.id));

    const permissions = roles.reduce((total, current) => {
      total.push(...current.permissions);
      return total;
    }, []);

    const requirePremission = this.reflector.getAllAndOverride<boolean>('IS_PRESSION', [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPremissPass = permissions.some((item) => {
      return item.code === requirePremission[0];
    });
    if (isPremissPass || requirePremission == undefined) {
      return true;
    } else {
      return false;
    }
  }
}
