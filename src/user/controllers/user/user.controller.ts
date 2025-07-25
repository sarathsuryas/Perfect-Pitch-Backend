import { Body, Controller, FileTypeValidator, Get, HttpStatus, Inject, InternalServerErrorException, ParseFilePipe, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { EditProfileDto } from 'src/user/dtos/editProfile.dto';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { UserService } from 'src/user/services/user/user.service';
import { IUserService } from 'src/user/interfaces/IUserService';

@Controller('user')
export class UserController {
constructor(
  @Inject('IUserService')
  private readonly _userService: IUserService,
) {}
  @UseGuards(UserAuthenticationGuard)
  @Get('get-user-data')
  async userData(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const user = await this._userService.getUserData(req.user._id)
      const obj = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        phone: user.phone,
        premiumUser: user.premiumUser,
        isBlocked: user.isBlocked,
        subscribers: user.subscribers
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
      //  const url = await this._uploadService.uploadProfileImage(file, 'userProfilePicture');
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
      const user = await this._userService.getUserData(req.user._id)
      if (user) {
        const updatedData = await this._userService.editProfile(obj, user.email)
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
      const user = await this._userService.getUserData(req.user._id)
      if (user) {
        const match = await this._userService.checkPassword(user.password, req.body.password)
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
      const success = await this._userService.resetPassword(req.user._id, req.body.password)
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
  @Put('subscribe-user')
  async subscribeUser(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      await this._userService.subscribeArtist(req.user._id, req.body.artistId)
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
      await this._userService.submitProfileImageDetails(req.body.uniqueKey, req.user._id)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
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
      const { page, perPage } = req.query; 
      if (!req.query.artist) {
        const artists = await this._userService.getArtists({ page: parseInt(page as string), perPage: parseInt(perPage as string) })
        const userId = req.user._id
        res.status(HttpStatus.OK).json({ artists, userId })
      }
      if (req.query.artist) {
        const artists = await this._userService.searchArtists(req.query.artist as string)
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
  @Get('search-artists')
  async searchArtists(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      
      if (req.query.artist) {
        const artists = await this._userService.searchArtists(req.query.artist as string)
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
  @Get('get-artist-media')
  async getUserMedia(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this._userService.getArtistMedias(req.query.artistId as string)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


}
