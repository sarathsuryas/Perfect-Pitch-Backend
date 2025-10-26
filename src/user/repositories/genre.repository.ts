import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISongsSameGenre } from "src/user/interfaces/ISongsSameGenre";
import { Genres } from "src/user/schema/genres.schema";
import { Audio } from "src/user/schema/audio.schema";
import { BaseRepository } from "./base.repository";
import { IGenreRepository } from "../interfaces/IGenreRepository";
@Injectable()
export class GenreRepository extends BaseRepository<Genres> implements IGenreRepository{
  constructor(@InjectModel('Genre') private readonly _genreModel: Model<Genres>,
  @InjectModel('Audio') private readonly _audioModel: Model<Audio>,

) {
  super(_genreModel)
}
// async getGenres(): Promise<IGenres[]> {
//   try {
//     return await this._genreModel.find().lean()
//   } catch (error) {
//     console.error(error)
//   }
// }


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