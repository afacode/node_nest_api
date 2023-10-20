import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import {Request} from 'express';

export const Role = (...args: string[]) => SetMetadata('role', args);


export const ReqUrl = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.url;
})