import { Body, Controller, Delete, FileTypeValidator, Get, HttpStatus, Inject, InternalServerErrorException, ParseFilePipe, Patch, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { Request, Response } from 'express';
import { VerifyOtpDto } from '../dtos/verifyOtp.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UserAuthenticationGuard } from '../guards/user-authentication/user-authentication.guard';
import { EditProfileDto } from '../dtos/editProfile.dto';
import { UploadService } from '../services/upload/upload.service';
import { UsersService } from '../services/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PresignedUrlService } from '../services/presigned-url/presigned-url.service';
import { ICustomRequest } from 'src/modules/admin/interfaces/ICustomRequest';
import { IAlbumGenPresignedUrlDto } from '../dtos/IAlbumGenPresignedUrl.dto';
import { IAlbumDetailsDto } from '../dtos/IAlbumDetails.dto';
import { IAlbumDetails } from '../interfaces/albumDetails';
import { storeError } from 'src/errorStore/storeError';
import { IVideoCommentDto } from '../dtos/IVideoComment.dto';
import { IGoogleLoginDto } from '../dtos/IGoogleLogin.dto';
import { IVideoDto } from '../dtos/IVideo.dto';
import Ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs'
import { spawn } from 'child_process';
import * as path from 'path';
import { IShortsDto } from '../dtos/IShorts.dto';
import { IAlbumData } from '../interfaces/IAlbumData';
import { ICreatePlaylistDto } from '../dtos/ICreatePlaylist.dto';
import { IPlaylistSongs } from '../interfaces/IPlaylistSongs';
import { ISubmitSongDetailsDto } from '../dtos/ISubmitSongDetails.dto';
import { IAudioDto } from '../dtos/IAudio.dto';
import { ISubmitSongDetails } from '../interfaces/ISubmitSongDetails';
import { v4 as uuidv4 } from 'uuid';
import { IReplyToReplyDto } from '../dtos/IReplyToReply.dto';
import Stripe from 'stripe';
import configuration from 'src/config/configuration';
import { PaymentService } from '../services/payment/payment.service';
import { PaymentSuccessDto } from '../dtos/paymentSuccess.dto';
import { ICreateLiveStreamDto } from '../dtos/ICreateLiveStream.dto';
import { ICreateLive } from '../interfaces/ICreateLive';
const webrtc = require("wrtc");


@Controller('users')
export class UsersController {

  constructor(private readonly _usersService: UsersService, private readonly _uploadService: UploadService, private readonly _presignedUrlService: PresignedUrlService, private readonly _paymentService: PaymentService) { }
  @Post('register')
  async registerUser(@Res() res: Response, @Body() userData: RegisterUserDto) {
    try {
      const result = await this._usersService.checkUser(userData)

      if (typeof result !== 'string') {
        return res.status(HttpStatus.OK).json({ data: result })
      } else {
        return res.status(HttpStatus.CONFLICT).json({ message: result })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }
  @Post('verify-otp')
  async verifyOtp(@Res() res: Response, @Body() data: VerifyOtpDto) {
    try {

      const result = await this._usersService.verifyOtp(data.userData, data.otp)
      if (result === "OTP Not Matching") {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: result })
      }
      if (typeof result !== 'string') {
        res.cookie('userRefreshToken', result.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })
        return res.status(HttpStatus.CREATED).send(result)
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "bad request" })
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() userData: LoginUserDto) {
    try {

      const data = await this._usersService.login(userData)

      if (typeof data !== "string") {
        const refreshToken = data.refreshToken
        res.cookie('userRefreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })


        res.status(HttpStatus.OK).json(data)
      } else {
        res.status(HttpStatus.NOT_FOUND).json(data)
      }
    } catch (error) { 
      console.log(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('google-login')
  async googleLogin(@Res() res: Response, @Body() userData: IGoogleLoginDto) {
    try {
      const data = await this._usersService.googleLogin(userData)

      if (typeof data !== "string") {
        const refreshToken = data.refreshToken
        res.cookie('userRefreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })


        res.status(HttpStatus.OK).json(data)
      } else {
        res.status(HttpStatus.NOT_FOUND).json(data)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }



  @Post('resend-otp')
  async resendOtp(@Res() res: Response, @Body() userData: VerifyOtpDto) {
    try {
      const data = JSON.parse(userData.userData)
      await this._usersService.resendOtp(data.data.email)
      res.status(HttpStatus.ACCEPTED).json(userData.userData)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const oldRefreshToken = req.cookies.userRefreshToken
      const payload = await this._usersService.decodeToken(oldRefreshToken)

      const newAccessToken = await this._usersService.createAccessToken(payload);
      const refreshToken = await this._usersService.getRefreshToken(payload);
      if (refreshToken === "refreshToken expired") {
        console.log('refreshToken expired')
        return res.status(HttpStatus.FORBIDDEN).send()
      }
      return res.send({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error)
    }
  }

  @Post('req-reset-password')
  async resetPassword(@Req() req: Request, @Res() res: Response) {
    if (!req.body.email) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
    }
    const user = await this._usersService.existUser(req.body.email)

    if (user === 'undefined') {
      return res.status(HttpStatus.CONFLICT).json({ message: "emaill does not exist" })
    }
    const result = await this._usersService.savePasswordResetToken(user, req.body.email)
    if (result) {
      res.status(HttpStatus.OK).json({ message: "email sent successfully" })
    }
  }

  @Post('valid-password-token')
  async validPasswordToken(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.body.token) {
        res.status(HttpStatus.FORBIDDEN).json({ message: 'token is required' })
      }
      const token = await this._usersService.getResetPasswordToken(req.body.token)
      if (!token) {
        res.status(HttpStatus.CONFLICT).json({ message: "Invalid URL" })
      }
      res.status(HttpStatus.OK).json({ message: 'Token verified successfully.', token });
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('new-password')
  async NewPassword(@Req() req: Request, @Res() res: Response) {
    try {
      const { password, UserId } = req.body
      const result = await this._usersService.newPassword(password, UserId)
      if (result) {
        res
          .status(HttpStatus.CREATED)
          .json({ message: 'Password reset successfully' });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Password can not reset.' });
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Get('get-user-data')
  async userData(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const user = await this._usersService.getUserData(req.user._id)
      const obj = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        phone: user.phone,
        premiumUser: user.premiumUser,
        isBlocked: user.isBlocked,
        subscribers:user.subscribers
      }
      if (user) {
        res.status(HttpStatus.OK).json(obj)
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: "user data not found" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-profile-picture')
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          // new MaxFileSizeValidator({
          //   maxSize: MAX_FILE_SIZE, // 10MB
          //   message: 'File is too large. Max file size is 10MB',
          // }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body('isPublic') isPublic: string, @Req() req: ICustomRequest, @Res() res: Response
  ) {
    try {
      // const url = await this._uploadService.uploadProfileImage(file, 'userProfilePicture');
      // if (!url) {
      //   return res.status(HttpStatus.BAD_REQUEST).send()
      // }
      // const result = await this._usersService.updateProfileImage(req.user._id, url.url)

      // console.log("User profile picture updated:", result);
      // return res.status(HttpStatus.OK).json({ success: true, message: "Image uploaded successfull" });

    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Put('edit-profile')
  async editProfile(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const obj: EditProfileDto = {
        fullName: req.body.fullName,
        phone: req.body.phone
      }
      const user = await this._usersService.getUserData(req.user._id)
      if (user) {
        const updatedData = await this._usersService.editProfile(obj, user.email)
        res.status(HttpStatus.OK).json(updatedData)
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: "user data not found" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }

  }
  @UseGuards(UserAuthenticationGuard)
  @Post('check-old-password')
  async checkOldPassword(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const user = await this._usersService.getUserData(req.user._id)
      if (user) {
        const match = await this._usersService.checkPassword(user.password, req.body.password)
        if (match) {
          res.status(HttpStatus.ACCEPTED).json({ message: "password match" })
        } else {
          res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: "password does not match" })
        }
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }

  }


  @UseGuards(UserAuthenticationGuard)
  @Put('change-password')
  async changePassword(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const success = await this._usersService.resetPassword(req.user._id, req.body.password)
      if (success) {
        res.status(HttpStatus.ACCEPTED).json({ message: 'updated successfully' })
      } else {
        res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: "password does not changed" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Post('upload-shorts')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req: ICustomRequest, @Res() res: Response) {

    try {
      const { videoName, videoDescription, genre } = req.body
      console.log(file)
      const url = await this._uploadService.uploadVideo(file, videoName);
      const obj: IVideoDto = {
        videoName: videoName,
        videoDescription: videoDescription,
        genre: genre,
        link: url,
        userId: req.user._id
      }
      console.log(url)
      // if (url) {
      //   const data = await this._usersService.uploadVideo(obj)
      //   if (data) {
      //     return res.status(HttpStatus.OK).send({message:"video uploaded"})
      //   } 
      // } else {
      // return res.status(HttpStatus.BAD_REQUEST).send({error:"internal server error"})
      // }
    } catch (error) {
      console.error(error)
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('trim-video')
  async trimVideo(@UploadedFile() file: Express.Multer.File, @Req() req: ICustomRequest, @Res() res: Response) {
    const videoPath = path.join(__dirname, "input.mp4");
    const outputPath = path.join(__dirname, "output.mp4");
    const { start, end } = req.body;

    fs.writeFileSync(videoPath, file.buffer);

    const ffmpegArgs = [
      "-i", videoPath, // Input file
      "-ss", start,    // Start time (e.g., '00:00:10')
      "-to", end,      // End time (e.g., '00:00:20')
      "-c", "copy",    // Copy codec to avoid re-encoding
      outputPath       // Output file
    ];


    // Spawn FFmpeg process
    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        // FFmpeg completed successfully, send the trimmed video back
        const trimmedBuffer = fs.readFileSync(outputPath);
        console.log(trimmedBuffer)
        res.download(outputPath, "trimmed-video.mp4", (err) => {
          if (err) {
            return res.status(500).send("Error sending file");
          }
        });
      } else {
        // Error in FFmpeg processing
        res.status(500).send("Error trimming video");
      }
    });

    ffmpegProcess.on("error", (err) => {
      console.error("Error with FFmpeg:", err);
      res.status(500).send("FFmpeg error");
    });


  }


  @UseGuards(UserAuthenticationGuard)
  @Post('generate-presigned-url')
  async generatePresignedUrl(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { fileName, contentType } = req.body
      const presignedUrl = await this._presignedUrlService.getPresignedSignedUrl(req.user._id, fileName, contentType)
      if (presignedUrl) {
        return res.status(HttpStatus.ACCEPTED).json({ success: true, presignedUrl })
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "something went wrong" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Post('post-video-details')
  async submitVideoDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { videoName, videoDescription, genreId, uniqueKeyVideo, uniqueKeyThumbNail } = req.body
      const videoLink = this._presignedUrlService.getFileUrl(uniqueKeyVideo)
      const thumbnailLink = this._presignedUrlService.getFileUrl(uniqueKeyThumbNail)
      const videoId = await this._usersService.SubmitVideoDetails(videoName, videoDescription, genreId, req.user._id, videoLink, thumbnailLink, req.user.fullName)
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
      if (!req.query.video) {
       
        const videos = await this._usersService.listVideos()
        if (videos) {
          return res.status(HttpStatus.ACCEPTED).json(videos)
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "videos not found" })
        }
      }
      if (req.query.video) {
        const videos = await this._usersService.searchVideos(req.query.video as string)
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
  @Post('generate-pre-signed-urls')
  async generateSignedUrlsForAlbum(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const parseData: IAlbumGenPresignedUrlDto[] = JSON.parse(req.body.post_params)
      const presignedUrls = []
      for (let i = 0; i < parseData.length; i++) {
        const data = await this._presignedUrlService.getPresignedSignedUrl(req.user._id, parseData[i].name, parseData[i].type)
        presignedUrls.push(data)
      }
      res.status(HttpStatus.OK).json({ success: true, message: "presigned urls for album", presignedUrls })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Post('submit-album-details')
  async submitAlbumDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const albumDetails = JSON.parse(req.body.files) as IAlbumDetailsDto
      const thumbNailLink = this._presignedUrlService.getFileUrl(albumDetails.thumbnailKey)
      const array: IAudioDto[] = []
      for (let i = 0; i < albumDetails.songs.length; i++) {
        const songLink = this._presignedUrlService.getFileUrl(albumDetails.songs[i].uniqueKey)
        const songThumbNailLink = this._presignedUrlService.getFileUrl(albumDetails.songs[i].thumbNailUniqueKey)
        array.push({ title: albumDetails.songs[i].title, link: songLink, artistId: req.user._id, thumbNailLink: songThumbNailLink, genreId: albumDetails.genreId, uuid: uuidv4() })
      }
      const obj: IAlbumDetails = {
        title: albumDetails.title,
        genreId: albumDetails.genreId,
        artistId: req.user._id,
        thumbNailLink: thumbNailLink,
        songs: array,
      }
      const uuids: string[] = []
      for (let i = 0; i < obj.songs.length; i++) {
        uuids.push(obj.songs[i].uuid)
      }
      const album = await this._usersService.submitAlbumDetails(obj, uuids)
      return res.status(HttpStatus.OK).json(album)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-albums')
  async getAlbums(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      if (!req.query.album) {
        const result = await this._usersService.getAlbums()
        if (result) {
          return res.status(HttpStatus.OK).json(result)
        }
      }
      if (req.query.album) {
        const result = await this._usersService.searchAlbums(req.query.album as string)
        if (result) {
          return res.status(HttpStatus.OK).json(result)
        }
      }

      return res.status(HttpStatus.NOT_FOUND).json({ message: "something went wrong" })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Get('get-artist-')
  async getArtistAlbums(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      if (req.query.artistId) {
        const result = await this._usersService.getArtistAlbums(req.query.artistId as string)
        if (result) {
          return res.status(HttpStatus.OK).json(result)
        }
      }

      return res.status(HttpStatus.NOT_FOUND).json({ message: "something went wrong" })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }




  @UseGuards(UserAuthenticationGuard)
  @Post('submit-single-details')
  async submitSingleDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = JSON.parse(req.body.file) as ISubmitSongDetailsDto
      const thumbNailLink = this._presignedUrlService.getFileUrl(data.thumbNailUniqueKey)
      const songLink = this._presignedUrlService.getFileUrl(data.songUniqueKey)
      const obj: ISubmitSongDetails = {
        title: data.title,
        genreId: data.genreId,
        thumbNailLink: thumbNailLink,
        songLink: songLink,
        userId: req.user._id
      }
      const result = await this._usersService.submitSingleDetails(obj)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Post('submit-shorts-details')
  async submitShortsDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const videoLink = this._presignedUrlService.getFileUrl(req.body.uniqueKey)
      const obj: IShortsDto = {
        caption: req.body.caption,
        description: req.body.description,
        shorts: true,
        link: videoLink,
        fullName: req.user.fullName,
        artistId: req.user._id
      }
      await this._usersService.submitShortsDetails(obj)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }



  @UseGuards(UserAuthenticationGuard)
  @Get('album-details')
  async albumDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const id = req.query.id as string
      const data = await this._usersService.getAlbumDetails(id)
      if (data) {
        return res.status(HttpStatus.OK).json(data)
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "data not found" })
      }
    } catch (error) {
      console.error(error)
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-shorts')
  async getShorts(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const shorts = await this._usersService.getShorts(req.user._id)
      res.status(HttpStatus.OK).json(shorts)
    } catch (error) {
      console.error(error)
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Get('get-video-page-details')
  async getVideoDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const result = await this._usersService.getVideoDetails(req.query.id as string, req.user._id)
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
      const data = await this._usersService.likeVideo(req.body.videoId, req.user._id)
      res.status(HttpStatus.OK).json(req.user._id)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Put('subscribe-user')
  async subscribeUser(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      await this._usersService.subscribeArtist(req.user._id, req.body.artistId)
      return res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Put('submit-profile-image-details')
  async submitProfileImageDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      await this._usersService.submitProfileImageDetails(req.body.uniqueKey, req.user._id)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

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

      const commentId = await this._usersService.addVideoComment(comment)

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
      await this._usersService.likeComment(req.body.commentId, req.user._id)
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
      const comments = await this._usersService.getComments(req.query.id as string)
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
    
      await this._usersService.replyComment(req.body.reply)
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
      const result = await this._usersService.getReplies(req.query.id as string)
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
      await this._usersService.likeReply(req.body.replyId, req.user._id)
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
      await this._usersService.likeReplyToReply(req.body.replyToReplyId, req.user._id)
      console.log(req.body)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }




  @UseGuards(UserAuthenticationGuard)
  @Post('create-Playlist')
  async createPlaylist(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const obj: ICreatePlaylistDto = {
        userId: req.user._id,
        songId: req.body.songId,
        title: req.body.title,
        visibility: req.body.visibility,
        thumbNailLink: req.body.thumbNailLink
      }
      const data = await this._usersService.createPlaylist(obj)
      res.status(HttpStatus.OK).json({ success: true, playlistId: data._id })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-user-playlist')
  async getUserPlaylist(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      if (!req.query.playlist) {
        const data = await this._usersService.getUserPlaylist(req.user._id)
        res.status(HttpStatus.OK).json(data)
      }
      if (req.query.playlist) {
        const data = await this._usersService.searchPlaylist(req.query.playlist as string)
        res.status(HttpStatus.OK).json(data)
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Put('add-to-playlist')
  async addToPlaylist(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._usersService.addToPlaylist(req.body.playlistId, req.body.songId)
      if (data) {
        res.status(HttpStatus.OK).json({ success: true, exist: true })
      } else {
        res.status(HttpStatus.OK).json({ success: true, exist: false })
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-playlist-songs')
  async getPlaylistSongs(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._usersService.getPlaylistSongs(req.query.playlistId as string)
      console.log(data.songsId[0])
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-genres')
  async getGenres() {
    try {
      return this._usersService.getGenres()
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Get('get-genre-songs')
  async getSameGenreSongs(@Query() id: { genreId: string }, @Res() res: Response) {
    try {
      const data = await this._usersService.getSameGenreSongs(id.genreId)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-artists')
  async getArtists(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      if (!req.query.artist) {
        const artists = await this._usersService.getArtists()
        const userId = req.user._id
        res.status(HttpStatus.OK).json({ artists, userId })
      }
      if (req.query.artist) {
        const artists = await this._usersService.searchArtists(req.query.artist as string)
        const userId = req.user._id
        res.status(HttpStatus.OK).json({ artists, userId })
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }



  @UseGuards(UserAuthenticationGuard)
  @Get('get-song')
  async getSong(@Query() data, @Res() res: Response) {
    try {
      const { songId } = data
      const result = await this._usersService.getSong(songId)
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }

  }

  @UseGuards(UserAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('create-live')
  async createLive(
    @UploadedFile() file: Express.Multer.File,
     @Req() req: ICustomRequest,
      @Res() res: Response ) {
      try {
        const dto:ICreateLiveStreamDto = {
          title: req.body.title,
          description: req.body.description,
          thumbNail: file,
          genreId: req.body.genreId
        }
         const url = await this._uploadService.uploadToS3(dto.thumbNail,req.body.title)
         const obj:ICreateLive= {
           title: dto.title,
           thumbNailLink: url.url,
           artistId: req.user._id,
           description: dto.description,
           genreId: dto.genreId
         }
        const streamId = await this._usersService.createLive(obj) 
        res.status(HttpStatus.OK).json({success:true,streamId})
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
      const result = await this._usersService.replyToReply(data)
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
      const data = await this._usersService.getRepliesToReply(query.replyId)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Post('create-checkout-session')
  async StripePayment(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._paymentService.createSession(req.body.priceId, req.user._id)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Post('payment-success')
  async paymentSuccess(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const stripe = new Stripe(configuration().stripe_secret_key);
      const session = await stripe.checkout.sessions.retrieve(req.body.sessionId)
      const dtoObject: PaymentSuccessDto = {
        id: session.id,
        amount_subtotal: session.amount_subtotal,
        created: session.created,
        currency: session.currency,
        customer_details: {
          email: session.customer_details.email,
          name: session.customer_details.email,
          userId: req.user._id
        },
        expires_at: session.expires_at,
        payment_intent: session.payment_intent as string,
        payment_status: session.payment_status,
        payment_method_types: session.payment_method_types,
        status: session.status,
        memberShipId: req.body.memberShipId
      }
      await this._paymentService.paymentSuccess(dtoObject)
      res.status(HttpStatus.OK).json(session)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-membership')
  async getMemberShip(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._usersService.getMemberShip()
      const userId = req.user._id
      res.status(HttpStatus.OK).json({ data, userId })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Post('check-active-membership')
  async checkActiveMemberShip(@Body() data: { userId: string }, @Res() res: Response) {
    try {
      const result = await this._usersService.checkActiveMemberShip(data.userId)
      if (result) {
        res.status(HttpStatus.OK).json(result)
      } else {
        res.status(HttpStatus.OK).json(result)
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Get('get-artist-media')
  async getUserMedia(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this._usersService.getArtistMedias(req.query.artistId as string)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  senderStream: any
  @Post('consumer')
  async consumer(@Body() body, @Res() res: Response) {
    try {
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
          {  
            urls: "stun:stun.stunprotocol.org"
          }
        ]
      });
      const desc = new webrtc.RTCSessionDescription(body.sdp);
      await peer.setRemoteDescription(desc);
      this.senderStream.getTracks().forEach(track => peer.addTrack(track, this.senderStream));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
        sdp: peer.localDescription
      }
      res.json(payload);
 
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @Post('broadcast')
  async broadcast(@Body() body,@Res() res:Response) {
    try {
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = (e) => this.handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);

    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  handleTrackEvent(e, peer) {   
    this.senderStream = e.streams[0];
};

@UseGuards(UserAuthenticationGuard)
@Get('get-streams')
async getLiveStreams(@Req() req:Request,@Res() res:Response) {
 try {
    const data = await this._usersService.getLiveStreams()
    res.status(HttpStatus.OK).json(data)
 } catch (error) {
  console.error(error)
  storeError(error, new Date())
  throw new InternalServerErrorException()
 }
}

@UseGuards(UserAuthenticationGuard)
@Get('get-chats')
async getChats(@Req() req:ICustomRequest,@Res() res:Response) {
  try {
   const chats = await this._usersService.getChats(req.query?.streamKey as string)
   res.status(HttpStatus.OK).json(chats)
  } catch (error) {
    console.error(error)
  storeError(error, new Date())
  throw new InternalServerErrorException()
  } 
}

@UseGuards(UserAuthenticationGuard)
@Get('get-live-video-details')
async getLiveVideoDetails(@Req() req:ICustomRequest,@Res() res:Response) {
  try {
   const data = await this._usersService.getLiveVideoDetails(req.query?.streamKey as string)
   res.status(HttpStatus.OK).json(data)
  } catch (error) {
    console.error(error)
  storeError(error, new Date())
  throw new InternalServerErrorException()
  } 
}

@UseGuards(UserAuthenticationGuard)
@Delete('stop-stream')
async stopStream(@Req() req:ICustomRequest,@Res() res:Response) {
  try {
   const data = await this._usersService.stopStreaming(req.body.streamKey)
   res.status(HttpStatus.OK).json({success:true})
  } catch (error) {
    console.error(error)
  storeError(error, new Date())
  throw new InternalServerErrorException()
  } 
}



}
