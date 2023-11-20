import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './common/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);

  // 静态资源访问
  app.useStaticAssets(join(process.cwd(), 'files'), {
    prefix: '/public',
  });

  // 全局中间件
  app.use(cors());

  // 全局pipe validate
  app.useGlobalPipes(new ValidationPipe());

  // websocket
  // app.useWebSocketAdapter(new SocketIoAdapter(app, app.get(ConfigService)));

  // swagger
  setupSwagger(app);

  const PORT = config.get<number>('SERVE_PORT', 3000);
  await app.listen(PORT, () => {
    Logger.log(`api服务已经启动,请访问: ${PORT}`);
  });
}
bootstrap();
