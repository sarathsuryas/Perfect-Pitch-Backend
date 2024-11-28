import { IAlbumData } from "./IAlbumData";
import { IUserPlaylists } from "./IUserPlaylists";
import { IVideoList } from "./IVideoList";

export interface IUserMedia {
  albums:IAlbumData[];
  videos:IVideoList[];
  playlists:IUserPlaylists[]
}