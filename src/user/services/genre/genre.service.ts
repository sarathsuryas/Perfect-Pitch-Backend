import { Inject, Injectable } from '@nestjs/common';
import { IGenres } from 'src/admin/interfaces/IGenres';
import { IGenreRepository } from 'src/user/interfaces/IGenreRepository';
import { IGenreService } from 'src/user/interfaces/IGenreService';
import { ISongsSameGenre } from 'src/user/interfaces/ISongsSameGenre';

@Injectable()
export class GenreService implements IGenreService{
  constructor(
    @Inject('IGenreRepository')
    private readonly _genreRepository: IGenreRepository,
  ) {}
  async getGenres(): Promise<IGenres[]> {
    try {
      return await this._genreRepository.find<IGenres>()
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
