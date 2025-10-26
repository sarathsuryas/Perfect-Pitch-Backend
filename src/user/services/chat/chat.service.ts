import { Inject, Injectable } from '@nestjs/common';
import { IChatService } from 'src/user/interfaces/chat-service.interface';
import { IChatRepository } from 'src/user/interfaces/IChatRepository';
import { IChats } from 'src/user/interfaces/IChats';

@Injectable()
export class ChatService implements IChatService {
  constructor (@Inject('IChatRepository')
    private readonly _chatRepository: IChatRepository) {}
  async getChats(streamKey: string): Promise<IChats[]> {
    try {
      return await this._chatRepository.getChat(streamKey)
    } catch (error) {
      console.error(error)
    }
  }

}
