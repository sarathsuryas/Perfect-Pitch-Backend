import { Test, TestingModule } from '@nestjs/testing';
import { LiveStreamingService } from './live-streaming.service';

describe('LiveStreamingService', () => {
  let service: LiveStreamingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveStreamingService],
    }).compile();

    service = module.get<LiveStreamingService>(LiveStreamingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
