import { NestFactory } from '@nestjs/core';
import { GrpcClientModule } from './grpc_client.module';

async function bootstrap() {
  const app = await NestFactory.create(GrpcClientModule);
  await app.listen(4443);
}
bootstrap();
