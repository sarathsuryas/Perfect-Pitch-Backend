import { Body, Controller, HttpStatus, InternalServerErrorException, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { IGoogleLoginDto } from 'src/user/dtos/IGoogleLogin.dto';
import { LoginUserDto } from 'src/user/dtos/loginUser.dto';
import { RegisterUserDto } from 'src/user/dtos/registerUser.dto';
import { VerifyOtpDto } from 'src/user/dtos/verifyOtp.dto';
import { UserAuthService } from 'src/user/services/user-auth/user-auth.service';

@Controller('user-auth')
export class UserAuthController {
constructor(private _userAuthService:UserAuthService) {}

  @Post('register')
  async registerUser(@Res() res:Response, @Body() userData: RegisterUserDto) {
    try {
      const result = await this._userAuthService.checkUser(userData)

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

      const result = await this._userAuthService.verifyOtp(data.userData, data.otp)
      if (result === "OTP Not Matching") {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: result })
      }
      if (typeof result !== 'string') {
        res.cookie('userRefreshToken', result.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
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

      const data = await this._userAuthService.login(userData)

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
      const data = await this._userAuthService.googleLogin(userData)

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
      await this._userAuthService.resendOtp(data.data.email)
      res.status(HttpStatus.ACCEPTED).json(userData.userData)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException({ message: "Internal Server Error" })
    }
  }

  @Post('refresh')
  async refresh(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const oldRefreshToken = req.cookies.userRefreshToken
      const payload = await this._userAuthService.decodeToken(oldRefreshToken)

      const newAccessToken = await this._userAuthService.createAccessToken(payload);
      const refreshToken = await this._userAuthService.getRefreshToken(payload);
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
    const user = await this._userAuthService.existUser(req.body.email)

    if (user === 'undefined') {
      return res.status(HttpStatus.CONFLICT).json({ message: "emaill does not exist" })
    }
    const result = await this._userAuthService.savePasswordResetToken(user, req.body.email)
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
      const token = await this._userAuthService.getResetPasswordToken(req.body.token)
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
  async NewPassword(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { password, UserId } = req.body
      const result = await this._userAuthService.newPassword(password, UserId)
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
}
