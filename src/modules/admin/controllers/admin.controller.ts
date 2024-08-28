import { Body, Controller, Get, HttpStatus, InternalServerErrorException, NotFoundException, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminLoginDto } from '../dtos/adminLogin.dto';
import { AdminService } from '../services/admin.service';
import { Request, Response } from 'express';
import { AuthenticationGuard } from '../guards/authentication/authentication.guard';
import { ICusomRequest } from 'src/modules/admin/interfaces/ICustomRequest';
import { EditUserDto } from 'src/modules/admin/dtos/editUser.dto';
import { RegisterUserDto } from 'src/modules/users/dtos/registerUser.dto';
import { IReturnAdminData } from '../interfaces/IReturnAdminData';

@Controller('admin')
export class AdminController {
  constructor(private readonly _adminService: AdminService) { }
  @Post('login')
  async login(@Res() res: Response, @Body() adminData: AdminLoginDto) {
    try {
      const data = await this._adminService.login(adminData.email, adminData.password)

      if (typeof data !== "string") {
        res.cookie('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        });
        res.status(HttpStatus.OK).send({ accessToken: data.accessToken, adminData: data.adminData })
      } else {
        res.status(HttpStatus.NOT_FOUND).json(data)
      }
    } catch (error) {
      
      console.log(error)
    }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const oldRefreshToken = req.cookies.refreshToken
      const payload = await this._adminService.decodeToken(oldRefreshToken)

      const newAccessToken = await this._adminService.createAccessToken(payload);
      const refreshToken = await this._adminService.getRefreshToken(payload);
      if (refreshToken === "refreshToken expired") {
        res.status(HttpStatus.FORBIDDEN).send()
      }
     

      return res.send({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error)
    }
  }

  @Get('get-users')
  @UseGuards(AuthenticationGuard)
  async getUsers(@Req() req: ICusomRequest) {
    try {
      if (req.user.isAdmin) {
        if (req.query.search) {
          const search = req.query.search as string
          return await this._adminService.searchUser(search)

        }
        return await this._adminService.getUsers()
      } else {
        return 'You are not permitted to this route'
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Patch('block-user')
  @UseGuards(AuthenticationGuard)
  async blockUser(@Req() req: ICusomRequest) {
    try {
      if (req.user.isAdmin) {
        await this._adminService.blockUser(req.body.email)
        return await this._adminService.getUsers()
      } else {
        return 'You are not permitted to this route'
      }

    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('add-user')

  async addUser(@Body() userData: RegisterUserDto, @Req() req: ICusomRequest, @Res() res: Response) {
    try {

      if (req.user.isAdmin) {
        const result = await this._adminService.addUser(userData)
        if (typeof result === "string") {
          res.status(HttpStatus.CONFLICT).json(result)
        } else {
          const data = await this._adminService.getUsers()
          res.status(HttpStatus.OK).json(data)
        }
      }

    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Patch('edit-user')
  @UseGuards(AuthenticationGuard)
  async editUser(@Body() userData: EditUserDto, @Req() req: ICusomRequest, @Res() res: Response) {
    try {
      if (req.user.isAdmin) {

        const data = await this._adminService.editUser(userData)
        if (typeof data === 'string') {
          res.status(HttpStatus.CONFLICT).json(data)
        } else {
          const users = await this._adminService.getUsers()
          res.status(HttpStatus.OK).json(users)
        }
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('req-reset-password')
  async resetPassword(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.body.email) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
      }
      const user = await this._adminService.existUser(req.body.email)
      if (!user) {
        res.status(HttpStatus.CONFLICT).json({ message: "emaill does not exist" })
      }
      const result = await this._adminService.savePasswordResetToken(user, req.body.email)
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
    const token = await this._adminService.getResetPasswordToken(req.body.token)
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
      const {password,AdminId} = req.body
      const result = await this._adminService.newPassword(password,AdminId)
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

}
