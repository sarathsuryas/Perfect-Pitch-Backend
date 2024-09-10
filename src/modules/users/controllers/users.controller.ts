import { Body, Controller, FileTypeValidator, Get, HttpStatus, Inject, InternalServerErrorException, ParseFilePipe, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { Request, response, Response } from 'express';
import { VerifyOtpDto } from '../dtos/verifyOtp.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UserAuthenticationGuard } from '../guards/user-authentication/user-authentication.guard';
import { IncomingForm } from 'formidable'
import { EditProfileDto } from '../dtos/editProfile.dto';
import configuration from 'src/config/configuration';
import { v4 as uuid } from 'uuid';
import { UploadService } from '../services/upload/upload.service';
import { UsersService } from '../services/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IVideoDto } from '../dtos/IVideo.dto';
import { PresignedUrlService } from '../services/presigned-url/presigned-url.service';
import { ICustomRequest } from 'src/modules/admin/interfaces/ICustomRequest';




@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService, private readonly _uploadService: UploadService,private readonly _presignedUrlService:PresignedUrlService) { }
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
        phone: user.phone
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
      const url = await this._uploadService.uploadProfileImage(file,'userProfilePicture');
      if (!url) {
        return res.status(HttpStatus.BAD_REQUEST).send()
      }
      const result = await this._usersService.updateProfileImage(req.user._id, url.url)

      console.log("User profile picture updated:", result);
      return res.status(HttpStatus.OK).json({ success: true, message: "Image uploaded successfull" });

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

  // @UseGuards(UserAuthenticationGuard)
  // @Post('upload-video')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req: ICustomRequest, @Res() res: Response) {

  //   try { 
  //     const { videoName, videoDescription, genre } = req.body
  //      console.log(file)
  //     const url = await this._uploadService.uploadVideo(file,videoName);
  //     const obj: IVideoDto = {
  //       videoName: videoName,
  //       videoDescription: videoDescription,
  //       genre: genre,
  //       link: url,
  //       userId:req.user._id
  //     }
  //     console.log(url)
  //     if (url) {
  //       const data = await this._usersService.uploadVideo(obj)
  //       if (data) {
  //         return res.status(HttpStatus.OK).send({message:"video uploaded"})
  //       } 
  //     } else {
  //     return res.status(HttpStatus.BAD_REQUEST).send({error:"internal server error"})
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // } 

 @UseGuards(UserAuthenticationGuard)
 @Post('generate-presigned-url')
 async generatePresignedUrl(@Req() req:ICustomRequest,@Res() res:Response) {
    try {
     const {fileName,contentType} = req.body
     const presignedUrl = await this._presignedUrlService.getPresignedSignedUrl(req.user._id,fileName,contentType)
    if (presignedUrl) {
      return res.status(HttpStatus.ACCEPTED).json({success:true,presignedUrl})
    }  else {
      return res.status(HttpStatus.BAD_REQUEST).json({message:"something went wrong"})
    }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
 } 

@UseGuards(UserAuthenticationGuard) 
@Post('post-video-details')
async submitVideoDetails(@Req() req:ICustomRequest,@Res() res:Response) {
   try {
    const {videoName,videoDescription, genre, uniqueKeyVideo,uniqueKeyThumbNail} = req.body
      const videoLink =  this._presignedUrlService.getFileUrl(uniqueKeyVideo)
      const thumbnailLink = this._presignedUrlService.getFileUrl(uniqueKeyThumbNail)
    const videoId = await this._usersService.SubmitVideoDetails(videoName,videoDescription,genre,req.user._id,videoLink,thumbnailLink)
    if(videoId) {
      return res.status(HttpStatus.ACCEPTED).json({success:true,videoId})
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({success:false,error:"error message"})
    }
   } catch (error) {
    console.error(error)
    throw new InternalServerErrorException()
   }  
} 
// video list
@UseGuards(UserAuthenticationGuard) 
@Get('video-list')
async videoList(@Res()res:Response ) {
   try {
     const videos = await this._usersService.listVideos()
     if(videos) {
      return res.status(HttpStatus.ACCEPTED).json(videos)
     } else {
      return res.status(HttpStatus.NOT_FOUND).json({message:"videos not found"})
     } 

   } catch (error) {
    console.error(error)
    throw new InternalServerErrorException()
   }
}

}
  