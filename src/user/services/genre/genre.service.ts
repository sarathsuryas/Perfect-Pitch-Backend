import { Injectable } from '@nestjs/common';
import { IGenres } from 'src/admin/interfaces/IGenres';
import { ISongsSameGenre } from 'src/modules/users/interfaces/ISongsSameGenre';
import { GenreRepository } from 'src/user/repositories/genre.repository';

@Injectable()
export class GenreService {
  constructor(private _genreRepository:GenreRepository) {}
  async getGenres(): Promise<IGenres[]> {
    try {
      return await this._genreRepository.getGenres()
    } catch (error) {
      console.error(error)
    }
  }

  async getSameGenreSongs(genreId: string): Promise<ISongsSameGenre[]> {
    try {
      return await this._genreRepository.getSameGenreSongs(genreId)
    } catch (error) {
      console.error(error)
    }
  }

}
