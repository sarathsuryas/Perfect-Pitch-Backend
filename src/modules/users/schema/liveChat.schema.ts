import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema({timestamps:true})
export class LiveChat extends Document {
 @Prop({required:true})
 streamKey:string
 @Prop({type: mongoose.Schema.Types.ObjectId})
 userId:ObjectId
 @Prop({required:true})
 message:string
 @Prop()
 createdAt?: Date
} 
 
export const LiveChatSchema = SchemaFactory.createForClass(LiveChat)

 