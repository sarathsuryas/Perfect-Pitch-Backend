import { Controller, Get, HttpStatus, Inject, InternalServerErrorException, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { IGenreService } from 'src/user/interfaces/IGenreService';

@Controller('genre')
export class GenreController {
  constructor(@Inject('IGenreService') private readonly _genreService: IGenreService) {}

  @UseGuards(UserAuthenticationGuard)
  @Get('get-genres')
  async getGenres() {
    try {
      return this._genreService.getGenres()
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Get('get-genre-songs')
  async getSameGenreSongs(@Query() id: { genreId: string }, @Res() res: Response) {
    try {
      const data = await this._genreService.getSameGenreSongs(id.genreId)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
}
