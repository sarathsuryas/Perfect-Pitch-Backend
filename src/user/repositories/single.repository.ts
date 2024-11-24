import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISubmitSongDetails } from "src/modules/users/interfaces/ISubmitSongDetails";
import { Audio } from "src/modules/users/schema/audio.schema";
@Injectable()
export class SingleRepository {
  constructor(@InjectModel('Audio') private readonly _audioModel: Model<Audio>,
) { }
  async submitSingleDetails(data: ISubmitSongDetails) {
    try {
      return await this._audioModel.create({ title: data.title, thumbNailLink: data.thumbNailLink, link: data.songLink, genreId: data.genreId, single: true, artistId: data.userId })
    } catch (error) {
      console.error(error)
    }
  }
}