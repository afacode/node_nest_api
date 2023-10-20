import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Request} from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('经过了守卫')
    // const req = context.switchToHttp().getRequest<Request>()
    // if (req.query.role.includes('admin'))
    return true;
  }
}
