import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { EditProfileDto } from 'src/modules/users/dtos/editProfile.dto';
import { IReturnEdit } from 'src/modules/users/interfaces/IReturnEdit';
import { IUserData } from 'src/modules/users/interfaces/IUserData';
import { UploadService } from 'src/modules/users/services/upload/upload.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { PresignedUrlService } from '../presigned-url/presigned-url.service';
import { IUserMedia } from 'src/modules/users/interfaces/IUserMedia';
import { AlbumRepository } from 'src/user/repositories/album.repository';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';
import { VideoRepository } from 'src/user/repositories/video.repository';
@Injectable()
export class UserService {
  constructor(private _userRepository:UserRepository,private _uploadService:UploadService,private _presignedUrlService:PresignedUrlService,private _albumRepository:AlbumRepository,private _playlistRepository:PlaylistRepository,private _videoRepository:VideoRepository) {}
  async getUserData(id: string): Promise<IUserData> {
    try {
      const user = await this._userRepository.getUser(id)
      const now = new Date();
      if (user.profileImageUrlExpiresAt < now) {
        const key = `perfect-pitch`
        const url = await this._uploadService.getPresignedSignedUrl(key)
        const image = await this._userRepository.updateProfileImage(user._id, url.url)
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
  async submitProfileImageDetails(uniqueKey: string, userId: string) {
    try {
      const uniqueUrl = this._presignedUrlService.getFileUrl(uniqueKey)
      await this._userRepository.updateProfileImage(userId, uniqueUrl)
    } catch (error) {
      console.error(error)
    }
  }

  async subscribeArtist(subscribedUserId: string, artistId: string) {
    try {
      await this._userRepository.subscribeArtist(subscribedUserId, artistId)
    } catch (error) {
      console.error(error)
    }
  }
  async getArtists(): Promise<IUserData[]> {
    try {
      return await this._userRepository.getArtists()
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
