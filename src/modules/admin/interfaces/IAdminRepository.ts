import { IUserData } from "src/modules/users/interfaces/IUserData";
import { IAdminData } from "./IAdminData";
import { RegisterUserDto } from "src/modules/users/dtos/registerUser.dto";
import { EditUserDto } from "src/modules/admin/dtos/editUser.dto";

export interface IAdminRepository {
  exist(email:string):Promise<IAdminData|null>;
  refreshTokenSetup(refreshToken: string, _id: string):Promise<void> 
  getUsers(): Promise<IUserData[]> 
  blockUser(email: string):Promise<void>
  addUser(userData:RegisterUserDto,hash:string):Promise<string>
  editUser(userData:EditUserDto):Promise<string>
  blockUser(email: string): Promise<void>
}