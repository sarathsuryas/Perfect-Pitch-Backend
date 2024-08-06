import { IReturnAdminData } from "./IReturnAdminData";

export interface IAdminService {
  login(email: string, password: string): Promise<IReturnAdminData | string>
  
}