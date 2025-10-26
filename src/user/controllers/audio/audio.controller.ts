import { Controller, Get, HttpStatus, Inject, InternalServerErrorException, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { IAudioService } from 'src/user/interfaces/audio-service.interface';

@Controller('audio')
export class AudioController {
  constructor(@Inject('IAudioService')
    private readonly _audioService: IAudioService) {}
  @UseGuards(UserAuthenticationGuard)
  @Get('get-song')
  async getSong(@Query() data, @Res() res: Response) {
    try {
      const { songId } = data
      const result = await this._audioService.getSong(songId)
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }

  }
}
