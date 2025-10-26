import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { EditProfileDto } from 'src/user/dtos/editProfile.dto';
import { IReturnEdit } from 'src/user/interfaces/IReturnEdit';
import { IUserData } from 'src/user/interfaces/IUserData';
import { IUserMedia } from 'src/user/interfaces/IUserMedia';
import { IUserRepository } from 'src/user/interfaces/IUserRepository';
import { IAlbumRepository } from 'src/user/interfaces/IAlbumRepository';
import { IVideoRepository } from 'src/user/interfaces/IVideoRepository';
import { IPlaylistRepository } from 'src/user/interfaces/IPlaylistRepository';
import { IPresignedUrlService } from 'src/user/interfaces/presigned-url-service.interface';
import { IUserService } from 'src/user/interfaces/IUserService';
@Injectable()
export class UserService implements IUserService{
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IAlbumRepository')
    private readonly _albumRepository: IAlbumRepository,

    @Inject('IVideoRepository')
    private readonly _videoRepository: IVideoRepository,

    @Inject('IPlaylistRepository')
    private readonly _playlistRepository: IPlaylistRepository,

    @Inject('IPresignedUrlService')
    private readonly _presignedUrlService: IPresignedUrlService,
  ) {}

  async getUserData(id: string): Promise<IUserData> {
    try {
      const user = await this._userRepository.getUser(id)
      const now = new Date();
      if (user.profileImageUrlExpiresAt < now) {
        // const key = `perfect-pitch`   req.user._id, fileName, contentType
        // const url = await this._presignedUrlService.getPresignedSignedUrl(key)
        // const image = await this._userRepository.updateProfileImage(user._id, url.url)
      }
      return user
    } catch (error) {
      console.error(error)
    }
  }
  async updateProfileImage(_id: string, link: string): Promise<string> {
    try {
      const imageLink = await this._userRepository.updateProfileImage(_id, link)
      return imageLink
    } catch (error) {
      console.error(error)
    }
  }

  async editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit> {
    try {
      const updatedData = await this._userRepository.editProfile(data, email)
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
      const user = await this._userRepository.resetPassword(_id, hash)
      if (user) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }
  async submitProfileImageDetails(uniqueKey: string, userId: string):Promise<void> {
    try {
      const uniqueUrl = this._presignedUrlService.getFileUrl(uniqueKey)
      await this._userRepository.updateProfileImage(userId, uniqueUrl)
    } catch (error) {
      console.error(error)
    }
  }

  async subscribeArtist(subscribedUserId: string, artistId: string):Promise<void> {
    try {
      await this._userRepository.subscribeArtist(subscribedUserId, artistId)
    } catch (error) {
      console.error(error)
    }
  }
  async getArtists(data:{page:number,perPage:number}): Promise<IUserData[]> {
    try {
      return await this._userRepository.getArtists(data)
    } catch (error) {
      console.error(error)
    }
  }

  async searchArtists(query: string): Promise<IUserData[]> {
    try {
      return await this._userRepository.searchArtists(query)
    } catch (error) {
      console.error(error)
    }
  }

  async getArtistMedias(artistId: string): Promise<IUserMedia> {
    try {
      const albums = await this._albumRepository.getUserAlbums(artistId)
      const videos = await this._videoRepository.getUserVideos(artistId)
      const playlists = await this._playlistRepository.getUserPublicPlaylist(artistId)
      return {
        albums,
        videos,
        playlists
      }
    } catch (error) {
      console.error(error)
    }
  }  

  

}
