import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Patch, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { UsersService } from '../services/users.service';
import { Request, Response } from 'express';
import { error } from 'console';
import { VerifyOtpDto } from '../dtos/verifyOtp.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { AuthenticationGuard } from 'src/modules/guards/authentication/authentication.guard';
import { ICusomRequest } from '../interfaces/ICustomRequest';
import { CreateUserDto } from '../dtos/createUser.dto';
import { EditUserDto } from '../dtos/editUser.dto';

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

      const token = await this._usersService.verifyOtp(data.userData, data.otp)
      if (token === "OTP Not Matching") {

        return res.status(HttpStatus.UNAUTHORIZED).json({ message: token })
      }
      if (typeof token === 'string') {
        return res.status(HttpStatus.CREATED).json({ token })
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
        res.status(HttpStatus.OK).json(data)
      } else {
        res.status(HttpStatus.NOT_FOUND).json(data)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Get('get-users')
  @UseGuards(AuthenticationGuard)
  async getUsers(@Req() req: ICusomRequest) {
    try {
      if (req.user.isAdmin) {
        return await this._usersService.getUsers()
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
        await this._usersService.blockUser(req.body.email)
        return await this._usersService.getUsers()
      } else {
        return 'You are not permitted to this route'
      }
       
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

 @Post('add-user')
 @UseGuards(AuthenticationGuard)
   async addUser (@Body() userData:RegisterUserDto,@Req()req:ICusomRequest,@Res() res:Response) {
     try {
      
      if(req.user.isAdmin) {
        const result = await  this._usersService.addUser(userData)
          if(typeof result === "string") {
            res.status(HttpStatus.CONFLICT).json(result)
          } else {
            const data = await this._usersService.getUsers()
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
     async editUser(@Body() userData:EditUserDto,@Req()req:ICusomRequest,@Res() res:Response) {
       try {
        if(req.user.isAdmin) {
          console.log(userData)
        const data = await this._usersService.editUser(userData)
        if(typeof data === 'string') {
          res.status(HttpStatus.CONFLICT).json(data)
        } else {
          const users = await this._usersService.getUsers()
          res.status(HttpStatus.OK).json(users)
        }
      }
       } catch (error) {
        console.error(error)
        throw new InternalServerErrorException({ message: "Internal Server Error" })
       }
     }

 } 


 

