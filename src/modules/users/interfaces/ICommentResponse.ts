import { ObjectId } from "mongoose"

export interface ICommentResponse {
    _id:ObjectId,
    videoId:ObjectId,
    comment:string,
    userId: {
      fullName:string;
      profileImage:string 
    }
    likes:[],
}