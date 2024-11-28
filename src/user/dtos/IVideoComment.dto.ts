import { ObjectId } from "mongoose";

export interface IVideoCommentDto {
  videoId: string;
  userId: string;
  likes: ObjectId[];
  comment: string;
}