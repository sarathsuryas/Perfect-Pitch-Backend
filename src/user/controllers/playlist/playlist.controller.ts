import { Controller, Get, HttpStatus, InternalServerErrorException, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { ICreatePlaylistDto } from 'src/user/dtos/ICreatePlaylist.dto';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { PlaylistService } from 'src/user/services/playlist/playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(private _playlistService:PlaylistService) {}
  
  @UseGuards(UserAuthenticationGuard)
  @Post('create-Playlist')
  async createPlaylist(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const obj: ICreatePlaylistDto = {
        userId: req.user._id,
        songId: req.body.songId,
        title: req.body.title,
        visibility: req.body.visibility,
        thumbNailLink: req.body.thumbNailLink
      }
      const data = await this._playlistService.createPlaylist(obj)
      res.status(HttpStatus.OK).json({ success: true, playlistId: data._id })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-user-playlists')
  async getUserPlaylist(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { page, perPage } = req.query;
      if (!req.query.playlist && req.query.playlist !== undefined && page && perPage) {
        const data = await this._playlistService.getUserPlaylist({ userId: req.user._id, page: parseInt(page as string), perPage: parseInt(perPage as string) })
        res.status(HttpStatus.OK).json(data)
      }
      if (req.query.playlist && req.query.playlist !== undefined) {
        const data = await this._playlistService.searchPlaylist(req.query.playlist as string)
        res.status(HttpStatus.OK).json(data)
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Get('get-all-playlists-user')
  async getAllPlaylistUser(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._playlistService.getAllPlaylistUser(req.user._id as string)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-playlists')
  async getPlaylists(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const { page, perPage } = req.query;
      if (!req.query.playlist && req.query.playlist !== undefined && page && perPage) {
        const data = await this._playlistService.getPlaylists({ userId: req.user._id, page: parseInt(page as string), perPage: parseInt(perPage as string) })
        res.status(HttpStatus.OK).json(data)
      }
      if (req.query.playlist && req.query.playlist !== undefined) {
        const data = await this._playlistService.searchPlaylist(req.query.playlist as string)
        res.status(HttpStatus.OK).json(data)
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }




  @UseGuards(UserAuthenticationGuard)
  @Put('add-to-playlist')
  async addToPlaylist(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._playlistService.addToPlaylist(req.body.playlistId, req.body.songId)
      if (data) {
        res.status(HttpStatus.OK).json({ success: true, exist: true })
      } else {
        res.status(HttpStatus.OK).json({ success: true, exist: false })
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-playlist-songs')
  async getPlaylistSongs(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._playlistService.getPlaylistSongs(req.query.playlistId as string, req.user._id)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

}
