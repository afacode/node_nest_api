import { Test, TestingModule } from '@nestjs/testing';
import { LibBaseService } from './lib_base.service';

describe('LibBaseService', () => {
  let service: LibBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibBaseService],
    }).compile();

    service = module.get<LibBaseService>(LibBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
