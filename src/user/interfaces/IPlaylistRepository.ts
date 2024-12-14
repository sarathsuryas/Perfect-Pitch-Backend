import { IUserPlaylists } from "./IUserPlaylists";

export interface IPlaylistRepository {
   recommendedPlaylists(): Promise<IUserPlaylists[]> 
   addToPlaylsit(playlistId: string, songId: string): Promise<boolean> 
   getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists> 
   getUserPublicPlaylist(userId: string):Promise<IUserPlaylists[]>
}