import { IMessageDto } from "../dtos/IMessageDto";
import { IChats } from "./IChats";

export interface IChatRepository {
  getChat(streamKey: string): Promise<IChats[]>
  StoreChat(data: IMessageDto):Promise<void>
}