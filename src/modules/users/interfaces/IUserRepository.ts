import { CreateUserDto } from "../../admin/dtos/createUser.dto";
import { EditUserDto } from "../../admin/dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { ICreatedUser } from "../../admin/interfaces/ICreatedUser";
import { IStoredOtp } from "./IStoredOtp";
import { IUserData } from "./IUserData";
import { IUserResetToken } from "./IUserResetToken";
import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "./IReturnEdit";

export interface IUserRepository {
  checkUser(userData:RegisterUserDto):Promise<boolean> 

  storeOtp(otp:string):Promise<void>

  returnOtp(): Promise<IStoredOtp>

  createUser(data: CreateUserDto, password: string): Promise<ICreatedUser>

  refreshTokenSetup(token: string, id: string): Promise<void>

  existUser(email:string): Promise<IUserData | null>
  
  getRefreshToken(email: string): Promise<string>

  getUserId(email: string): Promise<string>

  savePasswordResetToken(id: string, resetToken: string): Promise<boolean>

  getResetPasswordToken(resetToken: string)

  newPassword(password: string, AdminId: string): Promise<IUserResetToken | boolean>

  updatePassword(id: string, password: string): Promise<IUserData>

  getUser(id: string): Promise<IUserData>

  updateProfileImage(_id: string, link: string): Promise<string>

  editProfile(data: EditProfileDto,email:string):Promise<IReturnEdit>

  resetPassword(_id:string,password:string)
}