import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IGenres } from "src/admin/interfaces/IGenres";
import { ISongsSameGenre } from "src/user/interfaces/ISongsSameGenre";
import { Genres } from "src/user/schema/genres.schema";
import { Audio } from "src/user/schema/audio.schema";
@Injectable()
export class GenreRepository {
  constructor(@InjectModel('Genre') private readonly _genreModel: Model<Genres>,
  @InjectModel('Audio') private readonly _audioModel: Model<Audio>,

) {}
async getGenres(): Promise<IGenres[]> {
  try {
    return await this._genreModel.find().lean()
  } catch (error) {
    console.error(error)
  }
}


async getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]> {
  try {
    const data = await this._audioModel.find({ genreId: genreId })
      .populate('albumId', 'title thumbNailLink')
      .populate('artistId', 'fullName')
      .lean() as ISongsSameGenre[]
    return data
  } catch (error) {
    console.error(error)
  }
}


}