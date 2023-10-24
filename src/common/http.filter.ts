import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { getFormatRequestInfo } from 'src/shared/utils/formatRequestInfo';

@Catch()
export class HttpFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = exception.getResponse();
    let msg = exception.message || (status >= 500 ? 'Service Error' : 'Client Error');

    // if (Object.prototype.toString.call(response) === '[object Object]' && response.message) {
    //     msg = response.message;
    // }
    // 记录日志（错误消息，错误码，请求信息等）
    this.logger.error(msg, {
      status,
      req: getFormatRequestInfo(req),
      // stack: exception.stack,
    });

    res.status(status).json({
      httpCode: status,
      success: false,
      time: new Date().toISOString(),
      data: exception?.getResponse() ? exception?.getResponse() : exception.message,
      status: -1,
      message: exception.message,
      path: req.url,
    });
  }
}
