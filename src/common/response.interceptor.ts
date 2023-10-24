import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {Response, Request}  from 'express'
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { getFormatRequestInfo } from "src/shared/utils/formatRequestInfo";
import { Logger } from 'winston';

interface Data<T> {
    data: T
}

let requestSeq = 0;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) 
        private readonly logger: Logger,
      ) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
        const startTIme = Date.now(); // 请求开始时间
        const host = context.switchToHttp();
        const response  = host.getResponse<Response>()
        const req = host.getRequest<Request>();
        const {method, url, body, params, query} = host.getRequest<Request>();
        const reqCount = ++requestSeq;
        console.log(`${reqCount} ${method} ${url} request enter`)
        return next.handle().pipe(map(data => {
            console.log(`${method} ${url} response leave ${Date.now() - startTIme}ms`)
            this.logger.info('response', {
                responseData: data,
                req: getFormatRequestInfo(req),
              });
            // new ResultData('用户名被占用', createUserDto, false);
            return {
                data,
                status: 0,
                message: response.statusMessage || 'success',
                httpCode:  response.statusCode,
                success: true,
            }
        }))
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