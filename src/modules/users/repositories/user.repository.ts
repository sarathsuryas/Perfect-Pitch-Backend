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
import { UserPasswordResetToken } from "../schema/userResetToken";
import { IUserResetToken } from "../interfaces/IUserResetToken";
import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "../interfaces/IReturnEdit";
import { Video } from "../schema/video.schema";
import { IVideoList } from "../interfaces/IVideoList";

@Injectable()
export class UserRepository implements IUserRepository {

  constructor(@InjectModel('User') private readonly _userModel: Model<User>,
    @InjectModel('Otp') private readonly _otpModel: Model<Otp>, @InjectModel('UserResetToken') private readonly _resetTokenModel: Model<UserPasswordResetToken>,@InjectModel('Video') private readonly _videoModel:Model<Video>) { }

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
        return user?._id+"" 
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

  async updateProfileImage(_id: string, link: string): Promise<string> {
    try {
      const data = await this._userModel.findById({_id:_id})
       data.profileImage = link
      
       await data.save()
       return "success"
    } catch (error) {
      console.error(error)
    }
  }
  async editProfile(data: EditProfileDto,email:string):Promise<IReturnEdit> {
    try {
      const update = await this._userModel.findOneAndUpdate({email:email},{fullName:data.fullName,phone:data.phone}).lean() 
       return {
        fullName:update.fullName,
        phone:update.phone
       } 
    } catch (error) {
        console.error(error)
    }
  }

  async resetPassword(_id:string,password:string) {
    try {
      const user = await this._userModel.findOneAndUpdate({_id:_id},{password:password})
      return user
    } catch (error) {
      console.error(error)
    }
  }

  async uploadVideo(videoName:string,videoDescription:string,genre:string,userId:string,videoLink:string,thumbNailLink:string) {
    try {
      const result = await this._videoModel.create({
      title:videoName,
      description:videoDescription,
      genre:genre,
      userId:userId,
      link:videoLink,
      thumbnailLink:thumbNailLink
      })
      
     return result
    } catch (error) {
      console.error(error)
    }
  }

async listVideos():Promise<IVideoList[]> {
  try {
   const videos = await this._videoModel.find({},{title:1,description:1,thumbnailLink:1,visibility:1}).lean() as IVideoList[]
  return videos
  } catch (error) {
    console.error(error)
  }
}

}     