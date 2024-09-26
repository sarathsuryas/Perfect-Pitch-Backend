import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class VideoComment extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  videoId:string;
  @Prop()
  comments:{_id:string,userName:string,profileImage:string,userId:string}[]
}

export const videoCommentSchema = SchemaFactory.createForClass(VideoComment)