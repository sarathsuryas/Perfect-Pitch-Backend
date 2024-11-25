import { Test, TestingModule } from '@nestjs/testing';
import { LiveStreamingController } from './live-streaming.controller';

describe('LiveStreamingController', () => {
  let controller: LiveStreamingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveStreamingController],
    }).compile();

    controller = module.get<LiveStreamingController>(LiveStreamingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
