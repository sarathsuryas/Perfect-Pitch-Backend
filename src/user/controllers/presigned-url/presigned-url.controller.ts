import { Controller, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { IAlbumGenPresignedUrlDto } from 'src/modules/users/dtos/IAlbumGenPresignedUrl.dto';
import { UserAuthenticationGuard } from 'src/modules/users/guards/user-authentication/user-authentication.guard';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';

@Controller('presigned-url')
export class PresignedUrlController {
  constructor(private _presignedUrlService:PresignedUrlService){}
  @UseGuards(UserAuthenticationGuard)
  @Post('generate-presigned-url')
  async generatePresignedUrl(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { fileName, contentType } = req.body
      const presignedUrl = await this._presignedUrlService.getPresignedSignedUrl(req.user._id, fileName, contentType)
      if (presignedUrl) {
        return res.status(HttpStatus.ACCEPTED).json({ success: true, presignedUrl })
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "something went wrong" })
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Post('generate-pre-signed-urls')
  async generateSignedUrlsForAlbum(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const parseData: IAlbumGenPresignedUrlDto[] = JSON.parse(req.body.post_params)
      const presignedUrls = []
      for (let i = 0; i < parseData.length; i++) {
        const data = await this._presignedUrlService.getPresignedSignedUrl(req.user._id, parseData[i].name, parseData[i].type)
        presignedUrls.push(data)
      }
      res.status(HttpStatus.OK).json({ success: true, message: "presigned urls for album", presignedUrls })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }


}
