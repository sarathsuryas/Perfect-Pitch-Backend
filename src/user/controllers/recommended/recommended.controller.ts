import { Controller, Get, HttpStatus, Inject, InternalServerErrorException, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { RecommendedService } from 'src/user/services/recommended/recommended.service';
import { IRecommendedService } from 'src/user/interfaces/IRecommendedService';

@Controller('recommended')
export class RecommendedController {
  constructor(
    @Inject('IRecommendedService')
    private readonly _recommendedService: IRecommendedService,
  ) {}
  @UseGuards(UserAuthenticationGuard)
  @Get('recomended')
  async recommendedAlbums(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const result = await this._recommendedService.recommended()
      if (result) {
        return res.status(HttpStatus.OK).json(result)
      }
      return res.status(HttpStatus.NOT_FOUND).json({ message: "something went wrong" })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }
}
