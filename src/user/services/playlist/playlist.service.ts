import { Injectable } from '@nestjs/common';
import { ICreatePlaylistDto } from 'src/user/dtos/ICreatePlaylist.dto';
import { IUserPlaylists } from 'src/user/interfaces/IUserPlaylists';
import { PlaylistRepository } from 'src/user/repositories/playlist.repository';

@Injectable()
export class PlaylistService {
  constructor(private _playlistRepository:PlaylistRepository) {}
  async createPlaylist(data: ICreatePlaylistDto) {
    try {
      return await this._playlistRepository.createPlaylist(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getUserPlaylist(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
      return await this._playlistRepository.getUserPlaylist(data)
    } catch (error) {
      console.error(error)
    }
  }
  async getAllPlaylistUser(userId:string): Promise<IUserPlaylists[]> {
    try {
      return await this._playlistRepository.getAllPlaylistUser(userId)
    } catch (error) {
      console.error(error)
    }
  }

  async getPlaylists(data: { userId: string, page: number, perPage: number }): Promise<IUserPlaylists[]> {
    try {
      return await this._playlistRepository.getPlaylists(data)
    } catch (error) {
      console.error(error)
    }
  }


  async searchPlaylist(query: string): Promise<IUserPlaylists[]> {
    try {
      return await this._playlistRepository.searchPlaylist(query)
    } catch (error) {
      console.error(error)
    }
  }


  async addToPlaylist(playlistId: string, songId: string) {
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
