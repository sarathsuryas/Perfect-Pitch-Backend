import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IMessageDto } from "src/modules/users/dtos/IMessageDto";
import { IChats } from "src/modules/users/interfaces/IChats";
import { LiveChat } from "src/modules/users/schema/liveChat.schema";

@Injectable()
export class ChatRepository {
  constructor(@InjectModel('LiveChat') private _chatModel: Model<LiveChat>
) {}
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
  async StoreChat(data: IMessageDto) {
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