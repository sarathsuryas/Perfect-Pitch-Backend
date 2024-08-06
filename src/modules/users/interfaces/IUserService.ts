import { EditUserDto } from "../dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { IReturnUserData } from "./IReturnUserData";
import { IUserData } from "./IUserData";

export interface IUserService {
  
  checkUser(userData:RegisterUserDto):Promise<string|RegisterUserDto>;

  verifyOtp (userData:string,otp:string):Promise<string>

  login(userData: LoginUserDto): Promise<IReturnUserData | string>

  getUsers(): Promise<IUserData[]>

  blockUser(email: string): Promise<void>

  addUser(userData: RegisterUserDto): Promise<string>

  editUser(userData:EditUserDto):Promise<string>

}