import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongoose";

@Schema({timestamps:true})
export class VideoComment extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  videoId:ObjectId;
  @Prop({default:''})
  comment:string;
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId:ObjectId;
  @Prop({type: [mongoose.Schema.Types.ObjectId],default:[] })
  likes:ObjectId[];
  @Prop()
  createdAt?: Date
}

export const videoCommentSchema = SchemaFactory.createForClass(VideoComment)

