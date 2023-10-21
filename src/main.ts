import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import  {Response} from './common/response';
import { HttpFilter } from './common/http.filter'
import { GlobalLogger } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { RoleGuard } from './guard/role/role.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService)

  // 静态资源访问
  app.useStaticAssets(join(__dirname,  'files'),  {
    prefix: '/public'
  });
  
  // 全局中间件
  app.use(cors());

  // 全局日志
  app.use(GlobalLogger);

  // 全局异常拦截器
  app.useGlobalFilters(new HttpFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new Response());

  // 全局pipe validate
  app.useGlobalPipes(new ValidationPipe())

  // app.useGlobalGuards(new RoleGuard())

  const options = new DocumentBuilder()
    .setTitle('doc')
    .setDescription('doc description')
    .setVersion('1.0')
    .addTag('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  
  const PORT  = config.get<number>('SERVE_PORT', 3000);
  await app.listen(PORT, () => {
    console.log(`app listen port ${PORT}`, config)
  });
}
bootstrap();
