import { NestFactory } from '@nestjs/core';
import { GprcTestModule } from './gprc_test.module';

async function bootstrap() {
  const app = await NestFactory.create(GprcTestModule);
  await app.listen(3002);
}
bootstrap();
