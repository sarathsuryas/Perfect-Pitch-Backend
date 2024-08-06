import { CreateUserDto } from "../../admin/dtos/createUser.dto";
import { EditUserDto } from "../../admin/dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { ICreatedUser } from "../../admin/interfaces/ICreatedUser";
import { IStoredOtp } from "./IStoredOtp";
import { IUserData } from "./IUserData";

export interface IUserRepository {
  checkUser(userData:RegisterUserDto):Promise<boolean> 

  storeOtp(otp:string):Promise<void>

  returnOtp(): Promise<IStoredOtp>

  createUser(data: CreateUserDto, password: string): Promise<ICreatedUser>

  refreshTokenSetup(token: string, id: string): Promise<void>

  existUser(user: LoginUserDto): Promise<IUserData | null>
  
}