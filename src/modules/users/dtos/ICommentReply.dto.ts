import { ObjectId } from "mongoose";

export interface ICommentReplyDto {
  commentId: string;
  userId: string;
  likes: ObjectId[];
  reply: string;
}