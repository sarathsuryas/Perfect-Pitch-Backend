import { CreateUserDto } from "src/admin/dtos/createUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { IStoredOtp } from "./IStoredOtp";
import { ICreatedUser } from "src/admin/interfaces/ICreatedUser";
import { IUserData } from "./IUserData";
import { IGoogleLoginDto } from "../dtos/IGoogleLogin.dto";
import { IUserResetToken } from "./IUserResetToken";


export interface IUserAuthRepository {
  checkUser(userData: RegisterUserDto): Promise<boolean>
  storeOtp(otp: string): Promise<void>
  returnOtp(): Promise<IStoredOtp>
  createUser(data: CreateUserDto, password: string): Promise<ICreatedUser>
  refreshTokenSetup(token: string, id: string): Promise<void>
   existUser(email: string): Promise<IUserData | null> 
   createUserUsingGoogleLogin(data: IGoogleLoginDto): Promise<ICreatedUser> 
   getRefreshToken(email: string): Promise<string> 
   getUserId(email: string): Promise<string>
   savePasswordResetToken(id: string, resetToken: string): Promise<boolean>
   getResetPasswordToken(resetToken: string):Promise<IUserResetToken>
   newPassword(password: string, AdminId: string): Promise<IUserResetToken | boolean>
   updatePassword(id: string, password: string): Promise<IUserData> 
   getUser(id: string): Promise<IUserData>
}