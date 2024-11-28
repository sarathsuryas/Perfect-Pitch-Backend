import { ObjectId } from "mongoose";

export interface IReplyToReply {
  _id:string;
  replyToReply:string;
  userData:{
    profileImage:string;
    fullName:string;
  };
  likes:ObjectId[];
  tag:ObjectId
}