import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { EditProfileDto } from "src/user/dtos/editProfile.dto";
import { IAlbumData } from "src/user/interfaces/IAlbumData";
import { IReturnEdit } from "src/user/interfaces/IReturnEdit";
import { IUserData } from "src/user/interfaces/IUserData";
import { IVideoDetails } from "src/user/interfaces/IVideoDetails";
import { User } from "src/user/schema/user.schema";


@Injectable() 
export class UserRepository {
  constructor( @InjectModel('User') private readonly _userModel: Model<User>) {}
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
      const update = await this._userModel.findOneAndUpdate({ email: email }, { fullName: data.fullName, phone: data.phone }).lean()
      return {
        fullName: update.fullName,
      }
    } catch (error) {
      console.error(error)
    }
  }

  async resetPassword(_id: string, password: string) {
    try {
      const user = await this._userModel.findOneAndUpdate({ _id: _id }, { password: password })
      return user
    } catch (error) {
      console.error(error)
    }
  }

  async getUser(id: string): Promise<IUserData> {
    try {
      const data = await this._userModel.findOne({ _id: id + '' }).lean() as IUserData
      if (data) {
        return data
      }
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async subscribeArtist(subscribedUserId: string, artistId: string) {
    try {

      const data = await this._userModel.aggregate([{
        $match: { _id: new mongoose.Types.ObjectId(artistId) }
      }, { $match: { subscribers: subscribedUserId } }])

      if (data.length) {
        const unsubscribe = await this._userModel.findByIdAndUpdate(artistId, { $pull: { subscribers: subscribedUserId } }).lean() as IVideoDetails
        return {

        }
      }
      if (data.length === 0) {
        const subscribed = await this._userModel.findByIdAndUpdate(artistId, { subscribers: subscribedUserId })
      }

    } catch (error) {
      console.error(error)
    }
  }

  async getArtists(data:{page:number,perPage:number}): Promise<IUserData[]> {
    try {
      return await this._userModel.find()
                    .skip((data.page - 1) * data.perPage)
                     .limit(data.perPage)
                     .lean()
    } catch (error) {
      console.error(error)
    }
  }
  async searchArtists(query: string): Promise<IUserData[]> {
    try {
      return await this._userModel.find({ fullName: { $regex: `^${query}`, $options: 'i' } })
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