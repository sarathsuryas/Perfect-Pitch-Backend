import { ObjectId } from "mongoose";

export interface ICommentReply {
  _id:string;
  reply:string;
  userId:{
    profileImage:string;
    fullName:string;
  };
  likes:ObjectId[];
  tag:ObjectId
}