import { IAudioDto } from "../dtos/IAudio.dto";

export interface IAlbumDetails {
  title:string;
  artistId:string;
  thumbNailLink:string;
  genreId:string;
  songs:IAudioDto[]
}