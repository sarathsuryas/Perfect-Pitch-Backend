import { ISongsSameGenre } from "./ISongsSameGenre";

export interface IGenreRepository {
  getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]>
}