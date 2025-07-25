import { ICommentReplyDto } from "../dtos/ICommentReply.dto";
import { IReplyToReplyDto } from "../dtos/IReplyToReply.dto";
import { IVideoCommentDto } from "../dtos/IVideoComment.dto";
import { ICommentReply } from "./ICommentReplies";
import { ICommentResponse } from "./ICommentResponse";
import { IReplyToReply } from "./IReplyToReply";


export interface ICommentsService {
  addVideoComment(comment: IVideoCommentDto): Promise<any>;
  likeComment(commentId: string, userId: string): Promise<void>;
  getComments(videoId: string): Promise<ICommentResponse[]>;
  getReplies(commentId: string): Promise<ICommentReply[]>;
  replyComment(data: ICommentReplyDto): Promise<void>;
  likeReply(replyId: string, userId: string): Promise<void>;
  likeReplyToReply(replyToReplyId: string, userId: string): Promise<void>;
  replyToReply(data: IReplyToReplyDto): Promise<IReplyToReply | unknown>;
  getRepliesToReply(replyId: string): Promise<IReplyToReply[]>;
}
