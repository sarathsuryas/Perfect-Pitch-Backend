import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "../schema/admin.schema";
import { IAdminData } from "../interfaces/IAdminData";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { User } from "src/modules/users/schema/user.schema";
import { IUserData } from "src/modules/users/interfaces/IUserData";
import { RegisterUserDto } from "src/modules/users/dtos/registerUser.dto";
import { EditUserDto } from "src/modules/admin/dtos/editUser.dto";
import { JwtService } from "@nestjs/jwt";
import configuration from "src/config/configuration";
import { PasswordResetToken } from "../schema/resetToken.schema";
import { IResetToken } from "../interfaces/IResetToken";

@Injectable()
export class AdminRepository implements IAdminRepository {

  constructor(@InjectModel('Admin') private readonly _adminModel: Model<Admin>,
   @InjectModel('User') private readonly _userModel: Model<User>,
    @InjectModel('ResetToken') private readonly _resetTokenModel: Model<PasswordResetToken>) {

  }
  async exist(email: string): Promise<IAdminData | null> {
    try {
      const exist = await this._adminModel.findOne({ email: email }, { _id: 1, fullName: 1, password: 1, isAdmin: 1, isBlocked: 1, email: 1 })
      if (exist) {
        const obj: IAdminData = {
          _id: exist._id + '',
          fullName: exist.fullName,
          email: exist.email,
          isBlocked: exist.isBlocked,
          isAdmin: exist.isAdmin,
          password: exist.password
        }
        return obj
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  async refreshTokenSetup(refreshToken: string, _id: string): Promise<void> {
    try {
      await this._adminModel.findByIdAndUpdate(_id, { refreshToken: refreshToken })
    } catch (error) {
      console.error(error)
    }
  }

  async getUsers(): Promise<IUserData[]> {
    try {
      const data = await this._userModel.find().lean() as IUserData[]
      return data
    } catch (error) {
      console.log(error)
    }
  }

  async blockUser(email: string): Promise<void> {
    try {
      const data = await this._userModel.findOne({ email: email })

      if (data.isBlocked) {
        console.log('blocked')
        data.isBlocked = false
      } else {
        data.isBlocked = true
      }
      await data.save()

    } catch (error) {
      console.error(error)
    }
  }

  async addUser(userData: RegisterUserDto, hash: string): Promise<string> {
    try {
      const data = await this._userModel.findOne({ email: userData.email })
      if (!data) {
        await this._userModel.create({
          fullName: userData.fullName,
          email: userData.email,
          password: hash,
          phone: userData.phone
        })
      } else {
        return "the user exist"
      }

    } catch (error) {
      console.error(error)
    }
  }

  async editUser(userData: EditUserDto): Promise<string> {
    try {
      const data = await this._userModel.findOne({ email: userData.email })
      if (data) {
        data.email = userData.email
        data.fullName = userData.fullName
        data.phone = userData.phone
        await data.save()
      } else {
        return "user data not found"
      }
    } catch (error) {
      console.error(error)
    }
  }
  async getAdmin(id: string): Promise<IAdminData> {
    try {

      const data = await this._adminModel.findOne({ _id: id + '' }).lean() as IAdminData

      if (data) {
        return data
      }
      return data
    } catch (error) {
      console.error(error)
    }
  }
  async getRefreshToken(email: string): Promise<string> {
    try {
      const userData = await this._adminModel.findOne({ email: email })
      const { refreshToken } = userData
      console.log(refreshToken)
      return refreshToken
    } catch (error) {
      console.error(error)
    }
  }

  async searchUsers(search: string): Promise<IUserData[]> {
    try {
      const data = await this._userModel.find({ fullName: { $regex: `^${search}`, $options: 'i' } }).lean() as IUserData[]
      return data
    } catch (error) {
      console.log(error)
    }
  }

  async existUser(email: string): Promise<string> {
    try {
      const user = await this._adminModel.findOne({ email: email }).lean() as IAdminData
      if (user) {
        return user._id + ''
      }
    } catch (error) {
      console.error(error)
    }
  }

  async savePasswordResetToken(id: string, resetToken: string): Promise<boolean> {
    try {
      const resetTokenInstance = new this._resetTokenModel({ _adminId: id, resetToken: resetToken })
      await resetTokenInstance.save(
        await this._resetTokenModel.find({ _adminId: id, resetToken: { $ne: resetTokenInstance.resetToken } }).deleteOne().exec())
      return true
    } catch (error) {
      console.error(error)
    }
  }
  async getResetPasswordToken(resetToken: string) {
    try {
      const data = await this._resetTokenModel.findOne({ resetToken: resetToken })
      return data
    } catch (error) {
      console.error(error)
    }
  }
  async newPassword(password: string, AdminId: string): Promise<IResetToken | boolean> {
    try {
      const data = await this._resetTokenModel.findOne({ _adminId: AdminId }).lean() as IResetToken
      const expirationTime = new Date(data.createdAt.getTime() + 3600 * 1000);
      const currentTime = new Date();
      if (currentTime < expirationTime) {
        return data
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }
  async updatePassword(id: string, password: string): Promise<IAdminData> {
    try {
      const data = await this._adminModel.findByIdAndUpdate(id, { password: password }).lean() as IAdminData
      if (data) {
        return data
      } else {
        return data
      }

    } catch (error) {
      console.error(error)
    }
  }


} 
  
  