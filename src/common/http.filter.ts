import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import {Request, Response} from 'express';

@Catch()
export class HttpFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const req =  ctx.getRequest<Request>()
        const res =  ctx.getResponse<Response>()

        const status = exception.getStatus()

        res.status(status).json({
            httpCode: status,
            success:  false,
            time:  new Date().toISOString(),
            data: exception.getResponse(),
            status: -1,
            message: exception.message,
            path: req.url,
        })
    };
}