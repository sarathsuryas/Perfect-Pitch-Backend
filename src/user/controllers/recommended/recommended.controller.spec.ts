import { Test, TestingModule } from '@nestjs/testing';
import { RecommendedController } from './recommended.controller';

describe('RecommendedController', () => {
  let controller: RecommendedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendedController],
    }).compile();

    controller = module.get<RecommendedController>(RecommendedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
