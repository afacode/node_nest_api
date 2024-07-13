import { Module } from '@nestjs/common';
import { GrpcServerController } from './grpc_server.controller';
import { GrpcServerService } from './grpc_server.service';

@Module({
  imports: [],
  controllers: [GrpcServerController],
  providers: [GrpcServerService],
})
export class GrpcServerModule {}
