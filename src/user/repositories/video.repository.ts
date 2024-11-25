import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IResponseVideo } from "src/modules/users/interfaces/IResponseVideo";
import { IUserData } from "src/modules/users/interfaces/IUserData";
import { IVideoDetails } from "src/modules/users/interfaces/IVideoDetails";
import { IVideoList } from "src/modules/users/interfaces/IVideoList";
import { User } from "src/modules/users/schema/user.schema";
import { Video } from "src/modules/users/schema/video.schema";

@Injectable()
export class VideoRepository {
  constructor(@InjectModel('Video') private readonly _videoModel: Model<Video>,
    @InjectModel('User') private readonly _userModel: Model<User>,

  ) { }
  async uploadVideo(videoName: string, videoDescription: string, genreId: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string) {
    try {
      const result = await this._videoModel.create({
        artist: artist,
        title: videoName,
        description: videoDescription,
        genreId: genreId,
        artistId: artistId,
        link: videoLink,
        thumbnailLink: thumbNailLink
      })

      return result
    } catch (error) {
      console.error(error)
    }
  }

  async listVideos(data: { page: number, perPage: number }): Promise<IVideoList[]> {
    try {
      const videos = await this._videoModel.aggregate([
        { $match: { shorts: false } },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistData'
          }
        },
        { $unwind: '$artistData' },
        {
          $project: {
            title: 1,
            description: 1,
            thumbNailLink: 1,
            visibility: 1,
            link: 1,
            artistData: {
              _id: 1,
              fullName: 1
            }
          }
        },
        { $skip: (data.page - 1) * data.perPage },
        { $limit: data.perPage }
      ])

      return videos
    } catch (error) {
      console.error(error)
    }
  }

  async searchVideos(query: string): Promise<IVideoList[]> {
    try {
      const videos = await this._videoModel.find({ shorts: false, title: { $regex: `^${query}`, $options: 'i' } }, { artist: 1, title: 1, description: 1, thumbnailLink: 1, visibility: 1, link: 1 }).lean() as IVideoList[]
      return videos
    } catch (error) {
      console.error(error)
    }
  }
  async getVideoDetails(id: string, userId: string): Promise<IResponseVideo> {
    try {
      const viewer = await this._videoModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $match: { viewers: userId } }
      ])
      if (viewer.length === 0) {
        await this._videoModel.findByIdAndUpdate(id, { $push: { viewers: userId } })
      }
      const data = await this._videoModel.findById(id)
        .populate('artistId', 'subscribers profileImage fullName')
        .lean() as IVideoDetails

      const filter = await this._videoModel.find(
        {
          $and: [
            { _id: { $ne: data._id } },
            { genreId: data.genreId }
          ]
        })
        .populate('artistId', 'subscribers profileImage fullName')
        .lean() as IVideoDetails[]
      const userProfileImage = await this._userModel.findById(userId, { _id: 1, profileImage: 1 })
        .lean() as IUserData

      const obj: IResponseVideo = {
        video: data,
        suggestions: filter,
        profileImage: userProfileImage.profileImage,
        userName: ""
      }

      return obj
    } catch (error) {
      console.error(error)
    }
  }

  async likeVideo(videoId: string, userId: string) {
    try {
      const data = await this._videoModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(videoId) }
      }, { $match: { like: userId } }])
      if (data.length) {
        const dislike = await this._videoModel.findByIdAndUpdate(videoId, { $pull: { like: userId } }).lean() as IVideoDetails
        return {
          videoId: dislike._id,
          likeCount: dislike.like.length
        }
      }
      if (data.length === 0) {
        const liked = await this._videoModel.findByIdAndUpdate(videoId, { like: userId })
        return {
          videoId: liked._id,
          likeCount: liked.like.length
        }
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getUserVideos(userId: string): Promise<IVideoList[]> {
    try {
      const videos = await this._videoModel.aggregate([
        { $match: { artistId: new mongoose.Types.ObjectId(userId) } },
        { $match: { shorts: false } },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistData'
          }
        },
        { $unwind: '$artistData' },
        {
          $project: {
            title: 1,
            description: 1,
            thumbNailLink: 1,
            visibility: 1,
            link: 1,
            artistData: {
              _id: 1,
              fullName: 1
            }
          }
        },
      ])

      return videos
    } catch (error) {
      console.error(error)
    }
  }

  async recommendedVideos(): Promise<IVideoList[]> {
    try {
      const videos = await this._videoModel.aggregate([
        { $match: { shorts: false } },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'artistId',
            as: 'artistData'
          }
        },
        { $unwind: '$artistData' },
        {
          $project: {
            title: 1,
            description: 1,
            thumbNailLink: 1,
            visibility: 1,
            link: 1,
            viewers: 1,
            artistData: {
              _id: 1,
              fullName: 1
            }
          }
        },
        {
          $addFields: {
            viewersCount: { $size: '$viewers' }
          }
        },
        { $sort: { viewersCount: -1 } },
        { $limit: 3 }
      ])

      return videos
    } catch (error) {
      console.error(error)
    }
  }


}