import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./user.schema";

@Schema()
export class Video extends Document {
@Prop({required:true})  
title: string;
@Prop({required:true})
description:string;
@Prop()
like:[]
@Prop()
link:string;
@Prop()
thumbnailLink:string
@Prop({default:true})
visibility:boolean;
@Prop()
access:string;
@Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' }) 
userId:string;
@Prop()
section:string;
@Prop()
genre:string
@Prop({default:false})
shorts:boolean;
}

export const videoSchema = SchemaFactory.createForClass(Video)
