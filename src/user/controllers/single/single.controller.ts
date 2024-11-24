import { Controller, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICustomRequest } from 'src/modules/admin/interfaces/ICustomRequest';
import { ISubmitSongDetailsDto } from 'src/modules/users/dtos/ISubmitSongDetails.dto';
import { UserAuthenticationGuard } from 'src/modules/users/guards/user-authentication/user-authentication.guard';
import { ISubmitSongDetails } from 'src/modules/users/interfaces/ISubmitSongDetails';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { SingleService } from 'src/user/services/single/single.service';

@Controller('single')
export class SingleController {
  constructor(private _singleService: SingleService,private _presignedUrlService:PresignedUrlService) { }
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
