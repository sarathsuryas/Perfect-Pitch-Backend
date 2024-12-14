import { Injectable } from '@nestjs/common';
import { ICommentReplyDto } from 'src/user/dtos/ICommentReply.dto';
import { IReplyToReplyDto } from 'src/user/dtos/IReplyToReply.dto';
import { IVideoCommentDto } from 'src/user/dtos/IVideoComment.dto';
import { ICommentReply } from 'src/user/interfaces/ICommentReplies';
import { ICommentResponse } from 'src/user/interfaces/ICommentResponse';
import { IReplyToReply } from 'src/user/interfaces/IReplyToReply';
import { CommentsRepository } from 'src/user/repositories/comments.repository';

@Injectable()
export class CommentsService {
   constructor(private _commentsRepository:CommentsRepository) {}
  async addVideoComment(comment: IVideoCommentDto) {
    try {
      return await this._commentsRepository.videoCommentRepo.create(comment)
    } catch (error) {
      console.error(error)
    }
  }

  async likeComment(commentId: string, userId: string):Promise<void> {
    try {
      return await this._commentsRepository.likeComment(commentId, userId)
    } catch (error) {
      console.error(error)
    }
  }

  async getComments(videoId: string): Promise<ICommentResponse[]> {
    try {
      return await this._commentsRepository.videoCommentRepo.findWithPopulate<ICommentResponse>({ videoId }, // Filter
        { createdAt: -1 }, // Sort by `createdAt` descending
        { path: 'userId', select: 'fullName profileImage' }, // Populate `userId` with fields
        true )
        
    } catch (error) {
      console.error(error)
    }
  }

  async getReplies(commentId: string):Promise<ICommentReply[]> {
    try {
      return await this._commentsRepository.commentReplyRepo.findWithPopulate<ICommentReply>(
        {commentId},
        {createdAt:-1},
        {path:'userId',select: 'fullName profileImage'},
        true
      )
    } catch (error) {
      console.error(error)
    }
  }


  async replyComment(data: ICommentReplyDto):Promise<void> {
    try {
      await this._commentsRepository.commentReplyRepo.create(data)
    } catch (error) {
      console.error(error)
    }
  }

  async likeReply(replyId: string, userId: string):Promise<void> {
    try {
      await this._commentsRepository.likeReply(replyId, userId)
    } catch (error) {
      console.error(error)
    }
  }
  async likeReplyToReply(replyToReplyId: string, userId: string):Promise<void> {
    try {
      await this._commentsRepository.likeReplyToReply(replyToReplyId, userId)
    } catch (error) {
      console.error(error)
    }
  }  
  async replyToReply(data: IReplyToReplyDto):Promise<IReplyToReply | unknown> {
    try {
      return await this._commentsRepository.replyToReplyRepo.create(data)
    } catch (error) {
      console.error(error)
    }
  }
  async getRepliesToReply(replyId: string): Promise<IReplyToReply[]> {
    try {
      return await this._commentsRepository.getrepliesToReply(replyId)
    } catch (error) {
      console.error(error)
    }
  }  

}
