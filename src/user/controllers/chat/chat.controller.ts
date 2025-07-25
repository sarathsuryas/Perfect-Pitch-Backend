import { Controller, Get, HttpStatus, Inject, InternalServerErrorException, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { ChatService } from 'src/user/services/chat/chat.service';
import { IChatService } from 'src/user/interfaces/chat-service.interface';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject('IChatService')
    private readonly _chatService: IChatService,
  ) {}
  @UseGuards(UserAuthenticationGuard)
  @Get('get-chats')
  async getChats(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const chats = await this._chatService.getChats(req.query?.streamKey as string)
      res.status(HttpStatus.OK).json(chats)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
}
