import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ICreatePlaylistDto } from 'src/user/dtos/ICreatePlaylist.dto';
import { IUserPlaylists } from 'src/user/interfaces/IUserPlaylists';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';

@Injectable()
export class PlaylistService {
  constructor(private _playlistRepository:PlaylistRepository) {}
  async createPlaylist(data: ICreatePlaylistDto):Promise<IUserPlaylists | unknown>  {
    try {
      return await this._playlistRepository.create<ICreatePlaylistDto>(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getUserPlaylist(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
       const filter = { userId: data.userId };      
      return await this._playlistRepository.findAll<IUserPlaylists>(filter,(data.page - 1) * data.perPage,data.perPage,false)
    } catch (error) {
      console.error(error)
    }
  }
  async getAllPlaylistUser(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
      const filter = { userId: data.userId };      
      return await this._playlistRepository.findAll<IUserPlaylists>(filter,(data.page - 1) * data.perPage,data.perPage,false)
    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylists(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
      const filter = {
        $and: [
          { userId: new mongoose.Types.ObjectId(data.userId)  },
          { access: 'public' }       
        ]
      }
      return await this._playlistRepository.findAll(filter,(data.page - 1) * data.perPage,data.perPage,false)
    } catch (error) {
      console.error(error)
    }
  }


  async searchPlaylist(query: string): Promise<IUserPlaylists[]> {
    try {
      return await this._playlistRepository.findByQuery<IUserPlaylists>({
        $and:[
         { title: { $regex: `^${query}`, $options: 'i' }},
         {access:'public'}
        ]
         })
    } catch (error) {
      console.error(error)
    }
  }


  async addToPlaylist(playlistId: string, songId: string): Promise<boolean>  {
    try {
      return await this._playlistRepository.addToPlaylsit(playlistId, songId)
    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists> {
    try {
      return await this._playlistRepository.getPlaylistSongs(playlistId, userId)
    } catch (error) {
      console.error(error)
    }
  }
}
