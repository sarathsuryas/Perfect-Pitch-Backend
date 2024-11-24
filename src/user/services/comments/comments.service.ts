import { Injectable } from '@nestjs/common';
import { ICommentReplyDto } from 'src/modules/users/dtos/ICommentReply.dto';
import { IReplyToReplyDto } from 'src/modules/users/dtos/IReplyToReply.dto';
import { IVideoCommentDto } from 'src/modules/users/dtos/IVideoComment.dto';
import { ICommentResponse } from 'src/modules/users/interfaces/ICommentResponse';
import { IReplyToReply } from 'src/modules/users/interfaces/IReplyToReply';
import { CommentsRepository } from 'src/user/repositories/comments.repository';

@Injectable()
export class CommentsService {
   constructor(private _commentsRepository:CommentsRepository) {}
  async addVideoComment(comment: IVideoCommentDto) {
    try {
      return await this._commentsRepository.addVideoComment(comment)
    } catch (error) {
      console.error(error)
    }
  }

  async likeComment(commentId: string, userId: string) {
    try {
      return await this._commentsRepository.likeComment(commentId, userId)
    } catch (error) {
      console.error(error)
    }
  }

  async getComments(videoId: string): Promise<ICommentResponse[]> {
    try {
      return await this._commentsRepository.getComments(videoId)
    } catch (error) {
      console.error(error)
    }
  }

  async replyComment(data: ICommentReplyDto) {
    try {
      await this._commentsRepository.replyComment(data)
    } catch (error) {
      console.error(error)
    }
  }

  async getReplies(commentId: string) {
    try {
      return await this._commentsRepository.getReplies(commentId)
    } catch (error) {
      console.error(error)
    }
  }

  async likeReply(replyId: string, userId: string) {
    try {
      await this._commentsRepository.likeReply(replyId, userId)
    } catch (error) {
      console.error(error)
    }
  }
  async likeReplyToReply(replyToReplyId: string, userId: string) {
    try {
      await this._commentsRepository.likeReplyToReply(replyToReplyId, userId)
    } catch (error) {
      console.error(error)
    }
  }  
  async replyToReply(data: IReplyToReplyDto) {
    try {
      return await this._commentsRepository.replyToReply(data)
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
