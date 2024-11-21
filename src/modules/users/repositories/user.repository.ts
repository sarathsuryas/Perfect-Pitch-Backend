import { InjectModel } from "@nestjs/mongoose";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Model } from "mongoose";
import { User } from "../schema/user.schema";
import { Otp } from "../schema/otp.schema";
import { Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { CreateUserDto } from "../../admin/dtos/createUser.dto";
import { IStoredOtp } from "../interfaces/IStoredOtp";
import { ICreatedUser } from "../../admin/interfaces/ICreatedUser";
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
import { ISuggestionCommentResponse } from "../interfaces/ISuggestionCommentResponse";
import { IGoogleLoginDto } from "../dtos/IGoogleLogin.dto";
import { CommentReply } from "../schema/commentReply.schema";
import { ICommentReplyDto } from "../dtos/ICommentReply.dto";
import { ICommentReply } from "../interfaces/ICommentReplies";
import { IShortsDto } from "../dtos/IShorts.dto";
import { IResponseShorts } from "../interfaces/IResponseShorts";
import { IAudioDto } from "../dtos/IAudio.dto";
import { ICreatePlaylistDto } from "../dtos/ICreatePlaylist.dto";
import { Playlist } from "../schema/playlist.schema";
import { IUserPlaylists } from "../interfaces/IUserPlaylists";
import { Genres } from "../schema/genres.schema";
import { IGenres } from "src/modules/admin/interfaces/IGenres";
import { ISongsSameGenre } from "../interfaces/ISongsSameGenre";
import { ISubmitSongDetails } from "../interfaces/ISubmitSongDetails";
import { v4 as uuidv4 } from 'uuid';
import { ISongData } from "../interfaces/ISongData";
import { ReplyToReply } from "../schema/replyToReply.schema";
import { IReplyToReplyDto } from "../dtos/IReplyToReply.dto";
import { IReplyToReply } from "../interfaces/IReplyToReply";
import { MemberShip } from "../schema/membership.schema";
import { PaymentSuccessDto } from "../dtos/paymentSuccess.dto";
import { Payment } from "../schema/payment.schema";
import { IUserMedia } from "../interfaces/IUserMedia";
import { Live } from "../schema/live.schema";
import { ICreateLive } from "../interfaces/ICreateLive";
import { title } from "process";
import { ILiveStreams } from "../interfaces/ILiveStreams";
import { IMessageDto } from "../dtos/IMessageDto";
import { LiveChat } from "../schema/liveChat.schema";
import { IChats } from "../interfaces/IChats";
import { ILive } from "../interfaces/ILive";


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
    @InjectModel('ReplyToReply') private _replyToReplyModel: Model<ReplyToReply>,
    @InjectModel('MemberShip') private _memberShipModel: Model<MemberShip>,
    @InjectModel('Payment') private _paymentModel: Model<Payment>,
    @InjectModel('Live') private _liveModel: Model<Live>,
    @InjectModel('LiveChat') private _chatModel: Model<LiveChat>
  ) {
    this.getLiveStreams()
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

      const exist = await this._userModel.findOne({ email: { $regex: `^${email}`, $options: 'i' } })

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
      console.log((data.page - 1) * data.perPage)
      console.log(data.perPage)
      const videos = await this._videoModel.find({ shorts: false }, { artist: 1, title: 1, description: 1, thumbnailLink: 1, visibility: 1, link: 1 })
        .skip((data.page - 1) * data.perPage)
        .limit(data.perPage)
        .lean() as IVideoList[]
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

  async getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.find({}, { title: 1, artistName: 1, visibility: 1, thumbNailLink: 1, uuid: 1 })
        .skip((data.page - 1) * data.perPage)
        .limit(data.perPage)
        .populate('artistId', "fullName")
        .lean() as IAlbumData[]

      return result
    } catch (error) {
      console.error(error)
    }
  }

  async getArtistAlbums(artistId: string): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.find({ artistId: artistId }, { title: 1, artistName: 1, visibility: 1, thumbNailLink: 1, uuid: 1 })
        .populate('artistId', "fullName")
        .lean() as IAlbumData[]
      return result
    } catch (error) {
      console.error(error)
    }
  }



  async searchAlbum(query: string): Promise<IAlbumData[]> {
    try {
      const result = await this._albumModel.find({ title: { $regex: `^${query}`, $options: 'i' } }, { title: 1, artistName: 1, visibility: 1, thumbNailLink: 1, uuid: 1 })
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

  async getAlbumDetails(id: string): Promise<IAlbumData> {
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
      return result[0]
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
      console.log(data)
      const value = await this._playlistModel.create({ title: data.title, songsId: data.songId, access: data.visibility, userId: data.userId, thumbNailLink: data.thumbNailLink })
      return value
    } catch (error) {
      console.error(error)
    }
  }

  async getUserPlaylist(data: { userId: string, page: number, perPage: number }) {
    try {
      return await this._playlistModel.find({ userId: data.userId })
        .skip((data.page - 1) * data.perPage)
        .limit(data.perPage)
        .lean() as IUserPlaylists[]
    } catch (error) {
      console.error(error)
    }
  }
  async searchPlaylist(query: string) {
    try { 
      return await this._playlistModel.find({ title: { $regex: `^${query}`, $options: 'i' } }).lean() as IUserPlaylists[]
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
        .populate({
          path: 'songsId',
          populate: {
            path: 'artistId',
            model: 'User',
            select: '_id fullName'
          },

        })
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
  async searchArtists(query: string): Promise<IUserData[]> {
    try {
      return await this._userModel.find({ fullName: { $regex: `^${query}`, $options: 'i' } })
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

  async getPlaylistSong(playlistId: string) {
    try {

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


  async getrepliesToReply(replyId: string): Promise<IReplyToReply[]> {
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
                _id: 1,
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

      }

    } catch (error) {
      console.error(error)
    }
  }
  async paymentSuccess(data: PaymentSuccessDto) {
    try {
      await this._paymentModel.create({
        paymentId: data.id,
        amount: data.amount_subtotal / 100,
        userId: data.customer_details.userId,
        email: data.customer_details.email,
        name: data.customer_details.name,
        valid: true,
        expires_at: data.expires_at,
        paymentIntent: data.payment_intent,
        paymentStatus: data.payment_status,
        status: data.status,
        memberShipId: data.memberShipId
      })
      await this._memberShipModel.findOneAndUpdate({ _id: data.memberShipId, }, { users: data.customer_details.userId })
      await this._userModel.findOneAndUpdate({ _id: data.customer_details.userId }, { premiumUser: true })
    } catch (error) {
      console.error(error)
    }
  }

  async getMemberShip() {
    try {
      return await this._memberShipModel.find({ isBlocked: false })
    } catch (error) {
      console.error(error)
    }
  }




  async checkActiveMemberShip(userId: string) {
    try {
      const data = await this._paymentModel.findOne({ userId: userId })
      if (data) {
        return true
      } else {
        return false 
      }
    } catch (error) {
      console.error(error)
    }
  }

  async getArtistMedias(artistId: string): Promise<IUserMedia> {
    try {
      const albums = await this._albumModel.find({ artistId: artistId }, { title: 1, artistName: 1, visibility: 1, thumbNailLink: 1, uuid: 1 })
        .populate('artistId', "fullName")
        .lean() as IAlbumData[]
      const playlists = await this._playlistModel.find({ userId: artistId, access: 'public' }).lean() as IUserPlaylists[]
      const videos = await this._videoModel.find({ artistId: artistId, shorts: false }, { artist: 1, title: 1, description: 1, thumbnailLink: 1, visibility: 1, link: 1 }).lean() as IVideoList[]
      const obj: IUserMedia = {
        albums: albums,
        videos: videos,
        playlists: playlists
      }

      return obj
    } catch (error) {
      console.error(error)
    }
  }

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


  async StoreChat(data: IMessageDto) {
    try {
      await this._chatModel.create({
        streamKey: data.streamKey,
        userId: data.userId,
        message: data.message
      })
    } catch (error) {
      console.error(error)
    }
  }

  async getChat(streamKey: string): Promise<IChats[]> {
    try {
      const chats = await this._chatModel.aggregate([
        { $match: { streamKey: streamKey } },
        {
          $lookup: {
            from: "users",
            foreignField: '_id',
            localField: 'userId',
            as: 'userData'
          }
        },
        { $unwind: '$userData' },
        {
          $project: {
            streamKey: 1,
            message: 1,
            userData: {
              _id: 1,
              fullName: 1
            },
            createdAt: 1
          }
        },
        { $sort: { createdAt: 1 } }
      ]) as IChats[]

      return chats
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