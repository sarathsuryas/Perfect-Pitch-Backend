import { CreateUserDto } from "../dtos/createUser.dto";
import { EditUserDto } from "../dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { ICreatedUser } from "./ICreatedUser";
import { IStoredOtp } from "./IStoredOtp";
import { IUserData } from "./IUserData";

export interface IUserRepository {
  checkUser(userData:RegisterUserDto):Promise<boolean> 

  storeOtp(otp:string):Promise<void>

  returnOtp(): Promise<IStoredOtp>

  createUser(data: CreateUserDto, password: string): Promise<ICreatedUser>

  refreshTokenSetup(token: string, id: string): Promise<void>

  existUser(user: LoginUserDto): Promise<IUserData | null>

  getUsers(): Promise<IUserData[]>

  blockUser(email: string):Promise<void>

  addUser(userData:RegisterUserDto,hash:string):Promise<string> 

  editUser(userData:EditUserDto):Promise<string>

  
}