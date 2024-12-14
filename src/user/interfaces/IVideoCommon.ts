import { ObjectId,Document } from "mongoose";

export class IVideoCommon extends Document {
  videoId:ObjectId;
  comment:string;
  userId:ObjectId;
  likes:ObjectId[];
  createdAt?: Date
}