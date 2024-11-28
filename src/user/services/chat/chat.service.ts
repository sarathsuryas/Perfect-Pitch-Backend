import { Injectable } from '@nestjs/common';
import { IChats } from 'src/user/interfaces/IChats';
import { ChatRepository } from 'src/user/repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor (private _chatRepository:ChatRepository) {}
  async getChats(streamKey: string): Promise<IChats[]> {
    try {
      return await this._chatRepository.getChat(streamKey)
    } catch (error) {
      console.error(error)
    }
  }

}
