import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import * as bcrypt from 'bcryptjs'
import { IAdminData } from '../interfaces/IAdminData';
import { JwtService } from '@nestjs/jwt';
import configuration from '../../../config/configuration';
import { IReturnAdminData } from '../interfaces/IReturnAdminData';
import { IAdminService } from '../interfaces/IAdminService';
import { EditUserDto } from '../../../modules/admin/dtos/editUser.dto';
import { RegisterUserDto } from '../../../modules/users/dtos/registerUser.dto';
import { IUserData } from '../../../modules/users/interfaces/IUserData';
import * as crypto from 'crypto'
import { MailerService } from '@nestjs-modules/mailer';
import { IResetToken } from '../interfaces/IResetToken';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly _adminRepository: AdminRepository,
    private readonly _jwtService: JwtService,
    private readonly _mailService: MailerService,
  ) { }
  async login(email: string, password: string): Promise<IReturnAdminData | string> {

    try {
      const admin = await this._adminRepository.exist(email)
      if (admin) {

        const check = await bcrypt.compare(password, admin.password)
        if (check) {
          const payload = {
            _id: admin._id + '',
            email: admin.email,
            fullName: admin.fullName,
            isAdmin: admin.isAdmin,
            isBlocked: admin.isBlocked
          }
          const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
          const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
          await this._adminRepository.refreshTokenSetup(refreshToken, admin._id)
          const obj = {
            accessToken: accessToken,
            refreshToken:refreshToken,
            adminData: payload
          } 
          return obj
        } else {
          return "password is wrong"
        }
      } else {
        return "user not found"
      }

    } catch (error) {
      console.error(error)
    }
  }


  async getUsers(): Promise<IUserData[]> {
    try {
      const data = await this._adminRepository.getUsers()
      const result: IUserData[] = data.map((value) => {
        return {
          _id: value._id + '',
          fullName: value.fullName,
          email: value.email,
          isAdmin: value.isAdmin,
          isBlocked: value.isBlocked,
          profileImage: value.profileImage,
          phone: value.phone
        }
      })
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async blockUser(email: string): Promise<void> {
    try {
      await this._adminRepository.blockUser(email)

    } catch (error) {
      console.error(error)
    }
  }
  async addUser(userData: RegisterUserDto): Promise<string> {
    try {
      const salt = bcrypt.genSaltSync(10);
      console.log(userData)
      const hash = bcrypt.hashSync(userData.password, salt);
      const result = await this._adminRepository.addUser(userData, hash)
      if (typeof result === 'string') {
        return result
      }

    } catch (error) {
      console.error(error)
    }
  }  

  async editUser(userData:EditUserDto):Promise<string> {
    try {
      const data = await this._adminRepository.editUser(userData)
      if(typeof data === 'string') {
        return data
      } 
    } catch (error) {
      console.error(error)
    }
  }
  
async decodeToken(token:string):Promise<IAdminData> {
  try {
        const decoded = await this._jwtService.decode(token)
    const obj:IAdminData =    {
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


  async createAccessToken(payload:IAdminData):Promise<string> {
    try {
      const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })

      return accessToken
    } catch (error) {
      console.error(error)
    }
  }

  async getRefreshToken(payload:IAdminData):Promise<string> {
    try {
      console.log('payload from ')
       const refreshToken = await this._adminRepository.getRefreshToken(payload.email)
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

  async searchUser(search:string): Promise<IUserData[]> {
    try {
      const data = await this._adminRepository.searchUsers(search)
      const result: IUserData[] = data.map((value) => {
        return {
          _id: value._id + '',
          fullName: value.fullName,
          email: value.email,
          isAdmin: value.isAdmin,
          isBlocked: value.isBlocked,
          profileImage: value.profileImage,
          phone: value.phone
        }
      })
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async existUser(email:string):Promise<string> {
    try {
      const user = await this._adminRepository.existUser(email)
      return user
    } catch (error) {
       console.error(error)
    }
  }

  async savePasswordResetToken (id:string,email:string):Promise<boolean> {
    try {
       const resetToken =  crypto.randomBytes(16).toString('hex')
      const result = await this._adminRepository.savePasswordResetToken(id,resetToken)
      const data = await this._mailService.sendMail({
        from: configuration().userEmail,
        to: email,
        subject:"Password Reset",
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    'http://localhost:4200/admin/reset-password-form/' + resetToken + '\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      });
      return result
    } catch (error) {
      console.error(error)
    }
  }
  async getResetPasswordToken(resetToken:string) {
     try {
     const data = await  this._adminRepository.getResetPasswordToken(resetToken)
     return  data
     } catch (error) {
        console.error(error)
     }
  }

  async newPassword (password:string,AdminId:string):Promise<boolean> {
    try {
    const data = await this._adminRepository.newPassword(password,AdminId) as IResetToken 
    if(data) {
      const admin = await this._adminRepository.getAdmin(data._adminId)
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const result = await this._adminRepository.updatePassword(data._adminId,hash)
      if(result) {
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
