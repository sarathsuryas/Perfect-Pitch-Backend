import { Playlist } from "../schema/playlist.schema";
import { IBaseRepository } from "./IBaseRepository";
import { IUserPlaylists } from "./IUserPlaylists";

export interface IPlaylistRepository  extends IBaseRepository<Playlist>{
   recommendedPlaylists(): Promise<IUserPlaylists[]> 
   addToPlaylsit(playlistId: string, songId: string): Promise<boolean> 
   getPlaylistSongs(playlistId: string, userId: string): Promise<IUserPlaylists> 
   getUserPublicPlaylist(userId: string):Promise<IUserPlaylists[]>
}