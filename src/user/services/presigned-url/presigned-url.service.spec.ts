import { Test, TestingModule } from '@nestjs/testing';
import { PresignedUrlService } from './presigned-url.service';

describe('PresignedUrlService', () => {
  let service: PresignedUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresignedUrlService],
    }).compile();

    service = module.get<PresignedUrlService>(PresignedUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
