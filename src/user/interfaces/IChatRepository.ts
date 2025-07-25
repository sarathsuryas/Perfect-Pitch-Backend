import { IMessageDto } from "../dtos/IMessageDto";
import { IBaseRepository } from "./IBaseRepository";
import { IChat } from "./IChat";
import { IChats } from "./IChats";

export interface IChatRepository extends IBaseRepository<IChat>{
  getChat(streamKey: string): Promise<IChats[]>
  StoreChat(data: IMessageDto):Promise<void>
}