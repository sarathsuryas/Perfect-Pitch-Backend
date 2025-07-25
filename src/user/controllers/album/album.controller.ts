import { Controller, Get, HttpStatus, Inject, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { IAlbumDetailsDto } from 'src/user/dtos/IAlbumDetails.dto';
import { IAudioDto } from 'src/user/dtos/IAudio.dto';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { IAlbumDetails } from 'src/user/interfaces/albumDetails';
import { AlbumService } from 'src/user/services/album/album.service';
import { PresignedUrlService } from 'src/user/services/presigned-url/presigned-url.service';
import { v4 as uuidv4 } from 'uuid';
import { IAlbumService } from 'src/user/interfaces/album-service.interface';
import { IPresignedUrlService } from 'src/user/interfaces/presigned-url-service.interface';

@Controller('album')
export class AlbumController {
  constructor(
    @Inject('IAlbumService')
    private readonly _albumService: IAlbumService,
    @Inject('IPresignedUrlService')
    private readonly _presignedUrlService: IPresignedUrlService){}

  
  @UseGuards(UserAuthenticationGuard)
  @Post('submit-album-details')
  async submitAlbumDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const albumDetails = JSON.parse(req.body.files) as IAlbumDetailsDto
      const thumbNailLink = this._presignedUrlService.getFileUrl(albumDetails.thumbnailKey)
      const array: IAudioDto[] = []
      for (let i = 0; i < albumDetails.songs.length; i++) {
        const songLink = this._presignedUrlService.getFileUrl(albumDetails.songs[i].uniqueKey)
        const songThumbNailLink = this._presignedUrlService.getFileUrl(albumDetails.songs[i].thumbNailUniqueKey)
        array.push({ title: albumDetails.songs[i].title, link: songLink, artistId: req.user._id, thumbNailLink: songThumbNailLink, genreId: albumDetails.genreId, uuid: uuidv4() })
      }
      const obj: IAlbumDetails = {
        title: albumDetails.title,
        genreId: albumDetails.genreId,
        artistId: req.user._id,
        thumbNailLink: thumbNailLink,
        songs: array,
      }
      const uuids: string[] = []
      for (let i = 0; i < obj.songs.length; i++) {
        uuids.push(obj.songs[i].uuid)
      }
      const album = await this._albumService.submitAlbumDetails(obj, uuids)
      return res.status(HttpStatus.OK).json(album)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-albums')
  async getAlbums(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      console.log("////")
      const { page, perPage } = req.query;
      if (!req.query.album || req.query.album === "undefined" && page && page!=='undefined' && perPage) {
        console.log('from the albums')
        const result = await this._albumService.getAlbums({ page: parseInt(page as string), perPage: parseInt(perPage as string) })
        if (result) {
          return res.status(HttpStatus.OK).json(result)
        }
      }
     

      return res.status(HttpStatus.NOT_FOUND).json({ message: "something went wrong" })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('search-albums')
  async searchAlbums(@Req() req: ICustomRequest, @Res() res: Response) {
    try {

        const result = await this._albumService.searchAlbums(req.query.album as string)
        if (result) {
          return res.status(HttpStatus.OK).json(result)
        }
     

      return res.status(HttpStatus.NOT_FOUND).json({ message: "something went wrong" })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }



  @UseGuards(UserAuthenticationGuard)
  @Get('get-individual-albums')
  async getIndividualAlbums(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { page, perPage } = req.query;

      if (req.query.artistId) {
        const result = await this._albumService.getIndividualAlbums({ page: parseInt(page as string), perPage: parseInt(perPage as string),artistId:req.query.artistId as string })
        if (result) {
          return res.status(HttpStatus.OK).json(result)
        }
      }

      return res.status(HttpStatus.NOT_FOUND).json({ message: "something went wrong" })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('album-details')
  async albumDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const id = req.query.id as string
      const data = await this._albumService.getAlbumDetails(id, req.user._id)
      if (data) {
        return res.status(HttpStatus.OK).json(data)
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "data not found" })
      }
    } catch (error) {
      console.error(error)
    }
  }




}
