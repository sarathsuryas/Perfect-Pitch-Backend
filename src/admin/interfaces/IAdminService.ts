import { IUserData } from "src/user/interfaces/IUserData";
import { IReturnAdminData } from "./IReturnAdminData";
import { RegisterUserDto } from "src/user/dtos/registerUser.dto";
import { EditUserDto } from "src/admin/dtos/editUser.dto";
import { IAdminData } from "./IAdminData";

export interface IAdminService {
  login(email: string, password: string): Promise<IReturnAdminData | string>

  getUsers(): Promise<IUserData[]>

  addUser(userData: RegisterUserDto): Promise<string> 

  editUser(userData:EditUserDto):Promise<string>

  decodeToken(token:string):Promise<IAdminData> 

  createAccessToken(payload:IAdminData):Promise<string>

  getRefreshToken(payload:IAdminData):Promise<string>

  searchUser(search:string): Promise<IUserData[]>

  existUser(email:string):Promise<string>

  savePasswordResetToken (id:string,email:string):Promise<boolean>

  newPassword (password:string,AdminId:string):Promise<boolean>
}