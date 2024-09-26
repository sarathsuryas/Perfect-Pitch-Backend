import { InjectModel } from "@nestjs/mongoose";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Model } from "mongoose";
import { User } from "../schema/user.schema";
import { Otp } from "../schema/otp.schema";
import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { CreateUserDto } from "../../admin/dtos/createUser.dto";
import { IStoredOtp } from "../interfaces/IStoredOtp";
import { ICreatedUser } from "../../admin/interfaces/ICreatedUser";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { IUserData } from "../interfaces/IUserData";
import { UserPasswordResetToken } from "../schema/userResetToken";
import { IUserResetToken } from "../interfaces/IUserResetToken";
import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "../interfaces/IReturnEdit";
import { Video } from "../schema/video.schema";
import { IVideoList } from "../interfaces/IVideoList";
import { Album } from "../schema/album.schema";
import { IAlbumDetails } from "../interfaces/albumDetails";
import { IAlbumData } from "../interfaces/IAlbumData";
import { Audio } from "../schema/audio.schema";
import { IVideoDetails } from "../interfaces/IVideoDetails";
import { IResponseVideo } from "../interfaces/IResponseVideo";
import mongoose from "mongoose";
import { VideoComment } from "../schema/videoComment.schema";
import { IVideoCommentDto } from "../dtos/IVideoComment.dto";
import { ICommentResponse } from "../interfaces/ICommentResponse";
import { ICommentDetails } from "../interfaces/ICommentDetails";
import { ISuggestionCommentResponse } from "../interfaces/ISuggestionCommentResponse";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UserRepository implements IUserRepository {

  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    @InjectModel('Otp') private readonly _otpModel: Model<Otp>,
    @InjectModel('UserResetToken') private readonly _resetTokenModel: Model<UserPasswordResetToken>,
    @InjectModel('Video') private readonly _videoModel: Model<Video>,
    @InjectModel('Album') private readonly _albumModel: Model<Album>,
    @InjectModel('Audio') private readonly _audioModel: Model<Audio>,
    @InjectModel('VideoComment') private readonly _videoCommentModel: Model<VideoComment>
  ) { }

  async checkUser(userData: RegisterUserDto): Promise<boolean> {
    try {
      const result = await this._userModel.findOne({ email: userData.email })
      console.log("data from repository", result)
      if (!result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  async storeOtp(otp: string): Promise<void> {
    try {
      await this._otpModel.updateOne({ storedOtp: otp })
    } catch (error) {
      console.error(error)
    }
  }

  async returnOtp(): Promise<IStoredOtp> {
    try {
      return await this._otpModel.findOne({}, { _id: 0, storedOtp: 1 })
    } catch (error) {
      console.error(error)
    }
  }

  async createUser(data: CreateUserDto, password: string): Promise<ICreatedUser> {
    try {
      const result = await this._userModel.create({
        fullName: data.data.fullName,
        email: data.data.email,
        phone: data.data.phone,
        password: password
      })
      const obj: ICreatedUser = {
        _id: result._id + '',
        fullName: result.fullName,
        email: result.email,
        isBlocked: result.isBlocked,
        isAdmin: result.isAdmin
      }

      return obj
    } catch (error) {
      console.error(error)
    }
  }

  async refreshTokenSetup(token: string, id: string): Promise<void> {
    try {
      await this._userModel.findByIdAndUpdate(id, { refreshToken: token })
    } catch (error) {
      console.error(error)
    }
  }

  async existUser(user: LoginUserDto): Promise<IUserData | null> {
    try {

      const exist = await this._userModel.findOne({ email: user.email })

      if (exist) {
        const obj: IUserData = {
          _id: exist._id + '',
          fullName: exist.fullName,
          email: exist.email,
          password: exist.password,
          isAdmin: exist.isAdmin,
          isBlocked: exist.isBlocked
        }
        return obj
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
    }
  }


  async getRefreshToken(email: string): Promise<string> {
    try {
      const userData = await this._userModel.findOne({ email: email })
      const { refreshToken } = userData
      console.log(refreshToken)
      return refreshToken
    } catch (error) {
      console.error(error)
    }
  }

  async getUserId(email: string): Promise<string> {
    const user = await this._userModel.findOne({ email: email }).lean()
    return user?._id + ""
  }

  async savePasswordResetToken(id: string, resetToken: string): Promise<boolean> {
    try {
      const resetTokenInstance = new this._resetTokenModel({ _userId: id, resetToken: resetToken })
      await resetTokenInstance.save(
        await this._resetTokenModel.find({ _userId: id, resetToken: { $ne: resetTokenInstance.resetToken } }).deleteOne().exec())
      return true
    } catch (error) {
      console.error(error)
    }
  }
  async getResetPasswordToken(resetToken: string) {
    try {
      const data = await this._resetTokenModel.findOne({ resetToken: resetToken })
      return data
    } catch (error) {
      console.error(error)
    }
  }
  async newPassword(password: string, AdminId: string): Promise<IUserResetToken | boolean> {
    try {
      const data = await this._resetTokenModel.findOne({ _adminId: AdminId }).lean() as IUserResetToken
      const expirationTime = new Date(data.createdAt.getTime() + 3600 * 1000);
      const currentTime = new Date();
      if (currentTime < expirationTime) {
        return data
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }
  async updatePassword(id: string, password: string): Promise<IUserData> {
    try {
      const data = await this._userModel.findByIdAndUpdate(id, { password: password }).lean() as IUserData
      if (data) {
        return data
      } else {
        return data
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getUser(id: string): Promise<IUserData> {
    try {
      const data = await this._userModel.findOne({ _id: id + '' }).lean() as IUserData
      if (data) {
        return data
      }
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async updateProfileImage(_id: string, link: string): Promise<string> {
    try {
      const data = await this._userModel.findById({ _id: _id })
      data.profileImage = link

      await data.save()
      return "success"
    } catch (error) {
      console.error(error)
    }
  }
  async editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit> {
    try {
      const update = await this._userModel.findOneAndUpdate({ email: email }, { fullName: data.fullName, phone: data.phone }).lean()
      return {
        fullName: update.fullName,
        phone: update.phone
      }
    } catch (error) {
      console.error(error)
    }
  }

  async resetPassword(_id: string, password: string) {
    try {
      const user = await this._userModel.findOneAndUpdate({ _id: _id }, { password: password })
      return user
    } catch (error) {
      console.error(error)
    }
  }

  async uploadVideo(videoName: string, videoDescription: string, genre: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string) {
    try {
      console.log(artist)
      const result = await this._videoModel.create({
        artist: artist,
        title: videoName,
        description: videoDescription,
        genre: genre,
        artistId: artistId,
        link: videoLink,
        thumbnailLink: thumbNailLink
      })

      return result
    } catch (error) {
      console.error(error)
    }
  }

  async listVideos(): Promise<IVideoList[]> {
    try {
      const videos = await this._videoModel.find({}, { artist: 1, title: 1, description: 1, thumbnailLink: 1, visibility: 1, link: 1 }).lean() as IVideoList[]

      return videos
    } catch (error) {
      console.error(error)
    }
  }

  async submitAlbumDetails(details: IAlbumDetails) {
    try {
      const result = await this._albumModel.create({ title: details.title, thumbNailLink: details.thumbNailLink, artistName: details.artistName, songs: details.songs })
      return result
    } catch (error) {
      console.error(error)
    }
  }
  async getAlbums(): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.find({}, { title: 1, artistName: 1, visibility: 1, thumbNailLink: 1 }).lean() as
        IAlbumData[]
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async submitAudioDetails() {

  }

  async getAlbumDetails(id: string): Promise<IAlbumDetails> {
    try {
      const result = await this._albumModel.findById(id, { title: 1, artistName: 1, thumbNailLink: 1, songs: 1 }).lean() as IAlbumDetails

      return result
    } catch (error) {
      console.error(error)
    }
  }

  async getVideoDetails(id: string, userId: string): Promise<IResponseVideo> {
    try {
      const  videoSuggstionsComment:ISuggestionCommentResponse[] = []
      const data = await this._videoModel.findById(id)
        .populate('artistId', 'subscribers profileImage fullName')
        .lean() as IVideoDetails
      const filter = await this._videoModel.find({ genre: data.genre })
        .populate('artistId', 'subscribers profileImage fullName')
        .lean() as IVideoDetails[]
      const userProfileImage = await this._userModel.findById(userId, { _id: 1 ,profileImage: 1 })
      
      .lean() as IUserData
      const commentDetails = await this._videoCommentModel.findOne({ videoId: id }, {  comments: 1 })
      .sort()
      .lean() as ICommentResponse
      for (let i = 0; i < filter.length; i++) {
        const details = await this._videoCommentModel.findOne({ videoId: filter[i]._id }, {  comments: 1 }).lean() as ISuggestionCommentResponse
        videoSuggstionsComment.push(details)
      }

      const obj: IResponseVideo = {
        video: data,
        suggestions: filter,
        profileImage: userProfileImage.profileImage,
        comments: commentDetails,
        suggestedVideoComments: videoSuggstionsComment,
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

  async subscribeArtist(subscribedUserId: string, artistId: string) {
    try {

      const data = await this._userModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(artistId) }
      }, { $match: { subscribers: subscribedUserId } }])
      console.log(data)
      if (data.length) {
        const unsubscribe = await this._userModel.findByIdAndUpdate(artistId, { $pull: { subscribers: subscribedUserId } }).lean() as IVideoDetails
        return {

        }
      }
      if (data.length === 0) {
        const subscribed = await this._userModel.findByIdAndUpdate(artistId, { subscribers: subscribedUserId })
      }

    } catch (error) {
      console.error(error)
    }
  }

  async addVideoComment(comment: IVideoCommentDto) {
    try {

      const data = await this._videoCommentModel.findOneAndUpdate({ videoId: comment.videoId }, { $push: { comments: comment.commentDetails } })

      if (!data) {
       const result =  await this._videoCommentModel.create({ videoId: comment.videoId, comments: { userId: comment.commentDetails.userId, userName: comment.commentDetails.userName, comment: comment.commentDetails.comment, profileImage: comment.commentDetails.profileImage,_id:uuidv4() } })
       console.log(result.comments[0]._id)
      }

    } catch (error) {
      console.error(error)
    }
  }

}     