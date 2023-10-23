import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {Request}  from 'express'

let requestSeq = 0;

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now(); // 请求开始时间
        const host = context.switchToHttp();
        const {method, url, body, params, query} = host.getRequest<Request>();
        const reqCount = ++requestSeq;
        
        return next
            .handle()
            .pipe(
                tap(() =>
                 console.log(`${reqCount} ${method} ${url} ${Date.now() - start} ms`)
                ),
            );
    }
}