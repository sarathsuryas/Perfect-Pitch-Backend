import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IMessageDto } from "src/user/dtos/IMessageDto";
import { IChats } from "src/user/interfaces/IChats";
import { LiveChat } from "src/user/schema/liveChat.schema";
import { BaseRepository } from "./base.repository";
import { IChat } from "../interfaces/IChat";
import { IChatRepository } from "../interfaces/IChatRepository";

@Injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository{
  constructor(@InjectModel('LiveChat') private _chatModel: Model<LiveChat>
) {
  super(_chatModel)
}
  async getChat(streamKey: string): Promise<IChats[]> {
    try {
      const chats = await this._chatModel.aggregate([
        { $match: { streamKey: streamKey } },
        {
          $lookup: {
            from: "users",
            foreignField: '_id',
            localField: 'userId',
            as: 'userData'
          }
        },
        { $unwind: '$userData' },
        {
          $project: {
            streamKey: 1,
            message: 1,
            userData: {
              _id: 1,
              fullName: 1
            },
            createdAt: 1
          }
        },
        { $sort: { createdAt: 1 } }
      ]) as IChats[]

      return chats
    } catch (error) {
      console.error(error)
    }
  }
  async StoreChat(data: IMessageDto):Promise<void> {
    try {
      await this._chatModel.create({
        streamKey: data.streamKey,
        userId: data.userId,
        message: data.message
      })
    } catch (error) {
      console.error(error)
    }
  }


}