import { Request } from "express";

export interface ICustomRequest extends Request {
    user?:{
      _id:string;
      email:string;
      fullName:string
      isAdmin:boolean;
      isBlocked:boolean;
    },
    files?:any

}