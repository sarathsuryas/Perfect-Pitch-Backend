import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { EditProfileDto } from "src/user/dtos/editProfile.dto";
import { IReturnEdit } from "src/user/interfaces/IReturnEdit";
import { IUserData } from "src/user/interfaces/IUserData";
import { User } from "src/user/schema/user.schema";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "../interfaces/IUserRepository";


@Injectable() 
export class UserRepository extends BaseRepository<User> implements IUserRepository{
  constructor( @InjectModel('User') private readonly _userModel: Model<User>) {
    super(_userModel)
  }
  async updateProfileImage(_id: string, link: string): Promise<string> {
    try {
      const data = await this._userModel.findById({ _id: _id })
      data.profileImage = link

      await data.save()
      return "success"
    } catch (error) {
      console.error(error)
    }
  }
  async editProfile(data: EditProfileDto, email: string): Promise<IReturnEdit> {
    try {
      const update = await this.findOneAndUpdate({ email: email }, { fullName: data.fullName, phone: data.phone })
      return {
        fullName: update.fullName,
      }
    } catch (error) {
      console.error(error)
    }
  }

  async resetPassword(_id: string, password: string): Promise<IUserData> {
    try {
      const user = await this.findOneAndUpdate({ _id: _id }, { password: password }) as IUserData
      return user
    } catch (error) {
      console.error(error)
    }
  }

  async getUser(id: string): Promise<IUserData> {
    try {
      const data = await this.findOneByQuery({ _id: id + '' }) as IUserData
      if (data) {
        return data
      }
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async subscribeArtist(subscribedUserId: string, artistId: string):Promise<void> {
    try {

      const data = await this._userModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(artistId) }
      }, { $match: { subscribers: subscribedUserId } }])

      if (data.length) {
        const unsubscribe = await this.update(artistId, { $pull: { subscribers: subscribedUserId } })
      }
      if (data.length === 0) {
        const subscribed = await this.update(artistId, { subscribers: subscribedUserId })
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getArtists(data:{page:number,perPage:number}): Promise<IUserData[]> {
    try {
      return await this.findAll(false,(data.page - 1) * data.perPage,data.perPage,false)
                    // .skip((data.page - 1) * data.perPage)
                    //  .limit(data.perPage)
                    //  .lean()
    } catch (error) {
      console.error(error)
    }
  }
  async searchArtists(query: string): Promise<IUserData[]> {
    try {
      return await this.findByQuery({ fullName: { $regex: `^${query}`, $options: 'i' },isBlocked:false })
    } catch (error) {
      console.error(error)
    }
  }
  
  async recomendedArtists(): Promise<IUserData[]> {
    try {
      const artists = await this._userModel.aggregate([
        {
          $project: {
            _id: 1,
            fullName: 1,
            subscribers: 1,
            profileImage: 1,
            premiumUser: 1
          },
        },
        {
          $addFields: {
            subscribersCount: { $size: '$subscribers' }
          }
        },
        {
          $sort: { subscribersCount: -1 }
        },
        { $limit: 4 }
      ])
      return artists
    } catch (error) {
      console.error(error)
    }
  }



  
 

}