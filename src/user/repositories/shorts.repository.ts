import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IShortsDto } from "src/user/dtos/IShorts.dto";
import { IResponseShorts } from "src/user/interfaces/IResponseShorts";
import { IUserData } from "src/user/interfaces/IUserData";
import { IVideoDetails } from "src/user/interfaces/IVideoDetails";
import { User } from "src/user/schema/user.schema";
import { Video } from "src/user/schema/video.schema";
import { BaseRepository } from "./base.repository";
import { IShortsRepository } from "../interfaces/IShortsRepository";

@Injectable()
export class ShortsRepository implements IShortsRepository {
  constructor(@InjectModel('Video') private readonly _videoModel: Model<Video>,
  @InjectModel('User') private readonly _userModel: Model<User>,

  ) { }
  public userRepo = new BaseRepository<User>(this._userModel)
  public videoRepo = new BaseRepository<Video>(this._videoModel)

  async submitShortsDetails(data: IShortsDto):Promise<void> {
    try {
      await this.videoRepo.create({ artist: data.fullName, title: data.caption, description: data.description, shorts: true, link: data.link, artistId: data.artistId })
    } catch (error) {
      console.error(error)
    }
  }
  async getShorts(userId: string): Promise<IResponseShorts> {
    try {

      const videos = await this.videoRepo.findWithPopulate(
        { shorts: true },
        {},
        {path:'artistId',select:'subscribers profileImage fullName'}   
      ) as IVideoDetails[]
      const userData = await this.userRepo.findById<IUserData>(userId, { _id: 1, profileImage: 1, fullName: 1 })
      const data: IResponseShorts = {
        shorts: videos,
        user: {
          _id: userData._id,
          fullName: userData.fullName,
          profileImage: userData.profileImage
        }
      }

      return data
    } catch (error) {
      console.error(error)
    }
  }


}