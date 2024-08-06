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


 } 


 

