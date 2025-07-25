import { IChats } from "./IChats";

export interface IChatService {
  getChats(streamKey: string): Promise<IChats[]>;
}