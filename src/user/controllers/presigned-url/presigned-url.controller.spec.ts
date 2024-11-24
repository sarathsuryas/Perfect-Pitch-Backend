import { Test, TestingModule } from '@nestjs/testing';
import { PresignedUrlController } from './presigned-url.controller';

describe('PresignedUrlController', () => {
  let controller: PresignedUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresignedUrlController],
    }).compile();

    controller = module.get<PresignedUrlController>(PresignedUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
