import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin } from "../schema/admin.schema";
import { IAdminData } from "../interfaces/IAdminData";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { User } from "src/modules/users/schema/user.schema";
import { IUserData } from "src/modules/users/interfaces/IUserData";
import { RegisterUserDto } from "src/modules/users/dtos/registerUser.dto";
import { EditUserDto } from "src/modules/admin/dtos/editUser.dto";
import { JwtService } from "@nestjs/jwt";
import configuration from "src/config/configuration";

@Injectable() 
export class AdminRepository implements IAdminRepository {
 
  constructor(@InjectModel('Admin') private readonly _adminModel: Model<Admin>,@InjectModel('User') private readonly _userModel: Model<User>,private _jwtService:JwtService) {
   
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

     async getUsers(): Promise<IUserData[]> {
      try {
        const data = await this._userModel.find().lean() as IUserData[]
        return data
      } catch (error) {
        console.log(error)
      }
    }
  
    async blockUser(email: string):Promise<void> {
      try {
        const data = await this._userModel.findOne({email:email})
            
        if (data.isBlocked) {
          console.log('blocked')
          data.isBlocked = false
        } else {
          data.isBlocked = true
        }
        await data.save()
        
      } catch (error) {
        console.error(error)
      }
    }
  
    async addUser(userData:RegisterUserDto,hash:string):Promise<string> {
      try {
        const data = await this._userModel.findOne({email:userData.email})
        if(!data) {
          await this._userModel.create({
            fullName:userData.fullName,
            email:userData.email,
            password:hash,
            phone:userData.phone
          })
        } else {
          return "the user exist"
        }  
  
      } catch (error) {
        console.error(error)
      }
    }
  
    async editUser(userData:EditUserDto):Promise<string> {
       try {
        const data = await this._userModel.findOne({email:userData.email})
        if(data) {
          data.email = userData.email
          data.fullName = userData.fullName
          data.phone= userData.phone
          await data.save()
        }  else {
          return "user data not found"
        }
       } catch (error) {
        console.error(error)
       }
    }
    async getUser (id:string) {
      try {
      
       const data = await this._adminModel.findById(id) 

     const decode =   await this._jwtService.verifyAsync(data.refreshToken,
        {
          secret:configuration().jwtSecret
        }
      )
      console.log(decode)
      
      } catch (error) {
        console.error(error)
      }
    }
   async getRefreshToken(email:string):Promise<string>  {
    try {
      const userData = await this._adminModel.findOne({email:email})
     const  {refreshToken}  = userData
     console.log(refreshToken)
     return refreshToken
    } catch (error) {
      console.error(error)
    }
   }
       
  }
   
  