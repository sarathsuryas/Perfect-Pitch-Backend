import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ICreatePlaylistDto } from "src/user/dtos/ICreatePlaylist.dto";
import { IUserPlaylists } from "src/user/interfaces/IUserPlaylists";
import { Playlist } from "src/user/schema/playlist.schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class PlaylistRepository extends BaseRepository<Playlist> {
 constructor(@InjectModel('Playlist') private readonly _playlistModel: Model<Playlist>,
){
  super(_playlistModel)
}
  // async createPlaylist(data: ICreatePlaylistDto):Promise<IUserPlaylists | unknown> {
  //   try {
  //     const value = await this._playlistModel.create({ title: data.title, songsId: data.songsId, access: data.access, userId: data.userId, thumbNailLink: data.thumbNailLink })
  //     return value 
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // async getUserPlaylist(data: { userId: string, page: number, perPage: number }):Promise<IUserPlaylists[]> {
  //   try {
  //     return await this._playlistModel.find({ userId: data.userId })
  //       .skip((data.page - 1) * data.perPage)
  //       .limit(data.perPage)
  //       .lean() as IUserPlaylists[]
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // async getAllPlaylistUser(data: { userId: string, page: number, perPage: number }):Promise<IUserPlaylists[]> {
  //   try {
  //     return await this._playlistModel.find({ userId:data.userId })
  //       .skip((data.page - 1) * data.perPage)
  //       .limit(data.perPage)
  //       .lean() as IUserPlaylists[]
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // async getPlaylists(data: { userId: string, page: number, perPage: number }):Promise<IUserPlaylists[]> {
  //   try {
  //     return await this._playlistModel.find({
  //       $and: [
  //         { userId: new mongoose.Types.ObjectId(data.userId)  },
  //         { access: 'public' }       
  //       ]
  //     })
  //       .skip((data.page - 1) * data.perPage)
  //       .limit(data.perPage)
  //       .lean() as IUserPlaylists[]
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async recommendedPlaylists(): Promise<IUserPlaylists[]> {
    try {
      return await this._playlistModel.aggregate([
        { $match: { access: 'public' } },
        { $addFields: { viewersCount: { $size: '$viewers' } } },
        { $sort: { viewersCount: -1 } },
        { $limit: 4 }
      ]) as IUserPlaylists[]
    } catch (error) {
      console.error(error)
    }
  }


  // async searchPlaylist(query: string):Promise<IUserPlaylists[]> {
  //   try {
  //     return await this._playlistModel.find({
  //       $and:[
  //        { title: { $regex: `^${query}`, $options: 'i' }},
  //        {access:'public'}
  //       ]
       
  //        }).lean() as IUserPlaylists[]
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async addToPlaylsit(playlistId: string, songId: string): Promise<boolean> {
    try {
      const data = await this.findOneByQuery({ _id: playlistId, songsId: { $in: [songId] } })
      if (data) {
        return true
      } else {
        await this.findOneAndUpdate({ _id: playlistId }, { $push: { songsId: songId } })
        return false
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists> {
    try {
      const viewer = await this._playlistModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
        { $match: { viewers: userId } }
      ])
      if (viewer.length === 0) {
        await this.update(playlistId, { $push: { viewers: userId } })
      }
      const data = await this._playlistModel.findOne({ _id: playlistId })
        .populate({
          path: 'songsId',
          populate: {
            path: 'artistId',
            model: 'User',
            select: '_id fullName'
          },

        })
        .lean() as IUserPlaylists
      return data
    } catch (error) {
      console.error(error)
    }
  }
  async getUserPublicPlaylist(userId: string):Promise<IUserPlaylists[]> {
    try {
      return await this._playlistModel.find({ userId: userId, access: 'public' }).limit(4)
        .lean() as IUserPlaylists[]
    } catch (error) {
      console.error(error)
    }
  }



}