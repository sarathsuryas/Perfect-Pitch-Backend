import { IUserData } from "../../user/interfaces/IUserData";

export interface IReturnUserData {
  userData:IUserData;
  token:string;
  refreshToken:string;
}