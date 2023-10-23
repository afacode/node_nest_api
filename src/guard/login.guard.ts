import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginGuard implements CanActivate {
    @Inject(JwtService)
    private jwtService: JwtService

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authorization = request.header('authorization') || '';
        const bearer = authorization.split(' ');
        console.log(bearer, 'bearer')

        if (!bearer || bearer.length < 2) {
            throw new UnauthorizedException('登录token错误');
        }
        const token = bearer[1];
        try {
            const info = await this.jwtService.verifyAsync(token);
            // const payload = await this.jwtService.verifyAsync(
            //     token,
            //     {
            //       secret: jwtConstants.secret
            //     }
            //   );
            (request as any).user = info.user;
            console.log(info, 'LoginGuard')
            return true;
        } catch (e) {
            throw new UnauthorizedException('登录 token 失效，请重新登录');
        }
    }
}
