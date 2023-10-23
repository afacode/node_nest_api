import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {Response, Request}  from 'express'

interface Data<T> {
    data: T
}

let requestSeq = 0;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
        const startTIme = Date.now(); // 请求开始时间
        const host = context.switchToHttp();
        const response  = host.getResponse<Response>()
        const {method, url, body, params, query} = host.getRequest<Request>();
        const reqCount = ++requestSeq;
        console.log(`${reqCount} ${method} ${url} request enter`)
        return next.handle().pipe(map(data => {
            console.log(`${method} ${url} response leave ${Date.now() - startTIme}ms`)
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