import { Injectable } from '@nestjs/common';
import { ICreateLive } from 'src/user/interfaces/ICreateLive';
import { ILive } from 'src/user/interfaces/ILive';
import { ILiveStreams } from 'src/user/interfaces/ILiveStreams';
import { LiveStreamingRepository } from 'src/user/repositories/liveStreaming.repository';

@Injectable()
export class LiveStreamingService {
  constructor(private _liveStreamingRepository:LiveStreamingRepository) {}
  async createLive(data: ICreateLive): Promise<string> {
    try {
      return (await this._liveStreamingRepository.create(data)).uuid 
    } catch (error) {
      console.error(error) 
    }
  }

  async getLiveStreams(): Promise<ILiveStreams[]> {
    try {
      return await this._liveStreamingRepository.getLiveStreams()
    } catch (error) {
      console.error(error)
    }
  }


 
  async getLiveVideoDetails(streamKey: string): Promise<ILive> {
    try {
      return await this._liveStreamingRepository.getLiveVideoDetails(streamKey)
    } catch (error) {
      console.error(error)
    }
  }

  async stopStreaming(streamKey: string):Promise<void>  {
    try {
      return await this._liveStreamingRepository.stopStream(streamKey)
    } catch (error) {
      console.error(error)
    }
  }
}
