import { IAudioDto } from "../dtos/IAudio.dto";
import { Document } from "mongoose"

export interface IAlbumDetails {
  title:string;
  artistId:string;
  thumbNailLink:string;
  genreId:string;
  songs:IAudioDto[]
}