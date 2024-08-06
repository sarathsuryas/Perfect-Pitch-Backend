import { Request } from "express";

export interface ICusomRequest extends Request {
    user?:{
      _id:string;
      email:string;
      fullName:string
      isAdmin:boolean;
      isBlocked:boolean;
    }
}