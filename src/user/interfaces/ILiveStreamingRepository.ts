import { ILive } from "./ILive";
import { ILiveStreams } from "./ILiveStreams";

export interface ILiveStreamingRepository {
  getLiveStreams(): Promise<ILiveStreams[]>
   getLiveVideoDetails(streamKey: string): Promise<ILive>
   stopStream(streamKey: string):Promise<void>
}