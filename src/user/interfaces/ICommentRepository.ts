import { IReplyToReplyDto } from "../dtos/IReplyToReply.dto"
import { IReplyToReply } from "./IReplyToReply"

export interface ICommentsRepository {
  likeComment(commentId: string, userId: string):Promise<void> 
  likeReply(replyId: string, userId: string):Promise<void>
  likeReplyToReply(replyToReplyId: string, userId: string):Promise<void>
  replyToReply(replyToReply: IReplyToReplyDto):Promise<IReplyToReply | unknown>
  getrepliesToReply(replyId: string): Promise<IReplyToReply[]>
}