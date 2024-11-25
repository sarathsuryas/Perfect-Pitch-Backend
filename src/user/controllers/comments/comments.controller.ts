import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { IReplyToReplyDto } from 'src/modules/users/dtos/IReplyToReply.dto';
import { IVideoCommentDto } from 'src/modules/users/dtos/IVideoComment.dto';
import { UserAuthenticationGuard } from 'src/modules/users/guards/user-authentication/user-authentication.guard';
import { CommentsService } from 'src/user/services/comments/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private _commentsService:CommentsService) {}
  @UseGuards(UserAuthenticationGuard)
  @Post('add-video-comment')
  async addVideoComment(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const comment: IVideoCommentDto = {
        videoId: req.body.videoId,
        userId: req.user._id,
        likes: [],
        comment: req.body.comment
      }

      const commentId = await this._commentsService.addVideoComment(comment)

      res.status(HttpStatus.OK).json({ message: "comment added", success: true, commentId })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Patch('like-comment')
  async likeComment(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      await this._commentsService.likeComment(req.body.commentId, req.user._id)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Get('get-comments')
  async getComments(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const comments = await this._commentsService.getComments(req.query.id as string)
      if (comments) {
        return res.status(HttpStatus.OK).json(comments)
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false })
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Post('reply-comment')
  async replyComment(@Req() req: ICustomRequest, @Res() res: Response) {
    try {

      await this._commentsService.replyComment(req.body.reply)
      res.status(HttpStatus.OK).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Get('get-replies')
  async getReplies(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this._commentsService.getReplies(req.query.id as string)
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Patch('like-reply')
  async likeReply(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      await this._commentsService.likeReply(req.body.replyId, req.user._id)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Patch('like-reply-to-reply')
  async likeReplyToReply(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      await this._commentsService.likeReplyToReply(req.body.replyToReplyId, req.user._id)
      console.log(req.body)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Post('reply-to-reply')
  async replyToReply(@Body() data: IReplyToReplyDto, @Res() res: Response) {
    try {
      const result = await this._commentsService.replyToReply(data)
      if (result) {
        res.status(HttpStatus.CREATED).json({ success: true })
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-replies-to-reply')
  async getRepliesToReply(@Query() query: { replyId: string }, @Res() res: Response) {
    try {
      const data = await this._commentsService.getRepliesToReply(query.replyId)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }  



}
