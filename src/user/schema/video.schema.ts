import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema()
export class Video extends Document {
@Prop({required:true})
artist:string  
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
artistId:string;
@Prop({default:[]})
viewers:string[];
@Prop({type: mongoose.Schema.Types.ObjectId})
genreId:ObjectId
@Prop({default:false})
shorts:boolean;
}

export const videoSchema = SchemaFactory.createForClass(Video)
