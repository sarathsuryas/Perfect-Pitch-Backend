
import { IGenres } from 'src/admin/interfaces/IGenres';
import { ISongsSameGenre } from './ISongsSameGenre';

export interface IGenreService {
  getGenres(): Promise<IGenres[]>;
  getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]>;
}
