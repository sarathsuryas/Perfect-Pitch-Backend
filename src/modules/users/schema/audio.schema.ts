import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

@Schema()
export class Audio extends Document {
@Prop({required:true})  
title: string;
@Prop({required:true})
artistName:string;
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
@Prop()
section:string;
@Prop()
genre:string;
}

export const audioSchema = SchemaFactory.createForClass(Audio)
