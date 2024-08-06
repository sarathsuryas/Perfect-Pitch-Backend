import { IUserData } from "src/modules/users/interfaces/IUserData";
import { IReturnAdminData } from "./IReturnAdminData";
import { RegisterUserDto } from "src/modules/users/dtos/registerUser.dto";
import { EditUserDto } from "src/modules/admin/dtos/editUser.dto";

export interface IAdminService {
  login(email: string, password: string): Promise<IReturnAdminData | string>
  getUsers(): Promise<IUserData[]>
  addUser(userData: RegisterUserDto): Promise<string> 
  editUser(userData:EditUserDto):Promise<string>
}