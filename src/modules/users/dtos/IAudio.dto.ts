import { ObjectId } from "mongoose";

export interface IAudioDto {
  albumId?:ObjectId
  title:string;
  genreId:string;
  thumbNailLink:string;
  link:string;
  artistId:string;

}