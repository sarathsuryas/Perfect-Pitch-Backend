import { IVideoDetails } from "./IVideoDetails";

export interface IResponseShorts {
  shorts:IVideoDetails[];
  user:{
    _id:string;
    fullName:string;
    profileImage:string;
  }
}