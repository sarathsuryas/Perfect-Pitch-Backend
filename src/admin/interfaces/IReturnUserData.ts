import { IUserData } from "../../modules/users/interfaces/IUserData";

export interface IReturnUserData {
  userData:IUserData;
  token:string;
  refreshToken:string;
}