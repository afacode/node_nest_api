import { Test, TestingModule } from '@nestjs/testing';
import { GrpcClientController } from './grpc_client.controller';
import { GrpcClientService } from './grpc_client.service';

describe('GrpcClientController', () => {
  let grpcClientController: GrpcClientController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GrpcClientController],
      providers: [GrpcClientService],
    }).compile();

    grpcClientController = app.get<GrpcClientController>(GrpcClientController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(grpcClientController.getHello()).toBe('Hello World!');
    });
  });
});
