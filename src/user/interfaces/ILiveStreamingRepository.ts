import { Live } from "../schema/live.schema";
import { IBaseRepository } from "./IBaseRepository";
import { ILive } from "./ILive";
import { ILiveStreams } from "./ILiveStreams";

export interface ILiveStreamingRepository extends IBaseRepository<Live> {
  getLiveStreams(): Promise<ILiveStreams[]>
   getLiveVideoDetails(streamKey: string): Promise<ILive>
   stopStream(streamKey: string):Promise<void>
}