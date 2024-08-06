import { IAdminData } from "./IAdminData";

export interface IAdminRepository {
  exist(email:string):Promise<IAdminData|null>;
  refreshTokenSetup(refreshToken: string, _id: string):Promise<void> 
}