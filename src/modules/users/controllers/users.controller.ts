import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Patch, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { UsersService } from '../services/users.service';
import { Request, Response } from 'express';
import { error } from 'console';
import { VerifyOtpDto } from '../dtos/verifyOtp.dto'; 
import { LoginUserDto } from '../dtos/loginUser.dto';
import { AuthenticationGuard } from 'src/modules/admin/guards/authentication/authentication.guard';
import { ICusomRequest } from '../../admin/interfaces/ICustomRequest';
import { CreateUserDto } from '../../admin/dtos/createUser.dto';
import { EditUserDto } from '../../admin/dtos/editUser.dto';
import { UserAuthenticationGuard } from '../guards/user-authentication/user-authentication.guard';
import { IReturnUserData } from 'src/modules/admin/interfaces/IReturnUserData';
import { IncomingForm } from 'formidable'
import { v2 as cloudinary } from 'cloudinary';
import { EditProfileDto } from '../dtos/editProfile.dto';



@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) { }
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
        res.cookie('userRefreshToken',result.refreshToken,{
          httpOnly:true,
          secure:true,
          sameSite:'strict'
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
        res.cookie('userRefreshToken',data.refreshToken,{
          httpOnly:true,
          secure:true,
          sameSite:'strict'
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
  async resendOtp(@Res()res:Response,@Body() userData:VerifyOtpDto) {
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
  async refresh(@Res()res:Response,@Req() req: Request) {
    try {
      const oldRefreshToken = req.cookies.adminToken
      const payload = await this._usersService.decodeToken(oldRefreshToken)
      
      const newAccessToken = await this._usersService.createAccessToken(payload);
      const refreshToken = await this._usersService.getRefreshToken(payload);
      if(refreshToken === "refreshToken expired") {
        res.status(HttpStatus.FORBIDDEN)
      }
      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
       
      return res.send({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error) 
    }
  }

  @Post('req-reset-password')
  async resetPassword(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.body.email) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
      }
      const user = await this._usersService.existUser(req.body.email)
      if (!user) {
        res.status(HttpStatus.CONFLICT).json({ message: "emaill does not exist" })
      }
      const result = await this._usersService.savePasswordResetToken(user, req.body.email)
      if (result) {
        res.status(HttpStatus.OK).json({ message: "email sent successfully" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    } 
  }

@Post('valid-password-token')
async validPasswordToken(@Req() req:Request,@Res() res:Response) {
   try {
    if(!req.body.token) {
      res.status(HttpStatus.FORBIDDEN).json({message:'token is required'})
    }
    const token = await this._usersService.getResetPasswordToken(req.body.token)
    if(!token) {
       res.status(HttpStatus.CONFLICT).json({message:"Invalid URL"})      
    }
    res.status(HttpStatus.OK).json({ message: 'Token verified successfully.' ,token});
   } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({message:"Internal Server Error"})
   }
}
 
@Post('new-password')
async NewPassword (@Req() req:Request,@Res() res:Response) {
    try {
      const {password,UserId} = req.body
      const result = await this._usersService.newPassword(password,UserId)
      if(result) {
         res
        .status(HttpStatus.CREATED)
        .json({ message: 'Password reset successfully' });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Password can not reset.' });
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({message:"Internal Server Error"})
    }
}
@UseGuards(UserAuthenticationGuard)
@Get('get-user-data') 
  async userData (@Req() req:ICusomRequest,@Res() res:Response) {
    try {
      const user = await this._usersService.getUserData(req.user._id)
     const obj = {
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      profileImage:user.profileImage,
      phone:user.phone
     }
     if(user) {
      res.status(HttpStatus.OK).json(obj)
     } else {
      res.status(HttpStatus.NOT_FOUND).json({message:"user data not found"})
     }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Post('upload-profile-picture')
  async uploadProfileImage(@Req() req:ICusomRequest,@Res() res:Response) {
    try {
      const form = new IncomingForm()

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(404).json({ message: "Error in uploading image" })
        } else {
          if (files.image) {
            console.log(files?.image[0].filepath);
  
            const result = await cloudinary.uploader.upload(files?.image[0].filepath, {
              folder: 'profilePicture'
            });
           
            const user = await this._usersService.getUserData(req.user._id)
            if (user) {                                                                                  
              const data = await this._usersService.updateProfileImage(req.user._id,result.secure_url)
              
              console.log("User profile picture updated:",);
              return res.status(HttpStatus.OK).json({ success: true, message: "Image uploaded successfull",data });
            }
          }
        }
  
      })
    
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Put('edit-profile') 
  async editProfile(@Req() req:ICusomRequest,@Res() res:Response) {
    try {
      const obj:EditProfileDto = {
        fullName: req.body.fullName,
        phone: req.body.phone
      }
      const user = await this._usersService.getUserData(req.user._id)
      if(user) {
          const updatedData  = await this._usersService.editProfile(obj,user.email)
          res.status(HttpStatus.OK).json(updatedData)
      } else {
        res.status(HttpStatus.NOT_FOUND).json({message:"user data not found"})
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

}
 

