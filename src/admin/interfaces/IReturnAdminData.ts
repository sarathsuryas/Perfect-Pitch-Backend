import { IAdminData } from "./IAdminData";

export interface IReturnAdminData {
  adminData:IAdminData;
  accessToken:string;
  refreshToken:string;
}