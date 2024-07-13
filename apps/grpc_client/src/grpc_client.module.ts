import { Module } from '@nestjs/common';
import { GrpcClientController } from './grpc_client.controller';
import { GrpcClientService } from './grpc_client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4444',
          package: 'book',
          protoPath: join(__dirname, 'book/book.proto'),
        },
      },
    ]),
  ],
  controllers: [GrpcClientController],
  providers: [GrpcClientService],
})
export class GrpcClientModule {}
