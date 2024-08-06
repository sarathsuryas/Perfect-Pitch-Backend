import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "../schema/admin.schema";
import { IAdminData } from "../interfaces/IAdminData";
import { IAdminRepository } from "../interfaces/IAdminRepository";

@Injectable() 
export class AdminRepository implements IAdminRepository {
 
  constructor(@InjectModel('Admin') private readonly _adminModel: Model<Admin>) {
   
  }
  async exist(email:string):Promise<IAdminData|null> {
    try {
      const exist = await this._adminModel.findOne({email:email},{_id:1,fullName:1,password:1,isAdmin:1,isBlocked:1,email:1})
      if(exist) {
      const obj:IAdminData = {
        _id: exist._id+'',
        fullName:exist.fullName,
        email: exist.email,
        isBlocked: exist.isBlocked,
        isAdmin: exist.isAdmin,
        password:exist.password
      }
      return obj
    } else {
      return null
    }
    } catch (error) {
      console.error(error)
    }
  }
 async refreshTokenSetup(refreshToken: string, _id: string):Promise<void> {
    try {
      await this._adminModel.findByIdAndUpdate(_id, { refreshToken: refreshToken })
    } catch (error) {
      console.error(error)
    }
     }
  }
   