import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import configuration from 'src/config/configuration';
import { CreateUserDto } from 'src/admin/dtos/createUser.dto';
import { RegisterUserDto } from 'src/user/dtos/registerUser.dto';
import { IUserData } from 'src/user/interfaces/IUserData';
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { LoginUserDto } from 'src/user/dtos/loginUser.dto';
import { IReturnUserData } from 'src/admin/interfaces/IReturnUserData';
import { IGoogleLoginDto } from 'src/user/dtos/IGoogleLogin.dto';
import { IUserResetToken } from 'src/user/interfaces/IUserResetToken';
import { IUserAuthRepository } from 'src/user/interfaces/IUserAuthRepository';
import { IUserAuthService } from 'src/user/interfaces/IUserAuthService';
@Injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @Inject('IUserAuthRepository')
    private readonly _userAuthRepository: IUserAuthRepository,
    private readonly _mailService: MailerService,
    private readonly _jwtService: JwtService,
  ) { }
  async checkUser(userData: RegisterUserDto): Promise<string | RegisterUserDto> {
    try {
      const result = await this._userAuthRepository.checkUser(userData)
      const { email } = userData
      console.log(email, 'from service')
      if (result) {
        function generateOTP() {
          let digits = '0123456789';
          let OTP = '';
          let len = digits.length
          for (let i = 0; i < 5; i++) {
            OTP += digits[Math.floor(Math.random() * len)];
          }

          return OTP;
        }
        const otp = generateOTP()
        console.log(otp, "genereated from Service")
        const html = readFileSync('public/otp.html', "utf-8")
        const updatedContent = html.replace(
          '<strong style="font-size: 130%" id="otp"></strong>',
          `<strong style="font-size: 130%" id="otp">${otp}</strong>`
        );

        const message = `For Registering your account please use this OTP`;
        const data = await this._mailService.sendMail({
          from: configuration().userEmail,
          to: email,
          subject: `Otp`,
          text: message,
          html: updatedContent
        });

        await this._userAuthRepository.storeOtp(otp)
        return userData

      } else {
        return "user data exist please login"
      }
    } catch (error) {
      console.error(error)
    }
  }

  async verifyOtp(userData: string, otp: string): Promise<IUserData | string> {
    try {
      const { storedOtp } = await this._userAuthRepository.returnOtp()
      const parsedData: CreateUserDto = JSON.parse(userData)


      if (otp === storedOtp) {
        console.log(otp === storedOtp, "data")
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(parsedData.data.password, salt);
        const result = await this._userAuthRepository.createUser(parsedData, hash)
        const { _id, fullName, email, isAdmin, isBlocked } = result
        const payload = { _id, fullName, email, isAdmin, isBlocked }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "7d" })
        await this._userAuthRepository.refreshTokenSetup(refreshToken, _id)
        const obj: IUserData = {
          _id: _id,
          fullName: fullName,
          email: email,
          isBlocked: isBlocked,
          isAdmin: isAdmin,
          refreshToken: refreshToken,
          token: accessToken
        }
        return obj
      } else {
        return "OTP Not Matching"
      }
    } catch (error) {
      console.error(error)
    }
  }

  async login(userData: LoginUserDto): Promise<IReturnUserData | string> {
    try {

      const user = await this._userAuthRepository.existUser(userData.email)

      if (user && user.isBlocked) {
        return 'you cant login'
      }

      if (user) {
        const success = await bcrypt.compare(userData.password, user.password)
        if (success) {
          const payload = {
            _id: user._id + '',
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked
          }
          const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "5h" })
          const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "7d" })
          await this._userAuthRepository.refreshTokenSetup(refreshToken, user._id)
          const obj = {
            token: accessToken,
            refreshToken: refreshToken,
            userData: payload
          }
          return obj
        } else {
          return "the password is wrong"
        }
      } else {
        return "user Data does not exist please Sign Up"
      }
    } catch (error) {
      console.error(error)
    }
  }



  async googleLogin(userData: IGoogleLoginDto): Promise<IReturnUserData | string> {
    try {

      const user = await this._userAuthRepository.existUser(userData.email)
      if (user?.isBlocked) {
        return 'you cant login'
      }

      if (user) {
        const payload = {
          _id: user._id + '',
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked
        }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
        await this._userAuthRepository.refreshTokenSetup(refreshToken, user._id)
        const obj = {
          token: accessToken,
          refreshToken: refreshToken,
          userData: payload
        }
        return obj
      } else {
        const data = await this._userAuthRepository.createUserUsingGoogleLogin(userData)

        const payload = {
          _id: data._id + '',
          email: data.email,
          fullName: data.fullName,
          isAdmin: data.isAdmin,
          isBlocked: data.isBlocked
        }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
        await this._userAuthRepository.refreshTokenSetup(refreshToken, data._id)
        const obj = {
          token: accessToken,
          refreshToken: refreshToken,
          userData: payload
        }
        return obj

      }
    } catch (error) {
      console.error(error)
    }
  }


  async resendOtp(email: string): Promise<void> {
    try {
      function generateOTP() {
        let digits = '0123456789';
        let OTP = '';
        let len = digits.length
        for (let i = 0; i < 5; i++) {
          OTP += digits[Math.floor(Math.random() * len)];
        }

        return OTP;
      }
      const otp = generateOTP()
      console.log(otp, "genereated from Service")
      const html = readFileSync('public/otp.html', "utf-8")
      const updatedContent = html.replace(
        '<strong style="font-size: 130%" id="otp"></strong>',
        `<strong style="font-size: 130%" id="otp">${otp}</strong>`
      );

      const message = `For Registering your account please use this OTP`;
      const data = await this._mailService.sendMail({
        from: configuration().userEmail,
        to: email,
        subject: `Otp`,
        text: message,
        html: updatedContent
      });
      await this._userAuthRepository.storeOtp(otp)
    } catch (error) {
      console.error(error)
    }
  }


  async decodeToken(token: string): Promise<IUserData> {
    try {
      const decoded = await this._jwtService.decode(token)
      const obj: IUserData = {
        _id: decoded._id,
        email: decoded.email,
        fullName: decoded.fullName,
        isAdmin: decoded.isAdmin,
        isBlocked: decoded.isBlocked,
      }
      return obj
    } catch (error) {
      console.error(error)
    }
  }


  async createAccessToken(payload: IUserData): Promise<string> {
    try {
      const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "5h" })

      return accessToken
    } catch (error) {
      console.error(error)
    }
  }

  async getRefreshToken(payload: IUserData): Promise<string> {
    try {

      const refreshToken = await this._userAuthRepository.getRefreshToken(payload.email)

      await this._jwtService.verifyAsync(refreshToken,
        {
          secret: configuration().jwtSecret
        }
      )
      return refreshToken

    } catch (error) {
      console.error(error)
      return "refreshToken expired"
    }
  }


  async existUser(email: string): Promise<string> {
    try {
      const user = await this._userAuthRepository.getUserId(email)
      if (user === "undefined") {
        return user
      } else {
        return user
      }
    } catch (error) {
      console.error(error)
    }
  }


  async savePasswordResetToken(id: string, email: string): Promise<boolean> {
    try {
      const resetToken = crypto.randomBytes(16).toString('hex')
      const result = await this._userAuthRepository.savePasswordResetToken(id, resetToken)
      const data = await this._mailService.sendMail({
        from: configuration().userEmail,
        to: email,
        subject: "Password Reset",
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          `${configuration().endPoint}/reset-password-form/` + resetToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      });
      return result
    } catch (error) {
      console.error(error)
    }
  }
  async getResetPasswordToken(resetToken: string): Promise<IUserResetToken> {
    try {
      const data = await this._userAuthRepository.getResetPasswordToken(resetToken)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async newPassword(password: string, UserId: string): Promise<boolean> {
    try {
      const data = await this._userAuthRepository.newPassword(password, UserId) as IUserResetToken
      if (data) {
        const admin = await this._userAuthRepository.getUser(data._userId)
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const result = await this._userAuthRepository.updatePassword(data._userId, hash)
        if (result) {
          return true
        } else {
          return false
        }

      }
    } catch (error) {
      console.error(error)
    }
  }

}
