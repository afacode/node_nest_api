import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './common/swagger';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);

  // 静态资源访问
  app.useStaticAssets(join(process.cwd(), 'files'), {
    prefix: '/public',
  });

  // app.setGlobalPrefix('/api/v1')
  app.setGlobalPrefix('api');

  // cors
  // app.use(cors());
  app.enableCors();

  // 全局pipe validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(
          errors
            .filter((item) => !!item.constraints)
            .flatMap((item) => Object.values(item.constraints))
            .join('; '),
        );
      },
    }),
  );

  // websocket
  // app.useWebSocketAdapter(new SocketIoAdapter(app, app.get(ConfigService)));

  // swagger
  setupSwagger(app);

  const PORT = config.get<number>('port', 3000);
  const WS_PORT = config.get<string>('wsPort');
  const SWAGGER_API = config.get<string>('swagger.path');

  await app.listen(PORT, () => {
    Logger.log(`api服务已经启动,请访问: http://localhost:${PORT}`);
    Logger.log(`ws服务已经启动,请访问: http://localhost:${WS_PORT}`);
    Logger.log(`API文档已生成,请访问: http://localhost:${PORT}/${SWAGGER_API}`);
    Logger.log(`API knife文档已生成,请访问: http://localhost:${PORT}/doc.html`);
  });
}
bootstrap();
