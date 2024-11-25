import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { ICreateLiveStreamDto } from 'src/modules/users/dtos/ICreateLiveStream.dto';
import { UserAuthenticationGuard } from 'src/modules/users/guards/user-authentication/user-authentication.guard';
import { ICreateLive } from 'src/modules/users/interfaces/ICreateLive';
import { LiveStreamingService } from 'src/user/services/live-streaming/live-streaming.service';
import { UploadService } from 'src/user/services/upload/upload.service';
const webrtc = require("wrtc");

@Controller('live-streaming')
export class LiveStreamingController {
  constructor(private _liveStreamingService: LiveStreamingService, private _uploadService: UploadService) { }
  @UseGuards(UserAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('create-live')
  async createLive(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ICustomRequest,
    @Res() res: Response) {
    try {
      const dto: ICreateLiveStreamDto = {
        title: req.body.title,
        description: req.body.description,
        thumbNail: file,
        genreId: req.body.genreId
      }
      const url = await this._uploadService.uploadToS3(dto.thumbNail, req.body.title)
      const obj: ICreateLive = {
        title: dto.title,
        thumbNailLink: url.url,
        artistId: req.user._id,
        description: dto.description,
        genreId: dto.genreId
      }
      const streamId = await this._liveStreamingService.createLive(obj)
      res.status(HttpStatus.OK).json({ success: true, streamId })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  senderStream: any
  @Post('consumer')
  async consumer(@Body() body, @Res() res: Response) {
    try {
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org"
          }
        ]
      });
      const desc = new webrtc.RTCSessionDescription(body.sdp);
      await peer.setRemoteDescription(desc);
      this.senderStream.getTracks().forEach(track => peer.addTrack(track, this.senderStream));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
        sdp: peer.localDescription
      }
      res.json(payload);

    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @Post('broadcast')
  async broadcast(@Body() body, @Res() res: Response) {
    try {
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org"
          }
        ]
      });
      peer.ontrack = (e) => this.handleTrackEvent(e, peer);
      const desc = new webrtc.RTCSessionDescription(body.sdp);
      await peer.setRemoteDescription(desc);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const payload = {
        sdp: peer.localDescription
      }

      res.json(payload);

    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  handleTrackEvent(e, peer) {
    this.senderStream = e.streams[0];
  };

  @UseGuards(UserAuthenticationGuard)
  @Get('get-streams')
  async getLiveStreams(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this._liveStreamingService.getLiveStreams()
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-live-video-details')
  async getLiveVideoDetails(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._liveStreamingService.getLiveVideoDetails(req.query?.streamKey as string)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Delete('stop-stream')
  async stopStream(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._liveStreamingService.stopStreaming(req.body.streamKey)
      res.status(HttpStatus.OK).json({ success: true })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }




}
