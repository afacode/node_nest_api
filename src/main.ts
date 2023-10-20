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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  await app.listen(3000);
}
bootstrap();
