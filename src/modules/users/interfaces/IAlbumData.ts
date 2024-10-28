import { IAudioData } from "./IAudioData";

export interface IAlbumData {
  _id:string;
  title:string;
  uuid:string
  visibility:boolean;
  thumbNailLink:string;
  artistDetails:{
    _id:string;
    fullName:string;
  }
  songs:IAudioData[]
}