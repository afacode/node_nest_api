import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface Data<T> {
    data: T
}

@Injectable()
export class Response<T> implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
        return next.handle().pipe(map(data => {
            return {
                data,
                status: 0,
                message: 'success',
                success: true,
            }
        }))
    }
}