import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import * as bcrypt from 'bcryptjs'
import { IAdminData } from '../interfaces/IAdminData';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { IReturnAdminData } from '../interfaces/IReturnAdminData';
import { IAdminService } from '../interfaces/IAdminService';

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
          const accessToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "1d" })
          const refreshToken = await this._jwtService.signAsync(payload, { secret: configuration().jwtSecret, expiresIn: "10d" })
          await this._adminRepository.refreshTokenSetup(refreshToken, admin._id)
          const obj = {
            token: accessToken,
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
  }
