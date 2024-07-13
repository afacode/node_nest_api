import { NestFactory } from '@nestjs/core';
import { GrpcServerModule } from './grpc_server.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(GrpcServerModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:4444',
      package: 'book',
      protoPath: join(__dirname, 'book/book.proto'),
    },
  });
  await app.listen();
}
bootstrap();
