import { Controller, Get, HttpStatus, InternalServerErrorException, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { UserAuthenticationGuard } from 'src/modules/users/guards/user-authentication/user-authentication.guard';
import { GenreService } from 'src/user/services/genre/genre.service';

@Controller('genre')
export class GenreController {
  constructor(private _genreService:GenreService) {}
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
