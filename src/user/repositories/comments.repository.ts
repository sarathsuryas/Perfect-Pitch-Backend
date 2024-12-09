import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ICommentReplyDto } from "src/user/dtos/ICommentReply.dto";
import { IReplyToReplyDto } from "src/user/dtos/IReplyToReply.dto";
import { IVideoCommentDto } from "src/user/dtos/IVideoComment.dto";
import { ICommentReply } from "src/user/interfaces/ICommentReplies";
import { ICommentResponse } from "src/user/interfaces/ICommentResponse";
import { IReplyToReply } from "src/user/interfaces/IReplyToReply";
import { CommentReply } from "src/user/schema/commentReply.schema";
import { ReplyToReply } from "src/user/schema/replyToReply.schema";
import { VideoComment } from "src/user/schema/videoComment.schema";

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel('VideoComment') private readonly _videoCommentModel: Model<VideoComment>,
    @InjectModel('CommentReply') private readonly _commentReplyModel: Model<CommentReply>,
    @InjectModel('ReplyToReply') private _replyToReplyModel: Model<ReplyToReply>,
  ) {}
  async addVideoComment(comment: IVideoCommentDto): Promise<Object> {
    try {
      const data = await this._videoCommentModel.create({ videoId: comment.videoId, userId: comment.userId, comment: comment.comment })
      return data._id
    } catch (error) {
      console.error(error)
    }
  }

  async likeComment(commentId: string, userId: string) {
    try {

      const data = await this._videoCommentModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(commentId) }
      }, { $match: { likes: new mongoose.Types.ObjectId(userId) } }])

      if (data.length) {
        console.log('dislike')
        const dislike = await this._videoCommentModel.findByIdAndUpdate(commentId, { $pull: { likes: new mongoose.Types.ObjectId(userId) } }).lean()
      }
      if (data.length === 0) {
        console.log('like')
        const liked = await this._videoCommentModel.findByIdAndUpdate(commentId, { likes: new mongoose.Types.ObjectId(userId) })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async getComments(videoId: string): Promise<ICommentResponse[]> {
    try {
      return await this._videoCommentModel.find({ videoId: videoId })
        .sort({ createdAt: -1 })
        .populate('userId', 'fullName profileImage')
        .lean()
    } catch (error) {
      console.error(error)
    }
  }

  async replyComment(data: ICommentReplyDto) {
    try {
      await this._commentReplyModel.create({ commentId: data.commentId, userId: data.userId, reply: data.reply })
    } catch (error) {
      console.error(error)
    }
  }

  async getReplies(commentId: string): Promise<ICommentReply[]> {
    try {
      return await this._commentReplyModel.find({ commentId: commentId })
        .populate('userId', 'fullName profileImage').sort({ createdAt: -1 })
        .lean()
    } catch (error) {
      console.error(error)
    }
  }

  async likeReply(replyId: string, userId: string) {
    try {
      const data = await this._commentReplyModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(replyId) }
      }, { $match: { likes: new mongoose.Types.ObjectId(userId) } }])
      if (data.length) {
        console.log("dislike")
        const dislike = await this._commentReplyModel.findByIdAndUpdate(replyId, { $pull: { likes: new mongoose.Types.ObjectId(userId) } }).lean()
      }
      if (data.length === 0) {
        console.log("like")
        const liked = await this._commentReplyModel.findByIdAndUpdate(replyId, { likes: new mongoose.Types.ObjectId(userId) })
      }

    } catch (error) {
      console.error(error)
    }
  }
  async likeReplyToReply(replyToReplyId: string, userId: string) {
    try {
      const data = await this._replyToReplyModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(replyToReplyId) }
      }, { $match: { likes: new mongoose.Types.ObjectId(userId) } }])
      if (data.length) {
        console.log("dislike")
        const dislike = await this._replyToReplyModel.findByIdAndUpdate(replyToReplyId, { $pull: { likes: new mongoose.Types.ObjectId(userId) } }).lean()
      }
      if (data.length === 0) {
        console.log("like")
        const liked = await this._replyToReplyModel.findByIdAndUpdate(replyToReplyId, { likes: new mongoose.Types.ObjectId(userId) })

      }

    } catch (error) {
      console.error(error)
    }
  }

  async replyToReply(replyToReply: IReplyToReplyDto) {
    try {
      return await this._replyToReplyModel.create({
        replyId: replyToReply.replyId,
        likes: replyToReply.likes,
        replyToReply: replyToReply.replyToReply,
        userId: replyToReply.userId
      })
    } catch (error) {
      console.error(error)
    }
  }


  async getrepliesToReply(replyId: string): Promise<IReplyToReply[]> {
    try {
      const data = await this._replyToReplyModel
        .aggregate([
          { $match: { replyId: new mongoose.Types.ObjectId(replyId) } },
          {
            $lookup: {
              from: 'users',
              foreignField: '_id',
              localField: 'userId',
              as: 'userData'
            }
          },
          { $unwind: '$userData' },
          {
            $project: {
              _id: 1,
              replyToReply: 1,
              likes: 1,
              userData: {
                _id: 1,
                profileImage: 1,
                fullName: 1
              }
            }
          }
        ]) as IReplyToReply[]
      return data
    } catch (error) {
      console.error(error)
    }
  }


 


}