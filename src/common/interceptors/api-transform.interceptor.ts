import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getFormatRequestInfo } from 'src/shared/utils/formatRequestInfo';
import { Logger } from 'winston';
import { Reflector } from '@nestjs/core';
import { TRANSFORM_KEEP_KEY_METADATA } from '../contants/decorator.contants';
import { ResponseDto } from '../class/res.class';

interface Data<T> {
  data: T;
}

let requestSeq = 0;
/**
 * 统一处理返回接口结果，如果不需要则添加@Keep装饰器
 */
@Injectable()
export class ApiTransformInterceptor<T> implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly reflector: Reflector,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<any>> {
    const startTIme = Date.now(); // 请求开始时间
    const host = context.switchToHttp();
    const response = host.getResponse<Response>();
    const req = host.getRequest<Request>();
    const { method, url, body, params, query } = host.getRequest<Request>();
    const reqCount = ++requestSeq;
    console.log(`${reqCount} ${method} ${url} request enter`);

    return next.handle().pipe(
      map((data) => {
        console.log(`${method} ${url} response leave ${Date.now() - startTIme}ms`);
        this.logger.info('response', {
          responseData: data,
          req: getFormatRequestInfo(req),
        });
        const keep = this.reflector.get<boolean>(TRANSFORM_KEEP_KEY_METADATA, context.getHandler());
        if (keep) {
          return data;
        } else {
          response.header('Content-Type', 'application/json; charset=utf-8');
          return new ResponseDto(200, data);
        }
      }),
    );
  }
}

export class ResponseData {
  public status: number;
  public message: string;
  public data: any;
  public success: boolean;
  constructor(messageType: any, data = null, success = true) {
    this.status = 0;
    this.message = messageType;
    this.data = data;
    this.success = success;
  }
}
