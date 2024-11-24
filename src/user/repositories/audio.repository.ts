import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISongData } from "src/modules/users/interfaces/ISongData";
import { Audio } from "src/modules/users/schema/audio.schema";
@Injectable()
export class AudioRepository {
  constructor(@InjectModel('Audio') private readonly _audioModel: Model<Audio>,
) {}
  async getSong(songId: string): Promise<ISongData> {
    try {
      const data = await this._audioModel.aggregate([
        { $match: { uuid: songId } },
        {
          $lookup: {
            from: 'albums',
            localField: 'albumId',
            foreignField: '_id',
            as: 'albumDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'artistId',
            foreignField: '_id',
            as: 'artistDetails'
          }
        },
        { $unwind: '$albumDetails' },
        { $unwind: '$artistDetails' },
        {
          $project: {
            _id: 1,
            title: 1,
            link: 1,
            thumbNailLink: 1,
            albumDetails: {
              _id: 1,
              title: 1,
              songs: 1
            },
            artistDetails: {
              _id: 1,
              fullName: 1,
            }
          }
        }
      ])
      return data[0]
    } catch (error) {
      console.error(error)
    }
  }
}