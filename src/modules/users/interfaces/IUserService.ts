import { EditUserDto } from "../../admin/dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { IReturnUserData } from "../../admin/interfaces/IReturnUserData";
import { IUserData } from "./IUserData";
import { EditProfileDto } from "../dtos/editProfile.dto";
import { IReturnEdit } from "./IReturnEdit";

export interface IUserService {

  checkUser(userData:RegisterUserDto):Promise<string|RegisterUserDto>;

  verifyOtp (userData:string,otp:string):Promise<string>

  login(userData: LoginUserDto): Promise<IReturnUserData | string>
 
  resendOtp(email: string):Promise<void>
  
  decodeToken(token: string): Promise<IUserData>

  createAccessToken(payload: IUserData): Promise<string>

  getRefreshToken(payload: IUserData): Promise<string>

  existUser(email: string): Promise<string> 

  savePasswordResetToken(id: string, email: string): Promise<boolean>

  getResetPasswordToken(resetToken: string)

  newPassword(password: string, UserId: string): Promise<boolean>

  getUserData(id: string): Promise<IUserData>

  updateProfileImage(_id: string, link: string): Promise<string> 

  editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit> 

  checkPassword(password: string,checkPassword:string):Promise<boolean>

  resetPassword(_id:string,password:string):Promise<boolean>
}