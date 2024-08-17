import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
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
  async refresh(@Req() req: Request,@Res()res:Response) {
    try {
      const oldRefreshToken = req.cookies.adminToken
      const payload = await this._adminService.decodeToken(oldRefreshToken)
      
      const newAccessToken = await this._adminService.createAccessToken(payload);
      const refreshToken = await this._adminService.getRefreshToken(payload);
      if(refreshToken === "refreshToken expired") {
        res.status(HttpStatus.FORBIDDEN)
      }
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
       
      return res.send({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error) 
    }
  }

  @Get('get-users')
  @UseGuards(AuthenticationGuard)
  async getUsers(@Req() req: ICusomRequest) {
    try {
      if (req.user) { 

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




}
