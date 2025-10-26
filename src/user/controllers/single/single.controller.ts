import { Controller, HttpStatus, Inject, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { ISubmitSongDetailsDto } from 'src/user/dtos/ISubmitSongDetails.dto';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { ISubmitSongDetails } from 'src/user/interfaces/ISubmitSongDetails';
import { ISingleService } from 'src/user/interfaces/ISingleService';
import { IPresignedUrlService } from 'src/user/interfaces/presigned-url-service.interface';

@Controller('single')
export class SingleController {
  constructor( @Inject('ISingleService')
    private readonly _singleService: ISingleService,@Inject('IPresignedUrlService')
    private readonly _presignedUrlService:IPresignedUrlService) { }
  @UseGuards(UserAuthenticationGuard)
  @Post('submit-single-details')
  async submitSingleDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = JSON.parse(req.body.file) as ISubmitSongDetailsDto
      const thumbNailLink = this._presignedUrlService.getFileUrl(data.thumbNailUniqueKey)
      const songLink = this._presignedUrlService.getFileUrl(data.songUniqueKey)
      const obj: ISubmitSongDetails = {
        title: data.title,
        genreId: data.genreId,
        thumbNailLink: thumbNailLink,
        songLink: songLink,
        userId: req.user._id 
      } 
      const result = await this._singleService.submitSingleDetails(obj)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
}
