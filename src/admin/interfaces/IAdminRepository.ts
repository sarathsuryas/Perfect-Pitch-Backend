import { IUserData } from "src/user/interfaces/IUserData";
import { IAdminData } from "./IAdminData";
import { RegisterUserDto } from "src/user/dtos/registerUser.dto";
import { EditUserDto } from "src/admin/dtos/editUser.dto";
import { IResetToken } from "./IResetToken";

export interface IAdminRepository {
  exist(email:string):Promise<IAdminData|null>;

  refreshTokenSetup(refreshToken: string, _id: string):Promise<void> 

  getUsers(): Promise<IUserData[]> 

  blockUser(email: string):Promise<void>

  addUser(userData:RegisterUserDto,hash:string):Promise<string>

  editUser(userData:EditUserDto):Promise<string>

  blockUser(email: string): Promise<void>

  getAdmin(id: string): Promise<IAdminData>

  getRefreshToken(email: string): Promise<string>

  searchUsers(search: string): Promise<IUserData[]> 

  existUser(email: string): Promise<string>

  savePasswordResetToken(id: string, resetToken: string): Promise<boolean>

  newPassword(password: string, AdminId: string): Promise<IResetToken | boolean> 

  updatePassword(id: string, password: string): Promise<IAdminData>
}