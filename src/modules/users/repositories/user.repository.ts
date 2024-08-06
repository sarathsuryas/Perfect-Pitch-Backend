import { InjectModel } from "@nestjs/mongoose";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Model } from "mongoose";
import { User } from "../schema/user.schema";
import { Otp } from "../schema/otp.schema";
import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { CreateUserDto } from "../../admin/dtos/createUser.dto";
import { IStoredOtp } from "../interfaces/IStoredOtp";
import { ICreatedUser } from "../../admin/interfaces/ICreatedUser";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { IUserData } from "../interfaces/IUserData";
import { EditUserDto } from "../../admin/dtos/editUser.dto";
import { AdminRepository } from "src/modules/admin/repositories/admin.repository";

@Injectable()
export class UserRepository implements IUserRepository{
  constructor(@InjectModel('User') private readonly _userModel: Model<User>,
    @InjectModel('Otp') private readonly _otpModel: Model<Otp>) { }

  async checkUser(userData: RegisterUserDto): Promise<boolean> {
    try {
      const result = await this._userModel.findOne({ email: userData.email })
      console.log("data from repository", result)
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
        phone: data.data.phone,
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

  async existUser(user: LoginUserDto): Promise<IUserData | null> {
    try {

      const exist = await this._userModel.findOne({ email: user.email })

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

  

  
}    