import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";
import { Document } from "mongoose";

@Schema()
export class Audio extends Document {
  @Prop({ required: true })
  title: string;
  @Prop()
  like: []
  @Prop()
  link: string;
  @Prop({default:false})
  single: boolean
  @Prop()
  thumbNailLink: string
  @Prop({ default: true })
  visibility: boolean;
  @Prop()
  access: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  artistId: string;
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Album'}) 
  albumId:ObjectId
  @Prop()
  section: string;
  @Prop()
  uuid:string
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Genre',required:true})
  genreId: ObjectId;
}

export const audioSchema = SchemaFactory.createForClass(Audio)
