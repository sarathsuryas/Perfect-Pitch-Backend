import { Controller, Get, HttpStatus, InternalServerErrorException, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { UserAuthenticationGuard } from 'src/modules/users/guards/user-authentication/user-authentication.guard';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { VideoService } from 'src/user/services/video/video.service';

@Controller('video')
export class VideoController {
  constructor(private _presignedUrlService: PresignedUrlService, private _videoService: VideoService) { }
  @UseGuards(UserAuthenticationGuard)
  @Post('post-video-details')
  async submitVideoDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { videoName, videoDescription, genreId, uniqueKeyVideo, uniqueKeyThumbNail } = req.body
      const videoLink = this._presignedUrlService.getFileUrl(uniqueKeyVideo)
      const thumbnailLink = this._presignedUrlService.getFileUrl(uniqueKeyThumbNail)
      const videoId = await this._videoService.SubmitVideoDetails(videoName, videoDescription, genreId, req.user._id, videoLink, thumbnailLink, req.user.fullName)
      if (videoId) {
        return res.status(HttpStatus.ACCEPTED).json({ success: true, videoId })
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false, error: "error message" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
  // video list
  @UseGuards(UserAuthenticationGuard)
  @Get('video-list')
  async videoList(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { page, perPage } = req.query;
      if (!req.query.video || req.query.video === "undefined" && page && perPage) {
        const videos = await this._videoService.listVideos({ page: parseInt(page as string), perPage: parseInt(perPage as string) })
        if (videos) {
          return res.status(HttpStatus.ACCEPTED).json(videos)
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "videos not found" })
        }
      }
      if (req.query.video) {
        const videos = await this._videoService.searchVideos(req.query.video as string)
        if (videos) {
          return res.status(HttpStatus.ACCEPTED).json(videos)
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "videos not found" })
        }

      }


    } catch (error) {
      console.error(error)

      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-video-page-details')
  async getVideoDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const result = await this._videoService.getVideoDetails(req.query.id as string, req.user._id)
      result.userId = req.user._id
      result.userName = req.user.fullName
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }  

  @UseGuards(UserAuthenticationGuard)
  @Put('like-video')
  async likeVideo(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._videoService.likeVideo(req.body.videoId, req.user._id)
      res.status(HttpStatus.OK).json(req.user._id)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

}
