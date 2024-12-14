import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISubmitSongDetails } from "src/user/interfaces/ISubmitSongDetails";
import { Audio } from "src/user/schema/audio.schema";
import { IAudioData } from "../interfaces/IAudioData";
import { IAudioDto } from "../dtos/IAudio.dto";
import { BaseRepository } from "./base.repository";
@Injectable()
export class SingleRepository extends BaseRepository<Audio>{
  constructor(@InjectModel('Audio') private readonly _audioModel: Model<Audio>,
) { 
  super(_audioModel)
 }
  async submitSingleDetails(data: ISubmitSongDetails):Promise<IAudioDto | unknown> {
    try {
      return await this.create({ title: data.title, thumbNailLink: data.thumbNailLink, link: data.songLink, genreId: data.genreId, single: true, artistId: data.userId })
    } catch (error) {
      console.error(error)
    }
  } 
}