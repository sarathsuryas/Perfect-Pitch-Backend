import { Genres } from "../schema/genres.schema";
import { IBaseRepository } from "./IBaseRepository";
import { ISongsSameGenre } from "./ISongsSameGenre";

export interface IGenreRepository  extends IBaseRepository<Genres> {
  getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]>
}