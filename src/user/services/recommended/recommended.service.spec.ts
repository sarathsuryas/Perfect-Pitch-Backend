import { Test, TestingModule } from '@nestjs/testing';
import { RecommendedService } from './recommended.service';

describe('RecommendedService', () => {
  let service: RecommendedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendedService],
    }).compile();

    service = module.get<RecommendedService>(RecommendedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
