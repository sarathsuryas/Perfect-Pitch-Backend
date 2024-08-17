import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import * as bcrypt from 'bcryptjs'
import { IAdminData } from '../interfaces/IAdminData';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { IReturnAdminData } from '../interfaces/IReturnAdminData';
import { IAdminService } from '../interfaces/IAdminService';
import { EditUserDto } from 'src/modules/admin/dtos/editUser.dto';
import { RegisterUserDto } from 'src/modules/users/dtos/registerUser.dto';
import { IUserData } from 'src/modules/users/interfaces/IUserData';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly _adminRepository: AdminRepository,
    private readonly _jwtService: JwtService
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
          const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "60s" })
          const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "2m" })
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
      const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "60s" })

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
  
}
