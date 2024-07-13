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
import { ApiException } from '../exceptions/api.exception';
import { isDev } from 'src/config';
import { ResponseDto } from '../class/res.class';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // check api exection
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // set json response
    response.header('Content-Type', 'application/json; charset=utf-8');

    // prod env will not return internal error message
    const code =
      exception instanceof ApiException ? (exception as ApiException).getErrorCode() : status;

    let message = '服务器异常，请稍后再试';
    // 开发模式下提示500类型错误，生产模式下屏蔽500内部错误提示
    if (isDev() || status < 500) {
      message = exception instanceof HttpException ? exception.message : `${exception}`;
    }
    // 记录 500 日志
    if (status >= 500) {
      this.logger.error(message, {
        status,
        req: getFormatRequestInfo(req),
        // stack: exception.stack,
      });
      // this.logger.error(exception, ApiExceptionFilter.name);
    }

    const result = new ResponseDto(code, null, message);

    response.status(status).send(result);
  }
}
