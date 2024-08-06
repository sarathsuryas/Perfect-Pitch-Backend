import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IUserService } from '../interfaces/IUserService';
import { UserRepository } from '../repositories/user.repository';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import configuration from 'src/config/configuration';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../admin/dtos/createUser.dto';
import * as bcrypt from 'bcryptjs'
import { LoginUserDto } from '../dtos/loginUser.dto';
import { IUserData } from '../interfaces/IUserData';
import { IReturnUserData } from '../../admin/interfaces/IReturnUserData';
import { EditUserDto } from '../../admin/dtos/editUser.dto';


@Injectable()
export class UsersService {
  constructor(private readonly _usersRepository: UserRepository,
    private readonly _mailService: MailerService,
    private readonly _jwtService: JwtService
  ) { }


  async checkUser(userData: RegisterUserDto): Promise<string | RegisterUserDto> {
    try {
      const result = await this._usersRepository.checkUser(userData)
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
        const html = readFileSync(join(__dirname + "../../../../../public/otp.html"), "utf-8")
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

        await this._usersRepository.storeOtp(otp)
        return userData

      } else {
        return "user data exist please login"
      }
    } catch (error) {
      console.error(error)
    }
  }

  async verifyOtp(userData: string, otp: string): Promise<string> {
    try {
      const { storedOtp } = await this._usersRepository.returnOtp()
      const parsedData: CreateUserDto = JSON.parse(userData)


      if (otp === storedOtp) {
        console.log(otp === storedOtp, "data")
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(parsedData.data.password, salt);
        const result = await this._usersRepository.createUser(parsedData, hash)
        const { _id, fullName, email, isAdmin, isBlocked } = result
        const payload = { _id, fullName, email, isAdmin, isBlocked }
        const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
        const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
        await this._usersRepository.refreshTokenSetup(refreshToken, _id)
        return accessToken
      } else {
        return "OTP Not Matching"
      }
    } catch (error) {
      console.error(error)
    }
  }

  async login(userData: LoginUserDto): Promise<IReturnUserData | string> {
    try {
      const user = await this._usersRepository.existUser(userData)

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
          const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
          const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
          await this._usersRepository.refreshTokenSetup(refreshToken, user._id)
          const obj = {
            token: accessToken,
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

 

}
