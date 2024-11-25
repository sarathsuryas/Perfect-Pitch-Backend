import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ICreateLive } from "src/modules/users/interfaces/ICreateLive";
import { ILive } from "src/modules/users/interfaces/ILive";
import { ILiveStreams } from "src/modules/users/interfaces/ILiveStreams";
import { Live } from "src/modules/users/schema/live.schema";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LiveStreamingRepository {
  constructor(@InjectModel('Live') private _liveModel: Model<Live>,
) {}
  async createLive(data: ICreateLive): Promise<string> {
    try {
      const result = await this._liveModel.create({
        uuid: uuidv4(),
        title: data.title,
        description: data.description,
        artistId: data.artistId,
        genreId: data.genreId,
        thumbNailLink: data.thumbNailLink
      })
      return result.uuid
    } catch (error) {
      console.error(error)
    }
  }

  async getLiveStreams(): Promise<ILiveStreams[]> {
    try {
      const streams = await this._liveModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: "artistId",
            foreignField: '_id',
            as: 'artistDetails'
          }
        },
        { $unwind: '$artistDetails' },
        {
          $project: {
            _id: 0,
            uuid: 1,
            thumbNailLink: 1,
            title: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            }
          }
        }
      ]) as ILiveStreams[]

      return streams
    } catch (error) {
      console.error(error)
    }
  }
  async getLiveVideoDetails(streamKey: string): Promise<ILive> {
    try {
      console.log(streamKey)
      const live = await this._liveModel.aggregate([
        { $match: { uuid: streamKey } },
        {
          $lookup: {
            from: 'users',
            localField: 'artistId',
            foreignField: '_id',
            as: 'artistData'
          }
        },
        { $unwind: '$artistData' },
        {
          $project: {
            uuid: 1,
            title: 1,
            artistData: {
              fullName: 1,
              _id: 1,
              profileImage: 1
            }
          }
        }
      ])
      return live[0]
    } catch (error) {
      console.error(error)
    }
  }
  async stopStream(streamKey: string) {
    try {
      console.log(streamKey)
      await this._liveModel.deleteOne({ uuid: streamKey })
    } catch (error) {
      console.error(error)
    }
  }

}