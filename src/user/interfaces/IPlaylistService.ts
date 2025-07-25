import { ICreatePlaylistDto } from '../dtos/ICreatePlaylist.dto';
import { IUserPlaylists } from './IUserPlaylists';

export interface IPlaylistService {
  createPlaylist(data: ICreatePlaylistDto): Promise<IUserPlaylists | unknown>;
  getUserPlaylist(data: { userId: string; page: number; perPage: number }): Promise<IUserPlaylists[]>;
  getAllPlaylistUser(data: { userId: string; page: number; perPage: number }): Promise<IUserPlaylists[]>;
  getPlaylists(data: { userId: string; page: number; perPage: number }): Promise<IUserPlaylists[]>;
  searchPlaylist(query: string): Promise<IUserPlaylists[]>;
  addToPlaylist(playlistId: string, songId: string): Promise<boolean>;
  getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists>;
}
