import { Test, TestingModule } from '@nestjs/testing';
import { GprcTestController } from './gprc_test.controller';
import { GprcTestService } from './gprc_test.service';

describe('GprcTestController', () => {
  let gprcTestController: GprcTestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GprcTestController],
      providers: [GprcTestService],
    }).compile();

    gprcTestController = app.get<GprcTestController>(GprcTestController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gprcTestController.getHello()).toBe('Hello World!');
    });
  });
});
