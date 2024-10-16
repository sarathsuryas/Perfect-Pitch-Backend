import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongoose";

@Schema({timestamps:true})
export class CommentReply extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  commentId:ObjectId;
  @Prop({default:''})
  reply:string;
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId:ObjectId;
  @Prop({type: [mongoose.Schema.Types.ObjectId],default:[] })
  likes:ObjectId[];
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  tag:ObjectId
  @Prop()
  createdAt?: Date
}

export const commentReplySchema = SchemaFactory.createForClass(CommentReply)

