import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongoose";

@Schema({timestamps:true})
export class ReplyToReply extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId})
  replyId:ObjectId;
  @Prop({default:''})
  replyToReply:string;
  @Prop({type: mongoose.Schema.Types.ObjectId})
  userId:ObjectId;
  @Prop({type: [mongoose.Schema.Types.ObjectId],default:[] })
  likes:ObjectId[];
  @Prop({type: mongoose.Schema.Types.ObjectId})
  tag:ObjectId
  @Prop()
  createdAt?: Date
}

export const replyToReplySchema = SchemaFactory.createForClass(ReplyToReply)

