import { EditUserDto } from "../../admin/dtos/editUser.dto";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { RegisterUserDto } from "../dtos/registerUser.dto";
import { IReturnUserData } from "../../admin/interfaces/IReturnUserData";
import { IUserData } from "./IUserData";

export interface IUserService {

  checkUser(userData:RegisterUserDto):Promise<string|RegisterUserDto>;

  verifyOtp (userData:string,otp:string):Promise<string>

  login(userData: LoginUserDto): Promise<IReturnUserData | string>

  

}