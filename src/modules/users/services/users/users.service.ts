import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import configuration from '../../../../config/configuration';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { UserRepository } from '../../repositories/user.repository';
import { RegisterUserDto } from '../../dtos/registerUser.dto';
import { IUserData } from '../../interfaces/IUserData';
import { CreateUserDto } from '../../../../admin/dtos/createUser.dto';
import { LoginUserDto } from '../../dtos/loginUser.dto';
import { IReturnUserData } from '../../../../admin/interfaces/IReturnUserData';
import { IUserResetToken } from '../../interfaces/IUserResetToken';
import { IReturnEdit } from '../../interfaces/IReturnEdit';
import { EditProfileDto } from '../../dtos/editProfile.dto';
import { UploadService } from '../upload/upload.service';
import { IVideoList } from '../../interfaces/IVideoList';
import { IAlbumDetails } from '../../interfaces/albumDetails';
import { IAlbumData } from '../../interfaces/IAlbumData';
import { IResponseVideo } from '../../interfaces/IResponseVideo';
import { PresignedUrlService } from '../presigned-url/presigned-url.service';
import { IVideoCommentDto } from '../../dtos/IVideoComment.dto';
import { IGoogleLoginDto } from '../../dtos/IGoogleLogin.dto';
import { ICommentResponse } from '../../interfaces/ICommentResponse';
import { ICommentReplyDto } from '../../dtos/ICommentReply.dto';
import { IShortsDto } from '../../dtos/IShorts.dto';
import { IVideoDetails } from '../../interfaces/IVideoDetails';
import { IResponseShorts } from '../../interfaces/IResponseShorts';
import { ObjectId } from 'mongoose';
import { IAlbumResponse } from '../../interfaces/IAlbumResponse';
import { ICreatePlaylistDto } from '../../dtos/ICreatePlaylist.dto';
import { IUserPlaylists } from '../../interfaces/IUserPlaylists';
import { IGenres } from 'src/admin/interfaces/IGenres';
import { ISongsSameGenre } from '../../interfaces/ISongsSameGenre';
import { ISubmitSongDetailsDto } from '../../dtos/ISubmitSongDetails.dto';
import { ISubmitSongDetails } from '../../interfaces/ISubmitSongDetails';
import { ISongData } from '../../interfaces/ISongData';
import { IReplyToReplyDto } from '../../dtos/IReplyToReply.dto';
import { IReplyToReply } from '../../interfaces/IReplyToReply';
import { IUserMedia } from '../../interfaces/IUserMedia';
import { ICreateLive } from '../../interfaces/ICreateLive';
import { ILiveStreams } from '../../interfaces/ILiveStreams';
import { IChats } from '../../interfaces/IChats';
import { ILive } from '../../interfaces/ILive';
import { IHomePageData } from '../../interfaces/IHomePageData';


@Injectable()
export class UsersService {

  constructor(
    private readonly _usersRepository: UserRepository,
    private readonly _mailService: MailerService,
    private readonly _jwtService: JwtService,
    private readonly _uploadService: UploadService,
    private readonly _presignedUrlService: PresignedUrlService
  ) { }


  async checkUser(userData: RegisterUserDto): Promise<string | RegisterUserDto> {
    try {
      const result = await this._usersRepository.checkUser(userData)
      const { email } = userData
      console.log(email, 'from service')
      if (result) {
        function generateOTP() {
          let digits = '0123456789';
          let OTP = '';
          let len = digits.length
          for (let i = 0; i < 5; i++) {
            OTP += digits[Math.floor(Math.random() * len)];
          }

          return OTP;
        }
        const otp = generateOTP()
        console.log(otp, "genereated from Service")
        const html = readFileSync(join(__dirname, '../../../../../public/otp.html'), "utf-8")
        const updatedContent = html.replace(
          '<strong style="font-size: 130%" id="otp"></strong>',
          `<strong style="font-size: 130%" id="otp">${otp}</strong>`
        );

        const message = `For Registering your account please use this OTP`;
        const data = await this._mailService.sendMail({
          from: configuration().userEmail,
          to: email,
          subject: `Otp`,
          text: message,
          html: updatedContent
        });

        await this._usersRepository.storeOtp(otp)
        return userData

      } else {
        return "user data exist please login"
      }
    } catch (error) {
      console.error(error)
    }
  }

  async verifyOtp(userData: string, otp: string): Promise<IUserData | string> {
    try {
      const { storedOtp } = await this._usersRepository.returnOtp()
      const parsedData: CreateUserDto = JSON.parse(userData)


      if (otp === storedOtp) {
        console.log(otp === storedOtp, "data")
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(parsedData.data.password, salt);
        const result = await this._usersRepository.createUser(parsedData, hash)
        const { _id, fullName, email, isAdmin, isBlocked } = result
        const payload = { _id, fullName, email, isAdmin, isBlocked }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "7d" })
        await this._usersRepository.refreshTokenSetup(refreshToken, _id)
        const obj: IUserData = {
          _id: _id,
          fullName: fullName,
          email: email,
          isBlocked: isBlocked,
          isAdmin: isAdmin,
          refreshToken: refreshToken,
          token: accessToken
        }
        return obj
      } else {
        return "OTP Not Matching"
      }
    } catch (error) {
      console.error(error)
    }
  }

  async login(userData: LoginUserDto): Promise<IReturnUserData | string> {
    try {

      const user = await this._usersRepository.existUser(userData.email)

      if (user && user.isBlocked) {
        return 'you cant login'
      }

      if (user) {
        const success = await bcrypt.compare(userData.password, user.password)
        if (success) {
          const payload = {
            _id: user._id + '',
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked
          }
          const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "5h" })
          const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "7d" })
          await this._usersRepository.refreshTokenSetup(refreshToken, user._id)
          const obj = {
            token: accessToken,
            refreshToken: refreshToken,
            userData: payload
          }
          return obj
        } else {
          return "the password is wrong"
        }
      } else {
        return "user Data does not exist please Sign Up"
      }
    } catch (error) {
      console.error(error)
    }
  }



  async googleLogin(userData: IGoogleLoginDto): Promise<IReturnUserData | string> {
    try {

      const user = await this._usersRepository.existUser(userData.email)
      if (user?.isBlocked) {
        return 'you cant login'
      }

      if (user) {
        const payload = {
          _id: user._id + '',
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked
        }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
        await this._usersRepository.refreshTokenSetup(refreshToken, user._id)
        const obj = {
          token: accessToken,
          refreshToken: refreshToken,
          userData: payload
        }
        return obj
      } else {
        const data = await this._usersRepository.createUserUsingGoogleLogin(userData)

        const payload = {
          _id: data._id + '',
          email: data.email,
          fullName: data.fullName,
          isAdmin: data.isAdmin,
          isBlocked: data.isBlocked
        }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
        await this._usersRepository.refreshTokenSetup(refreshToken, data._id)
        const obj = {
          token: accessToken,
          refreshToken: refreshToken,
          userData: payload
        }
        return obj

      }
    } catch (error) {
      console.error(error)
    }
  }


  async resendOtp(email: string): Promise<void> {
    try {
      function generateOTP() {
        let digits = '0123456789';
        let OTP = '';
        let len = digits.length
        for (let i = 0; i < 5; i++) {
          OTP += digits[Math.floor(Math.random() * len)];
        }

        return OTP;
      }
      const otp = generateOTP()
      console.log(otp, "genereated from Service")
      const html = readFileSync(join(__dirname, '../../../../../public/otp.html'), "utf-8")
      const updatedContent = html.replace(
        '<strong style="font-size: 130%" id="otp"></strong>',
        `<strong style="font-size: 130%" id="otp">${otp}</strong>`
      );

      const message = `For Registering your account please use this OTP`;
      const data = await this._mailService.sendMail({
        from: configuration().userEmail,
        to: email,
        subject: `Otp`,
        text: message,
        html: updatedContent
      });
      await this._usersRepository.storeOtp(otp)
    } catch (error) {
      console.error(error)
    }
  }


  async decodeToken(token: string): Promise<IUserData> {
    try {
      const decoded = await this._jwtService.decode(token)
      const obj: IUserData = {
        _id: decoded._id,
        email: decoded.email,
        fullName: decoded.fullName,
        isAdmin: decoded.isAdmin,
        isBlocked: decoded.isBlocked,
      }
      return obj
    } catch (error) {
      console.error(error)
    }
  }


  async createAccessToken(payload: IUserData): Promise<string> {
    try {
      const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "5h" })

      return accessToken
    } catch (error) {
      console.error(error)
    }
  }

  async getRefreshToken(payload: IUserData): Promise<string> {
    try {

      const refreshToken = await this._usersRepository.getRefreshToken(payload.email)

      await this._jwtService.verifyAsync(refreshToken,
        {
          secret: configuration().jwtSecret
        }
      )
      return refreshToken

    } catch (error) {
      console.error(error)
      return "refreshToken expired"
    }
  }


  async existUser(email: string): Promise<string> {
    try {
      const user = await this._usersRepository.getUserId(email)
      if (user === "undefined") {
        return user
      } else {
        return user
      }
    } catch (error) {
      console.error(error)
    }
  }


  async savePasswordResetToken(id: string, email: string): Promise<boolean> {
    try {
      const resetToken = crypto.randomBytes(16).toString('hex')
      const result = await this._usersRepository.savePasswordResetToken(id, resetToken)
      const data = await this._mailService.sendMail({
        from: configuration().userEmail,
        to: email,
        subject: "Password Reset",
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200/reset-password-form/' + resetToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      });
      return result
    } catch (error) {
      console.error(error)
    }
  }
  async getResetPasswordToken(resetToken: string) {
    try {
      const data = await this._usersRepository.getResetPasswordToken(resetToken)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async newPassword(password: string, UserId: string): Promise<boolean> {
    try {
      const data = await this._usersRepository.newPassword(password, UserId) as IUserResetToken
      if (data) {
        const admin = await this._usersRepository.getUser(data._userId)
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const result = await this._usersRepository.updatePassword(data._userId, hash)
        if (result) {
          return true
        } else {
          return false
        }

      }
    } catch (error) {
      console.error(error)
    }
  }
  async getUserData(id: string): Promise<IUserData> {
    try {
      const user = await this._usersRepository.getUser(id)
      const now = new Date();
      if (user.profileImageUrlExpiresAt < now) {
        const key = `perfect-pitch`
        const url = await this._uploadService.getPresignedSignedUrl(key)
        const image = await this._usersRepository.updateProfileImage(user._id, url.url)
      }
      return user
    } catch (error) {
      console.error(error)
    }
  }
  async updateProfileImage(_id: string, link: string): Promise<string> {
    try {
      const imageLink = await this._usersRepository.updateProfileImage(_id, link)
      return imageLink
    } catch (error) {
      console.error(error)
    }
  }

  async editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit> {
    try {
      const updatedData = await this._usersRepository.editProfile(data, email)
      return updatedData
    } catch (error) {
      console.error(error)
    }
  }

  async checkPassword(password: string, checkPassword: string): Promise<boolean> {
    try {

      const success = await bcrypt.compare(checkPassword, password)
      if (success) {
        return true
      }
      else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  async resetPassword(_id: string, password: string): Promise<boolean> {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const user = await this._usersRepository.resetPassword(_id, hash)
      if (user) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  async SubmitVideoDetails(videoName: string, videoDescription: string, genreId: string, artistId: string, videoLink: string, thumbNailLink: string, artist: string) {
    try {
      const data = await this._usersRepository.uploadVideo(videoName, videoDescription, genreId, artistId, videoLink, thumbNailLink, artist)
      return data._id
    } catch (error) {
      console.error(error)
    }
  }

  async listVideos(data: { page: number, perPage: number }): Promise<IVideoList[]> {
    try {
      return await this._usersRepository.listVideos(data)
    } catch (error) {
      console.error(error)
    }
  }
  async searchVideos(query: string): Promise<IVideoList[]> {
    try {
      return await this._usersRepository.searchVideos(query)
    } catch (error) {
      console.error(error)
    }
  }

  async submitAlbumDetails(details: IAlbumDetails, uuids: string[]) {
    try {
      const album = await this._usersRepository.submitAlbumDetails(details, uuids)
      for (let i = 0; i < details.songs.length; i++) {
        details.songs[i].albumId = album._id as ObjectId
        details.songs[i].genreId = details.genreId
      }
      const data = await this._usersRepository.submitAudioDetails(details)
      return album
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbums(data: { page: number, perPage: number }): Promise<IAlbumData[]> {
    try {
      return await this._usersRepository.getAlbums(data)
    } catch (error) {
      console.error(error)
    }
  }
  async recommended(): Promise<IHomePageData> {
    try {
      const albums = await this._usersRepository.recommendedAlbums()
      const artists = await this._usersRepository.recomendedArtists()
      const videos = await this._usersRepository.recommendedVideos()
      const playlists = await this._usersRepository.recommendedPlaylists()
      return {
        albums,
        artists,
        playlists,
        videos
      }
    } catch (error) {
      console.error(error)
    }
  }


  async getArtistAlbums(artistId: string): Promise<IAlbumData[]> {
    try {
      return await this._usersRepository.getArtistAlbums(artistId)
    } catch (error) {
      console.error(error)
    }
  }

  async searchAlbums(query: string): Promise<IAlbumData[]> {
    try {
      return await this._usersRepository.searchAlbum(query)
    } catch (error) {
      console.error(error)
    }
  }


  async submitSingleDetails(data: ISubmitSongDetails) {
    try {
      return await this._usersRepository.submitSingleDetails(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getAlbumDetails(id: string, userId: string): Promise<IAlbumData> {
    try {
      return await this._usersRepository.getAlbumDetails(id, userId)
    } catch (error) {
      console.log(error)
    }
  }

  async getShorts(userId: string): Promise<IResponseShorts> {
    try {
      return await this._usersRepository.getShorts(userId)
    } catch (error) {
      console.log(error)
    }
  }

  async getVideoDetails(id: string, userId: string): Promise<IResponseVideo> {
    try {
      return this._usersRepository.getVideoDetails(id, userId)
    } catch (error) {
      console.error(error)
    }
  }
  async likeVideo(videoId: string, userId: string) {
    try {
      return await this._usersRepository.likeVideo(videoId, userId)
    } catch (error) {
      console.error(error)
    }
  }

  async subscribeArtist(subscribedUserId: string, artistId: string) {
    try {
      await this._usersRepository.subscribeArtist(subscribedUserId, artistId)
    } catch (error) {
      console.error(error)
    }
  }

  async submitProfileImageDetails(uniqueKey: string, userId: string) {
    try {
      const uniqueUrl = this._presignedUrlService.getFileUrl(uniqueKey)
      await this._usersRepository.updateProfileImage(userId, uniqueUrl)
    } catch (error) {
      console.error(error)
    }
  }

  async addVideoComment(comment: IVideoCommentDto) {
    try {
      return await this._usersRepository.addVideoComment(comment)
    } catch (error) {
      console.error(error)
    }
  }

  async likeComment(commentId: string, userId: string) {
    try {
      return await this._usersRepository.likeComment(commentId, userId)
    } catch (error) {
      console.error(error)
    }
  }

  async getComments(videoId: string): Promise<ICommentResponse[]> {
    try {
      return await this._usersRepository.getComments(videoId)
    } catch (error) {
      console.error(error)
    }
  }

  async replyComment(data: ICommentReplyDto) {
    try {
      await this._usersRepository.replyComment(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getReplies(commentId: string) {
    try {
      return await this._usersRepository.getReplies(commentId)
    } catch (error) {
      console.error(error)
    }
  }

  async likeReply(replyId: string, userId: string) {
    try {
      await this._usersRepository.likeReply(replyId, userId)
    } catch (error) {
      console.error(error)
    }
  }
  async likeReplyToReply(replyToReplyId: string, userId: string) {
    try {
      await this._usersRepository.likeReplyToReply(replyToReplyId, userId)
    } catch (error) {
      console.error(error)
    }
  }


  async submitShortsDetails(data: IShortsDto) {
    try {
      await this._usersRepository.submitShortsDetails(data)
    } catch (error) {
      console.error(error)
    }
  }

  async createPlaylist(data: ICreatePlaylistDto) {
    try {
      return await this._usersRepository.createPlaylist(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getUserPlaylist(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
      return await this._usersRepository.getUserPlaylist(data)
    } catch (error) {
      console.error(error)
    }
  }
  async getAllPlaylistUser(userId:string): Promise<IUserPlaylists[]> {
    try {
      return await this._usersRepository.getAllPlaylistUser(userId)
    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylists(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
      return await this._usersRepository.getPlaylists(data)
    } catch (error) {
      console.error(error)
    }
  }


  async searchPlaylist(query: string): Promise<IUserPlaylists[]> {
    try {
      return await this._usersRepository.searchPlaylist(query)
    } catch (error) {
      console.error(error)
    }
  }


  async addToPlaylist(playlistId: string, songId: string) {
    try {
      return await this._usersRepository.addToPlaylsit(playlistId, songId)
    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists> {
    try {
      return await this._usersRepository.getPlaylistSongs(playlistId, userId)
    } catch (error) {
      console.error(error)
    }
  }

  async getGenres(): Promise<IGenres[]> {
    try {
      return await this._usersRepository.getGenres()
    } catch (error) {
      console.error(error)
    }
  }

  async getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]> {
    try {
      return await this._usersRepository.getSameGenreSongs(genreId)
    } catch (error) {
      console.error(error)
    }
  }

  async getArtists(): Promise<IUserData[]> {
    try {
      return await this._usersRepository.getArtists()
    } catch (error) {
      console.error(error)
    }
  }

  async searchArtists(query: string): Promise<IUserData[]> {
    try {
      return await this._usersRepository.searchArtists(query)
    } catch (error) {
      console.error(error)
    }
  }

  async getSong(songId: string): Promise<ISongData> {
    try {
      return await this._usersRepository.getSong(songId)
    } catch (error) {
      console.error(error)
    }
  }

  async replyToReply(data: IReplyToReplyDto) {
    try {
      return await this._usersRepository.replyToReply(data)
    } catch (error) {
      console.error(error)
    }
  }
  async getRepliesToReply(replyId: string): Promise<IReplyToReply[]> {
    try {
      return await this._usersRepository.getrepliesToReply(replyId)
    } catch (error) {
      console.error(error)
    }
  }
  async getMemberShip() {
    try {
      return await this._usersRepository.getMemberShip()
    } catch (error) {
      console.error(error)
    }
  }

  async checkActiveMemberShip(userId: string) {
    try {
      return await this._usersRepository.checkActiveMemberShip(userId)
    } catch (error) {
      console.error(error)
    }
  }
  async getArtistMedias(artistId: string): Promise<IUserMedia> {
    try {
      const albums = await this._usersRepository.getUserAlbums(artistId)
      const videos = await this._usersRepository.getUserVideos(artistId)
      const playlists = await this._usersRepository.getUserPublicPlaylist(artistId)
      return {
        albums,
        videos,
        playlists
      }
    } catch (error) {
      console.error(error)
    }
  }

  async createLive(data: ICreateLive): Promise<string> {
    try {
      return await this._usersRepository.createLive(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getLiveStreams(): Promise<ILiveStreams[]> {
    try {
      return await this._usersRepository.getLiveStreams()
    } catch (error) {
      console.error(error)
    }
  }


  async getChats(streamKey: string): Promise<IChats[]> {
    try {
      return await this._usersRepository.getChat(streamKey)
    } catch (error) {
      console.error(error)
    }
  }

  async getLiveVideoDetails(streamKey: string): Promise<ILive> {
    try {
      return await this._usersRepository.getLiveVideoDetails(streamKey)
    } catch (error) {
      console.error(error)
    }
  }

  async stopStreaming(streamKey: string) {
    try {
      return await this._usersRepository.stopStream(streamKey)
    } catch (error) {
      console.error(error)
    }
  }

}

