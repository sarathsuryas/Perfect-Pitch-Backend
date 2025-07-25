// interfaces/ILiveStreamingService.ts

import { ILiveStreams } from './ILiveStreams';
import { ILive } from './ILive';
import { ICreateLive } from './ICreateLive'; // assuming this is the DTO for creation

export interface ILiveStreamingService {
  createLive(data: ICreateLive): Promise<string>;
  getLiveStreams(): Promise<ILiveStreams[]>;
  getLiveVideoDetails(streamKey: string): Promise<ILive>;
  stopStreaming(streamKey: string): Promise<void>;
}
