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
import { IGoogleLoginDto } from "../dtos/IGoogleLogin.dto";
import { CommentReply } from "../schema/commentReply.schema";
import { ICommentReplyDto } from "../dtos/ICommentReply.dto";
import { ICommentReply } from "../interfaces/ICommentReplies";
import { IShortsDto } from "../dtos/IShorts.dto";
import { IResponseShorts } from "../interfaces/IResponseShorts";
import { IAudioDto } from "../dtos/IAudio.dto";
import { IAlbumResponse } from "../interfaces/IAlbumResponse";
import { IAudioData } from "../interfaces/IAudioData";
import { ICreatePlaylistDto } from "../dtos/ICreatePlaylist.dto";
import { Playlist } from "../schema/playlist.schema";
import { IUserPlaylists } from "../interfaces/IUserPlaylists";
import { IPlaylistSongs } from "../interfaces/IPlaylistSongs";
import { Genres } from "../schema/genres.schema";
import { IGenres } from "src/modules/admin/interfaces/IGenres";
import { ISongsSameGenre } from "../interfaces/ISongsSameGenre";
import { ISubmitSongDetailsDto } from "../dtos/ISubmitSongDetails.dto";
import { ISubmitSongDetails } from "../interfaces/ISubmitSongDetails";
import { v4 as uuidv4 } from 'uuid';
import { title } from "process";
import { ISongData } from "../interfaces/ISongData";
import { ReplyToReply } from "../schema/replyToReply.schema";
import { IReplyToReplyDto } from "../dtos/IReplyToReply.dto";
import { IReplyToReply } from "../interfaces/IReplyToReply";


@Injectable()
export class UserRepository implements IUserRepository {

  constructor(
    @InjectModel('User') private readonly _userModel: Model<User>,
    @InjectModel('Otp') private readonly _otpModel: Model<Otp>,
    @InjectModel('UserResetToken') private readonly _resetTokenModel: Model<UserPasswordResetToken>,
    @InjectModel('Video') private readonly _videoModel: Model<Video>,
    @InjectModel('Album') private readonly _albumModel: Model<Album>,
    @InjectModel('Audio') private readonly _audioModel: Model<Audio>,
    @InjectModel('VideoComment') private readonly _videoCommentModel: Model<VideoComment>,
    @InjectModel('CommentReply') private readonly _commentReplyModel: Model<CommentReply>,
    @InjectModel('Playlist') private readonly _playlistModel: Model<Playlist>,
    @InjectModel('Genre') private readonly _genreModel: Model<Genres>,
    @InjectModel('ReplyToReply') private _replyToReplyModel: Model<ReplyToReply>
  ) {

  }

  async checkUser(userData: RegisterUserDto): Promise<boolean> {
    try {
      const result = await this._userModel.findOne({ email: userData.email })
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

  async existUser(email: string): Promise<IUserData | null> {
    try {

      const exist = await this._userModel.findOne({ email: email })

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

  async createUserUsingGoogleLogin(data: IGoogleLoginDto): Promise<ICreatedUser> {

    try {
      const result = await this._userModel.create({
        fullName: data.name,
        email: data.email,
        profileImage: data.photoUrl
      })
      const obj: ICreatedUser = {
        _id: result._id + '',
        fullName: result.fullName,
        email: result.email,
        isBlocked: result.isBlocked,
        isAdmin: result.isAdmin
      }
      return obj
    }

    catch (error) {
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
      const videos = await this._videoModel.find({ shorts: false }, { artist: 1, title: 1, description: 1, thumbnailLink: 1, visibility: 1, link: 1 }).lean() as IVideoList[]
      return videos
    } catch (error) {
      console.error(error)
    }
  }

  async storeSongsDetails(songs: IAudioDto) {
    try {
      const result = await this._audioModel.create({ title: songs.title })
    } catch (error) {
      console.error(error)
    }
  }



  async submitAlbumDetails(details: IAlbumDetails, uuids: string[]) {
    try {
      const result = await this._albumModel.create({ title: details.title, artistId: details.artistId, thumbNailLink: details.thumbNailLink, genreId: details.genreId, uuid: uuidv4(), songs: uuids })
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async submitAudioDetails(songs: IAlbumDetails) {
    try {
      const result = await this._audioModel.insertMany(songs.songs)
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbums(): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.find({}, { title: 1, artistName: 1, visibility: 1, thumbNailLink: 1, uuid: 1 })
        .populate('artistId', "fullName")
        .lean() as IAlbumData[]

      return result
    } catch (error) {
      console.error(error)
    }
  }

  async submitSingleDetails(data: ISubmitSongDetails) {
    try {
      return await this._audioModel.create({ title: data.title, thumbNailLink: data.thumbNailLink, link: data.songLink, genreId: data.genreId, single: true, artistId: data.userId })
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbumDetails(id: string): Promise<IAlbumData[]> {
    try {
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
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async getShorts(userId: string): Promise<IResponseShorts> {
    try {
      const videos = await this._videoModel.find({ shorts: true })
        .populate('artistId', 'subscribers profileImage fullName')
        .lean() as IVideoDetails[]
      const userData = await this._userModel.findById(userId, { _id: 1, profileImage: 1, fullName: 1 })
        .lean() as IUserData
      const data: IResponseShorts = {
        shorts: videos,
        user: {
          _id: userData._id,
          fullName: userData.fullName,
          profileImage: userData.profileImage
        }
      }

      return data
    } catch (error) {
      console.error(error)
    }
  }

  async getVideoDetails(id: string, userId: string): Promise<IResponseVideo> {
    try {
      const videoSuggstionsComment: ISuggestionCommentResponse[] = []
      const data = await this._videoModel.findById(id)
        .populate('artistId', 'subscribers profileImage fullName')
        .lean() as IVideoDetails
      const filter = await this._videoModel.find({ genre: data.genre })
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

  async subscribeArtist(subscribedUserId: string, artistId: string) {
    try {

      const data = await this._userModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(artistId) }
      }, { $match: { subscribers: subscribedUserId } }])

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

  async addVideoComment(comment: IVideoCommentDto): Promise<Object> {
    try {
      const data = await this._videoCommentModel.create({ videoId: comment.videoId, userId: comment.userId, comment: comment.comment })
      return data._id
    } catch (error) {
      console.error(error)
    }
  }

  async likeComment(commentId: string, userId: string) {
    try {

      const data = await this._videoCommentModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(commentId) }
      }, { $match: { likes: new mongoose.Types.ObjectId(userId) } }])

      if (data.length) {
        console.log('dislike')
        const dislike = await this._videoCommentModel.findByIdAndUpdate(commentId, { $pull: { likes: new mongoose.Types.ObjectId(userId) } }).lean()
      }
      if (data.length === 0) {
        console.log('like')
        const liked = await this._videoCommentModel.findByIdAndUpdate(commentId, { likes: new mongoose.Types.ObjectId(userId) })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async getComments(videoId: string): Promise<ICommentResponse[]> {
    try {
      return await this._videoCommentModel.find({ videoId: videoId })
        .sort({ createdAt: -1 })
        .populate('userId', 'fullName profileImage')
        .lean()
    } catch (error) {
      console.error(error)
    }
  }

  async replyComment(data: ICommentReplyDto) {
    try {
      await this._commentReplyModel.create({ commentId: data.commentId, userId: data.userId, reply: data.reply })
    } catch (error) {
      console.error(error)
    }
  }

  async getReplies(commentId: string): Promise<ICommentReply[]> {
    try {
      return await this._commentReplyModel.find({ commentId: commentId })
        .populate('userId', 'fullName profileImage').sort({ createdAt: -1 })
        .lean()
    } catch (error) {
      console.error(error)
    }
  }

  async likeReply(replyId: string, userId: string) {
    try {
      const data = await this._commentReplyModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(replyId) }
      }, { $match: { likes: new mongoose.Types.ObjectId(userId) } }])
      if (data.length) {
        console.log("dislike")
        const dislike = await this._commentReplyModel.findByIdAndUpdate(replyId, { $pull: { likes: new mongoose.Types.ObjectId(userId) } }).lean()
      }
      if (data.length === 0) {
        console.log("like")
        const liked = await this._commentReplyModel.findByIdAndUpdate(replyId, { likes: new mongoose.Types.ObjectId(userId) })
      }

    } catch (error) {
      console.error(error)
    }
  }

  async submitShortsDetails(data: IShortsDto) {
    try {
      await this._videoModel.create({ artist: data.fullName, title: data.caption, description: data.description, shorts: true, link: data.link, artistId: data.artistId })
    } catch (error) {
      console.error(error)
    }
  }

  async createPlaylist(data: ICreatePlaylistDto) {
    try {
      const value = await this._playlistModel.create({ title: data.title, songsId: data.songId, access: data.visibility, userId: data.userId })
      return value
    } catch (error) {
      console.error(error)
    }
  }

  async getUserPlaylist(userId: string) {
    try {
      return await this._playlistModel.find({ userId: userId }).lean() as IUserPlaylists[]
    } catch (error) {
      console.error(error)
    }
  }

  async addToPlaylsit(playlistId: string, songId: string): Promise<boolean> {
    try {
      const data = await this._playlistModel.findOne({ _id: playlistId, songsId: { $in: [songId] } })
      if (data) {
        return true
      } else {
        await this._playlistModel.findOneAndUpdate({ _id: playlistId }, { $push: { songsId: songId } })
        return false
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylistSongs(playlistId: string): Promise<IUserPlaylists> {
    try {
      return await this._playlistModel.findOne({ _id: playlistId })
        .populate('songsId')
        .lean()
    } catch (error) {
      console.error(error)
    }
  }

  async getGenres(): Promise<IGenres[]> {
    try {
      return await this._genreModel.find().lean()
    } catch (error) {
      console.error(error)
    }
  }


  async getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]> {
    try {

      return await this._audioModel.find({ genreId: genreId })
        .populate('albumId', 'title thumbNailLink')
        .populate('artistId', 'fullName')
        .lean() as ISongsSameGenre[]

    } catch (error) {
      console.error(error)
    }
  }

  async getArtists(): Promise<IUserData[]> {
    try {
      return await this._userModel.find()
    } catch (error) {
      console.error(error)
    }
  }

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
        { $unwind: '$albumDetails' },
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
            }
          }
        }
      ])
      return data[0]
    } catch (error) {
      console.error(error)
    }
  }

  async replyToReply(replyToReply: IReplyToReplyDto) {
    try {
      return await this._replyToReplyModel.create({
        replyId: replyToReply.replyId,
        likes: replyToReply.likes,
        replyToReply: replyToReply.replyToReply,
        userId: replyToReply.userId
      })
    } catch (error) {
      console.error(error)
    }
  }

  // _id:string;
  // reply:string;
  // userId:{
  //   profileImage:string;
  //   fullName:string;
  // };
  // likes:ObjectId[];
  // tag:ObjectId

  async getrepliesToReply(replyId: string):Promise<IReplyToReply[]> {
    try {
      const data = await this._replyToReplyModel
        .aggregate([
          { $match: { replyId: new mongoose.Types.ObjectId(replyId) } },
          {
            $lookup: {
              from: 'users',
              foreignField: '_id',
              localField: 'userId',
              as: 'userData'
            }
          },
          { $unwind: '$userData' },
          {
            $project: {
              _id: 1,
              replyToReply: 1,
              likes: 1,
              userData: {
                _id:1,
                profileImage: 1,
                fullName: 1
              }
            }
          }
        ]) as IReplyToReply[]
      return data
    } catch (error) {
      console.error(error)
    }
  }

 
  async likeReplyToReply(replyToReplyId: string, userId: string) {
    try {
      const data = await this._replyToReplyModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(replyToReplyId) }
      }, { $match: { likes: new mongoose.Types.ObjectId(userId) } }])
      if (data.length) {
        console.log("dislike")
        const dislike = await this._replyToReplyModel.findByIdAndUpdate(replyToReplyId, { $pull: { likes: new mongoose.Types.ObjectId(userId) } }).lean()
      }
      if (data.length === 0) {
        console.log("like")
        const liked = await this._replyToReplyModel.findByIdAndUpdate(replyToReplyId, { likes: new mongoose.Types.ObjectId(userId) })
        console.log(replyToReplyId)
      }

    } catch (error) {
      console.error(error)
    }
  }



}       