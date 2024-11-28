import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateUserDto } from "src/admin/dtos/createUser.dto"
import { ICreatedUser } from "src/admin/interfaces/ICreatedUser"
import { IGoogleLoginDto } from "src/user/dtos/IGoogleLogin.dto"
import { RegisterUserDto } from "src/user/dtos/registerUser.dto"
import { IStoredOtp } from "src/user/interfaces/IStoredOtp"
import { IUserData } from "src/user/interfaces/IUserData"
import { IUserResetToken } from "src/user/interfaces/IUserResetToken"
import { Otp } from "src/user/schema/otp.schema"
import { User } from "src/user/schema/user.schema"
import { UserPasswordResetToken } from "src/user/schema/userResetToken"

@Injectable()
export class UserAuthRepository {
constructor(
  @InjectModel('User') private readonly _userModel: Model<User>,
  @InjectModel('Otp') private readonly _otpModel: Model<Otp>,
  @InjectModel('UserResetToken') private readonly _resetTokenModel: Model<UserPasswordResetToken>,
) {}

  async checkUser(userData: RegisterUserDto): Promise<boolean> {
    try {
      const result = await this._userModel.findOne({ email: userData.email })
      if (!result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  async storeOtp(otp: string): Promise<void> {
    try {
      await this._otpModel.updateOne({ storedOtp: otp })
    } catch (error) {
      console.error(error)
    }
  }

  async returnOtp(): Promise<IStoredOtp> {
    try {
      return await this._otpModel.findOne({}, { _id: 0, storedOtp: 1 })
    } catch (error) {
      console.error(error)
    }
  }

  async createUser(data: CreateUserDto, password: string): Promise<ICreatedUser> {
    try {
      const result = await this._userModel.create({
        fullName: data.data.fullName,
        email: data.data.email,
        password: password
      })
      const obj: ICreatedUser = {
        _id: result._id + '',
        fullName: result.fullName,
        email: result.email,
        isBlocked: result.isBlocked,
        isAdmin: result.isAdmin
      }

      return obj
    } catch (error) {
      console.error(error)
    }
  }

  async refreshTokenSetup(token: string, id: string): Promise<void> {
    try {
      await this._userModel.findByIdAndUpdate(id, { refreshToken: token })
    } catch (error) {
      console.error(error)
    }
  }

  async existUser(email: string): Promise<IUserData | null> {
    try {

      const exist = await this._userModel.findOne({ email: { $regex: `^${email}`, $options: 'i' } })

      if (exist) {
        const obj: IUserData = {
          _id: exist._id + '',
          fullName: exist.fullName,
          email: exist.email,
          password: exist.password,
          isAdmin: exist.isAdmin,
          isBlocked: exist.isBlocked
        }
        return obj
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
    }
  }

  async createUserUsingGoogleLogin(data: IGoogleLoginDto): Promise<ICreatedUser> {

    try {
      const result = await this._userModel.create({
        fullName: data.name,
        email: data.email,
        profileImage: data.photoUrl
      })
      const obj: ICreatedUser = {
        _id: result._id + '',
        fullName: result.fullName,
        email: result.email,
        isBlocked: result.isBlocked,
        isAdmin: result.isAdmin
      }
      return obj
    }

    catch (error) {
      console.error(error)
    }
  }


  async getRefreshToken(email: string): Promise<string> {
    try {
      const userData = await this._userModel.findOne({ email: email })
      const { refreshToken } = userData
      console.log(refreshToken)
      return refreshToken
    } catch (error) {
      console.error(error)
    }
  }

  async getUserId(email: string): Promise<string> {
    const user = await this._userModel.findOne({ email: email }).lean()
    return user?._id + ""
  }

  async savePasswordResetToken(id: string, resetToken: string): Promise<boolean> {
    try {
      const resetTokenInstance = new this._resetTokenModel({ _userId: id, resetToken: resetToken })
      await resetTokenInstance.save(
        await this._resetTokenModel.find({ _userId: id, resetToken: { $ne: resetTokenInstance.resetToken } }).deleteOne().exec())
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
  async newPassword(password: string, AdminId: string): Promise<IUserResetToken | boolean> {
    try {
      const data = await this._resetTokenModel.findOne({ _adminId: AdminId }).lean() as IUserResetToken
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
  async updatePassword(id: string, password: string): Promise<IUserData> {
    try {
      const data = await this._userModel.findByIdAndUpdate(id, { password: password }).lean() as IUserData
      if (data) {
        return data
      } else {
        return data
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getUser(id: string): Promise<IUserData> {
    try {
      const data = await this._userModel.findOne({ _id: id + '' }).lean() as IUserData
      if (data) {
        return data
      }
      return data
    } catch (error) {
      console.error(error)
    }
  }

}