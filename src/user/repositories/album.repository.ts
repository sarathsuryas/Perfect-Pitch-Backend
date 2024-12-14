import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IAlbumDetails } from "src/user/interfaces/albumDetails";
import { IAlbumData } from "src/user/interfaces/IAlbumData";
import { Album } from "src/user/schema/album.schema";
import { v4 as uuidv4 } from 'uuid';
import { Audio } from "src/user/schema/audio.schema";
import { BaseRepository } from "./base.repository";
import { IAlbumDetailsDto } from "../dtos/IAlbumDetails.dto";
@Injectable()
export class AlbumRepository  extends BaseRepository<Album> {
constructor(@InjectModel('Album') private readonly _albumModel: Model<Album>,
@InjectModel('Audio') private readonly _audioModel: Model<Audio>,
) {
  super(_albumModel)
}
  async submitAlbumDetails(details: IAlbumDetails, uuids: string[]) {
    try {
      const result = await this.create({ title: details.title, artistId: details.artistId, thumbNailLink: details.thumbNailLink, genreId: details.genreId, uuid: uuidv4(), songs: uuids })
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.aggregate([
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistDetails'
          }
        },
        { $unwind: "$artistDetails" },
        {
          $project: {
            title: 1,
            thumbNailLink: 1,
            viewers: 1,
            uuid: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            }
          }
        },
        { $skip: (data.page - 1) * data.perPage },
        { $limit: data.perPage }
      ])
      return result 
    } catch (error) {
      console.error(error)
    }
  }

  async submitAudioDetails(songs: IAlbumDetails):Promise<void> {
    try {
      const result = await this._audioModel.insertMany(songs.songs)
    } catch (error) {
      console.error(error)
    }
  }

  async searchAlbum(query: string): Promise<IAlbumData[]> {
    try {
     
      const result = await this._albumModel.aggregate([{
        $match:{title:{ $regex: `^${query}`, $options: 'i' }}
      },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistDetails'
          }
        },
        { $unwind: "$artistDetails" },
        {
          $project: {
            title: 1,
            thumbNailLink: 1,
            viewers: 1,
            uuid: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            }
          }
        },
      ])
      return result 


    } catch (error) {
      console.error(error)
    }
  }
  async getIndividualAlbums(data: { page: number, perPage: number,artistId:string }): Promise<IAlbumData[]> {
    try {
   
      const result = await this._albumModel.aggregate([
        {$match:{artistId:new mongoose.Types.ObjectId(data.artistId)}},
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistDetails'
          }
        },
        { $unwind: "$artistDetails" },
        {
          $project: {
            title: 1,
            thumbNailLink: 1,
            viewers: 1,
            uuid: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            }
          }
        },
        { $skip: (data.page - 1) * data.perPage },
        { $limit: data.perPage }
      ])
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbumDetails(id: string, userId: string): Promise<IAlbumData> {
    try {

      const viewer = await this._albumModel.aggregate([
        { $match: { uuid: id } },
        { $match: { viewers: userId } }
      ])
      if (viewer.length === 0) {
        await this._albumModel.findOneAndUpdate({ uuid: id }, { $push: { viewers: userId } })
      }
      const result = await this._albumModel.aggregate([
        { $match: { uuid: id } },
        {
          $lookup: {
            from: 'users',
            localField: 'artistId',
            foreignField: '_id',
            as: 'artistDetails'
          }
        },
        {
          $lookup: {
            from: 'audios',
            localField: 'songs',
            foreignField: 'uuid',
            as: "songsDetails"
          }
        },
        { $unwind: '$artistDetails' },
        { $unwind: '$songsDetails' },
        {
          $project: {
            _id: 1,
            title: 1,
            uuid: 1,
            visibility: 1,
            thumbNailLink: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            },
            songsDetails: {
              _id: 1,
              title: 1,
              uuid: 1,
              genreId: 1,
              thumbNailLink: 1
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            uuid: { $first: '$uuid' },
            thumbNailLink: { $first: "$thumbNailLink" },
            artistDetails: { $first: '$artistDetails' },
            songs: {
              $push: "$songsDetails"
            }
          }
        }
      ]) as IAlbumData[]
      return result[0]
    } catch (error) {
      console.error(error)
    }
  }  
  async getUserAlbums(artistId: string): Promise<IAlbumData[]> {
    try {

      const result = await this._albumModel.aggregate([
        { $match: { artistId: new mongoose.Types.ObjectId(artistId) } },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistDetails'
          }
        },
        { $unwind: "$artistDetails" },
        {
          $project: {
            title: 1,
            thumbNailLink: 1,
            viewers: 1,
            uuid: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            }
          }
        },
        {
          $limit: 4
        }

      ])

      return result
    } catch (error) {
      console.error(error)
    }
  }

  async recommendedAlbums(): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.aggregate([
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistDetails'
          }
        },
        { $unwind: "$artistDetails" },
        {
          $project: {
            title: 1,
            thumbNailLink: 1,
            viewers: 1,
            uuid: 1,
            artistDetails: {
              _id: 1,
              fullName: 1
            }
          }
        }, {
          $addFields: {
            viewersCount: { $size: '$viewers' }
          }
        },
        {
          $sort: {
            viewersCount: -1
          }
        }, {
          $limit: 4
        }
      ])
      return result
    } catch (error) {
      console.error(error)
    }
  }



}