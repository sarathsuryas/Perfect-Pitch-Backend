import { Controller, Get, HttpStatus, Inject, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { IShortsDto } from 'src/user/dtos/IShorts.dto';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { IPresignedUrlService } from 'src/user/interfaces/presigned-url-service.interface';
import { IShortsService } from 'src/user/interfaces/IShortsService';

@Controller('shorts')
export class ShortsController {
  constructor(@Inject('IShortsService') private readonly _shortsService: IShortsService, @Inject('IPresignedUrlService')
  private readonly _presignedUrlService: IPresignedUrlService) {}
  @UseGuards(UserAuthenticationGuard)
  @Post('submit-shorts-details')
  async submitShortsDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const videoLink = this._presignedUrlService.getFileUrl(req.body.uniqueKey)
      const obj: IShortsDto = {
        caption: req.body.caption,
        description: req.body.description,
        shorts: true,
        link: videoLink,
        fullName: req.user.fullName,
        artistId: req.user._id
      }
      await this._shortsService.submitShortsDetails(obj)
      res.status(HttpStatus.ACCEPTED).json({ success: true })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-shorts')
  async getShorts(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const shorts = await this._shortsService.getShorts(req.user._id)
      res.status(HttpStatus.OK).json(shorts)
    } catch (error) {
      console.error(error)
    }
  }


}
